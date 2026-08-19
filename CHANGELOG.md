# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

* Added [Tree component](src/resources/components/interact/Tree.tsx)
* Change [Aside partial](src/resources/components/partials/Aside.tsx) to show the tree component
* Aside is now a [OffCanvas](src/resources/components/interact/OffCanvas.tsx) in Holy
* Markdown processing is now async as not all plugins supports sync processing (
  Example: [rehype-citation](https://github.com/timlrx/rehype-citation))
* Support for standalone execution (ie without a `package.json` file)
* Added pagefind support
* Added HTML cache while browsing to support pagefind indexing

## [0.1.1] - 2026-06-18

* First version
