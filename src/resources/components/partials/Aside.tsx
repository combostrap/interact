import type {Frontmatter, LayoutProps, Page} from "@combostrap/interact/types";
import React from "react";
import Tree from "@/components/interact/Tree.tsx";
import {getInteractConfig} from "../../../interact/config/interactConfig.ts";
import {getPagesTree} from "../../rsc/server/handler.tsx";

const pages = import.meta.glob<Page<Frontmatter>>(
    "./pages/**/*.ts",
    {eager: true}
)

function toRoute(path: string) {
    return path
        .replace("./pages", "")
        .replace(/index\.ts$/, "")
        .replace(/\.ts$/, "")
}


export const nav = Object.entries(pages)
    .map(([path, mod]) => ({
        path: toRoute(path),
        name: mod.frontmatter?.title ?? "Untitled",
        order: mod.frontmatter?.order ?? 0,
        group: mod.frontmatter?.group
    }))
    .sort((a, b) => a.order - b.order)

export type AsideProps = React.HTMLAttributes<HTMLElement> & LayoutProps

// @ts-ignore -- exported
export default function Aside({page, context, ...props}: AsideProps) {
    let interactConfig = getInteractConfig();
    let data = getPagesTree(interactConfig.paths.pagesDirectory).children ?? []

    return <Tree data={data} {...props} />


}