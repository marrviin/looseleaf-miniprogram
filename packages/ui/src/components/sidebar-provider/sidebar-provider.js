import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `SidebarProvider` — the context root. Owns the open state
    (persisted to a `sidebar_state`-named storage key, the cookie's stand-in),
    the phone sheet's state and the 768px isMobile breakpoint (upstream
    useIsMobile). Children — ll-sidebar, ll-sidebar-trigger, ll-sidebar-inset,
    ll-sidebar-rail — register through the descendant relation and receive the
    context on every change; the trigger and rail call back via __toggle().
    The Ctrl/Cmd+B shortcut upstream has no keyboard here. */
const SIDEBAR_KEY = 'll-sidebar-state';

function isMobileNow() {
  try {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    return (info.windowWidth || 375) < 768;
  } catch (e) {
    return true;
  }
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    isMobile: true,
    openMobile: false,
    effOpen: true,
    state: 'expanded',
    variant: 'sidebar',
    side: 'left',
  },
  relations: {
    '../sidebar/sidebar': {
      type: 'descendant',
      linked(child) {
        (this.__sides = this.__sides || []).push(child);
        child.__onProvider && child.__onProvider(this.__ctx(child));
      },
      unlinked(child) {
        this.__sides = (this.__sides || []).filter((c) => c !== child);
      },
    },
    '../sidebar-trigger/sidebar-trigger': {
      type: 'descendant',
      linked(child) {
        (this.__triggers = this.__triggers || []).push(child);
        child.__onProvider && child.__onProvider(this.__ctx());
      },
      unlinked(child) {
        this.__triggers = (this.__triggers || []).filter((c) => c !== child);
      },
    },
    '../sidebar-inset/sidebar-inset': {
      type: 'descendant',
      linked(child) {
        (this.__insets = this.__insets || []).push(child);
        child.__onProvider && child.__onProvider(this.__ctx());
      },
      unlinked(child) {
        this.__insets = (this.__insets || []).filter((c) => c !== child);
      },
    },
    '../sidebar-rail/sidebar-rail': {
      type: 'descendant',
      linked(child) {
        (this.__rails = this.__rails || []).push(child);
        child.__onProvider && child.__onProvider(this.__ctx());
      },
      unlinked(child) {
        this.__rails = (this.__rails || []).filter((c) => c !== child);
      },
    },
  },
  lifetimes: {
    attached() {
      const stored = (() => {
        try {
          return wx.getStorageSync(SIDEBAR_KEY);
        } catch (e) {
          return '';
        }
      })();
      const initial =
        this.data.open !== null ? this.data.open : stored === '' ? this.data.defaultOpen : stored === true || stored === 'true';
      this.setData({ isMobile: isMobileNow(), effOpen: !!initial, state: initial ? 'expanded' : 'collapsed' });
      setTimeout(() => this.__push(), 0);
    },
  },
  observers: {
    open(v) {
      if (v === null || v === this.data.effOpen) return;
      this.__applyOpen(!!v, false);
    },
  },
  methods: {
    /** Context for the children; a sidebar passes itself in so the provider
        can mirror its variant/side over to the insets (the peer-data bridge). */
    __ctx(fromSidebar) {
      const d = this.data;
      const variant = fromSidebar ? fromSidebar.data.variant : d.variant;
      const side = fromSidebar ? fromSidebar.data.side : d.side;
      return { ...d, variant, side, root: this };
    },
    __push() {
      (this.__sides || []).forEach((c) => c.__onProvider && c.__onProvider(this.__ctx(c)));
      [...(this.__triggers || []), ...(this.__insets || []), ...(this.__rails || [])].forEach((c) =>
        c.__onProvider && c.__onProvider(this.__ctx())
      );
    },
    __applyOpen(v, persist = true) {
      if (persist) {
        try {
          wx.setStorageSync(SIDEBAR_KEY, v);
        } catch (e) {
          /* storage full — state still applies for the session */
        }
      }
      this.setData({ effOpen: v, state: v ? 'expanded' : 'collapsed' });
      this.__push();
      this.triggerEvent('change', { open: v });
    },
    /** ll-sidebar reports its variant/side so insets can restyle (inset
        variant turns the page into a sheet from md up). */
    __reportSidebar(variant, side) {
      if (variant !== this.data.variant || side !== this.data.side) {
        this.setData({ variant, side });
        setTimeout(() => this.__push(), 0);
      }
    },
    __toggle() {
      if (this.data.isMobile) this.__setOpenMobile(!this.data.openMobile);
      else this.__setOpen(!this.data.effOpen);
    },
    __setOpen(v) {
      if (this.data.open !== null && v !== this.data.open) {
        // controlled: the observer adopts it after the parent re-renders;
        // push optimistically so the pad moves at once
        this.setData({ effOpen: v, state: v ? 'expanded' : 'collapsed' });
        this.__push();
        this.triggerEvent('change', { open: v });
        return;
      }
      this.__applyOpen(v);
    },
    __setOpenMobile(v) {
      this.setData({ openMobile: v });
      this.__push();
      this.triggerEvent('change', { openMobile: v });
    },
  },
});
