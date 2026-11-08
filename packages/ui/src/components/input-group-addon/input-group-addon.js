import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

export const props = {
  /** '"inline-start" | "inline-end" | "block-start" | "block-end"'. */
  align: {
    type: String,
    value: 'inline-start',
  },
  /** A block addon with a drawn rule between it and the text (upstream
      writes the className border-b / border-t; a class can't carry
      meaning here, so the edge is a prop: '' | 'top' | 'bottom'). */
  edge: {
    type: String,
    value: '',
  },
  customStyle: String,
};

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    // The rule recipe only runs when edge is set — an empty recipe id
    // short-circuits attachInk's measuring loop.
    llInkRecipe: '',
    llInkSelector: '.ll-input-group-addon__rule',
  },
  relations: {
    '../input-group/input-group': {
      type: 'ancestor',
      linked(parent) {
        this.__group = parent;
        if (String(this.data.align).indexOf('block-') === 0) {
          parent.setData({ hasBlock: true });
        }
      },
      unlinked() {
        this.__group = null;
      },
    },
  },
  observers: {
    edge(v) {
      this.__inkParams = () => ({ edge: v === 'top' ? 'top' : 'bottom' });
      const recipe = v ? 'input-group-rule' : '';
      if (this.data.llInkRecipe !== recipe) {
        this.setData({ llInkRecipe: recipe });
        if (recipe) setTimeout(() => this.__measureInk && this.__measureInk(), 50);
      }
    },
  },
  lifetimes: {
    attached() {
      if (this.data.edge) {
        this.__inkParams = () => ({ edge: this.data.edge === 'top' ? 'top' : 'bottom' });
        this.setData({ llInkRecipe: 'input-group-rule' });
        setTimeout(() => this.__measureInk && this.__measureInk(), 50);
      }
    },
  },
  methods: {
    noop() {},
    /** Tap on the addon (ll-button catches its own tap, so taps on buttons
        never get here — same as upstream's closest("button") bail) focuses
        the group's control. */
    onTap() {
      if (this.__group) this.__group.focusControl();
    },
  },
});
