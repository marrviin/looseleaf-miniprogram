// ll-dialog demo — mirrors the upstream docs page (#/components/dialog).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    dlgEdit: false,
    dlgKraft: false,
    dlgTorn: false,
    dlgSticky: false,
    dlgTerms: false,
    dlgInvite: false,
    dlgShare: false,
    // 03-long-content clauses
    clauses: [
      'You may keep this notebook as long as you like, and write in it in any color.',
      'Pages torn out belong to whoever holds them; margins belong to the reader.',
      'Doodles are protected speech. Coffee rings are an acceptable form of signature.',
      'If you find a pencil stub in the binding, it is yours, and it was always yours.',
      'We will never sell your handwriting. We could not read it either.',
      'By turning the page you agree to turn the next one, if there is a next one.',
      'Erasers are provided as a courtesy and may be worn down to nothing without notice.',
      'A drawing of a cat counts as a drawing of any cat, and the cat may object.',
      'Ink that bleeds through belongs to the page behind it.',
      'If the notebook is lost, it is not lost: it is simply somewhere else, being written in.',
    ],
    // 04-invite-teammate (controlled)
    inviteEmail: '',
    invited: [],
    invitedText: 'Nobody invited yet.',
  },
  methods: {
    openDlg(e) {
      this.setData({ [e.currentTarget.dataset.k]: true });
    },
    closeDlg(e) {
      this.setData({ [e.currentTarget.dataset.k]: false });
    },
    onDlgChange(e) {
      this.setData({ [e.currentTarget.dataset.k]: e.detail.value });
    },
    onInviteEmail(e) {
      this.setData({ inviteEmail: e.detail.value });
    },
    onInviteSubmit() {
      const email = (this.data.inviteEmail || '').trim();
      if (!email) return;
      const invited = [...this.data.invited, email];
      this.setData({
        invited,
        invitedText: `Invited: ${invited.join(', ')}`,
        inviteEmail: '',
        dlgInvite: false,
      });
    },
  },
});
