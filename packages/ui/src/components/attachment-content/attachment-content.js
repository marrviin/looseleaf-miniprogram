import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AttachmentContent` — the text column (title + description). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
