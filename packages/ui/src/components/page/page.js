import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Page` — a Paper laid out as a centered flex column; the
    holes/stain are the page-decor recipe drawn on the paper box (napkin
    pattern: the decor view rides in the slot, measured at the paper's
    box). */

const WIDTHS = { sm: '512px', md: '672px', lg: '896px', xl: '1152px', full: '' };

function tornEdge(torn) {
  if (torn === 'both') return { top: 'torn', bottom: 'torn' };
  if (torn === 'bottom') return { bottom: 'torn' };
  if (torn === 'top' || torn === true) return { top: 'torn' };
  return '';
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'page',
    llInkSelector: '.ll-page__decor',
    pageClass: 'll-page',
    decorOn: false,
    holesName: 'none',
    edgeSpec: '',
    widthStyle: '',
  },
  lifetimes: {
    attached() {
      this.__update();
    },
  },
  observers: {
    'width, holes, reinforce, stain, torn'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const raw = d.holes;
      const holes = raw === true ? 'start' : raw ? raw : 'none';
      const decorOn = holes !== 'none' || !!d.stain;
      this.__inkParams = { holes, reinforce: !!d.reinforce, stain: !!d.stain };
      this.setData({
        holesName: holes,
        decorOn,
        pageClass: 'll-page' + (holes === 'start' ? ' ll-page--holes-start' : '') + (holes === 'top' ? ' ll-page--holes-top' : ''),
        edgeSpec: tornEdge(d.torn),
        widthStyle: WIDTHS[d.width] ? `max-width:${WIDTHS[d.width]};` : '',
      });
      this.__measureInk();
    },
  },
});
