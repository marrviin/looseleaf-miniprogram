import { props as ruleProps, validators as ruleValidators } from '../rule/props';

export const props = {
  ...ruleProps,
  // React children → property: the centered hand-font label ("or continue
  // with"). Empty string renders a single plain rule.
  label: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = ruleValidators;
