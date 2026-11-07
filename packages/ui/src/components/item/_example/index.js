Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // A ruled list of links (example 2).
    pages: [
      { icon: 'file', title: 'Quarterly pages', desc: 'Last opened on Tuesday, tidy.' },
      { icon: 'folder', title: 'Receipts', desc: 'Forty-one of them, all crumpled.' },
      { icon: 'calendar', title: 'Calendar', desc: 'Three things this week, one of them cake.' },
    ],
    // An inbox (example 3).
    messages: [
      { doodle: 'sun', from: 'Mara', subject: 'Sunday plans', preview: 'The lake, if the weather holds, and there will be bread.', fresh: true },
      { doodle: 'flower', from: 'The garden club', subject: 'Bulbs, finally', preview: 'Two hundred tulips to plant before the ground freezes.' },
      { doodle: 'mushroom', from: 'Ines', subject: 'You will not believe it', preview: 'A whole ring of them, right behind the shed.' },
    ],
    // Image (example 8) — rain-cloud → cloud (no rain-cloud doodle yet).
    music: [
      { title: 'Midnight City Lights', artist: 'Neon Dreams', album: 'Electric Nights', duration: '3:45', doodle: 'moon' },
      { title: 'Coffee Shop Conversations', artist: 'The Morning Brew', album: 'Urban Stories', duration: '4:05', doodle: 'cup' },
      { title: 'Digital Rain', artist: 'Cyber Symphony', album: 'Binary Beats', duration: '3:30', doodle: 'cloud' },
    ],
    // Group with separators (example 10).
    people: [
      { username: 'shadcn', email: 'shadcn@looseleaf.example', initial: 's' },
      { username: 'maxleiter', email: 'maxleiter@looseleaf.example', initial: 'm' },
      { username: 'evilrabbit', email: 'evilrabbit@looseleaf.example', initial: 'e' },
    ],
    // Header (example 11) — light-bulb → sparkle (no bulb doodle yet).
    models: [
      { name: 'v0-1.5-sm', description: 'Everyday tasks and UI generation.', doodle: 'feather' },
      { name: 'v0-1.5-lg', description: 'Advanced thinking or reasoning.', doodle: 'sparkle' },
      { name: 'v0-2.0-mini', description: 'Open Source model for everyone.', doodle: 'sprout' },
    ],
    ddOpen: false,
    picked: '',
  },
  methods: {
    onDdChange(e) {
      this.setData({ ddOpen: e.detail.open });
    },
    onPick(e) {
      this.setData({ picked: e.currentTarget.dataset.name });
    },
  },
});
