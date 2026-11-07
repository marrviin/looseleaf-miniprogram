/**
 * ll-button properties.
 * API aligned with upstream looseleaf Button (variant × size × shape × seed).
 */
import { variantList, sizeList, shapeList } from './type';

export const props = {
  variant: {
    type: String,
    value: 'default',
  },
  size: {
    type: String,
    value: 'default',
  },
  shape: {
    type: String,
    value: 'default',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  loading: {
    type: Boolean,
    value: false,
  },
  openType: String,
  /** Accessibility label (upstream: icon buttons need an aria-label). */
  ariaLabel: {
    type: String,
    value: '',
  },
  hoverClass: {
    type: String,
    value: 'll-button--hover',
  },
  /** Seam trim inside a button-group: a ready clip-path string the group
      hands over (clips this button's ink start/end edge so neighbors share
      one stroke). Empty = no trim. */
  trimStyle: {
    type: String,
    value: '',
  },
  customStyle: String,
};

/** Validation lists, consumed by docs generation and unit tests. */
export const validators = {
  variant: variantList,
  size: sizeList,
  shape: shapeList,
};
