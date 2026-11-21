import type {InteractConfig} from "../config/interactConfig.js";
import {getComponentsAndImportArray, toJsString} from "../lib/virtualModuleUtil.js";


export function generateContextProvider(interactConfig: InteractConfig): {
    content: string;
    components: Record<string, string>
} {

    const {
        components: contextComponents,
        imports,
        exports
    } = getComponentsAndImportArray(interactConfig, "context")

    const headComponentAsJavascriptStringObject = toJsString(contextComponents);
    const virtualModuleContent = `
${imports.join('\n')}

const contextComponents = ${headComponentAsJavascriptStringObject};
export function getContextComponents() {
  return contextComponents;
}

export { ${[...exports].join(', ')} };

// to not return null
const dontUse = () => "Don't use the default export";
export default dontUse 
`;
    return {
        content: virtualModuleContent,
        components: contextComponents
    }
}