---
title: Debug
---

## Log

To get verbose log and [enable output of debug](https://github.com/debug-js/debug), you need to call the [cli](cli.md)
with the `DEBUG=interact:*` environment

Example

```bash
DEBUG=interact:* interact
DEBUG=interact:image* interact
# or for the vite build 
DEBUG=vite:*
```

## IDE Debugger

If your IDE cannot start cleanly a debug session or does not stop at breakpoint, here a clean method

* Start interact from the terminal with the `--inspect` or `--inspect-brk` node options

```bash
NODE_OPTIONS=--inspect interact start
```

* The debug process listener will print the listening address. Example:

```bash
Debugger listening on ws://127.0.0.1:9229/60d0f660-3811-4b87-ab68-7e1ee95e373f
For help, see: https://nodejs.org/en/docs/inspector
```

* Attach to it with your IDE to create a debug session. In Idea JetBrains, [follows this procedure](https://www.jetbrains.com/help/idea/running-and-debugging-node-js.html#ws_node_debug_remote_chrome)

* No breakpoints should hit as the source map is likely missing, use the `debugger` word in your script and reload your
  page.

```javascript
debugger
```
