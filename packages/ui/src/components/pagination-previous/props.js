/** ll-pagination-previous properties — upstream `PaginationPrevious`. */
import { sizeList } from '../button/type';

export const props = {
  disabled: {
    type: Boolean,
    value: false,
  },
  size: {
    type: String,
    value: 'default',
  },
  ariaLabel: {
    type: String,
    value: 'Go to previous page',
  },
  customStyle: String,
};

export const validators = {
  size: sizeList,
};
