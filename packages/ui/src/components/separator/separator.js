import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Separator` — a labeled divider wraps two rules around text.
    React takes it via children; here the label is a `label` property (a
    WeChat component can't test whether its slot is empty). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
});
