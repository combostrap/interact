import {getInteractConfig} from "@combostrap/interact/config";
import type {LayoutProps} from "@combostrap/interact/types";

/**
 * Head base meta
 * Relative path and anchor links in the page are
 * calculated by the browser relative to the path name of this URL
 *
 * In the root, we need to add a slash otherwise the relative path is calculated
 * against the parent path (if there is a base, there is another parent)
 *
 * ie <base href="/reference/component/">
 * works across domains because it's domain-agnostic — it always resolves relative to wherever the site is hosted.
 */
// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function HeadBase({context}: LayoutProps) {
    const interactConfig = getInteractConfig();
    let baseHeadURL = (interactConfig.site.base != "/" ? interactConfig.site.base : "") + context.url.pathname;
    return (
        <base href={baseHeadURL}/>
    )
}
