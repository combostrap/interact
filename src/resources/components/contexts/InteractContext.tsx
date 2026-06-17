import type {ReactNode} from "react";
import ErrorBoundary from "@/components/interact/ErrorBoundary";

// noinspection JSUnusedGlobalSymbols - vite virtual provider reads it
export default function InteractContext({children}: { children: ReactNode }) {

    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    )

}