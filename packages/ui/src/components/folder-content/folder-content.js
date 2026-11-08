import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `FolderContent` — the folder's body panel: an ll-paper cut from
    the folder's stock, with the folder-body ink (crease) laid on top, shown
    only while its tab is open. The folder root syncs `{ active, stock }`. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'folder',
    llInkSelector: '.ll-folder-content__decor',
    active: false,
    stockName: 'kraft',
    creaseOn: false,
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
  observers: {
    crease(v) {
      this.setData({ creaseOn: v !== false && v !== 'none' });
    },
  },
  methods: {
    /** From the folder root: open state + what stock to draw. */
    __onFolder({ active, stock }) {
      this.setData({ active, stockName: stock || 'kraft' });
      this.__inkParams = { crease: this.data.crease !== false && this.data.crease !== 'none' };
      setTimeout(() => this.__measureInk(), 60);
    },
  },
});
