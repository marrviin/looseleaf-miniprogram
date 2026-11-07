import { createComponent } from '../../common/component';

/** ll-popover-header — title + description column (flex flex-col gap-1 text-sm). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
