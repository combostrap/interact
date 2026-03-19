---
title: How to create a module page (Jsx, Tsx, Mdx)?
---

A `module page` is a [page](page.md) created from a `Jsx`, `Tsx`, `Mdx` file.

## Syntax

* `Jsx`, `Tsx` pages are called `programmatic page`
* while `mdx` is a mix of programmatic and [declarative Markdown](markdown.md) syntax


## Example

### Jsx

With a [frontmatter](frontmatter.md) that set the [layout](layout.md) to `landing`
```jsx
// pages/my-page.jsx
export const frontmatter = {
    layout: "landing"
}

export default function MyPage() {
    return (
        <p>You can create a `jsx` page</p>
    )
}
```

### Typescript tsx

With a [frontmatter](frontmatter.md) that set the page title to `My page`
```tsx
// pages/my-page.tsx
import type {InteractFrontmatter} from "@combostrap/interact/client";

export const frontmatter: InteractFrontmatter = {
    title: "My Page",
    layout: "landing"
}

export default function MyPage() {
    return (
        <p>You can create a `tsx` page</p>
    )
}
```

## Properties

They:

* allows `import` and `export`
* allows a [frontmatter](frontmatter.md)
* are added to the final bundle
