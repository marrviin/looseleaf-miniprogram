# 测试架构

四层金字塔（与 PR 描述里的方案一致）:

| 层 | 内容 | 位置 | 触发 |
|---|---|---|---|
| L0 | 构建/发布门禁 | `script/check-gates.mjs` | 每次 PR（ci.yml） |
| L1 | 纯逻辑单测 | `packages/ui/tests/unit/` | 每次 PR |
| L2 | 组件模拟测试 | `packages/ui/tests/simulate/` | 每次 PR |
| L3 | DevTools 自动化巡检 | `script/automator-smoke.mjs` | nightly / 发版前（本机） |
| L4 | 视觉回归（截图比对） | `script/visual-diff.mjs` | nightly / 发版前（本机） |

## 运行

```bash
npm run test              # L1 + L2（jest, packages/ui workspaces）
npm run test:gates        # L0
npm run test:automator    # L3 — 需本机 WeChat DevTools + 先 npm run build
npm run test:visual       # L4 — 对比 L3 截图与 baseline
```

## L1 — 单测（tests/unit/）

- `common.test.js` — rng 确定性（种子→手绘抖动的根基）、validator、ink 的
  hashSeed/resolvePaint、tokens 表与 tokens.wxss 同步守卫
- `props.test.js` — 参数化审计全部 269 个组件的 props.js（类型合法、字段成形）

## L2 — 模拟测试（tests/simulate/）

- `smoke.test.js` — 全量 368 个组件默认 props attach 不崩溃（参数化）
- `<component>.test.js` — Tier A 交互组件逐个行为用例（事件重发、状态机、
  group/relation 同步、props→class）

### harness 关键点

- **miniprogram-simulate 打了补丁**（根 package.json `patchedDependencies`）:
  jest 不吃 `delete require.cache`，同一组件路径二次注册时模块不会重新执行
  `Component()` → "component ll-x not found"。补丁加进程内 path→id 注册表，
  同路径只注册一次并全局复用（顺带让 relations 跨 load 解析）。
- `compiler: 'simulate'`（纯 JS 解析器）——官方 wcc 编译器会把 rootPath 下
  全部 368 个 wxml 一次性喂给原生进程，1MB spawn buffer 溢出（ENOBUFS）。
- `helpers/mount.cjs` 递归解析 usingComponents 三种引用形式（相对/根绝对/
  `looseleaf-miniprogram/` 包名自引用），依赖先加载后以 id 覆盖传入。
- `setup.cjs` stub 了 `wx.*`（createSelectorQuery 返回 300×48，ink 管线在
  stub 上正常走完）；ink 的视觉产物不测，只测 data/class/event。
- 模拟不了的（归 L3/L4）: 原生 disabled 按钮的 DOM 语义、virtualHost 的
  真实布局、rpx 换算、@media 断点、safe-area、canvas（reveal/typewriter
  在 smoke SKIP 里，各有原因）。

## L3 — automator 巡检（本机）

遍历 example app 全部页面（demo + 压力页），收集 console error，逐页截图：

```bash
npm run build && npm run test:automator -- --device iphone15pro
npm run test:automator -- --stress-only          # 只跑压力 fixture 页
```

## L4 — 视觉回归

```bash
npm run test:visual -- --device iphone15pro           # 对比 baseline
npm run test:visual -- --device iphone15pro --update  # 有意变更后重录
```

- 设备矩阵：baseline 按设备分目录（iphone15pro 起步；断点 640/768 需要
  iPad 档，safe-area 需要刘海屏档）
- 压力页（`<comp>-stress`）由 `build.mjs` 生成：超长无空格串 / emoji /
  widest digits / 空内容 × 两档宽度，喂长文本适配类回归
- baseline 与 DevTools 版本绑定——升级 DevTools 后统一 `--update` 重录
