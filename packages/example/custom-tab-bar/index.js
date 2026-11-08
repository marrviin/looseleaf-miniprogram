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
      // Route already mirrored: usually skip — every setData push costs a
      // full trigger re-sync. BUT each tab page owns its own bar instance,
      // and the in-bar tap that navigated AWAY from here moved THIS
      // instance's ll-tabs internal current (and its self-set value prop)
      // to the tapped key. Returning while current is stale paints the
      // wrong highlight (Home → tap About → tap Home: bar shows About).
      // __tapped remembers that key — undefined/null = nothing to heal.
      if (cur2.key === this.data.selected && (!this.__tapped || this.__tapped === cur2.key)) return;
      this.__tapped = null;
      if (cur2.key === this.data.selected) {
        // Stale-but-matching: ll-tabs' value prop was self-set to the
        // tapped-away key, and a same-value setData from here never
        // re-pushes the prop — the bound attribute is unchanged in the
        // vdom, so the framework skips the update and the value observer
        // stays silent. Force two REAL value changes instead: '' then the
        // route key. The '' push skips adoption in the observer (falsy
        // next → current untouched), so nothing repaints between the two
        // syncs — no flash, then the second push re-adopts the route key.
        this.setData({ selected: '' });
        setTimeout(() => this.setData({ selected: cur2.key }), 0);
        return;
      }
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
