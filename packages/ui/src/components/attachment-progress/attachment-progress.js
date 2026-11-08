import { createComponent } from '../../common/component';
import { svgDataUri } from '../../common/ink';
import {
  attachmentProgressTrack,
  attachmentProgressBar,
} from '../../common/ink-engine';
import { props } from './props';

/** Upstream `AttachmentProgress` — a hatched marker bar clipped to the
    value. The web build clips the recipe's bar part with a CSS clip-path;
    the webview can't, so the track and the bar are two fixed-size SVGs
    built at the measured width and the bar is revealed through an
    overflow-hidden window (a reveal, not a squash). No value = the bar
    pulses like upstream's indeterminate state. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    indeterminate: false,
    pct: 0,
    trackUri: '',
    barUri: '',
    barW: 0,
    llInkRecipe: '',
    llInkSelector: '.ll-attachment-progress',
  },
  observers: {
    'value, max, seed'() {
      this.__apply();
    },
  },
  lifetimes: {
    attached() {
      this.__apply();
    },
    detached() {
      if (this.__retryTimer) clearTimeout(this.__retryTimer);
    },
  },
  methods: {
    __apply() {
      const d = this.data;
      const has = d.value !== null && d.value !== undefined && d.value !== '';
      const v = has ? Number(d.value) : undefined;
      const max = Number(d.max) || 100;
      const pct = has ? Math.min(100, Math.max(0, (v / max) * 100)) : 100;
      this.setData({ indeterminate: !has, pct });
      // The ink spec may arrive before layout; remember and (re)draw.
      this.__drawWhenWide(0);
    },
    __drawWhenWide(n) {
      this.createSelectorQuery()
        .select('.ll-attachment-progress')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width || !rect.height) {
            if (n < 40) {
              if (this.__retryTimer) clearTimeout(this.__retryTimer);
              this.__retryTimer = setTimeout(() => this.__drawWhenWide(n + 1), n <= 10 ? 60 : 250);
            }
            return;
          }
          this.__draw(Number(Math.round(rect.width)), Number(Math.round(rect.height)));
        })
        .exec();
    },
    __draw(w, h) {
      const seed = String(this.data.seed ?? 'll-attachment-progress');
      const calm = false;
      const track = attachmentProgressTrack(`${seed}|track`, w, h, calm);
      const bar = attachmentProgressBar(`${seed}|bar`, w, h);
      this.setData({
        trackUri: svgDataUri(track.svg, track),
        barUri: svgDataUri(bar.svg, bar),
        barW: w,
      });
    },
  },
});
