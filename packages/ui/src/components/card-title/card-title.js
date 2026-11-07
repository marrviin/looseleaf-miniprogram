import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

// The script face is the same Kevin Sans files at 75% size-adjust upstream;
// the miniprogram expresses that as a smaller font-size instead.
ensureHandFont();

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
