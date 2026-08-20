import type {InteractConfig} from "../config/interactConfig.js";
import {getComponentsAndImportArray, toJsString} from "../lib/virtualModuleUtil.js";


export function generateContextProvider(interactConfig: InteractConfig, filterFunction: (key:string)=>boolean): {
    content: string;
    components: Record<string, string>
} {

    let {
        components: contextComponents,
        imports,
        exports
    } = getComponentsAndImportArray(interactConfig, "context", filterFunction)

    let headComponentAsJavascriptStringObject = toJsString(contextComponents);
    let virtualModuleContent = `
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