import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-form-label — upstream FormLabel: a Label that turns red pencil while
    its field has an error (the enclosing ll-form-item pushes the state). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    error: false,
  },
  relations: {
    '../form-item/form-item': {
      type: 'ancestor',
      linked(parent) {
        this.__item = parent;
      },
      unlinked(parent) {
        if (this.__item === parent) this.__item = null;
      },
    },
  },
  methods: {
    noop() {},
    /** Called by ll-form-item. */
    __applyError(hasError) {
      if (!!hasError === this.data.error) return;
      this.setData({ error: !!hasError });
    },
  },
});
