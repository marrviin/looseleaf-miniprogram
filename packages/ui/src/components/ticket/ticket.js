import { createComponent } from '../../common/component';
import { tiltFor } from '../../common/ink-engine';
import { props, validators } from './props';

const clampTilt = 1.2;

/** Upstream `Ticket` — a faced sheet: the recipe draws the silhouette with
    holes (evenodd face), the tear line and the pressed frames; the stock
    face is a CSS view clipped to the same shape (faced ink sandwich, see
    common/ink.js). The ink rotates by the seeded tilt while the content
    stays put (upstream rotates svg[data-ink="sheet"] via --ll-tilt). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'ticket-sheet',
    llInkSelector: '.ll-ticket',
    deg: 0,
    stubName: 'end',
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'stock, stub, stubWidth, punched, seed, tilt'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const stubName = validators.stub.includes(d.stub) ? d.stub : 'end';
      const stock = d.stock || 'kraft';
      this.__inkParams = {
        stock,
        stub: stubName,
        stubWidth: d.stubWidth,
        punched: !!d.punched,
      };
      let deg = 0;
      if (d.tilt !== false) {
        deg =
          typeof d.tilt === 'number'
            ? d.tilt
            : tiltFor(`tilt:${String(d.seed ?? '') || 'ticket'}`, clampTilt);
      }
      this.setData({ deg, stubName });
      this.__measureInk();
    },
  },
});
