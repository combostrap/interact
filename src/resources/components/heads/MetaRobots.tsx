import type {LayoutProps} from "@combostrap/interact/types";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function MetaRobots({page}: LayoutProps) {
    let robots = page?.frontmatter?.robots;
    return (
        <meta name="robots" content={robots ? robots : "index, follow"}/>
    )
}
