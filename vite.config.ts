import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import viteRscSsgPlugin from "./src/interact/vite-rsc-ssg/vite-rsc-ssg-plugin.ts";
import {defineConfig} from "vite";


export default defineConfig({
  publicDir: 'examples/app/public', // default is 'public'
  plugins: [
    // import("vite-plugin-inspect").then(m => m.default()),
    mdx(),
    react(),
    rsc({
      entries: {
        client: './src/interact/vite-rsc/entry.browser.tsx',
        rsc: './src/interact/vite-rsc/entry.rsc.tsx',
        ssr: './src/interact/vite-rsc/entry.ssr.tsx',
      },
    }),
    viteRscSsgPlugin(),
  ],
})






