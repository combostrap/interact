## Sharp

Sharp is also in: `@realfavicongenerator/image-adapter-node`.
We pinned it with resolutions.

## Type Module

```json
{
  "type": "module"
}
```

Is mandatory to generate js file as bundle and not mjs

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

* dist/node: all compiled js files for the cli
* src/resources: vite load them
* src/node: because src/resources may use them. ie entry.rsc.tsx use
  * node/config/interactConfig.ts
  * node/lib/htmlCache.ts
* package.json (mandatory for publishing and has the version)
* build-info.json (for built time)

```json
{
  "files": [
    "dist/node/**/*",
    "src/node/**/*",
    "src/resources/**/*",
    "src/types/**/*",
    "package.json"
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
The shebang of [cli.ts](../../packages/interact/src/node/cli/cli.ts) is a good example.

## Styling, tailwind and Shadcn

* tw-animate-css
* shadcn
* class-variance-authority
* tailwind-merge

## Markdown/Mx

`recma-mdx-is-mdx-component`: So that we can detect that the content comes from Markdown and set
the [prose class](../../sites/interact/pages/reference/styling.md#prose-content) to true
https://github.com/remcohaszing/recma-mdx-is-mdx-component

## cmdk

Used by shadcn for the command https://ui.shadcn.com/docs/components/base/command
https://github.com/dip/cmdk

## svgdom

Fixed to 0.1.24 because of
https://github.com/svgdotjs/svgdom/issues/141