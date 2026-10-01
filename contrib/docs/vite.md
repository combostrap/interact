## Plugin

interact config is not a props of plugin so that if the config change,
we can restart the dev server and each plugin get the new global value

## Update

### Check the CI

Check the `vite-ecosystem-ci` actions at: https://github.com/vitejs/vite-ecosystem-ci/  - The following
components should be green:

* `vite-plugin-react`
* `vite-plugin-rsc`
* `vitest`

Check the `ci-rsc` action at: https://github.com/vitejs/vite-plugin-react/actions/

### Grab the versions

* Get the `vite-plugin-rsc` version
  of https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-rsc/package.json

```json
{
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-server-dom-webpack": "^19.2.6"
}
```

* Get the `vite-plugin-react` version
  of https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/package.json


* Grab the peer dependencies at https://github.com/vitejs/vite-plugin-react/blob/main/package.json

```json
{
  "vite": "^8.2.1",
  "vite-plugin-inspect": "^12.0.2",
  "vitest": "^4.1.11"
}
```