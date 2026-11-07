/**
 * Small props validation helpers, shared with generated docs.
 */
export const Truthy = (v) => !!v;

export const oneOf = (list) => (v) => list.includes(v);

export const range = (min, max) => (v) => typeof v === 'number' && v >= min && v <= max;
