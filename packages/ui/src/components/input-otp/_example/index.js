Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-six-digits
    six: '482',
    // 02-letters-and-invalid: the right code is AB12, it starts on AB13
    code: 'AB13',
    codeWrong: true,
    codeSaid: 'That code does not match. Try again.',
    // 03-verify-your-email
    verify: '',
    verifyState: 'idle', // idle | wrong | done
    verifySaid: 'It expires in ten minutes.',
    // 53-controlled
    ctl: '',
  },
  methods: {
    // every demo otp reports through data-key — one generic handler
    onOtp(e) {
      const key = e.currentTarget.dataset.key;
      if (key) this.setData({ [key]: e.detail.value });
    },
    onOtpCode(e) {
      const v = e.detail.value.toUpperCase();
      const wrong = v.length === 4 && v !== 'AB12';
      this.setData({
        code: v,
        codeWrong: wrong,
        codeSaid: wrong ? 'That code does not match. Try again.' : v === 'AB12' ? 'That is the one.' : 'Four letters or digits.',
      });
    },
    onOtpVerify(e) {
      this.setData({
        verify: e.detail.value,
        verifyState: this.data.verifyState === 'wrong' ? 'idle' : this.data.verifyState,
        verifySaid: this.data.verifyState === 'wrong' ? 'It expires in ten minutes.' : this.data.verifySaid,
      });
    },
    onVerifyComplete(e) {
      this.setData({
        verifyState: e.detail.value === '246810' ? 'done' : 'wrong',
        verifySaid:
          e.detail.value === '246810' ? 'Verified. Welcome to the notebook.' : 'That is not the code. Check the email and try again.',
      });
    },
    onVerifyCheck() {
      const ok = this.data.verify === '246810';
      this.setData({
        verifyState: ok ? 'done' : 'wrong',
        verifySaid: ok ? 'Verified. Welcome to the notebook.' : 'That is not the code. Check the email and try again.',
      });
    },
    onVerifyReset() {
      this.setData({ verify: '', verifyState: 'idle', verifySaid: 'It expires in ten minutes.' });
    },
  },
});
