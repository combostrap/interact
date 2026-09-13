import type {Plugin} from 'vite';
import {getInteractConfig} from "../config/interactConfig.js";
import path from "path";
import type {ComboSearchParams} from "../../resources/search/combosearch/combosearch.js";

function generateSearchProviderModule({importPath, props = {}}: {
    importPath: string,
    props?: Record<string, unknown>
}): string {

    if (importPath == null) {
        throw new Error(`Search Provider import path not defined`);
    }
    const importName = "SearchEngine";
    const importStatement = `import ${importName} from ${JSON.stringify(importPath)};`;
    const jsonProperties = JSON.stringify(props);

    return `
${importStatement}

function isClass(value) {
    return (
        typeof value === "function" &&
        /^class\\s/.test(Function.prototype.toString.call(value))
    );
}

let properties = ${jsonProperties};
const searchEngineInstance = isClass(${importName})
    ? new ${importName}(properties)
    : ${importName}(properties);

export default searchEngineInstance;
`;
}

export default function viteSearchEngine(): Plugin {

    const moduleName = 'interact:search-engine';
    const interactConfig = getInteractConfig()
    return {
        name: moduleName,
        // ResolveId Hook: https://rollupjs.org/plugin-development/#resolveid
        resolveId(id) {
            if (id === moduleName) {
                return moduleName;
            }
            return null;
        },
        // Load Hook: https://rollupjs.org/plugin-development/#load
        async load(id) {

            if (id !== moduleName) {
                return null;
            }

            console.log(`${moduleName} - Search Engine Module loaded`);

            let importPath: string;
            let props = {};
            const comboSearchApi = process.env["COMBO_SEARCH_API"];

            if (comboSearchApi != undefined) {
                const comboSearchCollection = process.env["COMBO_SEARCH_COLLECTION"];
                if(comboSearchCollection==undefined){
                    throw new Error("COMBO_SEARCH_COLLECTION env is mandatory")
                }
                importPath = path.resolve(interactConfig.paths.interactResourcesDirectory, 'search/combosearch/combosearch.ts')
                props = {
                    apiBase: comboSearchApi,
                    collection: comboSearchCollection
                } as ComboSearchParams;
            } else {
                importPath = path.resolve(interactConfig.paths.interactResourcesDirectory, 'search/pagefind/pagefind-browser.ts')
            }
            const provider = generateSearchProviderModule({importPath, props});
            return provider;

        }
    };
}