export const props = {
  /** { fieldName: message } — the page owns the validation (upstream this
      is react-hook-form's FormProvider; RHF doesn't exist on the mini-
      program side, so the same errors map is passed in as a prop and every
      form-item under this form picks up its field's message). */
  errors: {
    type: Object,
    value: {},
  },
  customStyle: String,
};
