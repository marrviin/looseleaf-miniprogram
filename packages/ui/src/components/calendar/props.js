export const props = {
  /** 'single' | 'range' | 'multiple'. */
  mode: {
    type: String,
    value: 'single',
  },
  /** single: 'YYYY-MM-DD'; range: ['YYYY-MM-DD', 'YYYY-MM-DD'] (the second
      may be ''); multiple: ['YYYY-MM-DD', …]. */
  value: {
    type: null,
    optionalTypes: [String, Array],
    value: '',
  },
  /** First shown month 'YYYY-MM' (upstream defaultMonth). */
  defaultMonth: {
    type: String,
    value: '',
  },
  /** The circled-underlined day 'YYYY-MM-DD' (upstream today; pass a fixed
      date so the sheet looks the same tomorrow). */
  today: {
    type: String,
    value: '',
  },
  /** Disabling rules: [{ before: 'YYYY-MM-DD' }, { after: … },
      { dayOfWeek: [0, 6] }] — 0 is Sunday (upstream modifiers). */
  disabled: {
    type: Array,
    value: [],
  },
  /** 'YYYY-MM' — the first month the nav arrows and dropdowns allow. */
  startMonth: {
    type: String,
    value: '',
  },
  /** 'YYYY-MM' — the last allowed month. */
  endMonth: {
    type: String,
    value: '',
  },
  numberOfMonths: {
    type: null,
    optionalTypes: [Number, String],
    value: 1,
  },
  showOutsideDays: {
    type: Boolean,
    value: true,
  },
  showWeekNumber: {
    type: Boolean,
    value: false,
  },
  /** 'label' | 'dropdown' (month and year as picker fields). */
  captionLayout: {
    type: String,
    value: 'label',
  },
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  /** Note under the grid (upstream footer node). */
  footer: {
    type: String,
    value: '',
  },
  /** Mount the months on their own sheet of paper (upstream sheet). */
  sheet: {
    type: Boolean,
    value: false,
  },
  sheetStock: {
    type: String,
    value: 'card',
  },
  sheetTape: {
    type: String,
    value: '',
  },
  sheetFastener: {
    type: String,
    value: '',
  },
  /** Ghost | outline | … for the two nav arrows. */
  buttonVariant: {
    type: String,
    value: 'ghost',
  },
  ruled: {
    type: Boolean,
    value: true,
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  customStyle: String,
};

export const validators = {
  mode: ['single', 'range', 'multiple'],
  captionLayout: ['label', 'dropdown'],
};
