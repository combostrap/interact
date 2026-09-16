import type {SearchEngine, SearchOptions, SearchResponse} from "@combostrap/interact/types";

export type ComboSearchParams = { apiEndpoint: string, };

export interface ComboSearchHit {

    uri: URL;
    title: string;
    excerpt: string;
    score: number;
}

type ComboSearchResult = {
    relevanceThreshold?: number,
    hits: ComboSearchHit[],
}
// noinspection JSUnusedGlobalSymbols - loaded/used dynamically in a virtual module
export default class ComboSearch implements SearchEngine {

    private readonly url: URL;

    /**
     *
     * @param options - apiPrefix is the prefix of the URL (the request is forwarded server-side)
     */
    constructor(options?: ComboSearchParams) {
        if (options == null) {
            throw new Error("options must be provided");
        }
        const {apiEndpoint} = options || {};
        try {
            this.url = new URL(apiEndpoint);
        } catch (e) {
            throw new Error(`The api endpoint value : ${apiEndpoint} is not a valid URL`);
        }
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

        const response = await fetch(url, {
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
        const item: ComboSearchResult = await response.json()
        return {
            ok: true,
            data: {
                relevanceThreshold: item.relevanceThreshold,
                hits: item.hits.map(hit => ({
                    url: new URL(hit.uri),
                    excerpt: hit.excerpt,
                    score: hit.score,
                    title: hit.title,
                }))
            },
        }
    }


}