import {getInteractConfig} from "../../../node/config/interactConfig.ts";
import type {LayoutProps} from "@combostrap/interact/types";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function HeadTitle({page, context}: LayoutProps) {

    const interactConfig = getInteractConfig();
    const frontmatter = page?.frontmatter;
    const title = frontmatter?.title;
    const base = interactConfig.site.base
    const isBrowserPathRoot = context.url.pathname === base || context.url.pathname === `${base}index`;
    let headPageTitle = title ? title : "";
    if (!headPageTitle && isBrowserPathRoot) {
        headPageTitle = interactConfig.site.title || 'Default'
    }

    const pageTitle = headPageTitle + (!isBrowserPathRoot ? " | " + interactConfig.site.name : "")
    return (
        <title>{pageTitle}</title>
    )
}