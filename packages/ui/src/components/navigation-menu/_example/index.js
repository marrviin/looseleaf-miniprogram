// ll-navigation-menu demo — mirrors the upstream docs page (#/components/navigation-menu).
// Adapted: panel widths sized to phone (upstream md/lg widths are desktop);
// 50-demo's List/Simple items omitted (hidden md:block upstream, no room on
// phone); the featured card drops the Mascot (not ported).
Page({
  data: {
    // 02 Links only — the current page (active link).
    page: 'Notebooks',
    pages: ['Overview', 'Notebooks', 'Stickers', 'Settings'],
    // 01 — the components panel rows.
    components: [
      ['Alert Dialog', 'A modal dialog that interrupts the user with important content.'],
      ['Hover Card', 'For sighted users to preview content available behind a link.'],
      ['Progress', 'Displays an indicator showing the completion progress of a task.'],
      ['Scroll Area', 'Visually or semantically separates content.'],
      ['Tabs', 'A set of layered sections of content, one displayed at a time.'],
      ['Tooltip', 'A popup that displays information related to an element.'],
    ],
    // 03 — Product / Company link menus.
    items: [
      ['Product', ['Notebooks', 'Stickers', 'Templates']],
      ['Company', ['About', 'Blog', 'Careers']],
    ],
    // 50 — the Components panel rows.
    sixComponents: [
      ['Alert Dialog', 'A modal dialog that interrupts the user with important content and expects a response.'],
      ['Hover Card', 'For sighted users to preview content available behind a link.'],
      ['Progress', 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.'],
      ['Scroll-area', 'Visually or semantically separates content.'],
      ['Tabs', 'A set of layered sections of content—known as tab panels—that are displayed one at a time.'],
      ['Tooltip', 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.'],
    ],
  },
  onNav(_e) {
    // The root announces open/close (e.detail.value); nothing to do here.
  },
  onPage(e) {
    // 02 Links only: strip links report their page via data-page.
    const page = e.currentTarget.dataset.page;
    if (page) this.setData({ page });
  },
});
