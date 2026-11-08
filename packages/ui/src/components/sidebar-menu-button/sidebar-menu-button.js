import { createComponent } from '../../common/component';
import { props, validators } from './props';

const inList = (v, list, fallback) => (list.includes(v) ? v : fallback);

/** Upstream `SidebarMenuButton` — the row's button. Not a menu-row (its own
    layout: the pad's ruling line painted by CSS with an odd/even mask, the
    active/outline mark drawn by the sidebar-mark recipe, and a squaring to
    32px when the pad collapses to icons). Tap bubbles natively — a
    ll-dropdown-menu trigger slot keeps working — and `url` opens the page
    itself (upstream's asChild Link). The `tooltip` prop is accepted for API
    fidelity; the collapsed-strip tooltip has no miniprogram anchor. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    variantCls: 'default',
    sizeCls: 'default',
    marked: false,
    collapsed: false,
    parity: 0,
    llInkRecipe: '',
  },
  observers: {
    'isActive, variant, size'() {
      this.__sync();
    },
  },
  lifetimes: {
    attached() {
      this.__sync();
    },
  },
  methods: {
    __sync() {
      const d = this.data;
      const variant = inList(d.variant, validators.variant, 'default');
      const size = inList(d.size, validators.size, 'default');
      const marked = d.isActive || variant === 'outline';
      this.__inkParams = { active: d.isActive, outline: variant === 'outline' };
      this.setData(
        {
          variantCls: variant,
          sizeCls: size,
          marked,
          llInkRecipe: marked ? 'sidebar-mark' : '',
        },
        () => {
          if (marked) this.__measureInk();
          else this.setData({ inkStyle: '' });
        }
      );
    },
    /** From ll-sidebar-menu-item: collapsed-to-icons flag + row parity. */
    __onItem(ctx) {
      this.setData({ collapsed: !!ctx.collapsed, parity: ctx.parity || 0 });
    },
    onTap() {
      if (this.data.disabled) return;
      if (this.data.url) {
        wx.navigateTo({
          url: this.data.url,
          fail: () => {
            wx.switchTab({ url: this.data.url, fail: () => {} });
          },
        });
      }
    },
  },
});
