import type {Plugin} from 'vite';
import path from "path";
import debug from "debug";


/**
 * Not used, let for example
 *
 * When interact is run as a global app,
 * we wanted to resolve the dependencies from the global installation
 *
 */
export default function externalNodeModuleDependencyResolver(nodeModuleDir: string): Plugin {


    const debugLog = debug("interact:external-node-module-dependency-resolver");

    return {

        name: "external-node-module-dependency-resolver",

        async resolveId(id, importer) {

            if (
                id.startsWith(".") ||
                id.startsWith("/") ||
                id.startsWith("\0") ||
                id.startsWith("virtual:") ||
                id.startsWith("interact:") ||
                id.startsWith("node:")
            ) {
                debugLog(`${this.environment.name} - skipped: ${id}`);
                return null;
            }

            const resolver = async () => {


                // Ask Vite to resolve normally first.
                const normal = await this.resolve(id, importer, {
                    skipSelf: true,
                })

                if (normal) {
                    return normal
                }

                // Trick: make Vite resolve as if the import originated
                // from a file inside the global node_modules directory.
                const extraImporter = path.join(
                    nodeModuleDir,
                    '__vite_extra_resolver__.js',
                )

                return await this.resolve(id, extraImporter, {
                    skipSelf: true,
                })

            }

            const resolved = await resolver.call(this);

            if (resolved == null) {
                debugLog(`${this.environment.name} - not resolved: ${id}`);
                return null;
            }

            debugLog(`${this.environment.name} -     resolved: ${id} → ${JSON.stringify(resolved)}`);
            return resolved;

        },
    };
}