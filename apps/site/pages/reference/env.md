# Environment

Next to the [configuration file](conf.md), you can use environment variable
to configure your application.

## Env value injection with import.meta.env

You can use the [import.meta.env](https://vite.dev/guide/env-and-mode#env-variables)
with the `INTERACT_` prefix to inject env in your code.

```javascript
let apiHost = import.meta.env.INTERACT_API_HOST
if (apiHost == null || apiHost == '') {
    throw new Error("The INTERACT_API_HOST env is not defined.")
}
```

## Mode Detection

[Env mode detection](https://vite.dev/guide/env-and-mode#node-env-and-modes)

```javascript
if (import.meta.env.MODE == "production") {

}
```