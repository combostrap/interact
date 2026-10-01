---
title: Public directory
---

`public` is a [directory](directory-layout.md) that contains files that are made available publicly without any
processing.

Example:

* A PDF located in `public/static/book.pdf`
* would be publicly available at `https://yourdomain.tld/static/book.pdf`

## Files Type Example

It's use for files:

* referenced in HTML metadata (`<link rel="icon" href="/favicon.ico">`)
* whose paths must stay stable (e.g., referenced from a CMS, email template, or external service)
* you don't want to be transformed
* files that you want to share/distribute

Example:

* Shareable Files:
  * PDF,
  * Word document
* HTML Metadata Files
  * [robots.txt](robots.md#robotstxt),
  * `sitemap.xml`,
  * [manifest.json and favicon.ico](favicons.md)

## How to reference a public resource in pages?

A PDF located in `public/static/book.pdf` would be referenced in a [page](page.md) as :

* `HTML` syntax for [Programmatic Pages (Jsx, Tsx)](page-module.md)

```markdown
<a href="/static/book.pdf" download>Book</a>
```

* `Markdown` syntax for [Markdown pages](markdown.md).

```markdown
[Book](/public/static/book.pdf)
```

## Configuration

You can set the path of the public directory in the [paths configuration](directory-layout.md).
