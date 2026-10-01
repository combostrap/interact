---
title: Deep Merge Utility
---


We export a utility function called `deep-merge` as `@combostrap/interact/deep-merge`.

It will traverse the whole tree of objects recursively, meaning
it will also traverse and merge the children objects.

In case of conflict, the high priority object wins.

```javascript
import deepMerge from "@combostrap/interact/deep-merge";

let result = deepMerge(lowPriorityObject, highPriorityObject)
```

## Why not the deep-merge library ?

[deep-merge](https://www.npmjs.com/package/deepmerge) does not perform a real deep merge
by default. In the case of the conflit of two objects, they are not recursively merged.
The source/high priority objects wins.
