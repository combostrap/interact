---
title: Navigation
---

There is no router.

The path in the URL corresponds to:

* a file on the file system
* or a virtual file for a [CMS](cms.md)

## Anchor Component

The [Anchor](../components/anchor.md) component is [base aware](site.md#base).

* You should use it in your [page module (tsx)](page-module.md)
* It's the default [Markdown component](markdown-component.md) for `link`

## Event Listener

You can listen to the `pushstate` event to react to a navigation.

Example:

```javascript
useEffect(() => {
    const handlePathChange = () => setActual(window.location.pathname);
    window.addEventListener('pushstate', handlePathChange);
    return () => {
        window.removeEventListener('pushstate', handlePathChange);
    };
}, []);
```