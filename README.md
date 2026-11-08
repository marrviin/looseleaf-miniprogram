# Looseleaf Miniprogram

[English](./README.en.md) | 简体中文

**Looseleaf, drawn by hand — 让微信小程序拥有手绘纸质感的组件库。**

每个组件都由一支"钢笔"在运行时实时绘出:略微歪斜的边框、抖动的下划线、贴纸与胶带——像在便签纸上手写 UI。本项目是 [looseleaf](https://github.com/kevintngo/looseleaf) 的微信小程序移植版,组件统一以 `ll-` 为前缀,原生组件实现、按需引入、开箱即用。

## 组件一览

上游 [looseleaf](https://github.com/kevintngo/looseleaf) 文档站的 104 个组件,**100 个已移植**,4 个因小程序平台限制跳过——逐组件状态见 [docs/components.md](./docs/components.md)。

挑几个招牌的:

**手绘纸品** paper · index-card · polaroid · sticky-note · napkin · ticket · receipt · envelope · notebook · tape · sticker-board

**马克笔标注** highlight · underline · circled · bracket · scribble · stamp · seal · ribbon · lettering

**交互增强** confetti · flip-card · hover-card · signature · dropzone · command · combobox · sidebar

基础与表单(button / card / input / select / table / tabs…)、导航(breadcrumb / pagination / menu…)与浮层(dialog / sheet / toast / dropdown-menu…)同样是全量覆盖。完整的逐组件对照表见 [docs/components.md](./docs/components.md);克隆仓库用微信开发者工具打开 `packages/example` 即可浏览与上游文档站一一对应的全部 demo。

## 特性

- **运行时手绘墨迹** — 笔画按元素真实尺寸逐个绘制,描边 1:1 还原,每个实例都是独一无二的"手迹",支持 seed 指定与 rest / hover / pressed / focus / disabled 完整状态层
- **完整设计体系** — 上游 tokens(纸张、墨水、色板、密度)构建期预计算进 WXSS,纸纹、胶带、装订等质感一应俱全
- **手写字体** — Kevin Sans 随组件库注入,标题与正文都是"手写"的
- **原生小程序实现** — 无 WebView / 无跨端框架,纯 WXML + WXSS + Component,按需引入,体积可控
- **遵循上游 API** — 组件的 variant、props 与上游文档一一对应,迁移心智成本为零

## 小程序适配

上游是 React + Radix 组件库,移植不是"照抄模板",而是按小程序平台特性做的一整套工程适配:

- **墨迹引擎原样移植** — 上游 ~3200 行纯 TS ink 引擎(esbuild 打包为 `common/ink-engine.js`)在小程序运行时执行,按元素实测尺寸逐笔绘制、描边 1:1、保留出界摆动——不做"画一张图再拉伸"的烘焙
- **tokens 构建期求值** — 上游 ~1300 行 CSS 变量里大量 `color-mix()` 派生色在小程序渲染环境不可靠,构建期用 culori 逐个求值为静态色;整套 tokens 只出一份 `common/style/tokens.wxss`,`app.wxss` `@import` 一次即沿节点树继承
- **手写字体子集化** — Kevin Sans 裁剪为拉丁子集、base64 woff2 随包分发,组件首次渲染时经 `wx.loadFontFace` 全局注册一次;上游字体面自带的 `size-adjust: 88%` 在 `wx.loadFontFace` 上无法表达,全库字号按 ×0.88 重新换算,间距按 px → rpx 直转
- **交互状态重造** — 小程序没有 mouse / focus 事件,上游的 `data-hover` / `data-pressed` / `data-focus-visible` 强制态改为受控属性 `hovered` / `pressed` / `focusVisible`,与触摸按下态取 OR,状态层(pre-generated background-image 多值)随之切换
- **弹层体系重写** — Radix 的 portal 弹层(popover / dialog / sheet / dropdown-menu / command / combobox…)全部改为页内绝对定位层,菜单高亮、键盘导航、双向联动的协调逻辑用 Component relations 从零实现
- **对抗原生组件 UA** — 原生 `<button>` 的固定宽度、`margin: auto`、`overflow: hidden` 会依次挤散布局、裁掉墨迹出界笔触,button 型组件做了整套 UA 覆盖;内层原生节点统一 `catchtap` 防事件双触发
- **slot 样式域限制下的家族折叠** — 小程序 slot 内容属页面样式域,组件无法逐帧重绘或全局着色:sonner → `ll-toast`、`label-tag` 并入 `ll-tag`、tally → `ll-stepper-tally`、tear-off Body/Stub 折入本体、typography 的 Prose 跳过
- **平台能力替代** — `scroll-area` 由原生 scroll-view 覆盖、`native-select` 走系统 picker、input 的 file 类型接 `wx.chooseMedia`、date 类型接系统日期选择器、无 ResizeObserver 的 `pointAt` 改为挂载时单次量测
- **移动端细节** — drawer / sheet / dialog 底部 safe-area 适配,≤500px 视口下的箭头收拢、横向滚动钳制,118 个 demo 页逐页过 overflow
- **体积工程** — 主包 2MB 红线:tokens 不内联进组件、示例按上游文档分类拆 5 个分包、跨分包 require 的模块拷贝修补、建议开启 `ignoreUploadUnusedFiles` 上传裁剪

完整逐条说明(含每项的踩坑背景)见 [docs/components.md](./docs/components.md) 的「小程序适配」一节。

## 安装

```bash
npm install looseleaf-miniprogram
```

在微信开发者工具中「构建 npm」后按需引入:

```json
{
  "usingComponents": {
    "ll-button": "looseleaf-miniprogram/components/button/button",
    "ll-card": "looseleaf-miniprogram/components/card/card"
  }
}
```

```xml
<ll-card>
  <ll-card-header>
    <ll-card-title>Field Notes</ll-card-title>
    <ll-card-description>Jotted down by hand</ll-card-description>
  </ll-card-header>
  <ll-card-content>
    <ll-button variant="outline">Open</ll-button>
  </ll-card-content>
</ll-card>
```

> **首次接入需在 `app.wxss` 引入一次设计 tokens**(组件不自带,避免每个组件重复烘焙撑爆 2MB 主包):
>
> ```css
> @import 'miniprogram_npm/looseleaf-miniprogram/common/style/tokens.wxss';
> ```
>
> tokens 定义在 `page` 上,会以 CSS 自定义属性继承进所有组件。另建议在 `project.config.json` 开启 `"ignoreUploadUnusedFiles": true`,上传时按依赖图自动裁掉没用到的组件。

> 手写字体为可选增强:组件内部会在首次渲染时自动调用内置的 `ensureHandFont()` 注册 Kevin Sans(全局一次,无需手动接入;加载失败时回退系统字体,组件依旧可用,只是少了手写味)。

## 预览

```bash
git clone https://github.com/marrviin/looseleaf-miniprogram.git
cd looseleaf-miniprogram
pnpm install && npm run build
cp packages/example/project.config.example.json packages/example/project.config.json
```

用微信开发者工具打开 `packages/example`,即可浏览全部组件的完整 demo(与上游文档站的示例一一对应)。demo 由 `npm run build` 生成:主包只有 index 导航页 + 共享组件,demo 页按上游文档分类拆进 5 个分包(`pkg-forms` / `pkg-feedback` / `pkg-data` / `pkg-paper` / `pkg-interactive`),避免 npm 产物整体落在主包触发 2MB 上传上限(错误码 80051)——无需再手动「构建 npm」。

## 参与

欢迎提 [issue](https://github.com/marrviin/looseleaf-miniprogram/issues) 反馈问题或建议;全部组件的移植状态见 [docs/components.md](./docs/components.md),提交信息遵循 commitlint(conventional commits)。

## 致谢

本项目基于 [looseleaf](https://github.com/kevintngo/looseleaf)(by [@kevintngo](https://github.com/kevintngo),MIT License)改造:设计 tokens、手绘墨迹引擎与组件 API 均源自上游,在此致敬。所有手绘美学的功劳属于上游项目,移植过程中的问题由本仓库负责。

## License

[MIT](./LICENSE)(上游 looseleaf 同样以 MIT 发布)。
