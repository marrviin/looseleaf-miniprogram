/**
 * ll-badge properties.
 * API aligned with upstream looseleaf Badge (variant x size x tone x count/tally).
 * asChild has no miniprogram equivalent — use `hoverable` + tap events instead.
 */
import { badgeVariantList, badgeSizeList, badgeToneList } from './type';

export const props = {
  variant: {
    type: String,
    value: 'default',
  },
  size: {
    type: String,
    value: 'default',
  },
  tone: {
    type: String,
    value: 'marker',
  },
  /** Number shown when there is no slot content (children win upstream). */
  count: {
    type: null,
    optionalTypes: [Number],
    value: null,
  },
  max: {
    type: Number,
    value: 99,
  },
  /** Write count (1-20) as tally marks instead of digits. */
  tally: {
    type: Boolean,
    value: false,
  },
  /** Upstream: badges that are links/onClick draw a hover layer. */
  hoverable: {
    type: Boolean,
    value: false,
  },
  customStyle: String,
};

/** Validation lists, consumed by docs generation and unit tests. */
export const validators = {
  variant: badgeVariantList,
  size: badgeSizeList,
  tone: badgeToneList,
};
