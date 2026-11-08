import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-form — upstream Form (FormProvider) folded to an errors map: the page
    validates and passes { fieldName: message }; every form-item under this
    form reads its field's message and turns its label, message (and the
    wrapped control, via the item's hasError) red pencil. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  observers: {
    errors() {
      setTimeout(() => this.__syncItems(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__items = [];
    },
    detached() {
      this.__items = [];
    },
  },
  relations: {
    '../form-item/form-item': {
      type: 'descendant',
      linked(item) {
        if (!this.__items) this.__items = [];
        if (this.__items.indexOf(item) === -1) this.__items.push(item);
        setTimeout(() => this.__syncItems(), 0);
      },
      unlinked(item) {
        this.__items = (this.__items || []).filter((it) => it !== item);
      },
    },
  },
  methods: {
    noop() {},
    __syncItems() {
      const errors = this.data.errors || {};
      (this.__items || []).forEach((item) => {
        if (item.__setError) item.__setError(errors[item.data.name] || '');
      });
    },
  },
});
