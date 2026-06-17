// don't use the relative path (not resolved)
import type {FinalPage} from "../pages/interactPage.js";


/**
 * The context request props
 * These props are passed to:
 * * Middleware
 * * and finally to layout and partials components
 * Page is not in the context because it receives it as props
 */
export type ContextProps = {
    request: Request, // the original request
    // the routing normalized URL (with _.rsc suffix removed, no base, rewrite url, host may be fake)
    url: URL
    // derived information
    meta: {
        isRscRequest: boolean // true if request should return RSC payload (via _.rsc suffix)
        isRscActionRequest: boolean // true if this is a server action call (POST request)
        rscActionId?: string // server action ID from x-rsc-action header
        isMarkdownRequest: boolean // true if this is a Markdown request
        lastModifiedPage?: string; // last modified time of the page (iso string)
        isProsePage?: boolean // treats the page has prose content and add a prose class
    } & Record<string, string | boolean | undefined>
    response: {
        status?: number
        headers?: HeadersInit;
    }
};


export type LayoutProps = {
    page: FinalPage
    context: ContextProps
};