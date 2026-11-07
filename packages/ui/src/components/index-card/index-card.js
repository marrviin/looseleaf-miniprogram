import { createComponent } from '../../common/component';
import { attachInk } from '../../common/ink';
import { props } from './props';
import { tiltFor } from '../../common/ink-engine';

const clamp2 = (v, m) => Math.max(-m, Math.min(m, Math.round(v * 100) / 100));

/** Upstream `IndexCard` — a Paper (index-card stock, index rules) as a flex
    column, plus a decor drawing (rod hole, flag, pile of cards) measured on
    the card box through the index-card-decor recipe (pad 26). The whole
    sheet tilts under a quarter of a degree so the printed lines stay level
    under the text. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachInk()],
  properties: props,
  data: {
    llInkRecipe: '',
    llInkSelector: '.ll-index-card',
    tiltDeg: 0,
    decorOn: false,
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'hole, flag, stack, seed, tilt'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const seedKey = String(d.seed ?? '');
      const hole = d.hole === true || d.hole === 'true';
      const flag = d.flag && d.flag !== 'false' ? d.flag : false;
      const stack = Math.max(0, Math.min(3, Number(d.stack) || 0));
      const decorOn = hole || !!flag || stack > 0;

      let deg = 0;
      if (d.tilt !== false) {
        const raw =
          typeof d.tilt === 'number' || (typeof d.tilt === 'string' && d.tilt !== '')
            ? Number(d.tilt)
            : tiltFor(`tilt:${seedKey || 'll-index-card'}`, 0.225);
        deg = Number.isFinite(raw) ? clamp2(raw, 2) : 0;
      }

      this.__inkParams = () => ({ hole, flag: flag || 'none', stack });
      this.setData({
        decorOn,
        llInkRecipe: decorOn ? 'index-card-decor' : '',
        tiltDeg: deg,
      });
      if (decorOn) this.__measureInk();
    },
  },
});
