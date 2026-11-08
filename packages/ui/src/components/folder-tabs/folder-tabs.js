import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `FolderTabs` — the strip of tabs along the folder's top edge
    (role=tablist). Pure layout; the ll-folder root talks to tabs directly. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../folder/folder': {
      type: 'ancestor',
      linked(parent) {
        setTimeout(() => parent.__sync(), 0);
      },
    },
  },
});
