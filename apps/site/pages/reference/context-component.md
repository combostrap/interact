---
title: Context components
description: A context component is a component that wraps the Browser React Application
---

A `context` is server or client component that wraps the Interact server or client Application.

The following React component may be defined as `context` component:

* [Context Provider](https://react.dev/learn/passing-data-deeply-with-context) (ie tracker, url state manager, ...)
* [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## Example

### Default Client Error Boundary

This is the minimal `InteractContext` component used by [default](#default)

```tsx
export default function InteractContext({children}: { children: ReactNode }) {

    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    )

}
```

### Example Client Tracker

With the [Posthog tracker](https://posthog.com/docs/error-tracking/installation/react), you would create the following
file `PostHogContext.tsx` in the [contexts directory](directory-layout.md#configuration) - default to
`src/components/contexts`

```tsx
import {PostHogProvider} from '@posthog/react'

// noinspection JSUnusedGlobalSymbols
export default function PostHogContext({children}: { children: ReactNode }) {
    return (
        <PostHogProvider apiKey={"xxx"}>
            {children}
        </PostHogProvider>
    )
}
```


## Default

The default one can be seen in
the [main/src/resources/components/contexts directory](https://github.com/combostrap/interact/tree/main/src/resources/components/contexts)

We provide a standard `InteractContext` with an error boundary that you may override.
For instance, you would override it by creating your own `InteractContext` component at
`@/components/contexts/InteractContext.tsx`

## Syntax

They:

* are considered a [client component unless their name include server](#server-vs-client-context)
* accepts no props (but you can [inject env](env.md#env-value-injection-with-importmetaenv))
* should export the component as default


## Server vs Client Context

A context component can only be found:

* in the browser
* or in the server

They are considered a [client component](rsc.md#client-component) unless their name include `server`

## How to list all context components

`context components` are registered components. You can see them by running the [interact config command](conf.md#cli)

```bash
interact config -f components
# to select only the head component with yq
interact config -f components | yq 'to_entries | map(select(.value.type == "context")) | from_entries'
```

Example output:

```yaml
InteractContext:
  importPath: "@combostrap/interact/components/contexts/InteractContext"
  type: context
```

## Registration / Default Directory



To register a context component automatically, you can save it in the [contexts directory](../reference/directory-layout.md)
(By default, `src/components/contexts`)

You can also register it manually by:

* adding it in the `components` section of the [configuration file](../reference/conf.md)
* and setting the [type](../reference/component.md#type) to `context`

```json
{
  "components": {
    "myContext": {
      "importPath": "src/components/MyContext.tsx",
      "type": "context"
    }
  }
}
```
