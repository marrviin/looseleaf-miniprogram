const autoModes = ['Auto', 'Agent', 'Manual'];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    autoModes,
    // 02-buttons-and-states
    copied: false,
    // 03-comment-box
    reply: '',
    replySaid: '',
    // 04-newsletter
    newsEmail: '',
    newsState: 'idle', // idle | bad | ok
    newsSaid: 'No spam, and you can leave with one click.',
    // controlled overlays (automation opens them via these flags)
    tipInfo: false,
    tipHelp: false,
    tipPw: false,
    tipNotif: false,
    tipApi: false,
    popConn: false,
    ddAuto: false,
    ddMore: false,
    ddIn: false,
    autoPick: 'Auto',
    // 54-buttons
    profileCopied: false,
    fav: false,
  },
  methods: {
    onField(e) {
      const key = e.currentTarget.dataset.key;
      if (key) this.setData({ [key]: e.detail.value });
      if (key === 'newsEmail' && this.data.newsState !== 'idle') {
        this.setData({ newsState: 'idle', newsSaid: 'No spam, and you can leave with one click.' });
      }
    },
    onCopyLink() {
      this.setData({ copied: true });
      setTimeout(() => this.setData({ copied: false }), 2000);
    },
    onReply(e) {
      this.setData({ reply: e.detail.value });
    },
    onSendReply() {
      if (!this.data.reply.trim()) return;
      this.setData({ replySaid: `Sent to Ada: ${this.data.reply}` });
    },
    onSubscribe() {
      const ok = /^\S+@\S+\.\S+$/.test(this.data.newsEmail);
      this.setData({
        newsState: ok ? 'ok' : 'bad',
        newsSaid: ok ? 'Thank you. Watch your inbox.' : 'That does not look like an address.',
      });
    },
    // controlled overlays
    onTipInfo(e) {
      this.setData({ tipInfo: e.detail.value });
    },
    onTipHelp(e) {
      this.setData({ tipHelp: e.detail.value });
    },
    onTipPw(e) {
      this.setData({ tipPw: e.detail.value });
    },
    onTipNotif(e) {
      this.setData({ tipNotif: e.detail.value });
    },
    onTipApi(e) {
      this.setData({ tipApi: e.detail.value });
    },
    onPopConnChange(e) {
      this.setData({ popConn: e.detail.value });
    },
    onDdAutoChange(e) {
      this.setData({ ddAuto: e.detail.value });
    },
    onDdAuto() {
      this.setData({ ddAuto: !this.data.ddAuto });
    },
    onAutoPick(e) {
      this.setData({ autoPick: e.currentTarget.dataset.mode, ddAuto: false });
    },
    onDdMoreChange(e) {
      this.setData({ ddMore: e.detail.value });
    },
    onDdInChange(e) {
      this.setData({ ddIn: e.detail.value });
    },
    onCopyProfile() {
      this.setData({ profileCopied: true });
      setTimeout(() => this.setData({ profileCopied: false }), 2000);
    },
    onStar() {
      this.setData({ fav: !this.data.fav });
    },
  },
});
