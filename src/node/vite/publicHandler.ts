import type {Logger, Plugin, ResolvedConfig} from "vite";
import fs from "node:fs";
import path from "node:path";
import sirv from "sirv";

let pluginName = "public-handler";

/**
 * Recursively copies all files from `src` directory to `dest` directory.
 */
function copyDirSync(src: string, dest: string, root: string, logger: Logger): void {
    if (!fs.existsSync(src)) return;

    fs.mkdirSync(dest, {recursive: true});

    for (const entry of fs.readdirSync(src, {withFileTypes: true})) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath, root, logger);
        } else {
            logger.info(
                `[${pluginName}] Copying file: ${path.relative(root, srcPath)} → ${path.relative(root, destPath)}`
            );
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

export interface CopyPublicPluginOptions {
    /**
     * Source directory to copy from.
     * @default "src/public"
     */
    sourceDir?: string;
}

function resolvePath(filePath: string, rootPath: string) {
    return path.isAbsolute(filePath)
        ? filePath
        : path.resolve(rootPath, filePath);
}

/**
 * A Vite plugin that replaces the public directory feature of vite
 * https://vite.dev/config/shared-options#publicdir
 *
 * It will
 * * copies all files from `src/public` (or a custom source
 * directory) into the client build output directory after every build.
 * * server all files in dev mode as static files
 *
 * Why?
 * Vite Public feature will throw this error when importing a JSON file
 * ```
 * Assets in public directory cannot be imported from JavaScript.
 * If you intend to import that asset, put the file in the src directory, and use /src/static/resume/resume-data.json instead of /public/static/resume/resume-data.json.
 * If you intend to use the URL of that asset, use /static/resume/resume-data.json?url.
 * ```
 * See https://github.com/vitejs/vite/issues/13284
 * It seems that this is to enforce the rule: file in the public folder won't be bundled.
 */
export function publicHandler(
    options: CopyPublicPluginOptions = {}
): Plugin {
    const {sourceDir = "src/public"} = options;

    let resolvedConfig: ResolvedConfig;

    return {
        name: "vite-plugin-" + pluginName,

        configResolved(config) {
            resolvedConfig = config;
        },

        // Serve the directory as static files during `vite dev`
        configureServer(server) {
            const absSource = resolvePath(sourceDir, resolvedConfig.root);
            if (!fs.existsSync(absSource)) return;

            // sirv is a Vite dependency — safe to import as ESM.
            const serve = sirv(absSource, {dev: true});
            server.middlewares.use(serve);
        },

        // Copy files after the bundle is written
        async writeBundle(options) {

            if (!options.dir?.includes("client")) {
                resolvedConfig.logger.info(
                    `\n[${pluginName}] - Not client environment skipping`
                );
                return;
            }

            const {root} = resolvedConfig;

            // Determine the client output directory.
            // In a standard build `build.outDir` is the target.
            // In an SSR multienvironment build the client outDir is still
            // `build.outDir` (the server writes to a different path via
            // `build.ssrManifest` / environment config).
            const targetDirAbsolute = resolvePath(options.dir, root);
            const targetDirRelative = path.relative(root, targetDirAbsolute);
            const sourceDirAbsolute = resolvePath(sourceDir, root);
            const sourceDirRelative = path.relative(root, sourceDirAbsolute);

            if (!fs.existsSync(sourceDirAbsolute)) {
                // Nothing to copy — source directory doesn't exist yet.
                return;
            }

            resolvedConfig.logger.info(
                `\n[${pluginName}] Copying ${sourceDirRelative} → ${targetDirRelative}`
            );

            copyDirSync(sourceDirAbsolute, targetDirAbsolute, root, resolvedConfig.logger);
        },
    };
}