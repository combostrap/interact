export interface SearchOptions {
    /** Max results to return */
    limit?: number;
    /**
     * To cancel old requests on new keystroke
     * (the search provider should pass it to the fetch)
     **/
    abortSignal?: AbortSignal;
}


export type SearchResult = {
    relevanceThreshold?: number,
    hits: SearchHit[],
}

export interface SearchHit {

    /**
     * URL. We use only the path so that:
     * * the search can be tested on localhost (May have an anchor to a section)
     * * and we don't have any origin error (ie history.pushState would errored with `a history state object with https://xxx`
     * cannot be created in a document with origin http://localhost)
     */
    url: URL;
    /**
     * Page title
     */
    title: string;
    /**
     * Excerpt of why this page was selected
     * (Generally with the mark element to highlight the
     * found words)
     */
    excerpt: string;
    /**
     * Relevance score
     */
    score: number;
}


/**
 * TypeScript discriminated unions to enoce an ok
 */
export type SearchResponse =
    | { ok: true; data: SearchResult }
    | { ok: false; error: string; status: number };

export interface SearchEngine {

    /**
     * Hook that is executed when the dialogue open
     * (to load a JavaScript module)
     * It must be idempotent to not execute uit each time
     */
    onOpen: () => Promise<Void>;
    /**
     * A search
     */
    search: (query: string, opts?: SearchOptions) => Promise<SearchResponse>;

}