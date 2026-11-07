Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // File path tree (example 4).
    tree: {
      Notebooks: ['Field notes', 'Garden', 'Recipes'],
      'Field notes': ['2026', '2025'],
      2026: ['March', 'April'],
      March: ['Week 1', 'Week 2'],
      Garden: ['Beds', 'Seeds'],
      Recipes: ['Soups', 'Bread'],
    },
    here: 'March',
    shown: [],
    hidden: [],
    folders: [],
    // File path (composed): the crumbs are the folders you have opened.
    path: ['Notebooks', 'Field notes', '2026', 'March'],
    foldersOpen: false,
    menuOpen: false,
    respOpen: false,
    // With your router's Link: the trail is built from the path.
    route: '/docs/components/breadcrumb',
    titles: { docs: 'Docs', components: 'Components', breadcrumb: 'Breadcrumb', button: 'Button', card: 'Card', calendar: 'Calendar' },
    routeTrail: [],
  },
  lifetimes: {
    attached() {
      this.__applyPath();
      this.__applyRoute();
    },
  },
  methods: {
    /** File path: walk up to the clicked crumb. */
    goUp(e) {
      const p = this.data.path.slice(0, Number(e.currentTarget.dataset.at) + 1);
      this.setData({ path: p });
      this.__applyPath(p);
    },
    /** File path: open a folder below the current one. */
    openFolder(e) {
      const p = [...this.data.path, e.currentTarget.dataset.name];
      this.setData({ path: p });
      this.__applyPath(p);
    },
    /** File path: fold the middle of a path longer than four names. */
    __applyPath(pathIn) {
      const path = pathIn ?? this.data.path;
      const here = path[path.length - 1];
      const folded = path.length > 4;
      const shown = folded ? [path[0], ...path.slice(-2)] : path;
      const hidden = folded ? path.slice(1, -2) : [];
      this.setData({
        path,
        here,
        shown: shown.map((name) => ({
          name,
          at: path.indexOf(name),
          last: shown.indexOf(name) === shown.length - 1,
        })),
        hidden,
        folders: this.data.tree[here] ?? [],
      });
    },
    onFoldersChange(e) {
      this.setData({ foldersOpen: e.detail.open });
    },
    onMenuChange(e) {
      this.setData({ menuOpen: e.detail.open });
    },
    onRespChange(e) {
      this.setData({ respOpen: e.detail.open });
    },
    /** Router link stand-in: rewrite the path. */
    goRoute(e) {
      this.setData({ route: e.currentTarget.dataset.route });
      this.__applyRoute();
    },
    __applyRoute() {
      const parts = this.data.route.split('/').filter(Boolean);
      const trail = [{ href: '/', title: 'Home' }].concat(
        parts.map((p, i) => ({ href: '/' + parts.slice(0, i + 1).join('/'), title: this.data.titles[p] ?? p }))
      );
      this.setData({ routeTrail: trail });
    },
  },
});
