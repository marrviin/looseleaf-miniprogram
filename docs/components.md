# 组件总览

[English](./components.en.md) | 简体中文

对照上游 [looseleaf](https://github.com/kevintngo/looseleaf) 的 **123 个组件:119 个已移植,4 个因小程序平台限制跳过**。
组件名即上游名,小程序中以 `ll-` 前缀注册(如 `ll-button`),API 与上游文档一一对应;"说明"列是移植时的实现要点。

> 实际渲染效果请克隆仓库,用微信开发者工具打开 `packages/example` 浏览与上游文档站一一对应的 demo。

## 动作

| 组件 | 状态 | 说明 |
|---|---|---|
| button | ✅ | — |
| button-group | ✅ | (含 separator/text 子组件) |
| stamp-button | ✅ | 含 ll-stamp-surface 承接 impressions |
| toggle | ✅ | — |
| toggle-group | ✅ | — |

## 表单

| 组件 | 状态 | 说明 |
|---|---|---|
| calendar | ✅ | — |
| checkbox | ✅ | — |
| combobox | ✅ | trigger / editable / chips 三种形态 |
| date-picker | ✅ | — |
| dropzone | ✅ | 家族 7 组件：area/description/icon/item/list/rejections/title |
| field | ✅ | 家族 10 组件：field + label / title / description / error / group / set / legend / separator / content |
| form | ✅ | form / item / label / description / message 家族；errors map 对应上游 FormProvider |
| input | ✅ | — |
| input-group | ✅ | 家族 6 目录：group/addon/button/text/input/textarea |
| input-otp | ✅ | — |
| label | ✅ | required 星号为固定 SVG |
| native-select | ✅ | 系统 picker + 画框；分组拍平 |
| radio-group | ✅ | — |
| rating | ✅ | — |
| select | ✅ | 单组件 options 数组 + slip 弹层 |
| signature-pad | ✅ | — |
| slider | ✅ | — |
| stepper | ✅ | (tally 并入 stepper-tally) |
| sticker-picker | ✅ | — |
| switch | ✅ | — |
| textarea | ✅ | — |

## 反馈

| 组件 | 状态 | 说明 |
|---|---|---|
| alert | ✅ | 含 sticky note 变体，alert-title/description 关系 |
| empty | ✅ | (家族 6 组件) |
| progress | ✅ | — |
| skeleton | ✅ | (loading 家族) |
| sonner | ✅ | 以 `ll-toast` 落地 |
| spinner | ✅ | — |

## 浮层

| 组件 | 状态 | 说明 |
|---|---|---|
| alert-dialog | ✅ | 家族，含 alert-dialog-media |
| command | ✅ | 家族 9 组件；cmdk 式 relations 协调 |
| context-menu | ✅ | 在按压点弹出 |
| dialog | ✅ | (家族) |
| drawer | ✅ | 撕纸边 + 抓手胶带 + snap 吸附 |
| dropdown-menu | ✅ | (家族 10 组件 + ll-kbd) |
| hover-card | ✅ | 拍立得质感，含 hover-card-media |
| popover | ✅ | — |
| sheet | ✅ | (家族) |
| tooltip | ✅ | — |

## 导航

| 组件 | 状态 | 说明 |
|---|---|---|
| breadcrumb | ✅ | — |
| menubar | ✅ | 纸条 + 刻度尺画法，含 menubar-menu |
| navigation-menu | ✅ | (家族 7 组件) |
| pagination | ✅ | — |
| sidebar | ✅ | 全宽目录页形态，家族 22 组件 |
| tabs | ✅ | — |

## 布局

| 组件 | 状态 | 说明 |
|---|---|---|
| accordion | ✅ | — |
| aspect-ratio | ✅ | — |
| card | ✅ | — |
| collapsible | ✅ | trigger/content/indicator 家族 + margin-bracket 墨迹 |
| direction | ✅ | RTL/LTR provider，后代组件经 relation 读取方向 |
| resizable | ⏭️ | 无指针拖拽场景 |
| scroll-area | ⏭️ | scroll-view 原生覆盖 |
| separator | ✅ | (含 rule) |

## 数据展示

| 组件 | 状态 | 说明 |
|---|---|---|
| avatar | ✅ | (家族 6 组件) |
| badge | ✅ | — |
| carousel | ✅ | content/item/dots/dot/previous/next 家族；count 在 root ready 量取；vertical 页占满容器高 |
| item | ✅ | (cell/list 家族) |
| table | ✅ | 家族 7 组件：table + body / caption / cell / footer / head / header / row |

## 图表

| 组件 | 状态 | 说明 |
|---|---|---|
| chart | ✅ | — |

## 纸品

| 组件 | 状态 | 说明 |
|---|---|---|
| bookmark | ✅ | — |
| clipboard | ✅ | — |
| desk | ✅ | — |
| envelope | ✅ | — |
| folder | ✅ | — |
| index-card | ✅ | (家族) |
| label-tag | ✅ | (并入 tag 组件) |
| napkin | ✅ | — |
| notebook | ✅ | — |
| page | ✅ | — |
| paper | ✅ | (+ rules) |
| polaroid | ✅ | (家族) |
| receipt | ✅ | 家族 7 组件 |
| sticky-note | ✅ | — |
| tape | ✅ | — |
| ticket | ✅ | — |

## 马克笔标注

| 组件 | 状态 | 说明 |
|---|---|---|
| annotate | ✅ | — |
| arrow | ✅ | pointAt 在挂载时一次量测，不随布局变化重算 |
| asterisk | ✅ | — |
| bracket | ✅ | — |
| callout | ✅ | — |
| circled | ✅ | — |
| highlight | ✅ | — |
| quote | ✅ | quote-text + quote-attribution；引号墨迹按 tone/weight/size/rule |
| ribbon | ✅ | — |
| scribble | ✅ | — |
| signature | ✅ | — |
| squiggle | ✅ | — |
| strike | ✅ | — |
| tally | ✅ | (并入 stepper-tally) |
| underline | ✅ | — |

## 贴纸与涂鸦

| 组件 | 状态 | 说明 |
|---|---|---|
| doodle | ✅ | — |
| mascot | ✅ | — |
| seal | ✅ | — |
| stamp | ✅ | — |
| sticker | ✅ | — |
| sticker-sheet | ✅ | — |

## 聊天

| 组件 | 状态 | 说明 |
|---|---|---|
| attachment | ✅ | 家族 10 组件：content/description/group/media/progress/title/trigger/action(s) |
| bubble | ✅ | (含 group/reactions) |
| code-block | ✅ | 折叠为单组件，语法高亮内置 |
| marker | ✅ | (marker-content/icon/rule) |
| message | ✅ | 家族 avatar/content/footer/header/text；scroller、group 独立成组件 |
| message-scroller | ✅ | viewport/item/button/content 家族 |
| prompt-input | ✅ | 与 attachment 家族联动 |
| typing-indicator | ✅ | (loading 家族) |

## 互动

| 组件 | 状态 | 说明 |
|---|---|---|
| boil | ⏭️ | 每帧重绘的是任意 slot 内容——小程序 slot 属页面样式域，组件无法逐帧重渲染 |
| confetti | ✅ | — |
| corkboard | ✅ | — |
| flip-card | ✅ | — |
| marquee | ✅ | — |
| peel-corner | ⏭️ | 依赖指针拖拽物理（pointer capture + rAF 补间），实现成本高 |
| reveal | ✅ | — |
| sketchpad | ✅ | — |
| sticker-board | ✅ | — |
| tear-off | ✅ | Body/Stub 折入单组件，具名 slot |

## 排版

| 组件 | 状态 | 说明 |
|---|---|---|
| handwritten | ✅ | — |
| kbd | ✅ | — |
| lettering | ✅ | — |
| typography | ✅ | h1–h4 / p / lead / muted / small / large / list / inline-code / blockquote 系列；Prose 未移植（小程序样式隔离无法作用于 slot 内 markdown） |
| typewriter | ✅ | — |

## 图标

| 组件 | 状态 | 说明 |
|---|---|---|
| icon | ✅ | (~160 glyphs) |

## 小程序适配

上游是 React + Radix;移植版在保持视觉与 API 一一对应的前提下,按小程序平台特性做了如下调整:

- **运行时墨迹引擎** — 上游的 ink SVG 由 React 在运行时按元素真实尺寸生成;移植版把同一套 TS 引擎打包为 `common/ink-engine.js` 在小程序运行时执行,按元素实测尺寸逐个绘制、描边 1:1,不做整图拉伸。rest / hover / pressed / focus 状态层预生成后叠在同一元素的 `background-image` 上,交互时切换。
- **tokens 构建期求值** — 上游大量 `color-mix()` 派生色在小程序渲染环境不可靠,构建期用 culori 求值为静态色;整套 tokens 只产出一份 `common/style/tokens.wxss`,使用方在 `app.wxss` `@import` 一次即可沿节点树继承(组件不内联 tokens,避免主包膨胀)。
- **手写字体** — Kevin Sans 打包为 base64 woff2 拉丁子集,组件首次渲染时经 `wx.loadFontFace` 全局注册一次;加载失败回退系统字体。字体不含中文字形,中文文案回退为系统字体。
- **字号与间距换算** — 上游字体面带 `size-adjust: 88%` 而 `wx.loadFontFace` 无法表达,组件字号按上游 px × 0.88 换算为 rpx;间距按上游 px × 2 直转 rpx。
- **交互状态 API** — 小程序原生组件没有 mouse / focus 事件,上游的 `data-hover` / `data-pressed` / `data-focus-visible` 强制态改为受控属性 `hovered` / `pressed` / `focusVisible`,与触摸按下态取 OR 生效。
- **弹层不落 portal** — Radix 的 portal 弹层(popover / dialog / sheet / 各类 menu)改为页内绝对定位弹层,菜单高亮、键盘导航等协调逻辑用 Component relations 实现。
- **slot 属页面样式域** — 小程序 slot 内容的样式与重渲染权在页面侧,组件无法逐帧重绘 slot 内容、也无法对其施加全局样式;依赖这两点的上游组件(boil、typography 的 Prose)相应跳过。
- **原生 `<button>` 重置** — 原生 button 的 UA 样式(固定宽度、`margin: auto`、`overflow: hidden`)会压垮手绘墨迹层,button 型组件做了整套 UA 覆盖;内层原生节点统一 `catchtap` 防止事件双触发。
- **家族折叠** — 上游部分细分家族在小程序端折叠为单组件:sonner → `ll-toast`、`label-tag` 并入 `ll-tag`、tally → `ll-stepper-tally`、tear-off 的 Body/Stub 折入本体、code-block 单组件化(语法高亮内置)。
