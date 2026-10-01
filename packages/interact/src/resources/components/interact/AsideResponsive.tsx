"use client"
import OffCanvas from "@/components/interact/OffCanvas.tsx";
import {cn} from "@/lib/utils.ts";
import {useMediaQuery} from "@/hooks/useMediaQuery.ts";
import React from "react";

/**
 * Make its children in an off-canvas in mobile
 * and enforce them to be mounted only once
 *
 * Pro: Mounted only once
 * Cons: The downside is that the navigation/tree HTML of all nodes is printed on the browser on first load
 *
 * If the aside children do not have any global key binding, CSS is only what you need
 */
export default function AsideResponsive({children}: { children: React.ReactNode }) {

    // To not fire Aside children twice
    // if you use only CSS to handle the mount,
    // if the children as for instance, a SearchBox that opens with a key binding it will show twice
    const isDesktop = useMediaQuery("(min-width: 768px)")

    return (
        <div className="print:hidden">
            {!isDesktop ? (
                <OffCanvas hiddenClass={"lg:hidden"}>
                    <aside className={cn("px-4")}>
                        {children}
                    </aside>
                </OffCanvas>
            ) : (
                // Regular Aside - visible only at md and above
                <aside className={cn("hidden", "md:block")}>
                    {children}
                </aside>
            )}
        </div>
    )

}