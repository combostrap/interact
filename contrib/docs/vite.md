## Plugin

interact config is not a props of plugin so that if the config change,
we can restart the dev server and each plugin get the new global value

## Update

* Check that the Vite Rsc integration test are green at: https://github.com/vitejs/vite-ecosystem-ci/
* Get the version of https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-rsc/package.json
```json
{
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-server-dom-webpack": "^19.2.6"
}
```
* Get the version of https://github.com/vitejs/vite-plugin-react/blob/5e6212750105d8e3628f6639bf47ef7bb97c80d6/packages/plugin-react/package.json
```json
{
  "@vitejs/plugin-react": "workspace:*"
}
```
* Grab the peer dependencies at https://github.com/vitejs/vite-plugin-react/blob/main/package.json

```json
{
  "vite": "*",
  "vite-plugin-inspect": "^11.3.3"
}
```