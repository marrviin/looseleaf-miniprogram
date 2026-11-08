import { createComponent } from '../../common/component';

/** Upstream `TableCaption` — a <caption> under the table (caption-side:
    bottom), written in the script font. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
