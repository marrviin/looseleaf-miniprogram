import { createComponent } from '../../common/component';
import { clipboardClip } from '../../common/ink-engine';
import { svgDataUri } from '../../common/ink';
import { props } from './props';

/** Upstream `Clipboard` — a hardboard (or accent plastic) board drawn by
    clipboard-board-ink with a metal clip on top, holding one sheet of
    paper (upstream ClipboardPaper folds in as the wrapped slot). The clip
    is clipboard-clip art, sized 104px wide like upstream (clip 104). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'clipboard-board',
    // Measure the root (the board fills it); the ink view sits absolute
    // behind the paper.
    llInkSelector: '.ll-clipboard',
    clipStyle: '',
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    tone() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const tone = d.tone || 'hardboard';
      this.__inkParams = { tone };
      // The clip art is fixed-width (104px like upstream); its height comes
      // from the InkResult.
      const res = clipboardClip(this.__clipSeed(), { width: 104 });
      this.setData({
        clipStyle:
          `width:${res.w}px;height:${res.h}px;` +
          `background-image:url("${svgDataUri(res.svg, res)}");`,
      });
      this.__measureInk();
    },
    __clipSeed() {
      const d = this.data;
      return d.seed ? `${d.seed}|clip` : 'clipboard-clip';
    },
  },
});
