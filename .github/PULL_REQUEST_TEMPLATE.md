| 谢谢你的 PR!移植类改动请先阅读 [docs/component-guide.md](../docs/component-guide.md)。 |

## 这个 PR 做了什么

<!-- 一句话说明:移植了哪个组件 / 修了什么问题 -->

## 变更类型

- [ ] 新组件移植(含 `_example/` demo)
- [ ] 既有组件的保真修复(对齐上游)
- [ ] 构建脚本 / 工程化
- [ ] 文档 / demo
- [ ] 其他

## 验收自查(移植类必填)

- [ ] `npm run build:ink` 已跑(改过 recipe 时必须)
- [ ] `npm run build` 通过,微信开发者工具「构建 npm」后逐 variant 与上游文档站比对过
- [ ] 手写字体场景下 demo 文案为英文
- [ ] 状态层(rest/hover/pressed/focus/disabled)完整
- [ ] 修改墨迹引擎/运行时(`common/ink.js`)时,已有组件 demo 无回归

## 截图

<!-- 模拟器截图,最好附上游对照 -->
