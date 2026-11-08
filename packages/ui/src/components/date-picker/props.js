/** ll-date-picker props — upstream DatePicker + DateRangePicker folded into
    one component (mode 'single' | 'range'). Dates cross the boundary as
    'YYYY-MM-DD' strings (range: a [from, to] array); there is no Date
    object on this side. */
export const props = {
  mode: {
    type: String,
    value: 'single',
  },
  /** 'YYYY-MM-DD', or [from, to] in range mode. */
  value: {
    type: null,
    optionalTypes: [String, Array],
    value: '',
  },
  defaultValue: {
    type: null,
    optionalTypes: [String, Array],
    value: '',
  },
  placeholder: {
    type: String,
    value: '',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  readOnly: {
    type: Boolean,
    value: false,
  },
  /** Red pencil frame from the page; the component adds its own when typed
      text cannot be read (until the next edit). */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** false makes the whole field a button that shows the date (like a
      Select) — no free typing. */
  typeable: {
    type: Boolean,
    value: true,
  },
  /** Display/first-parse format: 'P' | 'PP' | 'PPP' or one of the literal
      patterns the reader understands ('yyyy-MM-dd', 'M/d/yyyy', …). */
  format: {
    type: String,
    value: 'PP',
  },
  /** Earliest / latest allowed day, 'YYYY-MM-DD'. */
  min: {
    type: String,
    value: '',
  },
  max: {
    type: String,
    value: '',
  },
  /** More days that cannot be chosen — calendar matchers:
      [{ before }, { after }, { dayOfWeek: [0..6] }] (0 = Sunday). */
  disabledDates: {
    type: Array,
    value: [],
  },
  /** { label, value } rows beside the calendar. value is an ISO string, a
      { from, to } pair, or a keyword — 'today' | 'tomorrow' | 'yesterday' |
      'in-a-week' | 'next-month' — worked out when the preset is chosen. */
  presets: {
    type: Array,
    value: [],
  },
  /** Put the calendar away when a day (a full range) is chosen. */
  closeOnSelect: {
    type: Boolean,
    value: true,
  },
  /** Controlled slip: pass true/false to drive it; events otherwise. */
  open: {
    type: null,
    value: null,
  },
  defaultOpen: {
    type: Boolean,
    value: false,
  },
  /** Accessible name of the calendar button and slip. */
  calendarLabel: {
    type: String,
    value: '',
  },
  invalidMessage: {
    type: String,
    value: 'Enter a date we can read.',
  },
  /** Calendar pass-throughs. today: 'YYYY-MM-DD'; defaultMonth:
      'YYYY-MM' (a range slip shows two months from it when the screen
      allows); startMonth/endMonth clamp the dropdown captions. */
  today: {
    type: String,
    value: '',
  },
  defaultMonth: {
    type: String,
    value: '',
  },
  numberOfMonths: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  showWeekNumber: {
    type: Boolean,
    value: false,
  },
  captionLayout: {
    type: String,
    value: 'label',
  },
  weekStartsOn: {
    type: null,
    optionalTypes: [Number],
    value: 0,
  },
  startMonth: {
    type: String,
    value: '',
  },
  endMonth: {
    type: String,
    value: '',
  },
  seed: {
    type: null,
    optionalTypes: [String, Number],
    value: '',
  },
  ariaLabel: {
    type: String,
    value: '',
  },
};
