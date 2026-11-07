import { createComponent } from '../../common/component';
import { BUTTON_GROUP_CHILD_RELATION, buttonGroupChildBehavior } from '../../common/button-group-child';
import { props, validators } from './props';

/** Upstream `ButtonGroupSeparator` — a pencil Separator that stretches to
    the group's height and takes the place of the two edges around it: the
    children on either side clip their own edges, so the separator's stroke
    is the only one. It joins the group's order as a marker (no trim of its
    own); any variant passes through to ll-separator. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [buttonGroupChildBehavior('.ll-button-group-separator')],
  properties: props,
  relations: {
    '../button-group/button-group': BUTTON_GROUP_CHILD_RELATION,
  },
  data: {
    v: 'pencil',
    o: 'vertical',
  },
  observers: {
    'variant, orientation'(variant, orientation) {
      this.setData({
        v: validators.variant.includes(variant) ? variant : 'pencil',
        o: validators.orientation.includes(orientation) ? orientation : 'vertical',
      });
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        v: validators.variant.includes(this.data.variant) ? this.data.variant : 'pencil',
        o: validators.orientation.includes(this.data.orientation) ? this.data.orientation : 'vertical',
      });
    },
  },
  methods: {
    __trimIsSep() {
      return true;
    },
  },
});
