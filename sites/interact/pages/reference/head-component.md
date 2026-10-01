---
title: Head component
description: A head component is a component that is rendered in the HTML HEAD.
---

A `head` is a [component](component.md) that is rendered in the [HTML Head node](head.md).

## How to create a Head component

See [How to create a head component](../howto/add-a-head.md)

## Default

The default one can be seen in
the [main/src/resources/components/heads directory](https://github.com/combostrap/interact/tree/main/src/resources/components/heads)

If you want to override the default ones, you should create a head with the same name and store it at:
`@/components/heads`.

## Syntax

They:

* are and should be [server component](rsc.md)
* accepts the layout props (page and context)
* should export the function component as default

### Not a Client Component Restriction

Head component cannot be [client component](../reference/rsc.md#client-component)
otherwise you get the [fatal rsc error](../reference/rsc.md#only-plain-objects-error)

## How to list all head components

`head component` are registered components. You can see them by running the [interact config command](conf.md#cli)

```bash
interact config -f components
# to select only the head component with yq
interact config -f components | yq 'to_entries | map(select(.value.type == "head")) | from_entries'
```
