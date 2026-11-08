# 参与贡献 · Contributing

[English](#english) | 简体中文

## 简体中文

感谢关注 Looseleaf Miniprogram!欢迎以任何形式参与:反馈 bug、提组件建议、补文档、修代码。

### 环境

```bash
pnpm install
npm run build        # 构建 packages/ui/dist 并生成示例小程序
```

用微信开发者工具打开 `packages/example`(首次需 `cp packages/example/project.config.example.json packages/example/project.config.json` 并填入自己的 appid)。**无需「构建 npm」**——示例由 `npm run build` 直接分包 staging。

### 仓库结构

- `packages/ui/src/components/<name>/` — 组件源码(`.js/.json/.wxml/.wxss` + `props.js`),家族组件按上游命名一一对应
- `packages/ui/src/components/<name>/_example/` — 该组件的 demo 页源码
- `packages/example/` — **全部由 `npm run build` 生成,请勿直接编辑**(下次构建会被静默覆盖);demo 请改对应组件的 `_example/`
- `script/` — 构建、tokens 烘焙、npm 包校验等工具链
- `docs/components.md` — 逐组件移植状态表(123 个上游组件 / 119 已移植 / 4 个平台限制跳过)

### 改动原则

- **遵循上游 API**:本仓库是 [looseleaf](https://github.com/kevintngo/looseleaf) 的移植版,组件的 props、variant、默认值与上游文档一一对应;有意偏离时(如平台限制导致的折叠)需在代码注释与 `docs/components.md` 的说明列注明
- 墨迹绘制请复用 `src/common/ink-engine.js` 的既有能力,不要引入截图烘焙式实现
- 主包体积有 2MB 红线,新组件注意 tokens 不内联、共享逻辑进 `common/`
- 提交信息遵循 commitlint(conventional commits);CI 会跑 `lint` + `build` + npm 包校验
- 新增/修改组件请同步更新 `docs/components.md`(中英两份)与 demo

### 提交流程

1. Fork / 拉分支
2. 改动 + `npm run build` + `pnpm lint` 自测通过
3. 提 PR,关联对应 issue;组件类改动请附开发者工具实机截图

## English

Thanks for your interest in Looseleaf Miniprogram! Bug reports, component requests, docs and code are all welcome.

- **Setup**: `pnpm install && npm run build`, then open `packages/example` in WeChat DevTools (copy `project.config.example.json` first). No "Build npm" step — the example is staged directly by the build script.
- **Layout**: component sources live in `packages/ui/src/components/<name>/` with demos in their `_example/` dirs; `packages/example/` is fully generated — never edit it directly.
- **Principles**: APIs mirror the upstream [looseleaf](https://github.com/kevintngo/looseleaf) docs one to one; deliberate deviations (platform limits, folded families) must be noted in code comments and `docs/components.md`. Keep ink rendering on the bundled engine, mind the 2MB main-package cap, run `pnpm lint` and `npm run build` before submitting.
- **Commits**: conventional commits (commitlint enforced); CI runs lint, build and the npm-package check.
- **Porting status**: see [docs/components.md](./docs/components.md).
