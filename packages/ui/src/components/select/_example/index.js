const fruits = [
  {
    group: 'Fruits',
    items: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'blueberry', label: 'Blueberry' },
      { value: 'grapes', label: 'Grapes' },
      { value: 'pineapple', label: 'Pineapple' },
    ],
  },
];

const zones = [
  {
    group: 'North America',
    items: [
      { value: 'Eastern (EST)', label: 'Eastern (EST)' },
      { value: 'Central (CST)', label: 'Central (CST)' },
      { value: 'Mountain (MST)', label: 'Mountain (MST)' },
      { value: 'Pacific (PST)', label: 'Pacific (PST)' },
      { value: 'Alaska (AKST)', label: 'Alaska (AKST)' },
      { value: 'Hawaii (HST)', label: 'Hawaii (HST)' },
    ],
  },
  { separator: true },
  {
    group: 'Europe & Africa',
    items: [
      { value: 'Greenwich Mean (GMT)', label: 'Greenwich Mean (GMT)' },
      { value: 'Central European (CET)', label: 'Central European (CET)' },
      { value: 'Eastern European (EET)', label: 'Eastern European (EET)' },
      { value: 'West Africa (WAT)', label: 'West Africa (WAT)' },
      { value: 'Central Africa (CAT)', label: 'Central Africa (CAT)' },
      { value: 'East Africa (EAT)', label: 'East Africa (EAT)' },
    ],
  },
  { separator: true },
  {
    group: 'Asia',
    items: [
      { value: 'Moscow (MSK)', label: 'Moscow (MSK)' },
      { value: 'India (IST)', label: 'India (IST)' },
      { value: 'China (CST)', label: 'China (CST)' },
      { value: 'Japan (JST)', label: 'Japan (JST)' },
      { value: 'Korea (KST)', label: 'Korea (KST)' },
    ],
  },
];

const pens = [
  { value: 'felt', label: 'Felt tip' },
  { value: 'pencil', label: 'Pencil' },
  { value: 'marker', label: 'Marker' },
  { value: 'quill', label: 'Quill (out of ink)', disabled: true },
];

const roles = [
  { value: 'Author', label: 'Author' },
  { value: 'Editor', label: 'Editor' },
  { value: 'Proofreader', label: 'Proofreader' },
  { value: 'Illustrator', label: 'Illustrator' },
];

const shifts = [
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
];

const timezones = [
  {
    group: 'North America',
    items: [
      { value: 'est', label: 'Eastern Standard Time (EST)' },
      { value: 'cst', label: 'Central Standard Time (CST)' },
      { value: 'mst', label: 'Mountain Standard Time (MST)' },
      { value: 'pst', label: 'Pacific Standard Time (PST)' },
      { value: 'akst', label: 'Alaska Standard Time (AKST)' },
      { value: 'hst', label: 'Hawaii Standard Time (HST)' },
    ],
  },
  {
    group: 'Europe & Africa',
    items: [
      { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
      { value: 'cet', label: 'Central European Time (CET)' },
      { value: 'eet', label: 'Eastern European Time (EET)' },
      { value: 'west', label: 'Western European Summer Time (WEST)' },
      { value: 'cat', label: 'Central Africa Time (CAT)' },
      { value: 'eat', label: 'East Africa Time (EAT)' },
    ],
  },
  {
    group: 'Asia',
    items: [
      { value: 'msk', label: 'Moscow Time (MSK)' },
      { value: 'ist', label: 'India Standard Time (IST)' },
      { value: 'cst_china', label: 'China Standard Time (CST)' },
      { value: 'jst', label: 'Japan Standard Time (JST)' },
      { value: 'kst', label: 'Korea Standard Time (KST)' },
      { value: 'ist_indonesia', label: 'Indonesia Central Standard Time (WITA)' },
    ],
  },
  {
    group: 'Australia & Pacific',
    items: [
      { value: 'awst', label: 'Australian Western Standard Time (AWST)' },
      { value: 'acst', label: 'Australian Central Standard Time (ACST)' },
      { value: 'aest', label: 'Australian Eastern Standard Time (AEST)' },
      { value: 'nzst', label: 'New Zealand Standard Time (NZST)' },
      { value: 'fjt', label: 'Fiji Time (FJT)' },
    ],
  },
  {
    group: 'South America',
    items: [
      { value: 'art', label: 'Argentina Time (ART)' },
      { value: 'bot', label: 'Bolivia Time (BOT)' },
      { value: 'brt', label: 'Brasilia Time (BRT)' },
      { value: 'clt', label: 'Chile Standard Time (CLT)' },
    ],
  },
];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    fruits,
    zones,
    pens,
    roles,
    shifts,
    timezones,
    // per-example select state (upstream defaultValue / useState)
    fruit: '',
    demo50: '',
    tz: 'Central European (CET)',
    role: 'Editor',
    shift: '',
    sent: '',
  },
  methods: {
    // every demo select reports through data-key — one generic handler
    onPick(e) {
      const key = e.currentTarget.dataset.key;
      if (key) this.setData({ [key]: e.detail.value });
    },
    onFileIt() {
      const { role, shift } = this.data;
      this.setData({ sent: `Filed: ${role} on the ${shift || 'no'} shift` });
    },
  },
});
