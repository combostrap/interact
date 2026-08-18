import path from 'node:path';
import type {Plugin} from "vite";
import fs from "fs";
import {spawn} from "node:child_process";
import sirv from "sirv";
import {getInteractConfig} from "../config/interactConfig.js";

/**
 * Integrate pagefind in prod and dev mode
 * @param options
 * How it works? We run pagefind against a static site
 * * For the dev mode, the html served is captured to create a static website
 * * For the production, the build site is used
 */
export default function vitePluginPagefind(options: {
    debounceMs?: number
}): Plugin {

    /**
     * interact config is not a props so that on dev server
     * restart the new configuration is read
     */
    let interactConfig = getInteractConfig();
    let absolutePagesDir = interactConfig.paths.pagesDirectory
    const {
        debounceMs = 1000,
    } = options;

    /**
     * When a page changes, we rebuilt the index at interval
     */
    let rebuildTimer: NodeJS.Timeout | null = null;
    /**
     * The site to index at the end of a build
     */
    let prodClientBuildOutDir: string;
    /**
     * We create a directory called site with all html
     * when the user or an agent is crawling the site.
     * The directory is then given to pageFind
     */
    let devPageFindSitePath = `${interactConfig.paths.runtimeDirectory}/pagefind/site`

    /**
     * Do we crawl on start to create the index?
     */
    let crawlOnStart = false

    async function reBuildIndexOnStart() {

        if (crawlOnStart) {
            const pages: Record<string, PageNode> = getPagesRecursively(absolutePagesDir);
            let failures = 0;

            let pagePaths = Object.keys(pages);
            for (const pagePath of pagePaths) {
                console.log('[pagefind] -> ' + pagePath)
                let url = new URL(pagePath, 'http://pagefind.local');
                let request = new Request(url);
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

        await runPageFind({site: devPageFindSitePath})
    }

    function scheduleRebuild() {
        if (rebuildTimer) clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(() => {
            rebuildTimer = null;
            runPageFind({site: devPageFindSitePath}).catch((err) => {
                console.error('[pagefind] schedule run failed:', err);
            });
        }, debounceMs);
    }

    return {
        name: 'vite-plugin-pagefind',

        configResolved(config) {

            if (!path.isAbsolute(absolutePagesDir)) {
                throw new Error(`pagesDir ${absolutePagesDir} is not absolute`);
            }
            let clientEnv = config.environments['client'];
            if (!clientEnv) {
                let clientEnvDoesNotExist = "The client env environment does not exist.";
                console.error(`Note: ${clientEnvDoesNotExist}`);
                throw new Error(clientEnvDoesNotExist);
            }
            prodClientBuildOutDir = clientEnv.build.outDir
        },


        /**
         * Capture the HTML to create a fake static website for indexing
         * https://vite.dev/guide/api-plugin#transformindexhtml
         */
        // transformIndexHtml: {
        //     order: 'post', // run after Vite's own transforms to get the final HTML
        //     handler(html, ctx) {
        //         console.log(`--- HTML served for ${ctx.path} ---`)
        //         debugger
        //         return html // must return it unchanged (or modified) to keep serving it
        //     },
        // },

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
            server.watcher.add(absolutePagesDir);

            /**
             * Schedule rebuilt and
             */
            server.watcher.on('all', (event, changedPath) => {
                const normalized = path.resolve(changedPath);
                if (!normalized.startsWith(absolutePagesDir)) return;
                if (!/\.mdx?$/i.test(normalized)) return;
                if (event === 'add' || event === 'change' || event === 'unlink') {
                    console.log(`[pagefind] ${event}: ${normalized} -> re-indexing`);
                    scheduleRebuild();
                }
                if (event === 'unlink') {
                    console.log(`[pagefind] ${event}: ${normalized} -> todo delete`);
                }
            });

            /**
             * Serve pagefind resources (library and index)
             */
            const serve = sirv(`${devPageFindSitePath}/pagefind`, {dev: true, etag: true,})
            server.middlewares.use("/pagefind", (req, res, next) => {
                serve(req, res, next)
            })

            /**
             * Capture the HTML to create a fake static website for indexing
             */
            server.middlewares.use((_req, res, next) => {
                const chunks: Buffer[] = []

                const originalWrite = res.write.bind(res)
                const originalEnd = res.end.bind(res)

                res.write = ((chunk: any, ...args: any[]) => {
                    if (chunk) {
                        chunks.push(
                            Buffer.isBuffer(chunk)
                                ? chunk
                                : Buffer.from(chunk),
                        )
                    }

                    return originalWrite(chunk, ...args)
                }) as typeof res.write

                res.end = ((chunk?: any, ...args: any[]) => {
                    if (chunk) {
                        chunks.push(
                            Buffer.isBuffer(chunk)
                                ? chunk
                                : Buffer.from(chunk),
                        )
                    }

                    const contentType = res.getHeader('content-type')

                    if (
                        typeof contentType === 'string' &&
                        contentType.includes('text/html')
                    ) {
                        const html = Buffer.concat(chunks).toString('utf8')
                        debugger
                        console.log("Html server:" + html.substring(0, 10))
                    }
                    const getHtmlFromRsc = async () => {
                        // @ts-ignore
                        const ssr = await import.meta.viteRsc.loadModule<typeof import('../../resources/rsc/server/entry.ssr.tsx')>('ssr', 'index')
                        const rscStream = Buffer.concat(chunks)
                        const ssrResult = await ssr.renderHtml(rscStream)
                        return await new Response(ssrResult.stream).text();
                    }
                    if (typeof contentType === 'string' && contentType.includes("text/x-component")) {
                        console.log("Html from rsc" );
                        getHtmlFromRsc().then((html) => console.log("Html from rsc:" + html.substring(0, 10)))
                    }

                    return originalEnd(chunk, ...args)
                }) as typeof res.end

                next()
            })
        },

        /**
         * Run page find at the end of the build
         * against the real static build site
         */
        async closeBundle() {
            // should the final
            await runPageFind({site: prodClientBuildOutDir})
        },
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
            let keyPath = "/" + relativePath;
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
 * Run page find to build the index and add the pagefind lib
 * @param opts
 */
function runPageFind(opts: {
    site: string;
    // extra page find cli args
    extraArgs?: string[];
    // external dependencies (ie npx pagefind is used)
    useNpx?: boolean;
    logStdioOutput?: boolean;
}): Promise<void> {
    const {site, extraArgs = [], useNpx = true, logStdioOutput = true} = opts;

    const command = useNpx ? "npx" : "pagefind";
    const args = useNpx
        ? ["pagefind", "--site", site, ...extraArgs]
        : ["--site", site, ...extraArgs];

    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: logStdioOutput ? "inherit" : "ignore",
            shell: process.platform === "win32", // npx.cmd needs a shell on Windows
        });

        child.on("error", (err) => {
            reject(new Error(`Failed to start pagefind: ${err.message}`));
        });

        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`pagefind exited with code ${code}`));
            }
        });
    });
}