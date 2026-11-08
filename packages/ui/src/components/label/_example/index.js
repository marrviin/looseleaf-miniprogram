Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    termsOn: false,
  },
  methods: {
    onTerms(e) {
      this.setData({ termsOn: !!e.detail.value });
    },
  },
});
