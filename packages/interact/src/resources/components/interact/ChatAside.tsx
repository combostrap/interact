"use client"

import {useState} from "react";
import {Chat} from "@/components/interact/Chat.tsx";
import OffCanvas from "@/components/interact/OffCanvas.tsx";

export function ChatAside() {

    const [open, setOpen] = useState(true);

    return (
        <>
            {/* Launcher */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-4 right-4 z-40 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg"
                >
                    Chat
                </button>
            )}

            <OffCanvas
                onOpenChange={(open) => setOpen(open)} open={open}
                backDrop={false}
                side={"right"}
                closeOnNavigation={false}
            >
                <Chat/>
            </OffCanvas>
        </>
    )
}