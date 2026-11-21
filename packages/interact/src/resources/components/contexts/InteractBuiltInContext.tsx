'use client'

import type {ReactNode} from "react";
import ErrorContext from "./ErrorContext.js";
import SearchContext from "@/components/contexts/SearchContext.tsx";
import ClientConfigContext from "./ClientConfigContext.js";
import SidebarContext from "@/components/contexts/SidebarContext.tsx";


export default function InteractBuiltInContext({children}: { children: ReactNode }) {

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