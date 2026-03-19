---
title: FrontMatter
---

`frontmatter` are [metadata](#list-of-metadata) that are used by [layout and partial component](component.md)
to create the final HTML document.

## Example

### Markdown Page (md, mdx)

In a [markdown Page](markdown.md)

```markdown
---
title: My title
layout: holy
---
```

### Programmatic Page (tsx, jsx)

In a [programmatic page](page-module.md)

```ts
export const frontmatter = {
    title: "My page title",
    layout: "holy"
}
```

## List of metadata

* `name`: The page name
* `title`: The page title
* `description`: The page description
* `layout`: The [layout](layout.md) applied (default to `holy`)
