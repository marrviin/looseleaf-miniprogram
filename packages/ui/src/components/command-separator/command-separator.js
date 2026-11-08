import { createComponent } from '../../common/component';

/** ll-command-separator — upstream CommandSeparator: a hand-drawn pencil
    rule between groups. It hides while a search is typed, like cmdk's
    own (the root tells it). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
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
  },
  methods: {
    /** The root: a search is on — separators step aside. */
    setSearching(on) {
      if (on !== this.data.hidden) this.setData({ hidden: on });
    },
  },
});
