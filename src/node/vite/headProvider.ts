import type {Plugin} from 'vite';
import {getInteractConfig, type InteractConfig} from "../config/interactConfig.js";
import {getComponentsAndImportArray, toJsString} from "../lib/virtualModuleUtil.js";


export function generateHeadProvider(interactConfig: InteractConfig): {
    content: string;
    heads: Record<string, string>
} {

    let {components: headComponents, imports, exports} = getComponentsAndImportArray(interactConfig, "head")

    let headComponentAsJavascriptStringObject = toJsString(headComponents);
    let virtualModuleContent = `
${imports.join('\n')}

const headComponents = ${headComponentAsJavascriptStringObject};
export function getHeadComponents() {
  return headComponents;
}

export { ${[...exports].join(', ')} };

// to not return null
const dontUse = () => "Don't use the default export";
export default dontUse 
`;
    return {
        content: virtualModuleContent,
        heads: headComponents
    }
}

export default function viteHeadProvider(): Plugin {

    /**
     * interact config is not a props so that on dev server
     * restart the new configuration is read
     */
    let interactConfig = getInteractConfig();
    /**
     * The name used in the import
     * ie import .... from 'interact:heads'
     */
    let moduleName = 'interact:heads';

    /**
     * We don't prefix with \0 as specified here:
     * https://vite.dev/guide/api-plugin#virtual-modules-convention
     * because it does not work
     * * We saw this error: [vite] Internal server error: The argument 'path' must be a string, Uint8Array, or URL without null bytes. Received '\x00interact:page-modules'
     * * And the module is not found anymore jn the module grpah
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

            let headProvider = generateHeadProvider(interactConfig);
            console.log(`${moduleName} module loaded with ${Object.keys(headProvider.heads).length} heads`);

            return headProvider.content;
        }
    };
}