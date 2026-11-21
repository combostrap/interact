"use client"
import {type ReactNode, useEffect, useState} from "react";
import {cn} from "@/lib/utils.ts";

type OffCanvasSide = "left" | "right"

type OffCanvasProps = {
    /**
     * Edge of the viewport the panel slides in from.
     * @default "left"
     */
    side?: OffCanvasSide
    /**
     * Extra classes applied before the base styles, typically used to hide
     * the panel at certain breakpoints (e.g. `"lg:hidden"`).
     */
    hiddenClass?: string,
    /** Content rendered inside the panel. */
    children: ReactNode,
    /**
     * Controlled state
     */
    open?: boolean,
    /**
     * Controlled function
     */
    onOpenChange?: (open: boolean) => void,
    /**
     * Uncontrolled initial value
     * @default "false"
     */
    defaultOpen?: boolean,
    /**
     * Show a backdrop that when clicked close the canvas
     * @default "true"
     */
    backDrop?: boolean,
    /**
     * Close the canvas when clicking on a link
     * @default "true"
     */
    closeOnNavigation?: boolean,
}

const sideClasses: Record<OffCanvasSide, { position: string; closed: string }> = {
    left: {
        position: "left-0",
        closed: "-translate-x-full",
    },
    right: {
        position: "right-0",
        closed: "translate-x-full",
    },
}


export default function OffCanvas({
                                      hiddenClass = "",
                                      children,
                                      open,
                                      defaultOpen = false,
                                      onOpenChange,
                                      backDrop = true,
                                      side = "left",
                                      closeOnNavigation = true
                                  }: OffCanvasProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOffCanvasOpen = isControlled ? open : internalOpen;

    const setIsOffCanvasOpen = (next: boolean) => {
        if (!isControlled) {
            setInternalOpen(next);   // only update own state when uncontrolled
        }
        onOpenChange?.(next);        // always notify the parent
    };

    // Esc to close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOffCanvasOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    /**
     * Listen to external navigation
     * (ie if the user click on a link, the canvas close)
     * pushstate is registered in the entry.browser.tsx
     */
    useEffect(() => {
        if (!closeOnNavigation) return;
        const handlePathChange = () => setIsOffCanvasOpen(false);
        window.addEventListener('pushstate', handlePathChange);
        return () => {
            window.removeEventListener('pushstate', handlePathChange);
        };
    }, []);

    const {position, closed} = sideClasses[side]

    return (
        <>
            {/* OffCanvas toggle button - visible only below md */}
            <div className={"print:hidden"}>
                <button
                    onClick={() => setIsOffCanvasOpen(true)}
                    className={cn(
                        hiddenClass,
                        "px-2",
                        "hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                    aria-label="Open navigation menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>

            {/* OffCanvas overlay and close when clicked */}
            {isOffCanvasOpen && backDrop && (
                <div
                    className={cn(hiddenClass, "fixed inset-0 backdrop-blur-sm z-40")}
                    onClick={() => setIsOffCanvasOpen(false)}
                />
            )}

            {/* OffCanvas sidebar - visible only when open */}
            <div className={cn(
                hiddenClass,
                "fixed top-0 h-full bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 overflow-y-auto",
                position,
                isOffCanvasOpen ? "translate-x-0" : closed
            )}>
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setIsOffCanvasOpen(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close navigation menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </>
    )
}