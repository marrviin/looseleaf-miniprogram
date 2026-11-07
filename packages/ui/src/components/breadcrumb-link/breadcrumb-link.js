import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `BreadcrumbLink` — a plain crumb link. WeChat has no pointer
    hover, so the highlighter swipe applies while the finger is down
    (touchstart..touchend), the same wash upstream shows on hover. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    swiped: false,
  },
  methods: {
    onTouchStart() {
      this.setData({ swiped: true });
    },
    onTouchEnd() {
      this.setData({ swiped: false });
    },
    onTap(e) {
      this.triggerEvent('tap', e.detail);
    },
  },
});
