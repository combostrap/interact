'use client'

import type {ReactNode} from "react";
import ErrorContext from "./ErrorContext.js";
import SearchContext from "@/components/contexts/SearchContext.tsx";
import ClientConfigContext from "./ClientConfigContext.js";
import SidebarContext from "@/components/contexts/SidebarContext.tsx";


// noinspection JSUnusedGlobalSymbols - vite virtual provider reads it
export default function InteractContext({children}: { children: ReactNode }) {

    return (
        <ClientConfigContext>
            <ErrorContext>
                <SearchContext>
                    <SidebarContext>
                        {children}
                    </SidebarContext>
                </SearchContext>
            </ErrorContext>
        </ClientConfigContext>
    )

}