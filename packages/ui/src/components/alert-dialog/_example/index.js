// ll-alert-dialog demo — mirrors the upstream docs page (#/components/alert-dialog).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // One flag per dialog; triggers are plain ll-buttons that flip them.
    dlgDelete: false,
    dlgDiscard: false,
    dlgPublish: false,
    dlgSignout: false,
    dlgClear: false,
    dlgAsync: false,
    dlgSure: false,
    // 04-async-delete (controlled): the action keeps the sheet up while it
    // works, then the page closes it and reports the result.
    busy: false,
    gone: false,
    goneText: 'Nothing deleted yet.',
  },
  methods: {
    openDlg(e) {
      this.setData({ [e.currentTarget.dataset.k]: true });
    },
    onDlgChange(e) {
      this.setData({ [e.currentTarget.dataset.k]: e.detail.value });
    },
    // The async action asked to stay open (keep-open); do the work here.
    onAsyncDelete() {
      if (this.data.busy) return;
      this.setData({ busy: true });
      setTimeout(() => {
        this.setData({
          busy: false,
          gone: true,
          goneText: 'The project was deleted.',
          dlgAsync: false,
        });
      }, 900);
    },
  },
});
