import { createComponent } from '../../common/component';

/** Upstream `NotebookCoverLabel` — the label on the cover: a card of
    paper (index-card stock, turned a little) holding the notebook's name
    in the script font. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    tilt: {
      type: null,
      optionalTypes: [Boolean, Number, String],
      value: true,
    },
    seed: {
      type: null,
      optionalTypes: [String, Number],
      value: '',
    },
    customStyle: String,
  },
});
