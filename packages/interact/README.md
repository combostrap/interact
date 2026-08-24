# Interact

The framework to create content application.

## Features

* Full React: A page is a React component
* Fully Composable: Bring or overwrite your own components (from layouts to content)
* Server first: Built on top of React Server Component
* Island ready: Thanks to RSC client directive
* Img processing included
* Svg optimization included
* Declarative: Support frontmatter in Markdown but also in programmatic page (jsx, tsx)
* Full Markdown support:
  * Mdx: Markdown with Jsx
  * Mdc: Markdown with Component
  * Md: Markdown with HTML
* Middleware and CMS support to bring remote pages
* Deploy everywhere:
  * on the edge everywhere with Server Rendering
  * or statically with Static Server Rendering

## The plus

* First class Layout.
  * Every page gets a layout or `none`
  * Every layout component is an overwritable React component
* First support IDE: Don't use an internet path in your link, use the path to your file
* No router, only layout:
  * Your page path is your URL path
  * Your content drives the layout and not your URL path

## Installation

```bash
# globally
npm install -g @combostrap/interact
# in a project
npm install @combostrap/interact
```

Then

```bash
interact start
```
