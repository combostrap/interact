/// <reference types="./vite-env-override.d.ts" />
/// <reference types="vite/client" />
/// <reference types="@vitejs/plugin-rsc/types" />
// Ambient virtual declare module file
/// <reference types="../node/vite/vite-search-provider-module.d.ts" />
/// <reference types="../node/vite/contextClientProviderModule.d.ts" />
/// <reference types="../node/vite/contextClientProviderModule.d.ts" />
/// <reference types="../node/vite/contextServerProviderModule.d.ts" />
/// <reference types="../node/vite/headProviderModule.d.ts" />
/// <reference types="../node/vite/mdxComponentProviderModule.d.ts" />
/// <reference types="../node/vite/layoutProviderModule.d.ts" />
/// <reference types="../node/vite/pagesProviderModule.d.ts" />
/// <reference types="../node/pages/interactPageModules.d.ts" />
/// <reference types="../node/vite/middlewareProviderModule.d.ts" />

// Type is in the resource directory
// because we import a jsx and it needs therefore the jsx prop in tsconfig

import type {SearchOptions, SearchHit, SearchEngine, SearchResponse} from "../resources/search/search-api.d.ts";
import type {InteractMarkdownConfig} from "../node/markdown/conf/markdownConfig.ts";
import type {MiddlewareHandler, Middleware} from "../node/middlewareEngine/interactMiddleware.d.ts"
import type {Page, Frontmatter, TocNode} from "../node/pages/interactPage.d.ts";
import type {ContextProps, LayoutProps} from "../node/componentsProvider/contextProps.d.ts";

import {type InteractConfig} from "../node/config/interactConfig.ts"

import type {InteractCommand} from "../node/cli/shared/vite.config.ts";

import {PageNode} from "../resources/rsc/server/types.ts";

export {
    InteractConfig,
    InteractMarkdownConfig,
    InteractCommand,
    MiddlewareHandler,
    Middleware,
    Page,
    ContextProps,
    LayoutProps,
    Frontmatter,
    TocNode,
    PageNode,
    SearchOptions,
    SearchHit,
    SearchEngine,
    SearchResponse
}


