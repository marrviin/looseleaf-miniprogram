const FRAMEWORKS = [
  { value: 'next', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

const LABELS = ['Design', 'Garden', 'Travel', 'Recipes', 'Field notes', 'Ideas', 'Reading', 'Music'];

const PEOPLE = ['Ada Lovelace', 'Grace Hopper', 'Graham Bell', 'Katherine Johnson', 'Alan Turing', 'Margaret Hamilton'];

const COUNTRIES = [
  { value: 'ar', label: 'Argentina' },
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'nz', label: 'New Zealand' },
];

const MENU_LABELS = ['feature', 'bug', 'enhancement', 'documentation', 'design', 'question', 'maintenance'];

const STATUSES = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'in progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
];

const labelOf = (list, v) => {
  const hit = (list || []).find((i) => i.value === v);
  return hit ? hit.label : v;
};

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    frameworks: FRAMEWORKS,
    fw: 'next',
    labels: LABELS,
    labelVals: ['Design', 'Garden', 'Travel'],
    labelsSaid: 'Design, Garden, Travel',
    breads: ['Sourdough', 'Focaccia', 'Rye', 'Brioche'],
    bread: '',
    breadSaid: 'Nothing picked yet.',
    people: PEOPLE,
    peopleResults: PEOPLE.slice(0, 3),
    peopleLoading: false,
    assignee: '',
    countries: COUNTRIES,
    country: 'nz',
    sent: '',
    menuLabels: MENU_LABELS,
    taskLabel: 'feature',
    menuOpen: false,
    statuses: STATUSES,
    statusOpen: false,
    statusLabel: '',
    respOpen: false,
    respLabel: '',
  },
  methods: {
    // 01 — framework picker
    onFwChange(e) {
      const v = e.detail.value;
      this.setData({ fw: v, fwSaid: labelOf(FRAMEWORKS, v) });
    },

    // 02 — labels as hang-tags
    onLabelsChange(e) {
      const v = e.detail.value || [];
      this.setData({ labelVals: v, labelsSaid: v.length ? v.join(', ') : 'No labels.' });
    },

    // 03 — creatable
    onBreadChange(e) {
      const v = e.detail.value;
      this.setData({ bread: v, breadSaid: `Chosen: ${v}` });
    },
    onBreadCreate(e) {
      const t = e.detail.value;
      this.setData({ breads: [...this.data.breads, t] });
    },

    // 04 — async search
    onPeopleInput(e) {
      const q = String(e.detail.value || '').trim().toLowerCase();
      if (this.__peopleTimer) clearTimeout(this.__peopleTimer);
      this.setData({ peopleLoading: true });
      this.__peopleTimer = setTimeout(() => {
        this.setData({
          peopleResults: PEOPLE.filter((p) => p.toLowerCase().includes(q)).slice(0, 5),
          peopleLoading: false,
        });
      }, 600);
    },
    onAssigneeChange(e) {
      this.setData({ assignee: e.detail.value, assigneeSaid: e.detail.value ? `Assigned to ${e.detail.value}` : '' });
    },

    // 05 — editable field in a form
    onCountryChange(e) {
      this.setData({ country: e.detail.value });
    },
    onShip() {
      this.setData({ sent: this.data.country || 'nothing' });
    },

    // 50 — filter inside a menu
    onMenuChange(e) {
      const k = e.currentTarget.dataset.k;
      if (k) this.setData({ [k]: e.detail.value });
    },
    onMenuLabel(e) {
      this.setData({ taskLabel: e.detail.value, menuOpen: false });
    },

    // 51 — popover + command by hand
    onStatusOpen(e) {
      this.setData({ statusOpen: !!e.detail.value });
    },
    onStatusPick(e) {
      const hit = STATUSES.find((s) => s.value === e.detail.value);
      this.setData({ statusLabel: hit ? hit.label : '', statusOpen: false });
    },

    // 52 — drawer shell
    onRespOpenTap() {
      this.setData({ respOpen: true });
    },
    onRespOpen(e) {
      this.setData({ respOpen: !!e.detail.value });
    },
    onRespPick(e) {
      const hit = STATUSES.find((s) => s.value === e.detail.value);
      this.setData({ respLabel: hit ? hit.label : '', respOpen: false });
    },
  },
});
