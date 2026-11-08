import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-form-message — upstream FormMessage: the field's error written under
    it on a wavy red pencil underline (the field-error recipe); renders
    nothing while the field is fine. The enclosing ll-form-item pushes the
    message text. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    error: '',
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
    __applyError(msg) {
      msg = msg || '';
      if (msg === this.data.error) return;
      this.setData({ error: msg });
    },
  },
});
