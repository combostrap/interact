import path from 'node:path';
import type {Plugin} from "vite";
import fs from "fs";
import sirv from "sirv";
import {getInteractConfig} from "../config/interactConfig.js";
import * as pagefind from "pagefind";
import type {PagefindServiceConfig} from "pagefind";
import {deleteHtmlCacheEntry} from "../lib/htmlCache.js";

/**
 * Integrate pagefind in prod and dev mode
 * @param options
 * How it works? We run pagefind against a static site
 * * For the dev mode, the html served is captured to create a static website
 * * For the production, the build site is used
 */
export default function vitePluginPagefind(options: {
    // how many Ms between 2 indexing
    // default to 5000 (ie 5 second)
    debounceMs?: number,
    // where page find is installed and located in the site
    // default to '.interact/search' following the same idea as `/.well-known/`
    siteRelativeBase?: string,
}): Plugin {

    const {
        debounceMs = 5000,
        siteRelativeBase = '.interact/search'
    } = options;

    /**
     * interact config is not a props so that on dev server
     * restart the new configuration is read
     */
    const interactConfig = getInteractConfig();
    const absolutePagesDir = interactConfig.paths.pagesDirectory

    /**
     * When a page changes, we rebuilt the index at interval
     */
    let rebuildTimer: NodeJS.Timeout | null = null;

    /**
     * The page find creation index
     */
    const pageFindConfig: PagefindServiceConfig = {
        rootSelector: 'main',
        writePlayground: true,
        excludeSelectors: [
            /* matches any element with the attribute, any tag */
            "[data-noindex]"
        ]
    }

    const devPagefindSite = interactConfig.paths.htmlCacheDirectory;


    const pageFindSiteBase = `/${siteRelativeBase}/`;
    const pagefindRootSitePath = path.resolve(devPagefindSite, siteRelativeBase);

    /**
     * Do we crawl on start to create the index?
     * False, not implemented yet
     */
    const crawlOnStart = false

    async function reBuildIndexOnStart() {

        if (crawlOnStart) {
            const pages: Record<string, PageNode> = getPagesRecursively(absolutePagesDir);
            let failures = 0;

            const pagePaths = Object.keys(pages);
            for (const pagePath of pagePaths) {
                console.log('[pagefind] -> ' + pagePath)
                const url = new URL(pagePath, 'http://pagefind.local');
                const request = new Request(url);
                /**
                 * The transformIndexHtml API will intercept the HTML
                 * and put it in the pagefind site
                 */
                const response: Response = await fetch(request);
                if (response.status !== 200) {
                    failures += 1;
                    console.error('[pagefind] -> ' + pagePath)
                }
            }

            console.log(
                `[pagefind] crawled ${pagePaths.length} file(s)${failures ? `, ${failures} failed` : ''}`
            );
        }


        await runPageFind({
            site: devPagefindSite,
            siteBase: pageFindSiteBase,
            config: pageFindConfig
        })
    }

    function scheduleRebuild() {
        if (rebuildTimer) clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(() => {
            rebuildTimer = null;
            runPageFind({
                site: devPagefindSite,
                siteBase: pageFindSiteBase,
                config: pageFindConfig
            }).catch((err) => {
                console.error('[pagefind] schedule run failed:', err);
            });
        }, debounceMs);
    }

    return {

        name: 'vite-plugin-pagefind',

        configureServer(server) {

            /**
             * Rebuild once the dev server is listening
             */
            server.httpServer?.once('listening', async () => {
                // Fire-and-forget: don't block
                reBuildIndexOnStart().catch((err) => {
                    console.error(err.message);
                });
            });

            /**
             * Watch the pages directory
             */
            server.watcher.add(devPagefindSite);
            server.watcher.add(absolutePagesDir);

            /**
             * * Schedule rebuilt
             * * And delete cache entry if page is deleted
             */
            server.watcher.on('all', (event, changedPath) => {

                /**
                 * If the html cache directory changes, we reschedule
                 */
                const normalized = path.resolve(changedPath);
                if (
                    normalized.startsWith(devPagefindSite)
                    && !normalized.startsWith(pagefindRootSitePath)
                    && normalized.endsWith(".html")
                    && (event === 'add' || event === 'change' || event === 'unlink')
                ) {
                    const relativeHtmlCachePath = path.relative(devPagefindSite, normalized);
                    console.log(`[pagefind] scheduled re-indexing - file ${event} detected in the HTML cache (${relativeHtmlCachePath})`);
                    scheduleRebuild();
                }

                /**
                 * Should be in a vite cache plugin
                 */
                if (!normalized.startsWith(absolutePagesDir)) return;
                if (!/\.(md|ts|js)x?$/i.test(normalized)) return;
                if (event === 'unlink') {
                    deleteHtmlCacheEntry(normalized)
                    console.log(`[pagefind] ${event}: Deleted the HTML cache entry for the page (${normalized})`);
                }
            });

            /**
             * Serve pagefind resources (library and index)
             */
            const serve = sirv(pagefindRootSitePath, {dev: true, etag: true,})
            server.middlewares.use(pageFindSiteBase, (req, res, next) => {
                serve(req, res, next)
            })

        },
        /**
         * Run page find at the end of the build
         * against the real static build site
         */
        buildApp: {
            order: 'post',
            async handler(builder) {
                const clientEnv = builder.environments['client'];
                if (!clientEnv) {
                    const clientEnvDoesNotExist = "The client env environment does not exist.";
                    console.error(`Note: ${clientEnvDoesNotExist}`);
                    throw new Error(clientEnvDoesNotExist);
                }
                const prodClientBuildOutDir = clientEnv.config.build.outDir
                try {
                    console.log(`PageFind: Index generation started`);
                    const pageCounts = await runPageFind({
                        site: prodClientBuildOutDir,
                        siteBase: pageFindSiteBase,
                        config: pageFindConfig
                    })
                    console.log(`PageFind: ${pageCounts} page added to the index`);
                } catch (e) {
                    console.error(`An error occurred on index generation: ${e}`, e)
                    throw e
                }
            },
        }
    };
}

