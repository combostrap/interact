/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
// Ambient virtual declare module file
/// <reference types="../node/vite/contextClientProviderModule.d.ts" />
/// <reference types="../node/vite/contextServerProviderModule.d.ts" />
/// <reference types="../node/vite/headProviderModule.d.ts" />
/// <reference types="../node/vite/mdxComponentProviderModule.d.ts" />
/// <reference types="../node/vite/layoutProviderModule.d.ts" />
/// <reference types="../node/vite/pagesProviderModule.d.ts" />
/// <reference types="../node/pages/interactPageModules.d.ts" />
/// <reference types="../node/vite/middlewareProviderModule" />

import type {InteractMarkdownConfig} from "./markdownConfig.js";
import type {MiddlewareHandler, Middleware, ReactNodeResponse} from "../node/middlewareEngine/interactMiddleware.d.ts"
import type {Page, Frontmatter, TocNode} from "../node/pages/interactPage";
import type {ContextProps, LayoutProps} from "../node/componentsProvider/contextProps";

import {type InteractConfig} from "../node/config/interactConfig.ts"

import type {InteractCommand} from "../cli/shared/vite.config.js";
import type {PageNode} from "@/rsc/server/handler.tsx";

export {
    InteractConfig,
    InteractMarkdownConfig,
    InteractCommand,
    MiddlewareHandler,
    Middleware,
    Page,
    ReactNodeResponse,
    ContextProps,
    LayoutProps,
    Frontmatter,
    TocNode,
    PageNode
}


