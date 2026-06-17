# Release

## Build

We build with `tsc` from `ts` to js file so that windows user can also use the cli.

Why? The shebang does not work on Windows

```typescript
#!/usr/bin/env -S node -r tsx/cjs
```

## Check

* `interact schema` should work
* no local TypeScript errors with `"skipLibCheck": false`
* `tsc` should show no TypeScript errors with `"skipLibCheck": true`

