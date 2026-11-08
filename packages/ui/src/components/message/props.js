/**
 * ll-message properties — upstream Message (message.tsx): one message row.
 */
export const props = {
  /** Which end of the row the message sits on. Bubbles inside inherit it. */
  align: {
    type: String,
    value: 'start',
  },
  customStyle: String,
};
