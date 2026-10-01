import {cn} from "@/lib/utils.ts";
import type {ReactNode} from "react";


export default function MainSidebarLayout({children, sideBar, className}: {
    className?: string,
    sideBar: ReactNode,
    children: ReactNode
}) {
    const gridClass = cn(
        "lg:grid",
        "lg:grid-cols-[7fr_minmax(auto,2fr)]",
        "lg:grid-flow-row",
        "lg:gap-4",
        "lg:[grid-template-areas:unset]",
        "lg:mx-4",
        "lg:content-start"
    );
    const tocClassName = cn(
        "lg:row-1",
        "lg:col-2",
        "lg:sticky",
        "lg:top-[5rem]",
        "lg:z-[2]",
        "lg:h-fit"
    );
    const childrenClass = cn(
        "lg:col-1",
        "lg:col-start-1"
    );
    return (
        <div className={cn(gridClass, className)}>
            <div className={tocClassName}>
                {sideBar}
            </div>
            <main className={childrenClass}>
                {children}
            </main>
        </div>
    )

}