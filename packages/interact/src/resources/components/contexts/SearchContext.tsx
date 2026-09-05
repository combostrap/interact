import {createContext, ReactNode, useContext} from "react";
import type {SearchProvider} from "@combostrap/interact/types";

const SearchProviderContext = createContext<SearchProvider | null>(null);

export function useSearchProvider() {
    const ctx = useContext(SearchProviderContext);
    if (!ctx) throw new Error("No search provider in context");
    return ctx;
}

export function getSearchProvider(id: string) {
    return null;
}
export function SearchProviderContextProvider({ providerId, children }: { providerId: string; children: ReactNode }) {
    const provider = getSearchProvider(providerId) ;

    return (
        <SearchProviderContext.Provider value={provider}>
            {children}
        </SearchProviderContext.Provider>
    )
}

