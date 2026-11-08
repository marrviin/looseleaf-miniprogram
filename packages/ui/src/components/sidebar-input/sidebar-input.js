import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-sidebar-input — upstream `SidebarInput`: an Input sized for the pad
    (32px). Value changes re-emit `input` so the owner can filter. */
createComponent({
  options: { styleIsolation: 'isolated', virtualHost: true },
  properties: props,
  methods: {
    onInput(e) {
      this.triggerEvent('input', { value: e.detail.value });
    },
  },
});
