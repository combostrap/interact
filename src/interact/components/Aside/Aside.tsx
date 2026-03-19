import type {Frontmatter, Page, TemplateProps} from "@combostrap/interact/types";

const pages = import.meta.glob<Page<Frontmatter>>(
    "./pages/**/*.ts",
    { eager: true }
)

function toRoute(path: string) {
    return path
        .replace("./pages", "")
        .replace(/index\.ts$/, "")
        .replace(/\.ts$/, "")
}

export const nav = Object.entries(pages)
    .map(([path, mod]) => ({
        route: toRoute(path),
        title: mod.frontmatter?.title ?? "Untitled",
        order: mod.frontmatter?.order ?? 0,
        group: mod.frontmatter?.group
    }))
    .sort((a, b) => a.order - b.order)

// @ts-ignore
export function Aside(layoutProps: TemplateProps) {
    return (
        <></>
    )
}