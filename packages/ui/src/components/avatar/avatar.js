import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** Upstream `Avatar` — a round box with a hand-drawn loop around it. The loop
    is the avatar-ring recipe drawn at the box's real size; the picture and
    the initials disc come through the slot (ll-avatar-image / ll-avatar-fallback
    / ll-avatar-badge). ring="none" draws no loop (long lists).

    Group layout is CSS-var driven: ll-avatar-group sets --ll-avatar-overlap
    (negative left margin) and --ll-avatar-ring (the card-color ring that cuts
    each face out of the one under it); this root reads both. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'avatar-ring',
    llInkSelector: '.ll-avatar',
    drawn: true,
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ ring: this.data.ring === 'none' ? 'ink' : this.data.ring });
    },
  },
  observers: {
    ring(value) {
      this.setData({ drawn: value !== 'none' });
      this.__inkParams = () => ({ ring: value === 'none' ? 'ink' : value });
      // The ink layer may have just been wx:if'd in — wait for layout.
      setTimeout(() => this.__measureInk(), 60);
    },
  },
});
