import { createComponent } from '../../common/component';

/** Upstream PolaroidCaption — the script line under the window. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
