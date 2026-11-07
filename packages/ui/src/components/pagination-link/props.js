/** ll-pagination-link properties — upstream `PaginationLink`
    (`<Button asChild variant={isActive ? 'secondary' : 'ghost'}>`). */
import { sizeList } from '../button/type';

export const props = {
  /** The current page: drawn secondary (highlighter block), others ghost. */
  isActive: {
    type: Boolean,
    value: false,
  },
  /** A Button size — a page number is a square icon button by default. */
  size: {
    type: String,
    value: 'icon',
  },
  disabled: {
    type: Boolean,
    value: false,
  },
  ariaLabel: {
    type: String,
    value: '',
  },
  customStyle: String,
};

export const validators = {
  size: sizeList,
};
