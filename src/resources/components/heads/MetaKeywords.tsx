import type {LayoutProps} from "@combostrap/interact/types";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function MetaKeywords({page}: LayoutProps) {
    let keyWords = page?.frontmatter?.keyWords;
    if (!keyWords) {
        return;
    }
    return (
        <meta name="keywords" content={keyWords}/>
    )
}
