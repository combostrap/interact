## Sharp

Sharp is also in: `@realfavicongenerator/image-adapter-node`.
We pinned it with resolutions.

## Component Export

The exports are meant to be used/bundled by vite, so they live in `src`

```json
{
  "exports": {
    "./components/*": "./src/interact/components/*.tsx"
  }
}
```

Components Export are not the compiled (dist) one, they are compiled by Vite so that the
import of CSS file works.
The only code that needs to be build is the code called by the cli to start vite
(ie all middleware and plugins) located in `src/interact`

## Vite

As direct dependency, it is mandatory for development otherwise you get error such
unable to find `./cjs/react-server-dom-webpack-client.browser.development.js`

After upgrading test a ssg
(tested vite 8.0.1 and it was breaking)

## DevDependencies

They include all dependencies to compile with tsc.
so that we can download the GitHub tarball, install only the devDependencies
and compile.

## Files

We need:

* all compiled js files in dist because the cli needs them.
* the src lib file so that vite will load them
* the type
* tsconfig as we use tsx to call the cli

```json
{
  "files": [
    "dist/interact/**/*",
    "src/lib/**/*",
    "src/types/**/*",
    "tsconfig.json"
  ]
}
```

otherwise we get this kind of error, when starting the cli:

```
message: [MODULE_NOT_FOUND] import() failed to load client-project/node_modules/@combostrap/interact/dist/interact/cli/commands/start.js: Cannot find module 'client-project/node_modules/@combostrap/interact/dist/interact/pages/viteVirtualPagesModules.js' imported from client-project/node_modules/@combostrap/interact/dist/interact/cli/shared/vite.config.js
```

## bin / cli

There is 2:

* `interact` - the build release used by user and ci/cd
* `ninteract` - the next interact used by developer as it needs tsx

Why not using tsx or node? Because:

* tsx starts a child node process (meaning that it does not work well with IDE debugger)
* the shebang is not supported on Windows

## Typescript - tsx

`tsx` is used to run `ts` file.
The shebang of [cli.ts](../../src/interact/cli/cli.ts) is a good example.

## Styling, tailwind and Shadcn

* tw-animate-css
* shadcn
* class-variance-authority
* tailwind-merge

## Markdown/Mx

`recma-mdx-is-mdx-component`: So that we can detect that the content comes from Markdown and set
the [prose class](../../apps/site/pages/reference/styling.md#prose-content) to true
https://github.com/remcohaszing/recma-mdx-is-mdx-component