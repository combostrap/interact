"use client"

import * as React from "react"
import {ChevronRight, ChevronDown} from "lucide-react"
import type {PageNode} from "@/rsc/server/handler.tsx";
import Anchor from "@combostrap/interact/components/Anchor";
import {useEffect} from "react";

export type Props = {
    nodes: PageNode[]
    expanded: string[]
    onExpandedChange: (expanded: string[]) => void
    className?: string
}

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(" ")
}

function flattenVisibleNodes(
    nodes: PageNode[],
    expandedSet: Set<string>,
    depth = 0
): Array<{ node: PageNode; depth: number }> {
    const result: Array<{ node: PageNode; depth: number }> = []

    for (const node of nodes) {
        result.push({node, depth})

        if (node.type === "folder" && expandedSet.has(node.path)) {
            if (node.children?.length) {
                result.push(
                    ...flattenVisibleNodes(node.children, expandedSet, depth + 1)
                )
            }
        }
    }

    return result
}

function FileTree({
                      nodes,
                      expanded,
                      onExpandedChange,
                      className,
                  }: Props) {
    const expandedSet = React.useMemo(() => new Set(expanded), [expanded])

    const [focusedPath, setFocusedPath] = React.useState<string | undefined>(undefined)
    const [actualPath, setActual] = React.useState<string | undefined>(undefined)

    const flat = React.useMemo(
        () => flattenVisibleNodes(nodes, expandedSet),
        [nodes, expandedSet]
    )

    /**
     * Listen to navigation
     * pushstate is registered in the entry.browser.tsx
     */
    useEffect(() => {
        const handlePathChange = () => setActual(window.location.pathname);
        window.addEventListener('pushstate', handlePathChange);
        return () => {
            window.removeEventListener('pushstate', handlePathChange);
        };
    }, []);

    const visiblePaths = flat.map((n) => n.node.path)

    const focusIndex = focusedPath
        ? visiblePaths.indexOf(focusedPath)
        : -1

    const setExpanded = (path: string) => {
        const next = new Set(expandedSet)
        if (next.has(path)) next.delete(path)
        else next.add(path)
        onExpandedChange(Array.from(next))
    }

    const moveFocus = (delta: number) => {
        if (!flat.length) return

        let idx = focusIndex
        if (idx === -1) idx = 0
        else idx = Math.max(0, Math.min(flat.length - 1, idx + delta))

        setFocusedPath(flat[idx]?.node.path)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!flat.length) return

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                moveFocus(1)
                break

            case "ArrowUp":
                e.preventDefault()
                moveFocus(-1)
                break

            case "ArrowRight": {
                e.preventDefault()
                const node = flat[focusIndex]?.node
                if (!node) return

                if (node.type === "folder") {
                    if (!expandedSet.has(node.path)) {
                        setExpanded(node.path)
                    } else if (node.children?.length) {
                        setFocusedPath(node.children[0]?.path)
                    }
                }
                break
            }

            case "ArrowLeft": {
                e.preventDefault()
                const node = flat[focusIndex]?.node
                if (!node) return

                if (node.type === "folder" && expandedSet.has(node.path)) {
                    setExpanded(node.path)
                }
                break
            }

            case "Enter": {
                e.preventDefault()
                const node = flat[focusIndex]?.node
                if (!node) return

                if (node.type === "folder") {
                    setExpanded(node.path)
                }
                break
            }
        }
    }

    return (
        <div
            className={cn("text-sm select-none", className)}
            role="tree"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={() => {
                if (!focusedPath && flat.length) {
                    setFocusedPath(flat[0]?.node.path)
                }
            }}
        >
            <ul className="space-y-0.5">
                {flat.map(({node, depth}) => {
                    const isFolder = node.type === "folder"
                    const isExpanded = expandedSet.has(node.path)
                    const isFocused = focusedPath === node.path

                    let focusClass = "text-primary";
                    if (actualPath !== node.path) {
                        focusClass = "text-black"
                    }
                    return (
                        <li
                            key={node.path}
                            role="treeitem"
                            aria-expanded={isFolder ? isExpanded : undefined}
                            tabIndex={-1}
                            className={cn(
                                "flex items-center gap-1 rounded px-2 py-1 cursor-pointer",
                                isFocused && "bg-accent",
                            )}
                            style={{paddingLeft: depth * 16}}
                            onClick={() => {
                                setFocusedPath(node.path)
                                if (isFolder) {
                                    setExpanded(node.path)
                                }
                            }}
                            onMouseMove={() => setFocusedPath(node.path)}
                        >
                            {isFolder && (
                                <span className="flex items-center gap-1">
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4"/>
                                ) : (
                                    <ChevronRight className="h-4 w-4"/>
                                )}
                                </span>
                            )}
                            <span className="truncate">
                                {!isFolder ? (
                                    <Anchor href={node.path} className={cn("truncate capitalize", focusClass)}>
                                        {node.name}
                                    </Anchor>
                                ) : (
                                    <span className="truncate capitalize">
                                    {node.name}
                                    </span>
                                )
                                }
                            </span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default function Tree({data}: { data: PageNode[] }) {

    const [expanded, setExpanded] = React.useState<string[]>([
        "/src",
        "/src/components",
    ])

    return (

        <FileTree
            nodes={data}
            expanded={expanded}
            onExpandedChange={setExpanded}
            className="p-2"
        />

    )
}