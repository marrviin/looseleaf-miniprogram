/** ll-marker-content — mirrors the parent marker's variant/tone (WeChat
    style isolation can't cascade them onto slotted children). */
export const props = {
  variant: {
    type: String,
    value: 'default',
  },
  tone: {
    type: String,
    value: 'default',
  },
  customStyle: String,
};
