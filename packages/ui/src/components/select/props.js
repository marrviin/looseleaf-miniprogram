/** options: a flat list of items, group objects and separators — the
    compound <SelectGroup>/<SelectItem> tree folds into one array because
    state can't cross slots:
      { value, label?, disabled? }   plain item
      { group, items: [...] }        kicker label + its items
      { separator: true }            pencil rule between groups */
export const props = {
  options: {
    type: Array,
    value: [],
  },
  value: {
    type: String,
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
  /** Red pencil frame (upstream aria-invalid). */
  invalid: {
    type: Boolean,
    value: false,
  },
  /** 'default' | 'sm' (upstream data-size). */
  size: {
    type: String,
    value: 'default',
  },
  /** Popup list max height in px (upstream max-h-N classes); 0 clamps to
      the room below/above the trigger. */
  contentMaxHeight: {
    type: null,
    optionalTypes: [Number, String],
    value: 0,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};
