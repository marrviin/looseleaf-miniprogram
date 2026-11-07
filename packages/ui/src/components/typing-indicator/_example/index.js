// ll-typing-indicator demo — mirrors the upstream docs page
// (#/components/typing-indicator). 02/03 put the indicator in Bubble /
// Message, which are not ported yet, so the active toggle is shown in a
// plain box instead; the toggle itself works the same (active, not
// display:none, so the region stays announced).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    typing: true,
  },
  methods: {
    onToggle() {
      this.setData({ typing: !this.data.typing });
    },
  },
});
