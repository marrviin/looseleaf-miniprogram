import { createComponent } from '../../common/component';
import { props, validators } from './props';
import { itemFrameVars } from '../../common/item-frames';
import { hashSeed } from '../../common/ink';

/** Upstream `Item` — a flex row for lists of things. The ruled pencil box
    (variant=outline) and the blue rule of a ruled group are CSS masks over
    tiny drawn tiles (never an svg per row); the frame picks which of three
    hands draws them. WeChat has no :hover, so a `link` row wears the
    highlighter swipe while the finger is down. Inside an ItemGroup it is a
    list item (aria-role=listitem) and inherits `ruled`. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    v: 'default',
    sz: 'default',
    ruled: false,
    inGroup: false,
    swiped: false,
    rootStyle: '',
  },
  relations: {
    '../item-group/item-group': {
      type: 'ancestor',
      linked(parent) {
        this.__group = parent;
        this.setData({ inGroup: true });
        setTimeout(() => this.__onGroup({ ruled: parent.data.ruled }), 0);
      },
      unlinked() {
        this.__group = null;
        this.setData({ inGroup: false, ruled: false });
      },
    },
    // Media parity (the crooked photos alternate by row) and the shift when
    // the row carries a description — both cross-component, so the row hands
    // them to its media children itself.
    '../item-media/item-media': {
      type: 'descendant',
      linked(child) {
        (this.__media = this.__media || []).push(child);
        setTimeout(() => this.__applyMedia(), 0);
      },
      unlinked(child) {
        this.__media = (this.__media || []).filter((m) => m !== child);
        this.__applyMedia();
      },
    },
    '../item-description/item-description': {
      type: 'descendant',
      linked() {
        this.__descCount = (this.__descCount || 0) + 1;
        setTimeout(() => this.__applyMedia(), 0);
      },
      unlinked() {
        this.__descCount = Math.max(0, (this.__descCount || 0) - 1);
        this.__applyMedia();
      },
    },
  },
  observers: {
    'variant, size'(variant, size) {
      const val = (list, x) => (list.includes(x) ? x : list[0]);
      this.setData({
        v: val(validators.variant, variant),
        sz: val(validators.size, size),
      });
    },
    seed() {
      this.__draw();
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        v: validators.variant.includes(this.data.variant) ? this.data.variant : 'default',
        sz: validators.size.includes(this.data.size) ? this.data.size : 'default',
      });
      this.__draw();
    },
  },
  methods: {
    /** The outline/rule mask tiles for this row's hand (frame). */
    __draw() {
      const d = this.data;
      const key = d.seed === '' || d.seed === null || d.seed === undefined ? `item|${this.__wxWebviewId__ ?? 0}` : String(d.seed);
      const frame = hashSeed(key) % 3;
      this.setData({ rootStyle: itemFrameVars(frame) });
    },
    /** Called by the group when `ruled` changes. */
    __onGroup(ctx) {
      this.setData({ ruled: !!ctx.ruled });
    },
    /** Push parity + description-shift to the media children. */
    __applyMedia() {
      const list = this.__media || [];
      const hasDesc = (this.__descCount || 0) > 0;
      list.forEach((m, i) => m.__onItem({ index: i, hasDesc }));
    },
    onTouchStart() {
      if (this.data.link) this.setData({ swiped: true });
    },
    onTouchEnd() {
      if (this.data.link) this.setData({ swiped: false });
    },
  },
});
