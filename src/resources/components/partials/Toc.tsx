import type {LayoutProps, TocNode} from "@combostrap/interact/types";
import "./toc.css"
import {getInteractConfig} from "@combostrap/interact/config";
import React from "react";
import clsx from "clsx";


export type TocProps = React.HTMLAttributes<HTMLElement> & LayoutProps & {
    maxDepth?: number;
}

function TocItems({entries, maxDepth = 3, currentDepth = 1}: {
    entries: TocNode[],
    maxDepth?: number,
    currentDepth?: number
}) {
    if (currentDepth > maxDepth) return null;

    return (
        <ul>
            {entries.map((heading, i) => (
                <li key={i} className={`toc-entry toc-level-${heading.depth}`}>
                    <a href={`#${heading.id}`}>
                        {heading.value}
                    </a>
                    {heading.children && heading.children.length > 0 && (
                        <TocItems entries={heading.children} maxDepth={maxDepth} currentDepth={currentDepth + 1}/>
                    )}
                </li>
            ))}
        </ul>
    );
}

export function TocNav({toc, className, maxDepth, ...rest}: {
    className?: string,
    toc: TocNode[],
    maxDepth?: number
} & React.HTMLAttributes<HTMLElement>) {
    /**
     * The selector is a class so that we can put more than one
     * for documentation purposes
     */
    return (
        <nav className={clsx("toc", className)} {...rest}>
            <p className="toc-header">Table of Contents</p>
            {toc && <TocItems entries={toc} maxDepth={maxDepth}/>}
        </nav>
    )
}

export default function Toc({maxDepth, page, context, ...navProps}: TocProps) {
    if (maxDepth == null) {
        maxDepth = getInteractConfig().template.toc?.maxDepth;
    }
    const toc: TocNode[] = page?.toc ?? [];
    if (toc.length == 0) {
        return null
    }

    return <TocNav toc={toc} maxDepth={maxDepth} {...navProps}/>;
}