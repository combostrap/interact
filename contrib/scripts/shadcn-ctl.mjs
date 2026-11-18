#!/usr/bin/env node
/**
 * Update vendored shadcn/ui components
 *
 * shadcn components are vendored source (not a npm dependency)
 * This script update them.
 *
 */

import {execFileSync} from "node:child_process"
import {existsSync, readFileSync, writeFileSync} from "node:fs"
import {readdir} from "node:fs/promises"
import path, {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {cac} from "cac"


// ---------------------------------------------------------------------------
// Fetch the components from the registry
// Why not the shadcn cli?
// - Installs the junk package cn into your dependencies (the base-vega registry declares a phantom `cn` dependency)
// - it requires components.json next to a package.json
// - drops a npm package-lock.json into a Yarn repo
// - Creates a literal packages/interact/@/ directory (alias resolution broken)
// - Writes import { cn } from "cn" into the component
// ---------------------------------------------------------------------------

async function fetchComponentsFromRegistry(REGISTRY_BASE, component, style) {
    const url = `${REGISTRY_BASE}/${style}/${component}.json`
    let raw
    const res = await fetch(url, {signal: AbortSignal.timeout(30_000)});
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    raw = await res.text();
    return JSON.parse(raw)
}

// ---------------------------------------------------------------------------
// transforms
// ---------------------------------------------------------------------------

/**
 * Replace the docs-app IconPlaceholder with the lucide icon it declares.
 * `<IconPlaceholder lucide="SearchIcon" className="x" />` -> `<SearchIcon className="x" />`
 * Returns the transformed source plus the collected icon names.
 */
function transformIconPlaceholders(source) {
    const icons = new Set()

    // Self-closing form.
    source = source.replace(
        /<IconPlaceholder\b([\s\S]*?)\/>/g,
        (match, body) => {
            const lucide = /\blucide="([^"]+)"/.exec(body)
            if (!lucide) {
                throw new Error(
                    "IconPlaceholder without a lucide prop:\n" + match,
                )
            }
            icons.add(lucide[1])
            const rest = body
                .replace(/\blucide="[^"]*"/, "")
                .replace(/\btabler="[^"]*"/, "")
                .replace(/\bhugeicons="[^"]*"/, "")
                .replace(/\bphosphor="[^"]*"/, "")
                .replace(/\bremixicon="[^"]*"/, "")
                .trim()
            return rest.length > 0
                ? `<${lucide[1]} ${rest} />`
                : `<${lucide[1]} />`
        },
    )

    // Paired form (no children expected, but be safe).
    source = source.replace(
        /<IconPlaceholder\b([\s\S]*?)>([\s\S]*?)<\/IconPlaceholder>/g,
        (match, body, children) => {
            const lucide = /\blucide="([^"]+)"/.exec(body)
            if (!lucide) {
                throw new Error(
                    "IconPlaceholder without a lucide prop:\n" + match,
                )
            }
            icons.add(lucide[1])
            return `<${lucide[1]}>${children}</${lucide[1]}>`
        },
    )

    return {source, icons}
}

/**
 * Rewrite imports to this repo's conventions.
 * Returns { source, icons } where icons are lucide icons that must be imported.
 */
function transformImports(source) {
    const lines = source.split("\n")
    const out = []
    const lucideIcons = new Set()

    for (let line of lines) {
        // Drop docs-app imports entirely.
        if (/^\s*import .*from "@\/app\//.test(line)) {
            continue
        }

        // The phantom dependency emitted by the registry.
        line = line.replace(/from "cn"/, 'from "@/lib/utils.ts"')

        // Registry-internal paths -> local component paths with .tsx extension.
        line = line.replace(
            /from "@\/registry\/[^/]+\/([^"]+)"/g,
            'from "@/components/$1.tsx"',
        )

        out.push(line)
    }

    return {source: out.join("\n"), lucideIcons}
}

/**
 * Ensure a lucide-react import exists for every icon actually used.
 */
