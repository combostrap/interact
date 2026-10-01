# Release

## Build

We build with `tsc` from `ts` to js file so that windows user can also use the cli.

Why? The shebang does not work on Windows

```typescript
#!/usr/bin/env -S node -r tsx/cjs
```

## Check

* `interact schema` should work
```bash
cd sites/interact
interact schema
```
* no local TypeScript errors with `"skipLibCheck": false`
```bash
yarn check
```
* check `d.ts` by setting `"skipLibCheck": true` into [tsconfig.json](../../packages/interact/tsconfig.json)
```bash
yarn check
# only error should be: 
# vite-env-override.d.ts:9:20 - error TS2300: Duplicate identifier 'src'.
```
*  check peer-dependencies rules
```bash
npx check-peer-dependencies no
# fail because of insiders that is not a valid version
# tailwindcss >=3.0.0 || >=4.0.0 || insiders is required by @tailwindcss/typography@0.5.20) (4.3.3 is installed)
```
* Check undeclared dependency with a [Doctor check](https://yarnpkg.com/migration/pnp#calling-the-doctor)
```bash
yarn dlx @yarnpkg/doctor
```
* build and start the website
```bash
yarn build
yarn bin interact # should be ..interact/dist/node/cli/cli.js
yarn interact --help # should work
yarn interact start --confPath=../../sites/interact # should work
```
* Merge the next branch
```bash
gfl # check log
gfs # squash
gfm # merge
```
* Test Install
```bash
npm install . -g
interact --version
npm remove -g @combostap/interact
```
* Release
```bash
# The version in the package should be the next version
yarn build
# check the page created
npm pack --dry-run
# You are being prompt
release --no-check --no-increment
```
