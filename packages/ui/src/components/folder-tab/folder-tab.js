import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `FolderTab` — a tab on the folder's top edge. Registers with the
    parent ll-folder; the folder syncs `{ value, stock }` so we know whether
    we are the active tab (checked layer) and what stock to draw. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'folder-tab',
    llInkSelector: '.ll-folder-tab',
    checked: false,
    activeClass: '',
    content: '',
  },
  relations: {
    '../folder/folder': {
      type: 'ancestor',
      linked(parent) {
        this.__folder = parent;
      },
      unlinked() {
        this.__folder = null;
      },
    },
  },
  lifetimes: {},
  methods: {
    /** From the folder root: am I open, and what stock am I drawn in. */
    __onFolder({ value, stock }) {
      const checked = !!value && value === this.data.value;
      const activeClass = checked ? ' is-active' : '';
      this.setData({ checked, activeClass, content: this.data.label || this.data.value });
      this.__inkParams = { stock, disabled: this.data.disabled };
      setTimeout(() => this.__measureInk(), 60);
    },
    onTap() {
      const folder = this.__folder;
      if (!folder || this.data.disabled) return;
      folder.__onTabTap(this.data.value);
    },
  },
});
