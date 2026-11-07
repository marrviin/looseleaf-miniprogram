import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** Upstream Card = Paper(stock="card", rules="none") — all sheet drawing
    (stock face, edges, rules, tape, fasteners, tilt) lives in ll-paper. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
