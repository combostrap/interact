---
title: How to create a head component?
---

This page shows you how to create your own [head component](../reference/head-component.md)
so that you can set any metadata on your pages.

## Steps

### Create a head component

A head is a component that:

* accept a layoutProps
* and return a Head child component

Example of minimal implementation:

```tsx
export default function MetaRobots({page}: LayoutProps) {
    let robots = page?.frontmatter?.robots;
    return (
        <meta name="robots" content={robots ? robots : "index, follow"}/>
    )
}
```

### Register it

Interact expects all head files to be stored in the [heads directory](../reference/directory-layout.md) (
default to `src/components/heads`)
as `jsx` or `tsx` files

* Save your head component at: `src/components/heads/MetaRobots.tsx`
* Restart Interact and you should see your `Head` component in the HTML page

## Verify that your head component was successfully registered

You can see the registered component with the [interact config command](../reference/conf.md#cli)
```bash
interact config -f components # list all components
interact config -f components.MetaRobots # list only your component
```