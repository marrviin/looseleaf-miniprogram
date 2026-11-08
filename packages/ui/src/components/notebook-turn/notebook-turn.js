import { createComponent } from '../../common/component';

/** Upstream `NotebookTurn` — a button over the folded corner (34px, always
    bottom right); turning goes to the page named by `to`. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  relations: {
    '../notebook/notebook': {
      type: 'ancestor',
      linked(parent) {
        this.__parent = parent;
      },
      unlinked() {
        this.__parent = null;
      },
    },
  },
  properties: {
    /** The page to turn to. */
    to: {
      type: String,
      value: '',
    },
    /** Accessible name; default "Turn the page". */
    label: {
      type: String,
      value: '',
    },
    customStyle: String,
  },
  methods: {
    onTap() {
      if (this.__parent && this.data.to) this.__parent.turn(this.data.to);
      this.triggerEvent('turn', { to: this.data.to });
    },
  },
});
