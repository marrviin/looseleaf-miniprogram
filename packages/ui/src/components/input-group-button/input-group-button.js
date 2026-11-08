import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-input-group-button — upstream InputGroupButton: a Button for an
    addon, ghost xs by default (24px) with sm/icon-xs/icon-sm steps. A thin
    wrapper over ll-button so the addon defaults hold; the tap is
    re-triggered (ll-button's own tap doesn't bubble). Put it inside an
    InputGroupAddon — a disabled button directly in the group would not
    look disabled, the addon keeps the box alive. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  methods: {
    onTap(e) {
      this.triggerEvent('tap', e.detail);
    },
    onGetUserInfo(e) {
      this.triggerEvent('getuserinfo', e.detail);
    },
    onContact(e) {
      this.triggerEvent('contact', e.detail);
    },
    onError(e) {
      this.triggerEvent('error', e.detail);
    },
  },
});