function ensureLucideImports(source, usedIcons) {
    if (usedIcons.size === 0) {
        return source
    }

    const names = [...usedIcons].sort()

    const existing = /^import \{([^}]*)} from "lucide-react"$/m.exec(source)
    if (existing) {
        const current = existing[1]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        const merged = [...new Set([...current, ...names])].sort()
        return source.replace(
            /^import \{[^}]*} from "lucide-react"$/m,
            `import { ${merged.join(", ")} } from "lucide-react"`,
        )
    }

    // Insert after the end of the last import statement. An import statement
    // ends at the line containing `from "..."` (or a bare `import "..."`);
    // multiline `import {` blocks must not be treated as the end.
    const lines = source.split("\n")
    let lastImportEnd = -1
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (/^import\b/.test(line) || /^\s*} from "/.test(line)) {
            if (/from "[^"]+"|^import "[^"]+"/.test(line)) {
                lastImportEnd = i
            }
        }
    }

    if (lastImportEnd === -1) {
        // No imports at all: put it at the top.
        lines.unshift(`import { ${names.join(", ")} } from "lucide-react"`, "")
        return lines.join("\n")
    }

    lines.splice(
        lastImportEnd + 1,
        0,
        `import { ${names.join(", ")} } from "lucide-react"`,
    )
    return lines.join("\n")
}

/**
 * Ensure exactly one blank line between the third-party import group and the
 * local (`@/...`) import group, matching this repo's style. Only touches the
 * import block at the top of the file.
 */
