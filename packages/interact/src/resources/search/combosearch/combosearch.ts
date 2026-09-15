import type {SearchOptions, SearchEngine, SearchResponse} from "@combostrap/interact/types";
import type {SearchResult} from "@/search/search-api";

export type ComboSearchParams = { apiBase: string, collection: string };


// noinspection JSUnusedGlobalSymbols - loaded/used dynamically in a virtual module
export default class ComboSearch implements SearchEngine {

    private readonly url: string;

    /**
     *
     * @param options - apiPrefix is the prefix of the URL (the request is forwarded server-side)
     */
    constructor(options?: ComboSearchParams) {
        if (options == null) {
            throw new Error("options must be provided");
        }
        const {apiBase, collection} = options || {};
        this.url = `${apiBase}/collections/${collection}/search`;
    }

    async onOpen() {
        return
    }

    search = async (query: string, opts?: SearchOptions): Promise<SearchResponse> => {
        const {limit = 8, abortSignal} = opts ?? {};

        if (abortSignal?.aborted) {
            return {
                ok: false,
                error: "Search aborted",
                status: 400,
            }
        }

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return {ok: true, data: {hits: []}};
        }

        const url = new URL(this.url);
        url.searchParams.set('q', query);
        url.searchParams.set('k', String(limit));

        const response = await fetch(url.toString(), {
            method: 'GET',
            signal: abortSignal,
        });

        if (!response.ok) {
            return {
                ok: false,
                error: response.statusText,
                status: response.status,
            }
        }
        const item: SearchResult = await response.json()
        return {
            ok: true,
            data: {
                relevanceThreshold: item.relevanceThreshold,
                hits: item.hits.map(hit => ({
                    id: hit.id,
                    excerpt: hit.excerpt,
                    score: hit.score,
                    title: hit.title,
                    url: new URL(hit.url, "http://dummy").pathname,
                }))
            },
        }
    }


}