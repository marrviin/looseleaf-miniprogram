# Looseleaf Miniprogram

[English](./README.en.md) | 简体中文

**Looseleaf, drawn by hand — 让微信小程序拥有手绘纸质感的组件库。**

每个组件都由一支"钢笔"在运行时实时绘出:略微歪斜的边框、抖动的下划线、贴纸与胶带——像在便签纸上手写 UI。本项目是 [looseleaf](https://github.com/kevintngo/looseleaf) 的微信小程序移植版,组件统一以 `ll-` 为前缀,原生组件实现、按需引入、开箱即用。

## 组件一览

**基础** button · badge · card · tag · separator · rule · icon · paper

**表单** checkbox · radio-group · switch · input · textarea · slider · stepper · rating · progress

**展示** avatar(含 badge / fallback / group 家族) · spinner

**浮层** dialog · sheet · toast · popover

P1 其余浮层与导航、手绘特色组件(polaroid、index-card、tape、marker 等)正在按 [PLAN.md](./PLAN.md) 的批次推进。

## 特性

- **运行时手绘墨迹** — 笔画按元素真实尺寸逐个绘制,描边 1:1 还原,每个实例都是独一无二的"手迹",支持 seed 指定与 rest / hover / pressed / focus / disabled 完整状态层
- **完整设计体系** — 上游 tokens(纸张、墨水、色板、密度)构建期预计算进 WXSS,纸纹、胶带、装订等质感一应俱全
- **手写字体** — Kevin Sans 随组件库注入,标题与正文都是"手写"的
- **原生小程序实现** — 无 WebView / 无跨端框架,纯 WXML + WXSS + Component,按需引入,体积可控
- **遵循上游 API** — 组件的 variant、props 与上游文档一一对应,迁移心智成本为零

## 安装

```bash
npm install looseleaf-miniprogram
```

在微信开发者工具中「构建 npm」后按需引入:

```json
{
  "usingComponents": {
    "ll-button": "looseleaf-miniprogram/button/button",
    "ll-card": "looseleaf-miniprogram/card/card"
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

> 手写字体为可选增强,按需调用组件库提供的 `ensureHandFont()` 即可全局加载。

## 预览

```bash
git clone https://github.com/marrviin/looseleaf-miniprogram.git
cd looseleaf-miniprogram
pnpm install && npm run build
cp packages/example/project.config.example.json packages/example/project.config.json
```

用微信开发者工具打开 `packages/example`,先执行一次「构建 npm」,即可浏览全部组件的完整 demo(与上游文档站的示例一一对应)。

## 参与

欢迎提 [issue](https://github.com/marrviin/looseleaf-miniprogram/issues) 反馈问题或建议;组件移植规范与踩坑记录见 [docs/component-guide.md](./docs/component-guide.md),提交信息遵循 commitlint(conventional commits)。

## 致谢

本项目基于 [looseleaf](https://github.com/kevintngo/looseleaf)(by [@kevintngo](https://github.com/kevintngo),MIT License)改造:设计 tokens、手绘墨迹引擎与组件 API 均源自上游,在此致敬。所有手绘美学的功劳属于上游项目,移植过程中的问题由本仓库负责。

## License

MIT(上游 looseleaf 同样以 MIT 发布)。
