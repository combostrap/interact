import {getInteractConfig} from "../../../interact/config/interactConfig";
import type {LayoutProps} from "@combostrap/interact/types";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function HeadTitle({page, context}: LayoutProps) {

    const interactConfig = getInteractConfig();
    let frontmatter = page?.frontmatter;
    let title = frontmatter?.title;
    const base = interactConfig.site.base
    const isBrowserPathRoot = context.url.pathname === base || context.url.pathname === `${base}index`;
    let headPageTitle = title ? title : "";
    if (!headPageTitle && isBrowserPathRoot) {
        headPageTitle = interactConfig.site.title || 'Default'
    }

    let pageTitle = headPageTitle + (!isBrowserPathRoot ? " | " + interactConfig.site.name : "")
    return (
        <title>{pageTitle}</title>
    )
}