// ll-sheet demo — mirrors the upstream docs page (#/components/sheet).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-four-sides / 51-side: one sheet instance per edge, toggled by key.
    sides: [
      { side: 'top', open: false },
      { side: 'right', open: false },
      { side: 'bottom', open: false },
      { side: 'left', open: false },
    ],
    bindings: [
      { binding: 'spiral', open: false },
      { binding: 'holes', open: false },
      { binding: 'perf', open: false },
      { binding: 'torn', open: false },
      { binding: 'none', open: false },
    ],
    sideSheets: [
      { side: 'top', open: false },
      { side: 'right', open: false },
      { side: 'bottom', open: false },
      { side: 'left', open: false },
    ],
    shSettings: false,
    shEdit: false,
    shNav: false,
    shDemo: false,
    // 04-navigation links
    links: [
      'Notebooks',
      'Drawings',
      'Recipes',
      'Garden log',
      'Reading list',
      'Field notes',
      'Letters',
      'Postcards',
      'Receipts',
      'Archive',
      'Bin',
    ],
  },
  methods: {
    openSh(e) {
      this.setData({ [e.currentTarget.dataset.k]: true });
    },
    openShAt(e) {
      const { list, idx } = e.currentTarget.dataset;
      this.setData({ [`${list}[${idx}].open`]: true });
    },
    closeSh(e) {
      this.setData({ [e.currentTarget.dataset.k]: false });
    },
    onShChange(e) {
      this.setData({ [e.currentTarget.dataset.k]: e.detail.value });
    },
    closeShItem(e) {
      const sid = e.currentTarget.dataset.sid;
      // The three item lists share indexes; only the opened list's flag is
      // ever true, so clearing all three is a no-op on the others.
      this.setData({
        [`sides[${sid}].open`]: false,
        [`bindings[${sid}].open`]: false,
        [`sideSheets[${sid}].open`]: false,
      });
    },
    onShItemChange(e) {
      // change{value:false} from the x / overlay tap — close the one open list.
      if (!e.detail.value) this.closeShItem(e);
    },
  },
});
