import type {LayoutProps} from "@combostrap/interact/types";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function MetaDescription({page}: LayoutProps) {
    const description = page?.frontmatter?.description;
    if (!description) {
        return;
    }
    return (
        <meta name="description" content={description}/>
    )
}
