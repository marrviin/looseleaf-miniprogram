import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-form-item — one field row (upstream FormItem): picks its field's
    message up from the enclosing ll-form and hands it to its form-label
    (red words) and form-message (red text on a wavy underline). The page
    can also read `hasError` off this node to invalidate the control. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    error: '',
    hasError: false,
  },
  lifetimes: {
    attached() {
      this.__label = null;
      this.__message = null;
    },
  },
  relations: {
    '../form/form': {
      type: 'ancestor',
      linked(parent) {
        this.__form = parent;
        if (parent.__items && this.__form) {
          // form may have attached first — make sure we're on its list
        }
      },
    },
    '../form-label/form-label': {
      type: 'descendant',
      linked(label) {
        this.__label = label;
        if (this.data.hasError) label.__applyError(true);
      },
      unlinked(label) {
        if (this.__label === label) this.__label = null;
      },
    },
    '../form-message/form-message': {
      type: 'descendant',
      linked(message) {
        this.__message = message;
        if (this.data.error) message.__applyError(this.data.error);
      },
      unlinked(message) {
        if (this.__message === message) this.__message = null;
      },
    },
  },
  methods: {
    noop() {},
    /** Called by ll-form (this.data.name is the map key). */
    __setError(msg) {
      msg = msg || '';
      if (msg === this.data.error) return;
      this.setData({ error: msg, hasError: !!msg });
      if (this.__label && this.__label.__applyError) this.__label.__applyError(!!msg);
      if (this.__message && this.__message.__applyError) this.__message.__applyError(msg);
    },
  },
});
