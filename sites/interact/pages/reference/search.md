---
title: Search Engine / Search Bot
---

The search engine is responsible for:

* content indexation
* content query

## Options/Guideline

### Which content is indexed

The search bot will index:

* the content of the `main` HTML element.
* and if not found, it will default to the `html` element.

## How to exclude content

To exclude text from indexation, you need to set the `data-noindex` attribute
on your HTML element.
