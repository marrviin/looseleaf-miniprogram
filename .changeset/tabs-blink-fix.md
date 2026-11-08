---
'looseleaf-miniprogram': patch
---

修复 tab bar 高亮闪烁:tabs-trigger 在墨迹层已渲染时同步应用缓存图层,跳过 60ms 延迟量测;custom-tab-bar 在路由已镜像时跳过同值 setData。补齐 message-group 组件 demo(此前已实现但无示例页);npm 包内 README 相对链接改写为 GitHub 绝对链接;新增 CONTRIBUTING.md;清理 lint 告警。
