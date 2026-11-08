# 移植 TODO — 全量组件状态

对照上游 [looseleaf](https://github.com/kevintngo/looseleaf) `src/components/ui/` 的 123 个组件。
顺序 = 上游文档站顺序（`src/docs/core/catalog.ts` 的 `CATEGORY_ORDER` 15 个分类，组内按标题字母序）。
最后更新：2026-11-08（D10 批次完成后）。

**进度：122 / 123 已移植，7 个跳过/降级，1 个再议（lettering）。全部计划批次（M2-P0 → D12）完成。**

图例：✅ 已移植（批次）· 🔲 待移植（计划批次）· ⏭️ 跳过 · 🔶 计划批次的可选项

## Actions

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Button | button | M2-P0 |
| ✅ | Button Group | button-group | M2-P2（含 separator/text 子组件） |
| ✅ | Stamp button | stamp-button | D12（含 ll-stamp-surface 承接 impressions） |
| ✅ | Toggle | toggle | M2-P2 |
| ✅ | Toggle Group | toggle-group | M2-P2 |

## Forms

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ D7 | Calendar | calendar | |
| ✅ | Checkbox | checkbox | M2-P0 |
| ✅ | Combobox | combobox | D5（a996f24，单组件 select 先例：trigger/editable/chips 三形态 + slip，combobox-chips/chip recipe，trigger 复用 select recipe） |
| ✅ D7 | Date Picker | date-picker | |
| 🔲 | Dropzone | dropzone | D11 |
| ✅ | Field | field | D3（家族 10 目录：field + label/title/description/error/group/set/legend/separator/content，d3d96be） |
| ✅ | Form | form | D6（fc50b1a，form/item/label/description/message，errors map 承接 FormProvider；RHF 50–59 示例由 field demo 同型承接） |
| ✅ | Input | input | M2-P0 |
| ✅ | Input Group | input-group | D6（8a8c16b，家族 6 目录：group/addon/button/text/input/textarea） |
| ✅ | Input OTP | input-otp | D6（abbb83a） |
| ✅ | Label | label | D3（e97f130，required 星号 = labelStar 固定 SVG） |
| ✅ | Native Select | native-select | D6（8585f1b，系统 picker + 画框；分组拍平） |
| ✅ | Radio Group | radio-group | M2-P0 |
| ✅ | Rating | rating | M2-P0 |
| ✅ | Select | select | D3（3c42cd4，单组件 options 数组 + slip 弹层） |
| ✅ D7 | Signature pad | signature-pad | |
| ✅ | Slider | slider | M2-P0 |
| ✅ | Stepper | stepper | M2-P0（tally 并入 stepper-tally） |
| ✅ | Sticker picker | sticker-picker | D12 |
| ✅ | Switch | switch | M2-P0 |
| ✅ | Textarea | textarea | M2-P0 |

## Feedback

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Alert | alert | D10（含 sticky note 变体，alert-title/description 关系） |
| ✅ | Empty | empty | M2-P1（家族 6 组件） |
| ✅ | Progress | progress | M2-P0 |
| ✅ | Skeleton | skeleton | M2-P1（loading 家族） |
| ✅ | Sonner | sonner | ✅ M2-P1（以 ll-toast 落地） |
| ✅ | Spinner | spinner | M2-P0 |

## Overlays

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Alert Dialog | alert-dialog | D5（家族 + alert-media recipe） |
| ✅ | Command | command | D5（家族 9 目录，cmdk 双向 relations 协调，63c0099） |
| ✅ | Context Menu | context-menu | D5（press-point slips） |
| ✅ | Dialog | dialog | M2-P1（家族） |
| ✅ | Drawer | drawer | D5（vaul slips：torn sheet + grab tape + snap） |
| ✅ | Dropdown Menu | dropdown-menu | M2-P1（家族 10 组件 + ll-kbd） |
| ✅ | Hover Card | hover-card | D5（polaroid slips + hover-card-media） |
| ✅ | Popover | popover | M2-P1 |
| ✅ | Sheet | sheet | M2-P1（家族） |
| ✅ | Tooltip | tooltip | M2-P1 |

## Navigation

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Breadcrumb | breadcrumb | M2-P2 |
| ✅ | Menubar | menubar | D5（paper strips ruler-tick bar，含 menubar-menu） |
| ✅ | Navigation Menu | navigation-menu | M2-P2（家族 7 组件） |
| ✅ | Pagination | pagination | M2-P2 |
| ⏭️ | Sidebar | sidebar | 跳过（桌面布局组件，无小程序场景） |
| ✅ | Tabs | tabs | M2-P2 |

## Layout

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Accordion | accordion | M2-P2 |
| ✅ | Aspect Ratio | aspect-ratio | D10 |
| ✅ | Card | card | M2-P0 |
| ✅ | Collapsible | collapsible | D10（trigger/content/indicator 家族 + margin-bracket 墨迹） |
| ✅ | Direction | direction | D10（最小 provider stub：mp 无 DOM 属性级联，descendants 经 relation 读 dir；web 的文字镜像折叠不移植） |
| ⏭️ | Resizable | resizable | 跳过（无指针拖拽场景） |
| ⏭️ | Scroll Area | scroll-area | 跳过（scroll-view 原生覆盖） |
| ✅ | Separator | separator | M2-P0（含 rule） |

## Data display

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Avatar | avatar | M2-P0（家族 6 组件） |
| ✅ | Badge | badge | M2-P0 |
| ✅ | Carousel | carousel | D10（content/item/dots/dot/previous/next 家族；count 在 root ready 量取；vertical 页占满容器高） |
| ✅ | Item | item | M2-P2（cell/list 家族） |
| ✅ | Table | table | D4（家族 7 目录：table + body/caption/cell/footer/head/header/row，ab4edc8；交互 demo d4cc346；团队账单 demo f3ea7de） |

## Charts

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ D7 | Chart | chart | |

## Paper

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Bookmark | bookmark | D2 |
| ✅ | Clipboard | clipboard | D8 |
| ✅ | Desk | desk | D8 |
| ✅ | Envelope | envelope | D8 |
| ✅ | Folder | folder | D8 |
| ✅ | Index card | index-card | M2-P3（家族） |
| ✅ | Label tag | label-tag | M2-P0（并入 tag 组件） |
| ✅ | Napkin | napkin | D2 |
| ✅ | Notebook | notebook | D8 |
| ✅ | Page | page | D8 |
| ✅ | Paper | paper | M2-P1（+ rules） |
| ✅ | Polaroid | polaroid | M2-P3（家族） |
| ✅ | Receipt | receipt | D2（家族 7 组件） |
| ✅ | Sticky note | sticky-note | D2 |
| ✅ | Tape | tape | M2-P3 |
| ✅ | Ticket | ticket | D2 |

## Marks

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Annotate | annotate | D1 |
| ✅ | Arrow | arrow | D10（pointAt 无 ResizeObserver，attach 时一次射线求交量测） |
| ✅ | Asterisk | asterisk | D1 |
| ✅ | Bracket | bracket | D1 |
| ✅ D11 | Callout | callout | D11（Handwritten + Arrow 组合；animate/delay 未暴露——mp 无 mark phase，箭头静态绘制） |
| ✅ | Circled | circled | D1 |
| ✅ | Highlight | highlight | D1 |
| ✅ | Quote | quote | D10（quote-text + quote-attribution；引号墨迹按 tone/weight/size/rule） |
| ✅ | Ribbon | ribbon | D2 |
| ✅ | Scribble | scribble | D1 |
| ✅ D11 | Signature | signature | D11（签名墨迹一层 SVG + 名字 real text；animate 用 CSS wipe 模拟，delay 保留） |
| ✅ | Squiggle | squiggle | D1 |
| ✅ | Strike | strike | D1 |
| ✅ | Tally | tally | M2-P0（并入 stepper-tally） |
| ✅ | Underline | underline | D1 |

## Stickers & doodles

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Doodle | doodle | M2-P3 |
| ✅ | Mascot | mascot | M2-P3 |
| ✅ | Seal | seal | D2 |
| ✅ | Stamp | stamp | D2 |
| ✅ | Sticker | sticker | D2 |
| ✅ | Sticker sheet | sticker-sheet | D2 |

## Chat

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ D11 | Attachment | attachment | D11（五态 + 进度 + live upload；clip 停靠 right:24px，见 attachment.js 注释） |
| ✅ D9 | Bubble | bubble | D9（bubble/bubble-group/bubble-content/bubble-reactions；tail 从 SVG 剥离因为无法对 background-image 部分隐藏） |
| ✅ | Code block | code-block | D10（折叠为单组件；code-highlight.ts + rng.ts 移植进 common/；body focus ring 省略） |
| ✅ | Marker | marker | M2-P3（marker-content/icon/rule） |
| ✅ D9 | Message | message | D9（message 家族 7 目录；含 message-text 逐词 soak） |
| ✅ D9 | Message scroller | message-scroller | D9（5 目录；scroll-top 优先级高于 scroll-into-view → 锚点改测量 rect 定位） |
| ✅ | Prompt input | prompt-input | D6；D11 回填 04 真实 Attachment 芯片 + 修复 multipleSlots 缺失导致具名 slot 全部不渲染 |
| ✅ | Typing indicator | typing-indicator | M2-P1（loading 家族） |

## Interactive

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ⏭️ | Boil | boil | 跳过：每帧重播种/改 ink knobs 的是任意 slotted children——小程序 slot 内容属页面样式域，组件无法逐帧重渲染（D7） |
| ✅ D7 | Confetti | confetti | D7 |
| ✅ | Corkboard | corkboard | D8 |
| ✅ D7 | Flip card | flip-card | 复合组件折进单组件：front/back 具名 slot + 全卡点击热区（multipleSlots）+ toggle()；preserve-3d 翻转 |
| ✅ D7 | Marquee | marquee | D7 |
| ⏭️ | Peel corner | peel-corner | 跳过：指针拖拽物理（pointer capture + rAF 补间 + 悬停 peek）成本高，D7 可选项按约跳过 |
| ✅ D7 | Reveal | reveal | D7 |
| ✅ D7 | Sketchpad | sketchpad | D7 |
| ✅ | Sticker board | sticker-board | D12（sticker-sheet demo "Sheet to board" 一节已回填） |
| ✅ | Tear-off | tear-off | D12（Body/Stub 折入单组件，具名 slot） |

## Typography

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ D11 | Handwritten | handwritten | D11（text prop 逐词 --jy/--jr/--jo；color-mix 减墨，--ll-jitter-k 由 0 修回 1） |
| ✅ | Kbd | kbd | D2 |
| ⏭️ | Lettering | lettering | 跳过：riso 套印 text-shadow(calc+var) 在 webview 仍不可靠；Handwritten 已就绪，成本/收益低 |
| ✅ D7 | Typewriter | typewriter | typingPlan 链式播放；caret 按实测字号渲染；stagger 同 reveal 用逐项 delay 替代 |
| ✅ | Typography | typography | D10（h1–h4/p/lead/muted/small/large/list/inline-code/blockquote 16 目录；Prose 跳过——mp 隔离样式无法作用 slot 全局 markdown） |

## Icons

| 状态 | 组件 | 上游 | 备注 |
|---|---|---|---|
| ✅ | Icon | icon | M2-P0（~160 glyphs） |

---

## 批次计划

| 批次 | 范围 | 组件 |
|---|---|---|
| ✅ D2 | 纸质小件 | ribbon, seal, stamp, kbd, sticky-note, napkin, bookmark, ticket, receipt 家族, sticker, sticker-sheet（11 个，全部完成） |
| ✅ D3 | label / field → select | label, field 家族, select（11 个目录，66 demo 页，全部完成） |
| ✅ D4 | 表格 | table（7 目录，3 commits，全部完成） |
| ✅ D5 | 弹层类 | alert-dialog, drawer, hover-card, context-menu, menubar, command, combobox（7 个，全部完成）；sonner 以 ll-toast（M2-P1）落账 |
| ✅ D6 | input-group 家族 | input-group, input-otp, prompt-input, native-select, form（8a8c16b / abbb83a / 5567bba / 8585f1b / fc50b1a） |
| ✅ D7 | 日历/图表/画板/动效 | calendar, date-picker, chart, sketchpad, signature-pad, confetti, typewriter, reveal, marquee, flip-card（10 个）；跳过 boil / peel-corner / lettering（见各行的⏭️备注） |
| ✅ D8 | 纸张大件/容器 | envelope, clipboard, notebook, folder, corkboard, desk, page（7 个，全部完成） |
| ✅ D9 | 消息类 | bubble, message, message-scroller |
| ✅ D10 | 展示与排版 | alert, carousel, collapsible, code-block, quote, typography 家族, aspect-ratio, arrow, direction（9 组，全部完成）；callout 推迟到 D11（依赖 Handwritten）；typography Prose 跳过 |
| ✅ D11 | 文件与签名 | attachment, dropzone, signature, handwritten, callout, prompt-input 04 回填（全部完成；新坑：observer 回写死循环、grain:false 悬空 mask、右缘堆叠死区、multipleSlots 缺失具名 slot 不渲染、virtualHost 组件不接收页面 class） |

| ✅ D12 | sticker 生态 | sticker-picker, sticker-board（+ sticker-sheet "Sheet to board" 回填）, stamp-button（+ ll-stamp-surface）, tear-off（全部完成；新坑：React context 跨组件不可达 → 页面当媒人 / wxml 拒绝对象字面量绑定 → data 预计算） |
| ⏭️ | 跳过 | sidebar, resizable, scroll-area |

## 欠账回填清单（依赖后续组件的 demo 节）

- ~~**sticker-sheet** demo "Sheet to board"（上游示例 03）→ 等 D12 `sticker-board`~~ → 已回填（D12）。
- **card** demo Guest book → 等 paper stock（ll-paper 已落地，待回填）。
- **card** demo Article / On-every-stock / Pinned-clipped-stapled → 等 P3 paper 组件（tape/doodle 已落地，逐项核对）。
- ~~**create project** demo 的 Select 占位 → 等 D3 `select`~~ → 已解锁，待回填（ll-select 已落地）。
- **input** demo date/file 类型 → picker / `wx.chooseMedia` 替代方案待定。
- ~~**checkbox** demo "50 with description" / "choice cards" → 等 D3 field 家族~~ → 已解锁，待回填（ll-field 家族已落地）。

## 已完成批次归档

- **M2-P0**（18 页）：badge, card, tag(+label-tag), separator(+rule), avatar 家族, icon, spinner, button, checkbox, radio-group, switch, input, textarea, slider, progress, stepper(+tally), rating
- **M2-P1**：paper(+rules), dialog 家族, sheet 家族, toast, popover, dropdown-menu 家族(10), tooltip, empty 家族(6), loading(skeleton, typing-indicator)
- **M2-P2**：tabs, accordion, item 家族, pagination, breadcrumb, button-group, toggle(+toggle-group), navigation-menu 家族(7)
- **M2-P3**：tape, doodle, mascot, marker 家族, index-card 家族, polaroid 家族
- **D1**（9 个 mark）：highlight, strike, underline, scribble, circled, squiggle, bracket, asterisk, annotate
- **D2**（11 个）：ribbon, seal, stamp, kbd, sticky-note, napkin, bookmark, ticket, receipt 家族, sticker, sticker-sheet
- **D3**（3 个上游组件，11 个目录）：label, select, field 家族（field + label/title/description/error/group/set/legend/separator/content）
- **D5**（7 个上游组件）：alert-dialog 家族, drawer 家族, hover-card 家族, context-menu, menubar(+menu), command 家族(9 目录), combobox；sonner 以 ll-toast 落账
