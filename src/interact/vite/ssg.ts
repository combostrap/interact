import type {Plugin, ResolvedConfig} from "vite";
import path from "node:path";
import {pathToFileURL} from "node:url";
import fs from "node:fs";
import {Readable} from "node:stream";
// interactConfig should be a relative path and not the package.json export as this is used by the client
import {getInteractConfig} from "../config/interactConfig.js";
import {writeFileSync} from "fs";

const RSC_POSTFIX = '_.rsc'

export default function ssg(): Plugin[] {
    return [
        {
            name: 'interact-rsc-ssg',
            config: {
                order: 'pre',
                handler(_config, env) {
                    return {
                        appType: env.isPreview ? 'mpa' : undefined,
                        rsc: {
                            serverHandler: env.isPreview ? false : undefined,
                        },
                    }
                },
            },
            buildApp: {
                async handler(builder) {
                    try {
                        console.log(`Interact: Static rendering started`);
                        await renderStatic(builder.config)
                    } catch (e) {
                        console.error(`An error occurred on static rendering: ${e}`)
                        throw e
                    }
                },
            },
        },
    ]
}

async function renderStatic(config: ResolvedConfig) {
    let rscEnv = config.environments['rsc'];
    if (!rscEnv) {
        throw new Error("The rsc env environment does not exist.");
    }
    console.log(`Note: Server rsc build located at: ${rscEnv.build.outDir}`);
    /**
     * Import the created rsc build
     */
    const rscIndexFilePath = path.join(rscEnv.build.outDir, 'index.js')
    console.log(`Note: Importing Rsc Bundle ${pathToFileURL(rscIndexFilePath).href}`);

    // Try/catch does not work on stalled Promise.
    // try/catch only catches thrown errors or rejected Promises. A Promise that never resolves or rejects is invisible to both.
    // Force Node's native ESM loader, bypassing Vite entirely
    const importModule = new Function('url', 'return import(url)')
    // @ts-ignore - no jsx otherwise it will also check all resources path from the entry.rsc.tsx, we need a bundler method here
    const entryRscModule: typeof import('../../resources/rsc/server/entry.rsc.tsx') = await Promise.race([
        importModule(/* @vite-ignore */ pathToFileURL(rscIndexFilePath).href),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('import() hung — never settled, can be caused by a deadlock between 2 different import')), 5000)
        )
    ])
    console.log(`Note: Rsc bundle imported`);
    // entry provides a list of static paths
    const staticPathsObject: Record<string, any> = entryRscModule.getStaticPaths()
    let staticPaths = Object.keys(staticPathsObject)
    console.log(`Note: ${staticPaths.length} static paths found`);
    // render rsc and html
    let clientEnv = config.environments['client'];
    if (!clientEnv) {
        let clientEnvDoesNotExist = "The client env environment does not exist.";
        console.error(`Note: ${clientEnvDoesNotExist}`);
        throw new Error(clientEnvDoesNotExist);
    }
    const baseDir = clientEnv.build.outDir
    let interactConfig = getInteractConfig();
    /**
     * Add the 404 if not set
     */
    const notFoundPath = interactConfig.middleware.notFoundPath;
    if (!(notFoundPath in staticPathsObject)) {
        staticPaths.push(notFoundPath)
    }
    console.log(`Interact: ${staticPaths.length} static paths found.`);
    for (const staticPatch of staticPaths) {

        /**
         * Request needs to take into account the base
         */
        let staticRequestPath = staticPatch;
        if (interactConfig.site.base != "/") {
            staticRequestPath = `${interactConfig.site.base}${staticRequestPath}`;
        }
        config.logger.info('[vite-rsc:ssg] -> ' + staticRequestPath)
        let fakeRequest = new Request(new URL(staticRequestPath, 'http://ssg.local'));
        const {html, rsc, md} = await entryRscModule.handleSsg(fakeRequest)

        /**
         * Final file still needs to be written at the normal path
         */
        await writeFileStream(
            path.join(baseDir, normalizeFilePath(staticPatch, ".html")),
            html,
        )
        await writeFileStream(path.join(baseDir, staticPatch + RSC_POSTFIX), rsc)
        if (md != null) {
            writeFileSync(
                path.join(baseDir, normalizeFilePath(staticPatch, ".md")),
                md
            )
        }
    }
    console.log(`Interact: Static rendering done`);
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true})
    await fs.promises.writeFile(filePath, Readable.fromWeb(stream as any))
}

function normalizeFilePath(p: string, extension: string) {
    if (p.endsWith('/')) {
        return p + 'index' + extension;
    }
    return p + extension
}