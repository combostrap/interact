import type {Plugin} from "vite";

/**
 * Check that there is no env `import.meta.env.xxx` left
 */
export default function viteCheckEnvExpansion(): Plugin {
    return {
        name: 'check-env-replaced',
        generateBundle(_, bundle) {
            // build.rollupOptions generateBundle hook inline
            // generateBundle gives you the in-memory chunks before writing,
            // and this.error() is the proper Rollup way to abort with a build error.
            const pattern = new RegExp(`import\\.meta\\.env\\w+`)
            for (const [fileName, chunk] of Object.entries(bundle)) {
                if (chunk.type !== 'chunk') continue
                const match = chunk.code.match(pattern)
                if (match) {
                    this.error(`Unreplaced env var "${match[0]}" found in ${fileName}`)
                }
            }
        }
    }
}