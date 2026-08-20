import type {MiddlewareHandler} from "../../node/middlewareEngine/interactMiddleware";
import type {ContextProps} from "../../node/componentsProvider/contextProps";
import type {Page} from "../../node/pages/interactPage";
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

        const pageModule = getModuleFromPageProvider({path: context.url.pathname});
        if (pageModule == undefined) {
            return pageModule;
        }
        if (isMdxModule(pageModule.module)) {
            addProseIfNotDefined(pageModule.module, context);
        }
        context.meta.localSourcePagePath = pageModule.path;

        return pageModule.module

    }
}

