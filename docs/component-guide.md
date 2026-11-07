# 组件移植指南

button 移植轮次(2026-11)沉淀的经验与规范,后续组件(M2 批次等)照此执行,避免重走弯路。

## 一、架构:运行时 ink 引擎(不要烘焙)

上游 looseleaf 的墨迹是**按元素真实尺寸逐个绘制**的(`bucketBox` 仅 4×2px 取整),描边宽度恒定 1:1 CSS px。任何"画一张大图再拉伸"的静态烘焙都会在非烘焙宽度上把描边压细、圆角压方——button 第一轮就栽在这里。

**正确做法(已落地,直接复用)**:

1. 新组件的 recipe 在 `script/ink-entry.ts` 的 `RECIPES` 里注册一行,然后 `npm run build:ink`(esbuild 打包上游引擎 → `common/ink-engine.js` + `common/tokens.js`)。
2. 组件 js:`data: { llInkRecipe: '<recipe>' }` 并混入 `attachInk()`(common/ink.js)。
3. 组件 wxml:根元素类名必须是 `.ll-<name>`(测量选择器),内部放
   `<view class="ll-ink-layer" style="{{inkStyle}}" />`,label 内容包在
   `<view class="ll-<name>__content">`(relative + z-index 1,墨迹在字后面)。
4. 组件 wxss 的 `.ll-ink-layer`:absolute、pointer-events:none、`background-size: 100% 100%`。`inset: -<pad>px` 由运行时按 recipe 的 pad 注入,保留手绘笔触出界摆动。

**改了 recipe 记得 `npm run build:ink`**;`build.mjs` 只做拼装,不会重烘引擎。

## 二、样式保真清单(逐条对照,缺一不可)

- **颜色映射要看上游源码**,别猜:`text-primary-foreground` 实际解析为 `--ll-ink`(深墨色)而非 paper;destructive 才是 paper。上游 `src/components/ui/<name>.tsx` 的 cva + `src/styles/looseleaf.css` 的 token 定义是唯一事实。
- **字号 ×0.88**:上游 hand 字面带 `size-adjust: 88%`,`wx.loadFontFace` 无法表达。所有组件字号按 `上游 px × 0.88 × 2 = rpx` 换算(default 16px → 28rpx),否则字形大 ~13.6%、内边距显挤。
- **间距 ×2 转 rpx,别减半**:Tailwind `gap-2`=8px=16rpx、`gap-4`=16px=32rpx、`gap-x-10`=40px=80rpx。
- **手写字体**:组件 js 顶部调 `ensureHandFont()`(common/hand-font.js,幂等,全局 loadFontFace,base64 woff2 拉丁子集)。中文无字形回退系统字体——**demo 文案用英文**,否则字体效果完全看不到。
- **原生 `<button>` UA 覆盖四件套**(少一个就翻车):
  - `width: auto !important; min-width: 0 !important; max-width: none !important`(UA 固定 ~184px 且带 !important)
  - `margin: 0 !important`(UA margin:auto 会挤散 flex 兄弟)
  - `overflow: visible`(UA hidden 会把墨迹层出界部分整个裁掉——当年"墨迹消失"的真凶)
  - **具体尺寸档的 `width` 也要 `!important`**,否则被基础 `width: auto !important` 压掉,icon 方钮塌成竖条。
- **交互层叠**(照搬上游 looseleaf.css 的层序):`rest < hover < pressed < focus`,disabled 单独替换全部。实现上用 `background-image` 多值,先写的在上层;pressed 时隐藏 hover;hover 时墨迹 `transform: rotate(var(--ll-hover-tilt))`(-0.9deg)。
- **状态 API**:小程序原生 button 无 focus/mouse 事件,上游的 `data-focus-visible` / `data-hover` / `data-pressed` 强制态做成受控属性 `focusVisible` / `hovered` / `pressed`;触摸按下(touchstart/end/cancel)与 `pressed` 属性取 OR。touchstart 还要 `setData({ inkPressed: true })` 驱动下沉类,**只改 this 实例字段不 setData 不会重渲染**。
- **事件冒泡**:内层原生元素用 `catchtap`,否则原生 tap 冒泡 + `triggerEvent('tap')` 双触发。
- **aria-label** 做成组件属性并透传给内层原生节点(上游要求 icon 按钮必填)。

## 三、Demo 页面要求(_example/)

以 `packages/ui/src/components/button/_example/` 为范本:

1. **结构还原上游文档页** `#/components/<name>`:页首简介段、Preview、Examples 下的全部小节(Sizes / States / As a link / …),**小节标题与说明文字用文档页英文原句**。仅省略 Installation、Usage、API reference、Accessibility、Related。
2. **Examples 一个不少**:上游示例用什么 props/组合就复刻什么;States 用受控 props 强制出完整状态矩阵(6 variant × 5 state + 蓝色斜体状态标签)。
3. **小程序不支持的能力不删案例**:asChild、Spinner、Icon 等用占位(文字字形/label 变化)呈现,并在描述句尾注明"ll-xxx 落地于 M2"后替换。
4. **交互型案例带真实状态机**(如 Loading composed 的 idle→saving→saved),写在 `_example/index.js` 的 Component methods 里。
5. 版式:`.row` gap 32rpx(gap-4);pair 结构(成对组合)对内 32rpx、对间 80rpx;页面底色 `--ll-paper`,说明文字 `#8a857c`。
6. demo 文案英文(手写字体可见性),`aria-label` 跟随上游示例。

## 四、验证循环(每次改动后)

```bash
node script/build.mjs          # 拼装 dist + 重生成 example 页
wechatide -c ClaudeCode build_npm --project $PWD/packages/example   # npm 唯一有效缓存刷新
wechatide -c ClaudeCode simulator_open_page --project $PWD/packages/example --page pages/<name>/index
wechatide -c ClaudeCode simulator_screenshot --project $PWD/packages/example
```

- **不跑 build_npm 必看到陈旧 npm**(清缓存/重启 IDE 都无效)——"我的 CSS 改动没生效"十有八九是它。
- 对照参考:上游 `pnpm dev` → http://localhost:5174/#/components/<name>;截图对比用 chrome-devtools MCP,注意小程序模拟器截图是 ~1.29x(484px 图 = 375pt)。
- 长页面滚动截图:`automation_evaluate` + `wx.pageScrollTo({ scrollTop })`。
