# looseleaf-miniprogram

[Looseleaf](https://github.com/kevintngo/looseleaf)(shadcn/ui, drawn by hand)的微信小程序复刻。
手绘纸质风格组件库 + 演示小程序。完整方案见 [PLAN.md](./PLAN.md)。

## 结构

| 目录 | 说明 |
|---|---|
| `packages/ui` | 组件库 `@looseleaf/ui`,源码在 `src/`,发布产物在 `dist/` |
| `packages/example` | 演示小程序,页面由构建脚本从组件 `_example/` 生成 |
| `script/` | 构建 / 脚手架 / ink 与 tokens 烘焙 |
| `.templates/` | `npm run gen <name>` 新组件脚手架 |

## 常用命令

```bash
pnpm install          # 安装依赖(同时启用 husky)
npm run gen card      # 生成新组件骨架
npm run build         # 构建 dist + 重新生成 example 页面
npm run bake:tokens   # (M1)从上游 looseleaf.css 烘焙 tokens.wxss
npm run bake:ink      # (M1)烘焙上游 ink recipes 为 WXSS 笔画
```

## 开发流程

1. `npm run gen <name>` 生成组件骨架;
2. 对着上游 looseleaf 同名组件实现(逻辑、API、`_example` demo);
3. `npm run build`,用微信开发者工具打开 `packages/example`(需先"构建 npm")查看;
4. 验收标准:逐 variant 对照上游文档站。

## 组件状态

- [x] button(骨架 + fallback 样式,ink 待 M1)
- [ ] P0 其余 15 个(见 PLAN.md §5)
