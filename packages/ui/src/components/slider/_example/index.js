// ll-slider demo — mirrors the upstream docs page (#/components/slider).
// Labels are plain text (WeChat has no htmlFor association); getValueText
// (a function prop) has no miniprogram equivalent.
const INITIAL = { size: 12, opacity: 85, hardness: 40 };

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-default
    volume: 60,
    // 02-range: price is controlled; the tone sliders are uncontrolled
    price: [200, 650],
    // 03-vertical: ["60",40] … the last fader disabled
    bands: [
      { hz: '60', v: 40, disabled: false },
      { hz: '230', v: 65, disabled: false },
      { hz: '910', v: 50, disabled: false },
      { hz: '3k', v: 80, disabled: false },
      { hz: '14k', v: 30, disabled: true },
    ],
    // 04-brush-settings
    brush: { ...INITIAL },
  },
  methods: {
    onVolume(e) {
      this.setData({ volume: e.detail.value[0] });
    },
    onPrice(e) {
      this.setData({ price: e.detail.value });
    },
    onBrushSize(e) {
      this.setData({ 'brush.size': e.detail.value[0] });
    },
    onBrushOpacity(e) {
      this.setData({ 'brush.opacity': e.detail.value[0] });
    },
    onBrushHardness(e) {
      this.setData({ 'brush.hardness': e.detail.value[0] });
    },
    onBrushReset() {
      this.setData({ brush: { ...INITIAL } });
    },
  },
});
