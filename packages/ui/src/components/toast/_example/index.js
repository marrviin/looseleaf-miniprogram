// ll-toast demo — mirrors the upstream docs page (#/components/sonner).
// Upstream imports the module-level toast(); here each example's toaster is
// a selectComponent handle (pages can't require package subpaths), and the
// method names match sonner's API.
const T = (comp, sel) => comp.selectComponent(sel);

const save = (ok) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (ok ? resolve({ name: 'Field notes' }) : reject(new Error('offline'))), 1800),
  );

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-types
    // 02-promise
    // 03-undo
    notes: ['Rain from six.', 'Tea, two cups.', 'Long letter to Ada.'],
    // 04-positions-and-fasteners
    positions: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    decorations: ['none', 'tape', 'pin'],
    pos: 'bottom-right',
    deco: 'tape',
  },
  methods: {
    // 50-demo
    showDemo() {
      const t = T(this, '#t-demo');
      t.toast('Event has been created', {
        description: 'Sunday, December 03, 2023 at 9:00 AM',
        action: {
          label: 'Undo',
          onClick: () => t.toast('Event removed'),
        },
      });
    },

    // 01-types
    showType(e) {
      const t = T(this, '#t-types');
      const k = e.currentTarget.dataset.k;
      if (k === 'default') t.toast('Event created', { description: 'Saturday, 10:00 am' });
      if (k === 'success') t.success('Notebook saved', { description: 'All 48 pages are safe.' });
      if (k === 'error') t.error('Could not sync', { description: 'You are offline. We will try again.' });
      if (k === 'warning') t.warning('Storage almost full', { description: '92% of your 1 GB is used.' });
      if (k === 'info') t.info('A new version is ready');
      if (k === 'loading') t.loading('Uploading photo…', { description: 'IMG_2043.jpg' });
    },

    // 02-promise
    saveOk() {
      T(this, '#t-promise').promise(() => save(true), {
        loading: 'Saving notebook…',
        success: (data) => `${data.name} saved`,
        error: 'Could not save',
      });
    },
    saveFail() {
      T(this, '#t-promise').promise(() => save(false), {
        loading: 'Saving notebook…',
        success: 'Saved',
        error: (e) => `Could not save: ${e.message}`,
      });
    },

    // 03-undo
    removeNote(e) {
      const i = Number(e.currentTarget.dataset.i);
      const gone = this.data.notes[i];
      const notes = this.data.notes.filter((_, k) => k !== i);
      this.setData({ notes });
      const t = T(this, '#t-undo');
      t.toast('Note deleted', {
        description: `"${gone}"`,
        duration: 6000,
        action: {
          label: 'Undo',
          onClick: () => {
            const restored = [...this.data.notes];
            restored.splice(i, 0, gone);
            this.setData({ notes: restored });
          },
        },
        cancel: { label: 'Dismiss', onClick: () => {} },
      });
    },

    // 04-positions-and-fasteners
    setPos(e) {
      this.setData({ pos: e.currentTarget.dataset.p });
    },
    setDeco(e) {
      this.setData({ deco: e.currentTarget.dataset.d });
    },
    showPositioned() {
      const { pos, deco } = this.data;
      T(this, '#t-positions').success('Copied to clipboard', { description: `${pos}, ${deco}` });
    },
  },
});
