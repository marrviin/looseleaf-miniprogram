import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `RadioGroup` (radix Root) — a radiogroup container that owns the
    value. Radios register through the descendant relation; a value change
    (tap or property) syncs every child's checked/disabled/invalid state. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../radio/radio': {
      type: 'descendant',
      linked(child) {
        (this.__radios = this.__radios || []).push(child);
      },
      unlinked(child) {
        this.__radios = (this.__radios || []).filter((c) => c !== child);
      },
    },
  },
  observers: {
    'value, disabled, invalid'() {
      setTimeout(() => this.__sync(), 0);
    },
  },
  lifetimes: {
    attached() {
      setTimeout(() => this.__sync(), 0);
    },
  },
  methods: {
    __sync() {
      (this.__radios || []).forEach((r) => r.__onGroup(this.data));
    },
    /** A radio was tapped: adopt its value, announce it. */
    __onRadioTap(value) {
      if (this.data.disabled || value === this.data.value) return;
      this.setData({ value });
      this.triggerEvent('change', { value });
    },
  },
});
