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
# check the pack created
npm pack --dry-run
# Install
yarn build && npm install . -g
# Check the build time to see if it's the one we just build
interact --version 
# A site build should be successful
# Asking for the version is not enough as the script is loaded dynamically and don't touch the whole graph
interact build --confPath ../../sites/interact/
# Optionally remove it and repeat
# Should show `removed 1 package in 200ms`
npm uninstall -g @combostrap/interact
```
* Release
```bash
# You are being prompt
# (For npm, see npm login doc, you need 2FA or staging)
# --npm.ignoreVersion: get the last version from git and not package.json
release-it --check --npm.ignoreVersion
# in case of errors use as basis the below command
# NODE_DEBUG=release-it:* release-it -VV \
#  --npm.skipChecks \
#  --no-github \
#  --no-plugins \
#  --no-git.requireCleanWorkingDir \
#  --no-git.requireCommits
```
* Test release
```bash
npm install -g @combostrap/interact@latest
```