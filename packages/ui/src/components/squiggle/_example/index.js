// ll-squiggle demo — mirrors the upstream docs page (#/components/squiggle).
Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    kinds: ['wavy', 'zigzag', 'loops', 'scallops', 'dashes', 'dots'],
    // WXML can't do modulo; alternate the pens here (upstream: i % 2).
    kindRows: [
      { name: 'wavy', tone: 'ink' },
      { name: 'zigzag', tone: 'blue' },
      { name: 'loops', tone: 'ink' },
      { name: 'scallops', tone: 'blue' },
      { name: 'dashes', tone: 'ink' },
      { name: 'dots', tone: 'blue' },
    ],
  },
  methods: {},
});
