import { createComponent } from '../../common/component';

/** ll-command-list — upstream CommandList: the scrolling list (max 300px;
    the list scrolls, not the paper, so the slip's shadow and edge stay
    whole). ll-command-empty / ll-command-loading render inside it, below
    the rows. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Max list height in px (upstream max-h-[300px]). */
    maxHeight: {
      type: null,
      optionalTypes: [Number, String],
      value: 300,
    },
    customStyle: String,
  },
});
