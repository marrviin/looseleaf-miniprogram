const SKETCHES = ['Snail on a leaf', 'Teapot, three ways', 'The corner of the desk', 'Rain at 7 a.m.'];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    align: 'center',
    styles: ['bold'],
    bold: true,
    italic: false,
    underline: false,
    view: 'list',
    sketches: SKETCHES,
  },
  methods: {
    noop() {},
    onAlign(e) {
      // single: clicking the on item clears it (value '')
      const v = e.detail.value;
      if (v) this.setData({ align: v });
    },
    onStyles(e) {
      const styles = e.detail.value;
      this.setData({
        styles,
        bold: styles.indexOf('bold') !== -1,
        italic: styles.indexOf('italic') !== -1,
        underline: styles.indexOf('underline') !== -1,
      });
    },
    onView(e) {
      const v = e.detail.value;
      if (v) this.setData({ view: v });
    },
  },
});