/**
 * Duplicate but yeah
 */
type PageNode = {
    name: string
    path: string
    type: "file" | "folder"
    children?: PageNode[]
}

function getPagesRecursively(dir: string, startDir: string = dir): Record<string, PageNode> {
    const results: Record<string, PageNode> = {};

    function walk(currentDir: string): void {
        const entries = fs.readdirSync(currentDir, {withFileTypes: true});

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                walk(fullPath);
                continue
            }
            const ext = path.extname(entry.name);
            const withoutExt = ext ? fullPath.slice(0, -ext.length) : fullPath;
            const relativePath = path.relative(startDir, withoutExt);
            const keyPath = "/" + relativePath;
            results[keyPath] = {
                name: path.basename(relativePath),
                path: keyPath,
                type: "file",
            };
        }
    }

    walk(dir);
    return results;
}


/**
 * Built the index with the Node API
 * https://pagefind.app/docs/node-api/
 * Why?
 * * we get some statistics to show back to the user
 * * we don't need to spawn a process with npx that will also inherit debug
 * * pagefind is a dev dependencies after all, not in the bundle
 */
async function runPageFind({config, site, siteBase}: {
    config?: PagefindServiceConfig,
    site: string,
    siteBase: string,
}) {

    // https://pagefind.app/docs/node-api/#pagefindcreateindex
    const {index} = await pagefind.createIndex(config);

    if (index == null) {
        throw new Error("Pagefind Index should not be undefined");
    }

    // https://pagefind.app/docs/node-api/#indexadddirectory
    const {errors, page_count} = await index.addDirectory({path: site});

    if (errors && errors.length > 0) {
        console.error("Indexing failed with errors:", errors);
        await pagefind.close();
        return 0;
    }

    // Write the generated bundle files to disk
    await index.writeFiles({
        outputPath: `${site}${siteBase}`
    });

    // Log/Return the page count
    console.log(`[pagefind] - successfully indexed ${page_count} pages.`);

    // https://pagefind.app/docs/node-api/#pagefindclose
    await pagefind.close();

    return page_count;
}

