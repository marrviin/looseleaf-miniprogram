# looseleaf-miniprogram

## 0.1.2

### Patch Changes

- 6f68a77: Fix three runtime bugs caught by the new L3 automator console sweep: checkbox observers must use the function form (the `{ handler }` object form throws in the real runtime), navigation-menu content/trigger now call the linked item's `__resolveValue` instead of their own (which does not exist), and sketchpad `replay()` passes a proper id Set to `__renderDoc` instead of an array (which threw `dim.has is not a function`).

## 0.1.1

### Patch Changes

- 9791005: 修复 tab bar 高亮闪烁:tabs-trigger 在墨迹层已渲染时同步应用缓存图层,跳过 60ms 延迟量测;custom-tab-bar 在路由已镜像时跳过同值 setData。补齐 message-group 组件 demo(此前已实现但无示例页);npm 包内 README 相对链接改写为 GitHub 绝对链接;新增 CONTRIBUTING.md;清理 lint 告警。

## 0.1.0

### Minor Changes

- 4f90316: 首次发布:120+ 个手绘风小程序组件(button、card、dialog、form、chart 等),含设计 tokens、手写字体加载与内置手绘墨迹引擎。