function normalizeImportGroups(source) {
    const lines = source.split("\n")

    // Leave a leading "use client" / "use server" directive and its blank
    // line untouched; only the import block below it is reorganised.
    let start = 0
    if (/^["']use (client|server)["']\s*$/.test(lines[0] ?? "")) {
        start = 1
        while (start < lines.length && lines[start].trim() === "") {
            start++
        }
    }

    // Find the end of the leading import block. Track multiline `import {`
    // blocks so their continuation lines are not mistaken for code.
    let end = -1
    let inMultilineImport = false
    for (let i = start; i < lines.length; i++) {
        const line = lines[i]
        if (inMultilineImport) {
            end = i
            if (/from "[^"]+"|^\s*} from "/.test(line)) {
                inMultilineImport = false
            }
            continue
        }
        if (/^import\b/.test(line)) {
            end = i
            if (!/from "[^"]+"|^import "[^"]+"/.test(line)) {
                inMultilineImport = true
            }
            continue
        }
        if (end !== -1 && line.trim() !== "") {
            break
        }
    }
    if (end === -1) {
        return source
    }

    const head = lines.slice(start, end + 1)
    const tail = lines.slice(end + 1)
    const prefix = lines.slice(0, start)

    // Split the head into individual import statements. A statement starts at
    // `import` and ends at the line containing `from "..."` (or a bare
    // `import "..."`). Blank lines are separators and are dropped here.
    const statements = []
    let current = null
    for (const line of head) {
        if (line.trim() === "") {
            continue
        }
        if (current === null) {
            current = []
        }
        current.push(line)
        if (/from "[^"]+"|^import "[^"]+"/.test(line)) {
            statements.push(current)
            current = null
        }
    }
    if (current !== null) {
        statements.push(current)
    }

    const isLocal = (stmt) =>
        stmt.some((line) => /from "@\//.test(line))

    const thirdParty = statements.filter((s) => !isLocal(s))
    const local = statements.filter((s) => isLocal(s))

    const rebuilt = []
    for (const s of thirdParty) {
        rebuilt.push(...s)
    }
    if (thirdParty.length > 0 && local.length > 0) {
        rebuilt.push("")
    }
    for (const s of local) {
        rebuilt.push(...s)
    }

    // Re-add the blank line after a leading directive.
    const prefixLines = [...prefix]
    if (prefixLines.length > 0) {
        prefixLines.push("")
    }

    return [...prefixLines, ...rebuilt, ...tail].join("\n")
}


/**
 * Normalise trailing whitespace / blank lines.
 */
function tidy(source) {
    return (
        source
            .split("\n")
            .map((line) => line.replace(/\s+$/, ""))
            .join("\n")
            .replace(/\n{3,}/g, "\n\n")
            .replace(/\n+$/, "") + "\n"
    )
}

function transform(rawSource, localSource) {
    let source = rawSource

    const iconResult = transformIconPlaceholders(source)
    source = iconResult.source

    const importResult = transformImports(source)
    source = importResult.source

    // Merge lucide imports: icons referenced in JSX plus any the file already
    // imported locally.
    const usedIcons = new Set(iconResult.icons)
    for (const m of localSource.matchAll(
        /import \{([^}]*)} from "lucide-react"/g,
    )) {
        for (const name of m[1].split(",")) {
            const trimmed = name.trim()
            if (trimmed && new RegExp(`\\b${trimmed}\\b`).test(source)) {
                usedIcons.add(trimmed)
            }
        }
    }
    source = ensureLucideImports(source, usedIcons)

    source = normalizeImportGroups(source)

    // Preserve a leading "use client" if the local file declares one.
    const localHasUseClient = /^["']use client["']/.test(localSource.trimStart())
    const upstreamHasUseClient = /^["']use client["']/.test(source.trimStart())
    if (localHasUseClient && !upstreamHasUseClient) {
        source = `"use client"\n\n${source}`
    }

    return tidy(source)
}


/**
 *
 * @param target_dir - the shadcn directory target
 * @returns {Promise<string[]>} the actual components
 */
async function getActualComponents(target_dir) {
    const entries = await readdir(target_dir, {withFileTypes: true});
    return entries
        .filter((e) => e.isFile() && e.name.endsWith('.tsx'))
        .map((f) => path.parse(f.name).name);
}


/**
 * Update (or check) the vendored shadcn/ui components.
 *
 * @param {object} options
 * @param {boolean} options.check - report out-of-date components without writing
 * @param {boolean} options.verbose - print the transformed source for each component
 * @param {string} options.style - registry style to fetch
 * @param {string[]} options.components - components to process (all when empty)
 */
async function run({check, verbose, style, components = []}) {

    const __dirname = dirname(fileURLToPath(import.meta.url))
    const REPO_ROOT = resolve(__dirname, "..", "..")
    const UI_DIR = join(
        REPO_ROOT,
        "packages/interact/src/resources/components/ui",
    )

    const REGISTRY_BASE = "https://ui.shadcn.com/r/styles"

    const targets =
        components.length > 0 ? components : await getActualComponents(UI_DIR)

    let failures = 0
    let changed = 0

    for (const component of targets) {

        const localPath = join(UI_DIR, `${component}.tsx`)
        if (!existsSync(localPath)) {
            console.error(`✗ ${component}: no local file at ${localPath}`)
            failures++
            continue
        }

        const localSource = readFileSync(localPath, "utf8")

        let item
        try {
            item = await fetchComponentsFromRegistry(REGISTRY_BASE, component, style)
        } catch (error) {
            console.error(`✗ ${component}: ${error.message}`)
            failures++
            continue
        }

        const file = item.files?.[0]
        if (!file?.content) {
            console.error(`✗ ${component}: registry item has no file content`)
            failures++
            continue
        }

        let next
        try {
            next = transform(file.content, localSource)
        } catch (error) {
            console.error(`✗ ${component}: ${error.message}`)
            failures++
            continue
        }

        if (verbose) {
            console.log(`\n${"=".repeat(60)}\n${component}\n${"=".repeat(60)}`)
            console.log(next)
        }

        const isSame = next === localSource

        if (check) {
            if (!isSame) {
                console.error(`✗ ${component}: out of date`)
                failures++
            } else {
                console.log(`✓ ${component}: up to date`)
            }
            continue
        }

        if (isSame) {
            console.log(`= ${component}: already up to date`)
            continue
        }

        changed++

        if (check) {
            console.log(`~ ${component}: would update`)
            // Show a unified diff via git diff --no-index.
            try {
                execFileSync(
                    "git",
                    [
                        "--no-pager",
                        "diff",
                        "--no-index",
                        "--color=always",
                        localPath,
                        "-",
                    ],
                    {input: next, stdio: ["pipe", "inherit", "inherit"]},
                )
            } catch {
                // git diff exits 1 when files differ; that is expected.
            }
            continue
        }

        writeFileSync(localPath, next)
        console.log(`✓ ${component}: updated`)
    }

    if (check && failures > 0) {
        console.error(
            `\n${failures} component(s) out of date`,
        )
        process.exit(1)
    }

}


async function main() {

    const cli = cac("update-shadcn-ui")

    // Set by whichever action runs; stays null when no action matches.
    let actionPromise = null

    cli
        .command("update [components...]", "Update vendored shadcn/ui components")
        .option("--verbose", "Print the transformed source for each component")
        .option("--style <style>", "Registry style to fetch", {
            default: "base-vega",
        })
        .action((components, options) => {
            actionPromise = run({
                check: false,
                verbose: Boolean(options.verbose),
                style: options.style,
                components,
            })
        })

    cli
        .command(
            "check [components...]",
            "Report out-of-date components without writing",
        )
        .option("--verbose", "Print the transformed source for each component")
        .option("--style <style>", "Registry style to fetch", {
            default: "base-vega",
        })
        .action((components, options) => {
            actionPromise = run({
                check: true,
                verbose: Boolean(options.verbose),
                style: options.style,
                components,
            })
        })

    cli.help()

    cli.parse()

    // No action matched: show the help.
    if (!actionPromise) {
        cli.outputHelp()
        process.exit(1)
    }

    await actionPromise

}

await main()
