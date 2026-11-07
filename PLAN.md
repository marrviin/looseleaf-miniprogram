# Looseleaf Miniprogram — 方案设计

> 复刻 [looseleaf](https://github.com/kevintngo/looseleaf)(shadcn/ui 手绘版)为微信小程序组件库。
> 上游核心:设计 tokens + Kevin Sans 字体 + 纯 TS 的 "ink engine"(手绘笔画生成)+ React 组件层。

## 1. 上游拆解

| 层 | 内容 | 小程序可移植性 |
|---|---|---|
| Tokens | `src/styles/looseleaf.css` ~1279 行 CSS 变量,大量 `color-mix()` 派生色 | CSS 变量可用;`color-mix()` 需构建期预计算 |
| Ink 引擎 | `src/lib/ink` ~3200 行纯 TS(rng/pen/shapes/fills/geom)+ `recipes/` 每组件一份画法,**零 React 依赖** | 可直接在 Node 复用 |
| React 组件层 | cva variants + `useInk` inline SVG 覆盖层;交互依赖 Radix | 全部手写为小程序组件 |

**核心前提**:ink SVG 使用 `preserveAspectRatio="none"` + viewBox,笔画随元素尺寸拉伸 →
烘焙成一张图后用 `background-size: 100% 100%` 拉伸即可还原视觉。上游 typography-tiles
本身就是 data-URI SVG 进 CSS,方向已被验证。

字体:Kevin Sans(Regular/Bold,各 ~46KB)为 MIT 许可,可直接使用。

## 2. 核心决策:ink 渲染通道

| 方案 | 做法 | 评价 |
|---|---|---|
| **A. 烘焙 base64 SVG → WXSS**(推荐) | Node 脚本复用 ink engine,按 variant×seed 池生成 SVG → base64 进组件 wxss `background-image` | 矢量零膨胀、实现简单;Skyline 不保证支持 |
| B. 烘焙 PNG | 同上,经 resvg 出 @3x PNG | 全渲染器兼容,体积大、需 sprite |
| C. 运行时 Canvas 2d | 组件内嵌 canvas 现场画 | 灵活但复杂、性能风险 |

- **M0 spike 定案**:真机/devtools 验证 A 在 WebView 下的效果;Skyline 作为已知限制或 A/B 双输出。
- **seed 机制**:上游每实例随机;小程序烘焙固定 seed 池(每 variant 3~5 个),组件接 `seed` prop 取模选用。
- **状态层**:recipes 输出 `rest/hover/pressed/focus/disabled` 多层,全部烘焙保留,按压态切 background。

## 3. Tokens 与字体

- `script/bake-tokens.mjs`:解析上游 `:root` 变量,`color-mix()` 用 culori 构建期求值为静态 hex → `packages/ui/src/common/style/tokens.wxss`。密度变体(calm/compact)映射为页面 class 变量覆盖。
- 字体:`wx.loadFontFace` 加载 woff2(`global: true`),组件库不强制加载,demo 提供snippet。

## 4. 工程结构(参考 TDesign / Vant Weapp 最佳实践)

```
looseleaf-miniprogram/
├─ package.json                     # workspace 根:scripts + husky/commitlint
├─ pnpm-workspace.yaml
├─ .templates/                      # 新组件脚手架(npm run gen <name>)
├─ script/
│  ├─ bake-ink.mjs                  # 复用 looseleaf ink engine 烘焙笔画
│  ├─ bake-tokens.mjs               # color-mix 预计算 → tokens.wxss
│  ├─ gen-component.mjs             # 从 .templates 生成组件骨架
│  ├─ build.mjs                     # src → dist + 公共样式内联注入
│  └─ screenshot-regress.mjs        # automator 截图回归
├─ packages/
│  ├─ ui/                           # 组件库本体
│  │  ├─ src/
│  │  │  ├─ common/
│  │  │  │  ├─ component.js         # Component() 工厂:统一 externalClasses、
│  │  │  │  │                       #   styleIsolation、ink behavior 注入
│  │  │  │  ├─ ink.js               # 烘焙产物运行时查询(seed 取模、状态层)
│  │  │  │  ├─ relation.js          # group 类组件父子关联
│  │  │  │  ├─ validator.js
│  │  │  │  ├─ version.js
│  │  │  │  └─ style/
│  │  │  │     ├─ tokens.wxss       # 构建产物
│  │  │  │     └─ ink/*.wxss        # 构建产物
│  │  │  ├─ components/<name>/
│  │  │  │  ├─ <name>.{js,json,wxml,wxss}
│  │  │  │  ├─ props.js             # properties 定义 + 校验
│  │  │  │  ├─ type.js              # variant/size 枚举
│  │  │  │  ├─ _example/            # 组件内 demo,example 应用引用
│  │  │  │  └─ README.md            # API 文档
│  │  │  └─ index.js
│  │  └─ dist/                      # 构建产物(pnpm publish 指向)
│  └─ example/                      # 演示小程序,页面由脚本从 _example 生成
└─ .github/workflows/ci.yml
```

关键实践:
1. **`common/component.js` 工厂**(TDesign 核心模式):统一注入 ink behavior、`externalClasses`、`styleIsolation`。ink 运行时逻辑只存在这一份。
2. **props 与实现分离**:`props.js` 纯数据定义,便于文档生成与单测。
3. **`_example/` 随组件走**:build 脚本扫描生成 `example/pages/<comp>/`,新组件零配置出 demo。
4. **单产物**:无 less/TS 编译需求,发布 CJS `dist/`。
5. **公共 wxss 内联注入**:构建时把该组件用到的 token/ink 样式内联进组件 wxss 头部,不依赖消费方引全局样式。
6. **commit 规范**:husky + commitlint + changesets。

## 5. 组件清单(四批)

- **P0 基础(16)**:button、badge、card、tag/便利贴、divider、avatar、icon、checkbox、radio、switch、input、textarea、slider、progress、stepper、rating
- **P1 浮层/反馈**:dialog、action-sheet、toast、popover/dropdown(SelectorQuery 定位 + `root-portal`,碰撞翻转参考 Radix)、tooltip、empty、loading
- **P2 导航**:tabs、segmented、cell/list、accordion、pagination、navbar
- **P3 手绘特色**:polaroid、index-card、tape、marker 高亮、mascot、doodles 贴纸(纯静态 SVG,烘焙成本最低)

## 6. 验证与发布

- `miniprogram-automator` 驱动 example 做 e2e + 截图回归,基准取上游文档站。
- npm 发包,消费方走微信"构建 npm";`miniprogram-ci` 做 packNpm 校验。
- 每组件验收标准:对着上游 demo 逐 variant 比对。
- 上游同步:ink 引擎/recipes 程序化复用;React 组件层手写对照。

## 7. 里程碑

1. **M0 Spike(1~2 天)**:① background-image SVG 真机 WebView 渲染 button ink;② tokens 预计算;③ loadFontFace。
2. **M1 管线**:bake-ink + bake-tokens 跑通,ll-button + ll-card 全链路落地。
3. **M2**:P0 组件 16 个。
4. **M3**:P1 浮层类(自研定位,工作量最大)。
5. **M4**:P2/P3 + example 文档 + 发 v0.1.0。

## 8. 风险

- Skyline 不支持 SVG 背景 → PNG 兜底(方案 B)或声明仅 WebView。
- 长列表页多墨迹层渲染压力 → 按需内联、控制 seed 池大小。
- 窄高元素笔画拉伸失真 → 与上游一致,属预期行为。
- 包体积 → 烘焙素材按组件拆分、按需引用。

## 9. 命名

- npm 包名:`looseleaf-miniprogram`(用户决定 2026-11-07:改用非 scoped 名,替换原计划的 @looseleaf/ui)
- 组件前缀:`ll-`(如 `ll-button`)
