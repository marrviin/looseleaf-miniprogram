/** ll-breadcrumb-ellipsis properties — three pencil dots for the crumbs
    left out. Wrap it in a trigger with an aria-label to open the hidden
    ones (upstream keeps the box at size-6 or more). */
export const props = {
  size: {
    type: String,
    value: '', // '' = default size-9; 'sm' = size-6 (24px) like upstream's className
  },
  customStyle: String,
};

export const validators = {
  size: ['', 'sm'],
};
