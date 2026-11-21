/**
 * SSR/Client Entry point
 * so that this CSS are first and loaded before any components
 * Because in Rsc environment, the imported CSS are loaded first
 * and may interfere with the CSS layer if seen first
 */

import {type ReactNode} from "react";
import "interact:global.css"
import {getContextComponents} from "interact:server-contexts";
import {getContextComponents as getClientContextComponents} from "interact:client-contexts";
import InteractBuiltInContext from "@/components/contexts/InteractBuiltInContext.tsx";

type AppProps = {
    children: ReactNode;
};

export default function InteractApp({children}: AppProps) {
    let root = children;
    for (const ContextComponent of Object.values(getContextComponents())) {
        root = (
            <ContextComponent>
                {root}
            </ContextComponent>
        )
    }

    // Sort in descending order so that the components that are first in ascending order becomes the root of the tree
    const contextComponents = getClientContextComponents();
    const contextKeysDescendingOrder = Object.keys(contextComponents).sort((a, b) => b.localeCompare(a));
    for (const contextComponentKey of contextKeysDescendingOrder) {
        const ContextComponent = contextComponents[contextComponentKey];
        if (ContextComponent == undefined) {
            continue
        }
        root = (
            <ContextComponent>
                {root}
            </ContextComponent>
        )
    }
    return (
        <InteractBuiltInContext>
            {root}
        </InteractBuiltInContext>
    )
}