"use client"

import {useSidebar} from "@/components/contexts/SidebarContext.tsx";
import {cn} from "cn";

import {PanelLeft} from "lucide-react"
import {Button} from "@/components/ui/button.tsx";

export function SidebarButton(className: { className: string }) {

    const {toggle, isOffCanvas} = useSidebar();

    return isOffCanvas ? (
        <Button
            onClick={toggle}
            variant={"ghost"}
            className={cn(
                className,
                "hover:bg-gray-100 dark:hover:bg-gray-700 p-0 m-0"
            )}
            aria-label="Open navigation menu"
        >
            <PanelLeft className={"text-primary size-6"}/>
        </Button>
    ) : null
}