import { createComponent } from '../../common/component';

/** Upstream IndexCardTitle — the script title above the red rule. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
