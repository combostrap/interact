"use client"
import {type ReactNode, useEffect, useState} from "react";
import {cn} from "@/lib/utils.ts";


export default function OffCanvas({hiddenClass = "md:hidden", children}: {
    hiddenClass?: string,
    children: ReactNode
}) {
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

    /**
     * Listen to navigation
     * pushstate is registered in the entry.browser.tsx
     */
    useEffect(() => {
        const handlePathChange = () => setIsOffCanvasOpen(false);
        window.addEventListener('pushstate', handlePathChange);
        return () => {
            window.removeEventListener('pushstate', handlePathChange);
        };
    }, []);

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

            {/* OffCanvas overlay close when clicked */}
            {isOffCanvasOpen && (
                <div
                    className={cn(hiddenClass, "fixed inset-0 backdrop-blur-sm z-40")}
                    onClick={() => setIsOffCanvasOpen(false)}
                />
            )}

            {/* OffCanvas sidebar - visible only when open */}
            <div className={cn(
                hiddenClass, "fixed top-0 left-0 h-full bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 overflow-y-auto",
                isOffCanvasOpen ? "translate-x-0" : "-translate-x-full"
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