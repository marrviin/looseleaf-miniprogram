/**
 * Parent/child relation helpers for group components (checkbox-group, radio-group…),
 * following the upstream Vant `relation` behavior approach.
 *
 * TODO(M2): implement when the first group component lands.
 */
export const useChildren = () => ({
  relations: {
    './parent-placeholder': { type: 'descendant' },
  },
});

export const useParent = () => ({
  relations: {
    './child-placeholder': { type: 'ancestor' },
  },
});
