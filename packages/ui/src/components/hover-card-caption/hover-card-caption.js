import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-hover-card-caption — the pencil caption under the photo window
    (upstream: mt-2.5 px-1 font-script text-[1.4rem]). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
