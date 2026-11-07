// ll-annotate demo — mirrors the upstream docs page (#/components/annotate).
// The playground omits the (not yet ported) callout/tally margin notes.
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-playground: switch each mark on and off, replay the whole page.
    on: { circle: true, highlight: true, underline: true, strike: true, wavy: true },
    marks: ['circle', 'highlight', 'underline', 'strike', 'wavy'],
    labels: { circle: 'Circle', highlight: 'Highlight', underline: 'Underline', strike: 'Strike', wavy: 'Wavy line' },
    // 02-every-type
    types: [
      { type: 'highlight', word: 'swipe' },
      { type: 'underline', word: 'line' },
      { type: 'circle', word: 'loop' },
      { type: 'box', word: 'box' },
      { type: 'brackets', word: 'brackets' },
      { type: 'strike-through', word: 'struck' },
      { type: 'crossed-off', word: 'crossed off' },
      { type: 'scribble', word: 'scribbled' },
    ],
  },
  methods: {
    onToggle(e) {
      const key = e.currentTarget.dataset.key;
      this.setData({ [`on.${key}`]: !this.data.on[key] });
    },
    onReplay() {
      this.setData({ on: { circle: false, highlight: false, underline: false, strike: false, wavy: false } });
      setTimeout(() => this.setData({ on: { circle: true, highlight: true, underline: true, strike: true, wavy: true } }), 80);
    },
  },
});
