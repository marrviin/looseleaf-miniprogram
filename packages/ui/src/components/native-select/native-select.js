import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-native-select — upstream NativeSelect: the platform's own picker in a
    hand-drawn frame with a drawn chevron. The popup is the system picker
    (mp `picker mode="selector"`), so its typeahead and mobile wheel are the
    platform's own; option groups fold flat because the system list has no
    headers. Events: `change` {value, label, index}, `cancel`. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'native-select',
    llInkSelector: '.ll-native-select',
    items: [],
    range: [],
    index: -1,
    label: '',
    picked: false,
  },
  observers: {
    'options, value, placeholder'() {
      this.__sync();
    },
    'disabled, invalid'() {
      this.__inkParams = () => ({
        disabled: !!this.data.disabled,
        invalid: !!this.data.invalid,
      });
      setTimeout(() => this.__measureInk(), 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({
        disabled: !!this.data.disabled,
        invalid: !!this.data.invalid,
      });
      this.__sync();
      setTimeout(() => this.__measureInk(), 300);
    },
  },
  methods: {
    noop() {},
    __normalize(options) {
      const items = [];
      (options || []).forEach((opt) => {
        if (opt && typeof opt === 'object' && Array.isArray(opt.options)) {
          (opt.options || []).forEach((o) => items.push(this.__one(o)));
        } else {
          items.push(this.__one(opt));
        }
      });
      return items;
    },
    __one(opt) {
      if (opt && typeof opt === 'object') {
        return { label: String(opt.label ?? ''), value: opt.value != null ? String(opt.value) : String(opt.label ?? '') };
      }
      return { label: String(opt ?? ''), value: String(opt ?? '') };
    },
    __sync() {
      const d = this.data;
      const items = this.__normalize(d.options);
      const value = String(d.value ?? d.defaultValue ?? '');
      let index = items.findIndex((it) => it.value === value);
      // the empty first option (the placeholder option) reads as unpicked
      const picked = index >= 0 && items[index].value !== '';
      this.setData({
        items,
        range: items.map((it) => it.label),
        index: picked ? index : -1,
        label: picked ? items[index].label : d.placeholder || (index >= 0 ? items[index].label : ''),
        picked,
      });
    },
    onChange(e) {
      const i = Number(e.detail.value);
      const item = this.data.items[i];
      if (!item) return;
      const picked = item.value !== '';
      this.setData({ value: item.value, index: picked ? i : -1, label: picked ? item.label : this.data.placeholder || item.label, picked });
      this.triggerEvent('change', { value: item.value, label: item.label, index: i });
    },
    onCancel() {
      this.triggerEvent('cancel', {});
    },
  },
});
