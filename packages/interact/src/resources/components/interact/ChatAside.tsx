"use client"

import {useState} from "react";
import {Chat} from "@/components/interact/Chat.tsx";
import OffCanvas from "@/components/interact/OffCanvas.tsx";
import {Button} from "@/components/ui/button.tsx";

export function ChatAside() {

    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Launcher */}
            {!open && (
                <Button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-4 right-4 z-40"
                >
                    Chat
                </Button>
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