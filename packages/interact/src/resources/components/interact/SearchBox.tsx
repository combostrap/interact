"use client"

import * as React from "react"
import {Search} from "lucide-react"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import type {PagefindInstance} from "../../../node/search/pagefind-search";


type ResultItem = {
    id: string
    url: string
    title: string
    excerpt: string
}

let pagefind: PagefindInstance | null = null

// ie .interact/search
declare const __SEARCH_RELATIVE_BASE_URL__: string;

async function loadPagefind(): Promise<PagefindInstance> {

    if (pagefind == null) {
        let baseurl = import.meta.env.BASE_URL;
        let relativeBasePath = `${__SEARCH_RELATIVE_BASE_URL__}/pagefind.js`;
        let pagefindUrl
        if (baseurl != "/") {
            pagefindUrl = `${baseurl}/${relativeBasePath}`
        } else {
            pagefindUrl = `${baseurl}${relativeBasePath}`
        }
        pagefind = await import(/* @vite-ignore */ pagefindUrl) as PagefindInstance;
        await pagefind.options({
            highlightParam: "highlight",
            baseUrl: baseurl,
        });
    }
    return pagefind
}

export function SearchBox() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<ResultItem[]>([])
    const [loading, setLoading] = React.useState(false)
    const [activeValue, setActiveValue] = React.useState<string>('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (open) loadPagefind().then(() => null)
    }, [open])

    React.useEffect(() => {
        if (!query) {
            setResults([])
            return
        }

        let cancelled = false
        setLoading(true)

        const run = async () => {
            const pagefind = await loadPagefind()
            const search = await pagefind.search(query)
            if (cancelled) return

            const items = await Promise.all(
                search.results.slice(0, 8).map(async (r) => {
                    const data = await r.data()
                    function removeHtmlExtension(input:string) {
                        const [pathAndQuery = '', hash] = input.split('#');
                        const [path = '', query] = pathAndQuery.split('?');
                        const newPath = path.replace(/\.html$/i, '');
                        return newPath + (query ? '?' + query : '') + (hash ? '#' + hash : '');
                    }
                    let url = removeHtmlExtension(data.url);
                    return {
                        id: r.id,
                        url: url,
                        title: data.meta?.["title"] ?? data.url,
                        excerpt: data.excerpt,
                    }
                })
            )

            if (!cancelled) {
                setResults(items)
                setLoading(false)
            }
        }

        const debounce = setTimeout(run, 150)
        return () => {
            cancelled = true
            clearTimeout(debounce)
        }
    }, [query])

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((o) => !o)
            }
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [])


    const kbdClass = "inline-flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 font-mono text-xs"

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button
                        variant="outline"
                        className="relative w-full max-w-sm justify-start text-muted-foreground"
                    >
                        <Search className="mr-2 h-4 w-4"/>
                        Search docs...
                        <kbd
                            className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </Button>
                }
            />
            <DialogContent
                className="fixed top-20 translate-y-0 p-0 gap-0 max-h-[calc(100vh-2rem)] md:max-w-1/2"
                initialFocus={inputRef}
                showCloseButton={false}
            >
                <Command
                    shouldFilter={false}
                    value={activeValue}
                    onValueChange={setActiveValue}
                >
                    <CommandInput
                        ref={inputRef}
                        placeholder="Search..."
                        value={query}
                        onValueChange={setQuery}
                        className={"bg-none"}
                    />
                    <CommandList>
                        {loading && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Searching...
                            </div>
                        )}
                        {!loading && query && (
                            <CommandEmpty>
                                {results.length === 0
                                    ? "No results found."
                                    : `${results.length} results found.`}
                            </CommandEmpty>
                        )}
                        {results.length > 0 && (
                            <CommandGroup heading="Results">
                                {results.map((r) => {
                                    return (
                                        <CommandItem
                                            key={r.id}
                                            value={r.url}
                                            onSelect={() => {
                                                history.pushState(null, '', r.url)
                                                setOpen(false)
                                            }}
                                            className="flex flex-col items-start gap-1"
                                        >
                                            <span className="font-medium">{r.title}</span>
                                            <span
                                                className="line-clamp-1 text-xs text-muted-foreground"
                                                dangerouslySetInnerHTML={{__html: r.excerpt}}
                                            />
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
                {/* fake status bar */}
                {activeValue && (
                    <div className="truncate border-t bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                        {activeValue}
                    </div>
                )}
                <div
                    className="flex items-center justify-between border-t border-border px-3 py-1.5 text-xs text-muted-foreground pt-3">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className={kbdClass}>↑</kbd>
                            <kbd className={kbdClass}>↓</kbd>
                            <span className="ml-0.5">Navigate</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className={kbdClass}>↵</kbd>
                            <span className="ml-0.5">Select</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className={kbdClass}>esc</kbd>
                            <span className="ml-0.5">Close</span>
                        </span>
                    </div>

                    <span className="flex items-center gap-1">
                        <kbd
                            className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 font-mono text-xs">⌘</kbd>
                        <kbd
                            className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-muted px-1 font-mono text-xs">K</kbd>
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    )
}