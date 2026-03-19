---
title: How to create a layout?
---

## Steps

### Create a layout component

The layout should return the `html` element wrapping a [page component](../reference/page.md)

Example of minimal implementations:

```tsx
import type {TemplateProps} from "@combostrap/interact/client";
import Head from "@combostrap/interact/components/Head";

export function MyLayout(props: TemplateProps) {
    const PageComponent = layoutProps.page.default;
    const request = layoutProps.request;
    return (
        <html lang="en" dir="ltr">
        <Head {...layoutProps} />
        <body>
        {PageComponent && <PageComponent request={request}/>}
        </body>
        </html>
    )
}
```

### Register it

You can register it by defining it in the [configuration file](../reference/conf.md).

```json
{
  "components": {
    "MyLayout": {
      "importPath": "src/component/MyLayout.js",
      "type": "layout"
    }
  }
}
```

### Use it

You can now use it.

For instance, in a [markdown page](../reference/markdown.md)

```markdown
---
layout: my-layout
---
```