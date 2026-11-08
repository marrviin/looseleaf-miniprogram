Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    // 01-default
    countries: [
      { label: 'Choose a country', value: '' },
      { label: 'Iceland', value: 'is' },
      { label: 'Portugal', value: 'pt' },
      { label: 'Japan', value: 'jp' },
      { label: 'Canada', value: 'ca' },
    ],
    country: '',
    // 02-groups-and-states
    penGroups: [
      { label: 'Pens', options: ['Felt tip', 'Gel'] },
      { label: 'Pencils', options: ['HB', '2B'] },
    ],
    pen: 'Felt tip',
    sizes: ['A5, ruled', 'A4, ruled'],
    size: 'A5, ruled',
    badOptions: [
      { label: 'Pick one', value: '' },
      { label: 'Something', value: 'x' },
    ],
    bad: '',
    // 03-shipping-form
    shipName: '',
    shipCountries: [
      { label: 'Choose…', value: '' },
      { label: 'Iceland', value: 'is' },
      { label: 'Portugal', value: 'pt' },
      { label: 'Canada', value: 'ca' },
    ],
    shipCountry: '',
    regions: {
      is: ['Reykjavik', 'Akureyri'],
      pt: ['Lisbon', 'Porto', 'Faro'],
      ca: ['Ontario', 'Quebec', 'Alberta'],
    },
    shipRegion: '',
    shipSaid: '',
  },
  methods: {
    // one generic reporter: data-key names the field, every change lands here
    onNs(e) {
      const key = e.currentTarget.dataset.key;
      if (key) this.setData({ [key]: e.detail.value != null ? e.detail.value : e.detail.value === '' ? '' : e.detail });
      // region follows country: picking a country resets the region
      if (key === 'shipCountry') this.setData({ shipRegion: '' });
    },
    onShip() {
      const d = this.data;
      if (!d.shipCountry || !d.shipRegion) {
        this.setData({ shipSaid: 'Pick a country and a region first.' });
        return;
      }
      this.setData({ shipSaid: `Ships to ${d.shipRegion}, ${d.shipCountry}` });
    },
  },
});
