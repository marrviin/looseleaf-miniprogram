// ll-sidebar demo — mirrors the upstream docs page (#/components/sidebar).
// Upstream examples run their pads inside fixed-height frames with the pad
// viewport-fixed and the frame clipping it; a miniprogram frame can't
// contain a fixed element, so every demo pad renders docked via the
// `static` escape hatch and the provider fills the frame's height.
// The real phone behavior (the pad in a Sheet) is what the component does
// without `static` — the docs-site index page uses it that way.
import { ensureHandFont } from '../../../common/hand-font';

ensureHandFont();

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// 04-search-and-loading — 40 notebooks, no drawing per row
const SEARCH_BASE = ['Field notes', 'Garden log', 'Recipes', 'Trip to Lisbon', 'Sketches', 'Reading list', 'Letters', 'Budget'];
const ALL = Array.from({ length: 40 }, (_, i) => `${SEARCH_BASE[i % SEARCH_BASE.length]}${i >= SEARCH_BASE.length ? ` ${Math.floor(i / SEARCH_BASE.length) + 1}` : ''}`);

// 57/58 — the original's table-of-contents data
const TOC = [
  { title: 'Getting Started', items: ['Installation', 'Project Structure'] },
  {
    title: 'Build Your Application',
    items: ['Routing', 'Data Fetching', 'Rendering', 'Caching', 'Styling', 'Optimizing', 'Configuring', 'Testing', 'Authentication', 'Deploying', 'Upgrading', 'Examples'],
  },
  { title: 'API Reference', items: ['Components', 'File Conventions', 'Functions', 'next.config.js Options', 'CLI', 'Edge Runtime'] },
  { title: 'Architecture', items: ['Accessibility', 'Fast Refresh', 'Next.js Compiler', 'Supported Browsers', 'Turbopack'] },
];
const tocWithSlugs = TOC.map((g) => ({ ...g, slug: slug(g.title), items: g.items.map((t) => ({ title: t, slug: slug(t) })) }));

const PROJECTS_59 = ['Design Engineering', 'Sales & Marketing', 'Travel', 'Support', 'Feedback'];

// 55 / 56 rows — precomputed (WXML expressions can't call .split())
const MENU_PROJECTS = [
  { icon: 'frame', name: 'Design Engineering' },
  { icon: 'chart-pie', name: 'Sales & Marketing' },
  { icon: 'map', name: 'Travel' },
  { icon: 'life-buoy', name: 'Support' },
  { icon: 'send', name: 'Feedback' },
];
const ACTION_ROWS = MENU_PROJECTS.slice(0, 3);
const BADGE_ROWS = [
  { icon: 'life-buoy', name: 'Support', badge: '21' },
  { icon: 'send', name: 'Feedback', badge: '8' },
  { icon: 'map', name: 'Travel', badge: '3' },
];

Component({
  data: {
    menuProjects: MENU_PROJECTS,
    actionRows: ACTION_ROWS,
    badgeRows: BADGE_ROWS,

    // 02 — collapse to icons
    iconsOpen: true,
    iconsCurrent: 'Inbox',
    iconsItems: [
      { title: 'Inbox', icon: 'inbox', count: '3' },
      { title: 'Calendar', icon: 'calendar' },
      { title: 'Search', icon: 'search' },
      { title: 'Settings', icon: 'settings' },
    ],

    // 03 — variants and sides
    variant: 'floating',
    side: 'left',
    variantItems: [
      ['Overview', 'layout-dashboard'],
      ['Reports', 'chart-column'],
      ['Team', 'users'],
      ['Billing', 'credit-card'],
    ],

    // 04 — search and loading
    q: '',
    searchLoading: false,
    searchCurrent: ALL[0],
    searchExtra: [],
    searchNames: ALL,
    searchAll: ALL,

    // 57 — menu sub (always open) / 58 — menu collapsible
    toc: tocWithSlugs,
    tocActive: 'Data Fetching',

    // 59 — controlled and loading
    ctrlOpen: true,
    ctrlLoaded: false,
    ctrlRound: 0,
    ctrlProjects: PROJECTS_59,
    ctrlIcons: ['frame', 'chart-pie', 'map', 'life-buoy', 'send'],

    // dropdown pick echo
    picked: '',
  },
  lifetimes: {
    attached() {
      this.__searchFilter();
      this.__startLoad();
    },
    detached() {
      if (this.__loadTimer) clearTimeout(this.__loadTimer);
    },
  },
  methods: {
    // 02 — collapse to icons
    onIconsChange(e) {
      const open = e.detail.openMobile !== undefined ? e.detail.openMobile : e.detail.open;
      this.setData({ iconsOpen: open });
    },
    onIconsPick(e) {
      this.setData({ iconsCurrent: e.currentTarget.dataset.title });
    },

    // 03 — variants and sides
    onVariant(e) {
      if (e.detail.value) this.setData({ variant: e.detail.value });
    },
    onSide(e) {
      if (e.detail.value) this.setData({ side: e.detail.value });
    },

    // 04 — search and loading
    onSearchInput(e) {
      this.setData({ q: e.detail.value }, () => this.__searchFilter());
    },
    __searchFilter() {
      const { q, searchAll, searchExtra } = this.data;
      const names = [...searchExtra, ...searchAll].filter((n) => n.toLowerCase().includes(q.trim().toLowerCase()));
      this.setData({ searchNames: names });
    },
    onAddNotebook() {
      const extra = [`Untitled ${this.data.searchExtra.length + 1}`, ...this.data.searchExtra];
      this.setData({ searchExtra: extra }, () => this.__searchFilter());
    },
    onPickNotebook(e) {
      this.setData({ searchCurrent: e.currentTarget.dataset.name });
    },
    onSearchReload() {
      if (this.data.searchLoading) return;
      this.setData({ searchLoading: true });
      this.__searchTimer = setTimeout(() => this.setData({ searchLoading: false }), 1400);
    },

    // 54 — group action posts a toast
    onGroupAction() {
      const t = this.selectComponent('#t-group-action');
      if (t) t.toast('You clicked the group action!');
    },

    // 59 — controlled provider + loading
    onCtrlChange(e) {
      const open = e.detail.openMobile !== undefined ? e.detail.openMobile : e.detail.open;
      this.setData({ ctrlOpen: open });
    },
    onCtrlToggle() {
      const p = this.selectComponent('#provider-59');
      if (p) p.__toggle();
    },
    __startLoad() {
      this.setData({ ctrlLoaded: false });
      if (this.__loadTimer) clearTimeout(this.__loadTimer);
      this.__loadTimer = setTimeout(() => this.setData({ ctrlLoaded: true }), 2000);
    },
    onCtrlReload() {
      if (!this.data.ctrlLoaded) return;
      this.setData({ ctrlRound: this.data.ctrlRound + 1 }, () => this.__startLoad());
    },

    // dropdown echo
    onPick(e) {
      this.setData({ picked: e.detail && e.detail.value !== undefined ? e.detail.value : e.currentTarget.dataset.name || '' });
    },
  },
});
