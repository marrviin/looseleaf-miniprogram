# Components

English | [简体中文](./components.md)

Against the upstream [looseleaf](https://github.com/kevintngo/looseleaf)'s **123 components: 119 ported, 4 skipped due to mini program platform limits**.
Component names match upstream; register them with the `ll-` prefix in the mini program (e.g. `ll-button`). APIs mirror the upstream docs one to one; the "Notes" column records implementation highlights from the port.

> To see the components rendered, clone the repo and open `packages/example` in WeChat DevTools — the demos mirror the upstream docs site one to one.

## Actions

| Component | Status | Notes |
|---|---|---|
| button | ✅ | — |
| button-group | ✅ | with separator / text sub-components |
| stamp-button | ✅ | `ll-stamp-surface` receives impressions |
| toggle | ✅ | — |
| toggle-group | ✅ | — |

## Forms

| Component | Status | Notes |
|---|---|---|
| calendar | ✅ | — |
| checkbox | ✅ | — |
| combobox | ✅ | trigger / editable / chips modes |
| date-picker | ✅ | — |
| dropzone | ✅ | family of 7: area / description / icon / item / list / rejections / title |
| field | ✅ | family of 10: field + label / title / description / error / group / set / legend / separator / content |
| form | ✅ | family of form / item / label / description / message; errors map mirrors upstream FormProvider |
| input | ✅ | — |
| input-group | ✅ | family of 6: group / addon / button / text / input / textarea |
| input-otp | ✅ | — |
| label | ✅ | required asterisk is a fixed SVG |
| native-select | ✅ | system picker + drawn frame; option groups flattened |
| radio-group | ✅ | — |
| rating | ✅ | — |
| select | ✅ | single component: options array + slip layer |
| signature-pad | ✅ | — |
| slider | ✅ | — |
| stepper | ✅ | (tally folded into stepper-tally) |
| sticker-picker | ✅ | — |
| switch | ✅ | — |
| textarea | ✅ | — |

## Feedback

| Component | Status | Notes |
|---|---|---|
| alert | ✅ | includes sticky-note variant, alert-title / description relation |
| empty | ✅ | (family of 6) |
| progress | ✅ | — |
| skeleton | ✅ | (loading family) |
| sonner | ✅ | shipped as `ll-toast` |
| spinner | ✅ | — |

## Overlays

| Component | Status | Notes |
|---|---|---|
| alert-dialog | ✅ | family, includes alert-dialog-media |
| command | ✅ | family of 9; cmdk-style relations coordination |
| context-menu | ✅ | opens at the press point |
| dialog | ✅ | (family) |
| drawer | ✅ | torn sheet edge + grab tape + snap |
| dropdown-menu | ✅ | (family of 10 + `ll-kbd`) |
| hover-card | ✅ | polaroid look, includes hover-card-media |
| popover | ✅ | — |
| sheet | ✅ | (family) |
| tooltip | ✅ | — |

## Navigation

| Component | Status | Notes |
|---|---|---|
| breadcrumb | ✅ | — |
| menubar | ✅ | paper strips + ruler-tick drawing, includes menubar-menu |
| navigation-menu | ✅ | (family of 7) |
| pagination | ✅ | — |
| sidebar | ✅ | full-width catalog-page form, family of 22 |
| tabs | ✅ | — |

## Layout

| Component | Status | Notes |
|---|---|---|
| accordion | ✅ | — |
| aspect-ratio | ✅ | — |
| card | ✅ | — |
| collapsible | ✅ | trigger / content / indicator family + margin-bracket ink |
| direction | ✅ | RTL/LTR provider; descendants read direction via relations |
| resizable | ⏭️ | no pointer-drag scenario in mini programs |
| scroll-area | ⏭️ | covered by native scroll-view |
| separator | ✅ | (includes rule) |

## Data display

| Component | Status | Notes |
|---|---|---|
| avatar | ✅ | (family of 6) |
| badge | ✅ | — |
| carousel | ✅ | content / item / dots / dot / previous / next family; count measured at root ready; vertical pages fill container height |
| item | ✅ | (cell / list family) |
| table | ✅ | family of 7: table + body / caption / cell / footer / head / header / row |

## Charts

| Component | Status | Notes |
|---|---|---|
| chart | ✅ | — |

## Paper

| Component | Status | Notes |
|---|---|---|
| bookmark | ✅ | — |
| clipboard | ✅ | — |
| desk | ✅ | — |
| envelope | ✅ | — |
| folder | ✅ | — |
| index-card | ✅ | (family) |
| label-tag | ✅ | (folded into the tag component) |
| napkin | ✅ | — |
| notebook | ✅ | — |
| page | ✅ | — |
| paper | ✅ | (+ rules) |
| polaroid | ✅ | (family) |
| receipt | ✅ | family of 7 |
| sticky-note | ✅ | — |
| tape | ✅ | — |
| ticket | ✅ | — |

## Marks

| Component | Status | Notes |
|---|---|---|
| annotate | ✅ | — |
| arrow | ✅ | pointAt measures once at attach, no re-measure on layout changes |
| asterisk | ✅ | — |
| bracket | ✅ | — |
| callout | ✅ | — |
| circled | ✅ | — |
| highlight | ✅ | — |
| quote | ✅ | quote-text + quote-attribution; quote-mark ink varies by tone / weight / size / rule |
| ribbon | ✅ | — |
| scribble | ✅ | — |
| signature | ✅ | — |
| squiggle | ✅ | — |
| strike | ✅ | — |
| tally | ✅ | (folded into stepper-tally) |
| underline | ✅ | — |

## Stickers & doodles

| Component | Status | Notes |
|---|---|---|
| doodle | ✅ | — |
| mascot | ✅ | — |
| seal | ✅ | — |
| stamp | ✅ | — |
| sticker | ✅ | — |
| sticker-sheet | ✅ | — |

## Chat

| Component | Status | Notes |
|---|---|---|
| attachment | ✅ | family of 10: content / description / group / media / progress / title / trigger / action(s) |
| bubble | ✅ | (includes group / reactions) |
| code-block | ✅ | folded into a single component, syntax highlighting built in |
| marker | ✅ | (marker-content / icon / rule) |
| message | ✅ | family avatar / content / footer / header / text; scroller and group are their own components |
| message-scroller | ✅ | viewport / item / button / content family |
| prompt-input | ✅ | works with the attachment family |
| typing-indicator | ✅ | (loading family) |

## Interactive

| Component | Status | Notes |
|---|---|---|
| boil | ⏭️ | the per-frame redraw target is arbitrary slot content — mini program slots live in the page's style scope, so the component cannot re-render them every frame |
| confetti | ✅ | — |
| corkboard | ✅ | — |
| flip-card | ✅ | — |
| marquee | ✅ | — |
| peel-corner | ⏭️ | relies on pointer-drag physics (pointer capture + rAF tweening), too costly to port |
| reveal | ✅ | — |
| sketchpad | ✅ | — |
| sticker-board | ✅ | — |
| tear-off | ✅ | Body / Stub folded into the single component, named slots |

## Typography

| Component | Status | Notes |
|---|---|---|
| handwritten | ✅ | — |
| kbd | ✅ | — |
| lettering | ✅ | — |
| typography | ✅ | h1–h4 / p / lead / muted / small / large / list / inline-code / blockquote set; Prose not ported (mini program style isolation cannot reach markdown inside slots) |
| typewriter | ✅ | — |

## Icons

| Component | Status | Notes |
|---|---|---|
| icon | ✅ | (~160 glyphs) |

## Mini program adaptations

Upstream is React + Radix; the port keeps the visuals and the API mapping but adapts to the mini program platform:

- **Runtime ink engine** — upstream generates ink SVGs at runtime, per element's real size, in React; the port bundles the same TS engine as `common/ink-engine.js` and runs it inside the mini program, drawing each element from its measured size with a 1:1 stroke width — no whole-image stretching. The rest / hover / pressed / focus state layers are pre-generated and stacked on the same element's `background-image`, swapped on interaction.
- **Tokens evaluated at build time** — upstream derives many colors via `color-mix()`, which is unreliable in the mini program rendering environment; they are evaluated to static colors at build time with culori. Tokens ship as a single `common/style/tokens.wxss` — `@import` it once in `app.wxss` and they inherit down the node tree (components don't inline tokens, keeping the main package lean).
- **Handwriting font** — Kevin Sans ships as a base64 woff2 Latin subset and is registered once globally via `wx.loadFontFace` when the first component renders; on failure text falls back to the system font. The font has no CJK glyphs, so Chinese text always uses the system font.
- **Font-size & spacing conversion** — the upstream font face carries `size-adjust: 88%`, which `wx.loadFontFace` cannot express, so component font sizes are converted as upstream px × 0.88 → rpx; spacing converts as upstream px × 2 → rpx.
- **Interaction state API** — native mini program components have no mouse / focus events, so upstream's forced states `data-hover` / `data-pressed` / `data-focus-visible` become controlled props `hovered` / `pressed` / `focusVisible`, OR-ed with the touch-pressed state.
- **No portal for popups** — Radix portal layers (popover / dialog / sheet / the various menus) become absolutely positioned in-page layers; menu highlighting, keyboard navigation and the like are coordinated through Component relations.
- **Slots live in the page's style scope** — the mini program keeps slot content's styling and re-rendering on the page side, so a component can neither redraw slot content per frame nor apply global styles to it. Upstream components relying on either (boil, typography's Prose) are skipped.
- **Native `<button>` reset** — the native button's UA styles (fixed width, `margin: auto`, `overflow: hidden`) would crush the hand-drawn ink layer; button-type components carry a full UA override, and inner native nodes use `catchtap` to prevent double-fired events.
- **Folded families** — some upstream families fold into single components on the mini program side: sonner → `ll-toast`, `label-tag` folded into `ll-tag`, tally → `ll-stepper-tally`, tear-off's Body / Stub folded into the component itself, code-block as a single component (syntax highlighting built in).
