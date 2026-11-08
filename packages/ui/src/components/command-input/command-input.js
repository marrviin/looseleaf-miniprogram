import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { attachInk } from '../../common/ink';

ensureHandFont();

/** ll-command-input — upstream CommandInput: a magnifier, blue felt text
    and the commandInputRecipe's double rule drawn under the row (a blue
    one joins it while the field has focus — data-ink-focus="within").
    Typing reports to the ll-command root, which filters the rows; the
    root pushes the result count back for the polite status line. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachInk()],
  properties: {
    placeholder: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    ariaLabel: String,
    customStyle: String,
  },
  data: {
    llInkRecipe: 'command-input',
    llInkSelector: '.ll-command-input__wrapper',
    status: '',
  },
  relations: {
    '../command/command': {
      type: 'ancestor',
      linked(parent) {
        this.__cmd = parent;
      },
      unlinked() {
        this.__cmd = null;
      },
    },
  },
  methods: {
    onInput(e) {
      const v = e.detail.value;
      this.setData({ value: v });
      this.triggerEvent('input', { value: v });
      if (this.__cmd) this.__cmd.onSearch(v);
    },
    onFocus() {
      this.setData({ focusVisible: true });
      this.triggerEvent('focus', {});
    },
    onBlur() {
      this.setData({ focusVisible: false });
      this.triggerEvent('blur', {});
    },
    /** The root's result count, after each keystroke ("3 results"). */
    setStatus(q, count) {
      const label = count === 0 ? 'No results' : count === 1 ? '1 result' : `${count} results`;
      this.setData({ status: q ? label : '' });
    },
  },
});
