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

let pagefindPromise: Promise<any> | null = null

// ie .interact/search
declare const __SEARCH_RELATIVE_BASE_URL__: string;

function loadPagefind(): Promise<PagefindInstance> {

    if (!pagefindPromise) {


        let baseurl = import.meta.env.BASE_URL;
        let relativeBasePath = `${__SEARCH_RELATIVE_BASE_URL__}/pagefind.js`;
        let pagefindUrl
        if (baseurl != "/") {
            pagefindUrl = `${baseurl}/${relativeBasePath}`
        } else {
            pagefindUrl = `${baseurl}${relativeBasePath}`
        }
        pagefindPromise = import(/* @vite-ignore */ pagefindUrl)
    }
    return pagefindPromise
}

export function SearchBox() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<ResultItem[]>([])
    const [loading, setLoading] = React.useState(false)
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
                    return {
                        id: r.id,
                        url: data.url,
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
                className="fixed left-1/2 top-20 -translate-x-1/2 translate-y-0 max-h-[calc(100vh-2rem)] overflow-y-auto"
                initialFocus={inputRef}
            >
                <Command shouldFilter={false} className={'mt-3'}>
                    <CommandInput
                        ref={inputRef}
                        placeholder="Search..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Searching...
                            </div>
                        )}
                        {!loading && query && results.length === 0 && (
                            <CommandEmpty>No results found.</CommandEmpty>
                        )}
                        {results.length > 0 && (
                            <CommandGroup heading="Results">
                                {results.map((r) => {
                                    let target = r.url;
                                    if (r.url.endsWith("html")) {
                                        target = target.replace(".html", "");
                                    }
                                    return (
                                        <CommandItem
                                            key={r.id}
                                            value={r.id}
                                            onSelect={() => {
                                                history.pushState(null, '', target)
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
            </DialogContent>
        </Dialog>
    )
}