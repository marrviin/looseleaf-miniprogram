import { createComponent } from '../../common/component';
import { tiltFor } from '../../common/ink-engine';
import { props } from './props';

/** Upstream `NotebookCover` — a cloth cover over board with a darker
    stitched spine on the start edge and an elastic band round the end.
    One drawn sheet, tilted and shadowed as one: the faced ink sandwich
    (cast shadow → under strokes → face views → over strokes) rotates
    together; the label body stays put. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'notebook-cover',
    // measure the root (the sheet fills it)
    llInkSelector: '.ll-notebook-cover',
    tiltStyle: '',
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'tone, band, tilt, seed'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      this.__inkParams = { tone: d.tone || 'tomato', band: d.band !== false };
      // tilt: true = seeded turn under 1.4deg; number = degrees; false = flat
      const deg =
        d.tilt === false
          ? 0
          : typeof d.tilt === 'number'
            ? d.tilt
            : tiltFor(`tilt:${d.seed || 'notebook-cover'}`, 1.4);
      this.setData({ tiltStyle: deg ? `transform:rotate(${deg}deg);` : '' });
      this.__measureInk();
    },
  },
});
