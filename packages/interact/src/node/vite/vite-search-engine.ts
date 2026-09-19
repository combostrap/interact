import type {Plugin} from 'vite';
import {getInteractConfig} from "../config/interactConfig.js";
import path from "path";
import type {ComboSearchParams} from "../../resources/search/combosearch/combosearch.js";
import {isValidHttpUrl} from "../lib/URLUtil.js";

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


let properties = ${jsonProperties};
let searchEngineInstance;
try {
    // constructable class
    searchEngineInstance = new ${importName}(properties)
} catch {
    // callable
    try {
        searchEngineInstance = ${importName}(properties)
    } catch (e) {
        throw new Error("The default import of the search engine (${importPath}) is neither a constructor nor a callable", e)
    }
}

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
            const comboSearchEndpoint = process.env["COMBO_SEARCH_ENDPOINT"];
            if (comboSearchEndpoint != null) {
                if (!isValidHttpUrl(comboSearchEndpoint)){
                    throw new Error(`The URL value (${comboSearchEndpoint}) from the env COMBO_SEARCH_ENDPOINT is not a valid URL`)
                }
                importPath = path.resolve(interactConfig.paths.interactResourcesDirectory, 'search/combosearch/combosearch.ts')
                props = {
                    apiEndpoint: comboSearchEndpoint
                } as ComboSearchParams;
                console.log(`${moduleName}: ComboSearch Engine configured`);
            } else {
                importPath = path.resolve(interactConfig.paths.interactResourcesDirectory, 'search/pagefind/pagefind-browser.ts')
                console.log(`${moduleName}: Basic static browser engine configured`);
            }
            const provider = generateSearchProviderModule({importPath, props});
            return provider;

        }
    };
}