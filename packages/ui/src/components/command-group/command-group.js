import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-command-group — upstream CommandGroup: items under a heading, set
    like a typewritten kicker. Groups with no match hide themselves: the
    ll-command root filters the rows, then asks each group to recount. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    heading: {
      type: String,
      value: '',
    },
    customStyle: String,
  },
  data: {
    hidden: false,
  },
  relations: {
    '../command/command': {
      type: 'ancestor',
      linked(parent) {
        if (parent && parent.onChildLinked) parent.onChildLinked();
      },
      unlinked() {},
    },
    '../command-item/command-item': {
      type: 'descendant',
      linked() {},
      unlinked() {},
    },
  },
  methods: {
    /** The root's post-filter recount: hide when no row survived. */
    recount() {
      const items = this.getRelationNodes('../command-item/command-item') || [];
      const visible = items.some((it) => !it.data.hidden);
      if (visible === this.data.hidden) this.setData({ hidden: !visible });
    },
  },
});
