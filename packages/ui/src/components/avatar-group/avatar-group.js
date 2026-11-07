import { createComponent } from '../../common/component';
import { props } from './props';

// Upstream overlap: *+* gets -ms-1.5 (-6px), size-tuned to -4/-6/-8/-14px.
// We apply the margin to every child via the --ll-avatar-overlap var and
// compensate with an equal positive margin on the container, so the first
// face lands where upstream puts it.
const OVERLAP_PX = { sm: 4, default: 6, lg: 8, xl: 14 };

/** Upstream `AvatarGroup` — overlaps its faces; the card-color CUT ring on
    each avatar cuts it out of the one under it.

    Miniprogram deviation: WeChat has no *+* sibling selector across component
    boundaries, so the group takes a `size` prop (matching its avatars') and
    publishes two CSS vars the avatars read:
      --ll-avatar-overlap  the negative left margin (every child; the
                           container's positive margin re-aligns the first)
      --ll-avatar-ring     the cut-out color: --ll-avatar-group-ring when set
                           on the surface the group sits on, else the card
                           color (#f8f5ee — baked light-theme --card) */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    groupStyle: '',
  },
  lifetimes: {
    attached() {
      this.__apply();
    },
  },
  observers: {
    size() {
      this.__apply();
    },
  },
  methods: {
    __apply() {
      const ov = OVERLAP_PX[this.data.size] ?? 6;
      this.setData({
        groupStyle:
          `--ll-avatar-overlap:-${ov}px;` +
          '--ll-avatar-ring:var(--ll-avatar-group-ring, #f8f5ee);' +
          `margin-left:${ov}px;`,
      });
    },
  },
});
