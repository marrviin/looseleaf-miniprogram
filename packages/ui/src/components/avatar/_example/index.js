Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    people: [
      'Ada Lovelace',
      'Jo Okafor',
      'Mika Kobayashi',
      'Sam Reyes',
      'Priya Nair',
      'Tomas Berg',
      'Lena Fischer',
      'Omar Haddad',
      'Yuki Tanaka',
      'Ines Moreau',
      'Kofi Mensah',
      'Nora Lindqvist',
    ],
    group2: ['Priya Nair', 'Tomas Berg', 'Lena Fischer'],
    group3: ['Omar Haddad', 'Yuki Tanaka', 'Ines Moreau', 'Kofi Mensah'],
    team: [
      { name: 'Ada Lovelace', role: 'Designer', status: 'online' },
      { name: 'Jo Okafor', role: 'Engineer', status: 'busy' },
      { name: 'Mika Kobayashi', role: 'Writer', status: 'away' },
      { name: 'Sam Reyes', role: 'Support', status: 'offline' },
    ],
    watchers: ['Priya Nair', 'Tomas Berg', 'Lena Fischer'],
  },
  methods: {},
});
