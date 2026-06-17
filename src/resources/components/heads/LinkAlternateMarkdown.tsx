import type {LayoutProps} from "@combostrap/interact/types";

/**
 * The markdown alternate version
 * (URL Path name should have already the base)
 */
// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function LinkAlternateMarkdown({context}: LayoutProps) {
    let markdownAlternateHref = context.url.pathname.endsWith("/") ? context.url.pathname + "index.md" : context.url.pathname + ".md"
    return (
        <link rel="alternate" type="text/markdown" href={markdownAlternateHref}/>
    )
}
