# Looseleaf Miniprogram

English | [简体中文](./README.md)

**Looseleaf, drawn by hand — give your WeChat Mini Program a hand-drawn, paper-textured UI.**

Every component is drawn by a "pen" at runtime: slightly tilted borders, wobbly underlines, stickers and tape — like sketching your UI on loose-leaf paper. This is a WeChat Mini Program port of [looseleaf](https://github.com/kevintngo/looseleaf), with all components under the `ll-` prefix, implemented as native mini program components, tree-shakable by design and ready to use.

## Components

**Base** button · badge · card · tag · separator · rule · icon · paper

**Form** checkbox · radio-group · switch · input · textarea · slider · stepper · rating · progress

**Display** avatar (incl. the badge / fallback / group family) · spinner

**Overlay** dialog · sheet · toast · popover

The rest of the overlay batch, navigation components, and hand-drawn specialties (polaroid, index-card, tape, marker, …) are on the roadmap in [PLAN.md](./PLAN.md) (Chinese).

## Features

- **Runtime ink** — strokes are drawn per element at its real size with a 1:1 stroke width; every instance is a unique "handwriting", with seed control and the full rest / hover / pressed / focus / disabled state layers
- **A complete design system** — upstream tokens (paper, ink, palette, density) are precomputed into WXSS at build time; paper grain, tape and binding textures included
- **Handwriting font** — Kevin Sans ships with the library; headings and body text are all "handwritten"
- **Native mini program components** — no WebView, no cross-platform framework; pure WXML + WXSS + Component, import per component and keep your bundle lean
- **Upstream-faithful API** — variants and props mirror the upstream docs one to one, so there is zero mental overhead moving between them

## Installation

```bash
npm install looseleaf-miniprogram
```

After "Build npm" in WeChat DevTools, register components as needed:

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

> **Import the design tokens once in your `app.wxss`** (components don't carry them, to avoid baking a ~5KB copy into every component and blowing the 2MB main-package limit):
>
> ```css
> @import 'miniprogram_npm/looseleaf-miniprogram/common/style/tokens.wxss';
> ```
>
> Tokens are declared on `page` and inherit into every component as CSS custom properties. Also consider enabling `"ignoreUploadUnusedFiles": true` in `project.config.json` so unused components are stripped at upload time.

> The handwriting font is an optional enhancement — call the provided `ensureHandFont()` to load it globally when needed.

## Preview

```bash
git clone https://github.com/marrviin/looseleaf-miniprogram.git
cd looseleaf-miniprogram
pnpm install && npm run build
cp packages/example/project.config.example.json packages/example/project.config.json
```

Open `packages/example` in WeChat DevTools and run "Build npm" once to browse full demos of every component, mirroring the upstream docs site.

## Contributing

Issues are welcome. Component porting rules and hard-won debugging notes live in [docs/component-guide.md](./docs/component-guide.md) (Chinese); commit messages follow commitlint (conventional commits).

## Acknowledgements

This project is a port of [looseleaf](https://github.com/kevintngo/looseleaf) by [@kevintngo](https://github.com/kevintngo), MIT licensed — the design tokens, ink engine and component API all come from upstream, with gratitude. All credit for the hand-drawn aesthetic belongs to the original project; porting issues are ours.

## License

MIT (upstream looseleaf is likewise MIT licensed).
