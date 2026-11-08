import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-command-empty — upstream CommandEmpty: shown when nothing matches.
    Stubby comes out with his magnifier and your words in script. The
    ll-command root counts the surviving rows and tells it. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** `false` leaves Stubby out. */
    mascot: {
      type: Boolean,
      value: true,
    },
    customStyle: String,
  },
  data: {
    visible: false,
  },
  relations: {
    '../command/command': {
      type: 'ancestor',
      linked(parent) {
        if (parent && parent.onChildLinked) parent.onChildLinked();
      },
      unlinked() {},
    },
  },
  methods: {
    /** The root's post-filter count — the empty state shows at zero. */
    setCount(count) {
      const visible = count === 0;
      if (visible !== this.data.visible) this.setData({ visible });
    },
  },
});
