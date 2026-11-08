// Tab defs mirror app.json's tabBar.list; highlight follows the route so
// every tab page just calls getTabBar().sync() in onShow.
const TABS = [{"key":"home","icon":"layout-grid","text":"Components","url":"/pages/index/index"},{"key":"about","icon":"info","text":"About","url":"/pages/about/index"}];

Component({
  data: { tabs: TABS, selected: 'home' },
  lifetimes: {
    attached() {
      // each tab page owns a bar instance — start it from the real route
      // so it never paints the wrong highlight before the first onShow
      this.sync();
    },
  },
  methods: {
    sync() {
      const pages = getCurrentPages();
      const cur = pages[pages.length - 1];
      if (!cur) return;
      const cur2 = this.data.tabs.find((t) => t.url === '/' + cur.route);
      if (!cur2) return;
      // Route already mirrored: usually skip — a same-value setData still
      // fires ll-tabs' value observer → full trigger re-sync → every
      // trigger re-applies its ink layer (the redundant second sync a tap
      // triggers). BUT each tab page owns its own bar instance, and the
      // in-bar tap that navigated AWAY from here moved THIS instance's
      // ll-tabs internal current off its route (selected never followed).
      // Returning while current is stale paints the wrong highlight on
      // the way back (Home → tap About → tap Home: bar shows About).
      // Only an early return is safe when ll-tabs still agrees.
      if (cur2.key === this.data.selected && this.__tapped !== cur2.key) return;
      // Same-value setData is fine here: ll-tabs' value observer adopts
      // its stale internal current back from the value prop, and the
      // re-sync only restacks already-cached ink URIs (no re-draw).
      this.__tapped = null;
      this.setData({ selected: cur2.key });
    },
    // ll-tabs change → switchTab; the destination page's onShow → sync()
    // re-highlights from the route (each tab page owns a bar instance).
    // Remember the tapped key: it moved this instance's internal current,
    // so sync() knows a same-value re-adopt is needed to undo it.
    onTabsChange(e) {
      this.__tapped = e.detail.value;
      const t = this.data.tabs.find((t) => t.key === e.detail.value);
      if (t) wx.switchTab({ url: t.url });
    },
  },
});
