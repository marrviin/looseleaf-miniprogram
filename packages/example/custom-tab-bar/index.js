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
      // unconditional: a tap on this instance already moved ll-tabs'
      // internal current — same-value setData still fires the observer,
      // which re-adopts the route's key and re-syncs every trigger.
      this.setData({ selected: cur2.key });
    },
    // ll-tabs change → switchTab; the destination page's onShow → sync()
    // re-highlights from the route (each tab page owns a bar instance).
    onTabsChange(e) {
      const t = this.data.tabs.find((t) => t.key === e.detail.value);
      if (t) wx.switchTab({ url: t.url });
    },
  },
});
