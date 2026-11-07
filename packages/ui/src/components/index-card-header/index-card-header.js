import { createComponent } from '../../common/component';

/** Upstream IndexCardHeader — h-[49px] (the red rule's band), items-end,
   between the title and any trailing note. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
