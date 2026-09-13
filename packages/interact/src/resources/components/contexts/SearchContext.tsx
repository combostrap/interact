'use client'

import React, {createContext, type ReactNode, useContext} from "react";
import type {SearchEngine} from "@combostrap/interact/types";
import searchEngine from "interact:search-engine";


const SearchProviderContext = createContext<SearchEngine | null>(null);
type OpenState = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
const SearchOpenContext = React.createContext<OpenState>([false, () => {
}])

export function useSearchOpenState(): OpenState {
    const ctx = React.useContext(SearchOpenContext)
    if (!ctx) {
        /**
         * In server rendering
         */
        if (typeof window === 'undefined') {
            return [
                false,
                () => {
                }
            ]
        }
        throw new Error("useSearchOpenState must be used within SearchOpenContext")
    }
    return ctx
}

export function useSearchProvider() {
    const ctx = useContext(SearchProviderContext);
    if (!ctx) {
        /**
         * In server rendering
         */
        if (typeof window === 'undefined') {
            return null
        }
        throw new Error("No search provider in context");
    }
    return ctx;
}


// noinspection JSUnusedGlobalSymbols - read dynamically
export default function SearchContext({children}: {
    children: ReactNode
}) {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (open && ('onOpen' in searchEngine)) {
            searchEngine.onOpen().then(() => null)
        }
    }, [open])

    return (
        <SearchProviderContext.Provider value={searchEngine}>
            <SearchOpenContext.Provider value={[open, setOpen]}>
                {children}
            </SearchOpenContext.Provider>
        </SearchProviderContext.Provider>
    )
}

