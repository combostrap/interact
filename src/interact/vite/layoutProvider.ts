import type {Plugin} from 'vite';
import {getInteractConfig, type InteractConfig} from "../config/interactConfig.js";
import {getComponentsAndImportArray, toJsString} from "../lib/virtualModuleUtil.js";


export function generateLayoutProvider(interactConfig: InteractConfig): {
    content: string;
    layouts: Record<string, string>
} {

    let {components: layoutComponents, imports, exports} = getComponentsAndImportArray(interactConfig, "layout")


    let layoutComponentAsJavascriptStringObject = toJsString(layoutComponents);
    let virtualModuleContent = `
${imports.join('\n')}

const layoutComponents = ${layoutComponentAsJavascriptStringObject};
export function getLayoutComponent(name) {
  return layoutComponents[name];
}

export { ${[...exports].join(', ')} };

// to not return null
const dontUse = () => "Don't use the default export";
export default dontUse 
`;
    return {
        content: virtualModuleContent,
        layouts: layoutComponents
    }
}

export default function viteLayoutProvider(): Plugin {

    /**
     * interact config is not a props so that on dev server
     * restart the new configuration is read
     */
    let interactConfig = getInteractConfig();
    /**
     * The name used in the import
     * ie import .... from 'interact:layouts'
     */
    let moduleName = 'interact:layouts';

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

            let layoutProvider = generateLayoutProvider(interactConfig);
            console.log(`${moduleName} module loaded with ${Object.keys(layoutProvider.layouts).length} layouts`);

            return layoutProvider.content;
        }
    };
}