import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream StickyNoteFooter — mt-auto pt-2 font-hand text-sm text-ink-soft. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
