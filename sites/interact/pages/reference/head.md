---
title: How to add a Head element
description: How to add a Head element in Interact
---

A `head element` is a HTML element that is rendered in
the [HTML Head node](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/head).

## How to add a Head element

### By creating a Head React Component

You can create a specialized component called a [head component](head-component.md)
that are rendered into the `head` html element.

### Hoisting

We support also head elements hoisting.

If your [page](page.md) returns elements with type (`meta`,`script`, `link`, `style`),
they are moved into the `head` html element.

