import type {InteractConfig} from "../config/interactConfig.js";
import path from "path";
import type {ComponentTypeType} from "../config/configSchema.js";

/**
 * This function was created to print without any quote
 * so that an object can be added to JavaScript virtual module
 * It works for object but also for any other basic type
 */
export function toJsString(value: any, indent = 0): any {
    const pad = ' '.repeat(indent + 2);
    const closePad = ' '.repeat(indent);

    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;  // no quotes
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) {
        // @ts-ignore
        const items = value.map(v => `${pad}${toJsString(v, indent + 2)}`);
        return `[\n${items.join(',\n')}\n${closePad}]`;
    }
    if (typeof value === 'object') {

        // @ts-ignore
        const entries = Object.entries(value).map(
            // @ts-ignore
            ([k, v]) => {
                /**
                 * The key value may be my-component
                 * The Javascript string result should be then 'my-component'
                 */
                if (k.includes("-")) {
                    k = `'${k}'`
                }
                return `${pad}${k}: ${toJsString(v, indent + 2)}`
            }
        );
        return `{\n${entries.join(',\n')}\n${closePad}}`;
    }
    return String(value);
}


export function getComponentsAndImportArray(interactConfig: InteractConfig, type: ComponentTypeType, filterFunction?: (key:string)=>boolean) {
    let imports = [];
    let components: Record<string, string> = {};

    // component may be registered multiple time
    // for instance, code is registered for the pre element and itself as Code,
    // but it should be exported only once
    let exports = new Set<string>();
    for (const [key, value] of Object.entries(interactConfig.components)) {

        if (value.type != type) {
            continue;
        }

        if (filterFunction != null && filterFunction(key)) {
            continue
        }

        /**
         * Import Path
         */
        let importPath = value.importPath;
        if (importPath == null) {
            throw new Error(`Import ${importPath} not defined for the layout component ${key}`);
        }

        /**
         * Import name
         * Cannot come from the path "./pages/404.ts",404 is a number and is not valid as component name but valid as path
         */
        let importName = key;

        /**
         * Map
         */
        let layoutKey = key.toLowerCase();
        components[layoutKey] = importName;

        if (!exports.has(importName)) {

            /**
             * We export all component so that they can be used
             */
            exports.add(importName);

            /**
             * Relative to Absolute
             */
            if (importPath.startsWith("./")) {
                importPath = path.resolve(interactConfig.paths.rootDirectory, importPath);
            }

            /**
             * Import statement
             */
            imports.push(`import ${importName} from ${JSON.stringify(importPath)};`);

        }


    }
    return {
        components: components,
        imports: imports,
        exports: exports
    }
}