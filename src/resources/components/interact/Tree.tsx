"use client"

import * as React from "react"
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react"

export type TreeNode = {
    name: string
    path: string
    type: "file" | "folder"
    children?: TreeNode[]
}

export type Props = {
    nodes: TreeNode[]

    selected: string | null
    expanded: string[]

    onSelect: (path: string) => void
    onExpandedChange: (expanded: string[]) => void
}

function cn(...classes: (string | undefined | false)[]) {
    return classes.filter(Boolean).join(" ")
}

function flattenVisibleNodes(
    nodes: TreeNode[],
    expandedSet: Set<string>,
    depth = 0
): Array<{ node: TreeNode; depth: number }> {
    const result: Array<{ node: TreeNode; depth: number }> = []

    for (const node of nodes) {
        result.push({ node, depth })

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
                             selected,
                             expanded,
                             onSelect,
                             onExpandedChange,
                         }: Props) {
    const expandedSet = React.useMemo(() => new Set(expanded), [expanded])

    const [focusedPath, setFocusedPath] = React.useState<string | undefined>(undefined)

    const flat = React.useMemo(
        () => flattenVisibleNodes(nodes, expandedSet),
        [nodes, expandedSet]
    )

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
                } else {
                    onSelect(node.path)
                }
                break
            }
        }
    }

    return (
        <div
            className="w-full text-sm select-none"
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
                {flat.map(({ node, depth }) => {
                    const isFolder = node.type === "folder"
                    const isExpanded = expandedSet.has(node.path)
                    const isSelected = selected === node.path
                    const isFocused = focusedPath === node.path

                    return (
                        <li
                            key={node.path}
                            role="treeitem"
                            aria-expanded={isFolder ? isExpanded : undefined}
                            aria-selected={isSelected}
                            tabIndex={-1}
                            className={cn(
                                "flex items-center gap-1 rounded px-2 py-1 cursor-pointer",
                                isFocused && "bg-accent",
                                isSelected && "font-medium"
                            )}
                            style={{ paddingLeft: depth * 16 }}
                            onClick={() => {
                                setFocusedPath(node.path)

                                if (isFolder) {
                                    setExpanded(node.path)
                                } else {
                                    onSelect(node.path)
                                }
                            }}
                            onMouseMove={() => setFocusedPath(node.path)}
                        >
              <span className="flex items-center gap-1">
                {isFolder ? (
                    isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )
                ) : (
                    <span className="w-4" />
                )}

                  {isFolder ? (
                      <Folder className="h-4 w-4 text-muted-foreground" />
                  ) : (
                      <File className="h-4 w-4 text-muted-foreground" />
                  )}
              </span>

                            <span className="truncate">{node.name}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default function Tree({data}: { data: TreeNode[] }) {
    const [selected, setSelected] = React.useState<string | null>(null)

    const [expanded, setExpanded] = React.useState<string[]>([
        "/src",
        "/src/components",
    ])

    return (
        <div className="w-72 border-r h-screen p-2">
            <FileTree
                nodes={data}
                selected={selected}
                expanded={expanded}
                onSelect={(path) => {
                    setSelected(path)
                    console.log("Selected file:", path)
                }}
                onExpandedChange={setExpanded}
            />

            <div className="mt-4 text-xs text-muted-foreground">
                Selected: {selected ?? "none"}
            </div>
        </div>
    )
}