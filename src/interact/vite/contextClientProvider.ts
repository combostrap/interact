import type {Plugin} from 'vite';
import {getInteractConfig} from "../config/interactConfig.js";
import {generateContextProvider} from "./contextProviderUtil.js";
import {SERVER_TERM} from "./contextServerProvider.js";


export default function viteContextComponentProvider(): Plugin {

    /**
     * interact config is not a props so that on dev server
     * restart the new configuration is read
     */
    let interactConfig = getInteractConfig();
    /**
     * The name used in the import
     * ie import .... from 'interact:client-contexts'
     */
    let clientTerm = "client";
    let moduleName = `interact:${clientTerm}-contexts`;

    /**
     * We don't prefix with \0 as specified here:
     * https://vite.dev/guide/api-plugin#virtual-modules-convention
     * because it does not work
     * * We saw this error: [vite] Internal server error: The argument 'path' must be a string, Uint8Array, or URL without null bytes. Received '\x00interact:page-modules'
     * * And the module is not found any more jn the module grpah
     */
    const resolvedVirtualModuleId = moduleName;


    return {
        name: moduleName,
        // ResolveId Hook: https://rollupjs.org/plugin-development/#resolveid
        resolveId(id) {
            if (id === moduleName) {
                return resolvedVirtualModuleId;
            }
            return null;
        },
        // Load Hook: https://rollupjs.org/plugin-development/#load
        async load(id) {
            if (id !== resolvedVirtualModuleId) {
                return null;
            }

            let headProvider = generateContextProvider(
                interactConfig,
                (key:string)=>key.toLowerCase().includes(SERVER_TERM)
            );
            console.log(`${moduleName} module loaded with ${Object.keys(headProvider.components).length} contexts`);

            return headProvider.content;
        }
    };
}