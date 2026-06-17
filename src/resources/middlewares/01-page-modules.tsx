import type {MiddlewareHandler} from "../../interact/middlewareEngine/interactMiddleware";
import type {ContextProps} from "../../interact/componentsProvider/contextProps";
import type {Page} from "../../interact/pages/interactPage";
import getModuleFromPageProvider from 'interact:page-modules';
import {addProseIfNotDefined} from "@/lib/page-utils";

function isMdxModule(mod: any) {
    return typeof mod.default === 'function' &&
        (
            mod.default.name === "MDXContent" // works in dev before bundling
            ||
            mod.default.isMDXComponent === true // works always, added by the plugin: recma-mdx-is-mdx-component
        );
}

/**
 * A middleware that returns the pages modules
 * Get a page module (jsx, tsx, ts, js, mdx)
 */
// noinspection JSUnusedGlobalSymbols - loaded dynamically via alias
export async function handler(): Promise<MiddlewareHandler> {

    return async function (context: ContextProps): Promise<Page | undefined> {

        let module = getModuleFromPageProvider({path: context.url.pathname});
        if (module == undefined) {
            return module;
        }
        if (isMdxModule(module)) {
            addProseIfNotDefined(module, context);
        }
        return module

    }
}

