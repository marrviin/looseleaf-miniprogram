import { createComponent } from '../../common/component';
import { props } from './props';

const HIGHLIGHTS = ['yellow', 'pink', 'green', 'blue', 'orange', 'lilac', 'teal'];
const PENS = ['ink', 'blue', 'red', 'green', 'pencil', 'marker', 'orange'];

/** Upstream `Annotate` — a dispatcher over the mark components. WXML can't
    switch components dynamically, so the mapping lands in derived data and
    the template picks the child with wx:if:
    - color routes to a highlight tone or a pen depending on `type`;
    - a highlighter is held fine→light / brush→heavy (upstream does the same
      mapping inline). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    pen: '',
    hlTone: '',
    hlWeight: 'regular',
    shape: 'circle',
  },
  observers: {
    'type, color, weight'() {
      const { type, color, weight } = this.data;
      const pen = color && PENS.indexOf(color) !== -1 ? color : '';
      const hlTone = color && HIGHLIGHTS.indexOf(color) !== -1 ? color : '';
      const hlWeight = weight === 'fine' ? 'light' : weight === 'brush' ? 'heavy' : 'regular';
      const shape = type === 'box' ? 'box' : type === 'brackets' ? 'brackets' : 'circle';
      this.setData({ pen, hlTone, hlWeight, shape });
    },
  },
});
