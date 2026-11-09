---
'looseleaf-miniprogram': patch
---

Fix three runtime bugs caught by the new L3 automator console sweep: checkbox observers must use the function form (the `{ handler }` object form throws in the real runtime), navigation-menu content/trigger now call the linked item's `__resolveValue` instead of their own (which does not exist), and sketchpad `replay()` passes a proper id Set to `__renderDoc` instead of an array (which threw `dim.has is not a function`).
