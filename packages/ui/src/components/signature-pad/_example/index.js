// ll-signature-pad demo — the page owns the agreement form's validation.
Page({
  data: {
    said: 'Unsigned.',
    typeSaid: 'Unsigned.',
    agreed: false,
    agreeSaid: 'Unsigned.',
    formInvalid: false,
    sent: 'Not sent yet',
  },
  onSaid(e) {
    this.setData({ said: this.describe(e.detail) });
  },
  onTypeSaid(e) {
    this.setData({ typeSaid: this.describe(e.detail) });
  },
  describe(d) {
    if (!d || !d.value) return 'Unsigned.';
    return `${d.mode === 'type' ? 'Typed' : 'Drawn'} signature — ${d.value.length} characters of image.`;
  },
  onAgree(e) {
    this.setData({ agreed: !!(e.detail && e.detail.checked) });
  },
  onAgreeChange(e) {
    const patch = {};
    if (e.detail && e.detail.value) patch.formInvalid = false;
    patch.agreeSaid = this.describe(e.detail);
    this.setData(patch);
  },
  onSubmit() {
    const sig = this.selectComponent('#agree-sig');
    const v = sig ? sig.signature() : '';
    if (!v || !this.data.agreed) {
      this.setData({ formInvalid: !v, sent: 'Not sent yet' });
      return;
    }
    this.setData({ formInvalid: false, sent: `${v.length} characters of image` });
  },
});
