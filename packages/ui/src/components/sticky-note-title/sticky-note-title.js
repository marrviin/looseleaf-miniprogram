import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream StickyNoteTitle — the first word, bold script. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
