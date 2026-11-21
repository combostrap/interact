"use client"
import OffCanvas from "@/components/interact/OffCanvas.tsx";
import {cn} from "@/lib/utils.ts";
import React from "react";
import {useSidebar} from "@/components/contexts/SidebarContext.tsx";

/**
 * Make its children in an off-canvas in mobile
 * and enforce them to be mounted only once
 *
 * Pro: Mounted only once
 * Cons: The downside is that the navigation/tree HTML of all nodes is printed on the browser on first load
 *
 * If the aside children do not have any global key binding, CSS is only what you need
 */
export default function SideBar({children}: { children: React.ReactNode }) {

    const {isOffCanvas, setIsOpen, isOpen} = useSidebar();

    let hiddenClass = "lg:hidden";
    return isOffCanvas ? (
        <>
            <OffCanvas
                hiddenClass={hiddenClass}
                onOpenChange={setIsOpen} open={isOpen}
            >
                <aside className={cn("px-4")}>
                    {children}
                </aside>
            </OffCanvas>
        </>
    ) : (
        <aside>
            {children}
        </aside>
    )

}