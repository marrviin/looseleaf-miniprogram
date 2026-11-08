import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-command-item — upstream CommandItem (cmdk's Item): one command row.
    The row the search lands on (data-selected) wears the highlighter; a
    disabled row is graphite and inert. No ink per row, so a palette of
    hundreds of commands costs nothing extra. The ll-command root hides
    and highlights rows while you type; picking is a tap, which emits
    `select` with the item's value. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Matched against the search (with keywords/label). */
    value: {
      type: String,
      value: '',
    },
    /** Extra match text (cmdk keywords). */
    keywords: {
      type: Array,
      value: [],
    },
    /** Fallback match text (upstream derives the value from the row's
        text; a WeChat row can't read its slot, so pass label or value). */
    label: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
  },
  data: {
    hidden: false,
    selected: false,
  },
  relations: {
    '../command/command': {
      type: 'ancestor',
      linked(parent) {
        if (parent && parent.onChildLinked) parent.onChildLinked();
      },
      unlinked() {},
    },
    '../command-group/command-group': {
      type: 'ancestor',
      linked() {},
      unlinked() {},
    },
  },
  methods: {
    /** Match text: value + keywords + label (the root lowercases). */
    __matchText() {
      const d = this.data;
      return [d.value, ...(d.keywords || []), d.label].join(' ');
    },
    __setHidden(h) {
      if (this.data.hidden !== h) this.setData({ hidden: h });
    },
    __setSelected(s) {
      if (this.data.selected !== s) this.setData({ selected: s });
    },
    onTap() {
      if (this.data.disabled) return;
      this.triggerEvent(
        'select',
        { value: this.data.value || this.data.label },
        { bubbles: true, composed: true }
      );
    },
  },
});
