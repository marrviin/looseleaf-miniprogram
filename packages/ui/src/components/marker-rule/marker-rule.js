import { createComponent } from '../../common/component';
import { attachInk } from '../../common/ink';

/** Upstream MarkerRule (marker.tsx, internal) — one pencil line: beside the
    words (side start/end, leaving a small gap towards them) or under them
    (side full, pencil or wavy). `new` tone draws in red. Measured and drawn
    per box through the marker-rule recipe. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachInk()],
  properties: {
    /** 'start' | 'end' | 'full'. */
    side: {
      type: String,
      value: 'start',
    },
    /** 'default' | 'new'. */
    tone: {
      type: String,
      value: 'default',
    },
    /** Wavy line (border marker only). */
    wavy: {
      type: null,
      optionalTypes: [Boolean, String],
      value: false,
    },
  },
  data: {
    llInkRecipe: 'marker-rule',
    llInkSelector: '.ll-marker-rule',
  },
  observers: {
    'side, tone, wavy'() {
      this.__inkParams = () => ({
        side: this.data.side,
        tone: this.data.tone === 'new' ? 'new' : 'default',
        style: (this.data.wavy === true || this.data.wavy === 'true') && this.data.side === 'full' ? 'wavy' : 'line',
      });
      this.__measureInk();
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        side: this.data.side,
        tone: this.data.tone === 'new' ? 'new' : 'default',
        style: (this.data.wavy === true || this.data.wavy === 'true') && this.data.side === 'full' ? 'wavy' : 'line',
      });
    },
  },
});
