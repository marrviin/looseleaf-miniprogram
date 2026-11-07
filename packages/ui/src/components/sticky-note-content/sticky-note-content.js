import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream StickyNoteContent — the body. `done` mirrors the note's ticked
    state (WeChat style isolation can't carry it from the parent): checked
    notes strike the words through. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
