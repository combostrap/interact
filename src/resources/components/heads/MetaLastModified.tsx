import type {LayoutProps} from "@combostrap/interact/types";

/**
 * Last modified
 */
// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function MetaLastModified({context}: LayoutProps) {
    if (context.meta.lastModifiedPage == null) {
        return;
    }
    let lastModified = new Date(context.meta.lastModifiedPage);
    return (
        <meta httpEquiv="last-modified" content={lastModified.toUTCString()}/>
    )
}