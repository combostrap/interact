---
title: Shadcn Support
---

You can use [shadcn](https://ui.shadcn.com/) to discover and add components based

## Built-in components

### Base UI / Radix-UI Interactivity Library

Our [own default components](registry.md) are developed on top of [base-ui](interactive-component.md#base-ui-library),
the next generation of Radix-ui.

If you want only Radix-UI, you need to:

* build your own [layouts](layout.md) without any base-ui component (mostly navbar and sidebar)
* or
  * use Radix-Ui components in your project at `@/components/ui`
  * set the `alias.resolution` [configuration](conf.md) to `cascade`.

With `cascade` as resolution, the UI import such as `import {Button} from "@/components/ui/button.js"` will
be resolved first against your project.

### Shadcn Dependencies

The [built-in components](registry.md) uses the following dependencies:

* [base-ui](interactive-component.md#base-ui-library)
* [cmdk](https://github.com/dip/cmdk) for the [command](https://ui.shadcn.com/docs/components/base/command#installation)

