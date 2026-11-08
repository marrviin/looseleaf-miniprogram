import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** ll-select — upstream Select (Radix) folded into one component: the
    compound Root/Trigger/Content/Group/Item tree becomes an `options` array
    (state can't cross slots). The trigger is a drawn field (selectRecipe:
    open spreads the pencil box); the list is a slip of paper, popper-placed
    under the trigger with its min-width, flipping above when clipped.
    Events: `change` {value} on pick, `openchange` {value} on open/close. */
const MARGIN = 8;
const POPOVER_GAP = 4; // upstream data-[side=bottom]:translate-y-1

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'select',
    visible: false,
    closing: false,
    placed: false,
    panelStyle: '',
    viewportStyle: '',
    rows: [],
    displayLabel: '',
  },
  observers: {
    'options, value'() {
      this.__applyValue();
    },
    invalid() {
      // red frame — not in attachInk's observer list, re-measure here
      if (typeof this.__measureInk === 'function') this.__measureInk();
    },
  },
  lifetimes: {
    attached() {
      // selectRecipe params: the invalid layer replaces rest (field-frame
      // convention); disabled swaps in via attachInk's own path.
      this.__inkParams = () => ({ invalid: !!this.data.invalid });
      this.__applyValue();
      if (this.data.value) this.setData({ open: false });
    },
    detached() {
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
    },
  },
  methods: {
    noop() {},
    __applyValue() {
      const rows = [];
      let displayLabel = this.data.placeholder || '';
      let placeholder = true;
      for (const o of this.data.options || []) {
        if (!o) continue;
        if (o.separator) {
          rows.push({ type: 'sep', key: `sep${rows.length}` });
          continue;
        }
        if (o.group) {
          rows.push({ type: 'label', key: `g:${o.group}`, label: o.group });
          for (const it of o.items || []) {
            rows.push({ type: 'item', key: it.value, value: it.value, label: it.label === undefined ? it.value : it.label, disabled: !!it.disabled });
          }
          continue;
        }
        if (o.value !== undefined) {
          rows.push({ type: 'item', key: o.value, value: o.value, label: o.label === undefined ? o.value : o.label, disabled: !!o.disabled });
        }
      }
      const picked = rows.find((r) => r.type === 'item' && r.value === this.data.value);
      if (picked) {
        displayLabel = picked.label;
        placeholder = false;
      }
      this.setData({ rows, displayLabel, hasValue: !placeholder });
    },

    onTriggerTap() {
      if (this.data.disabled || this.data.closing) return;
      if (this.data.visible) {
        this.triggerEvent('openchange', { value: false });
        this.__dismiss();
      } else {
        this.triggerEvent('openchange', { value: true });
        this.__show();
      }
    },
    onOutsideTap() {
      this.triggerEvent('openchange', { value: false });
      this.__dismiss();
    },
    onItemTap(e) {
      const { value, disabled } = e.currentTarget.dataset;
      if (disabled) return;
      this.setData({ value });
      this.triggerEvent('change', { value });
      this.triggerEvent('openchange', { value: false });
      this.__dismiss();
    },

    __show() {
      if (this.__exitTimer) {
        clearTimeout(this.__exitTimer);
        this.__exitTimer = null;
      }
      // open stacks the recipe's open layer over the pencil box (the rest
      // sketch hides for it, hideOn open) — attachInk re-measures on `open`
      this.setData({ open: true, visible: true, closing: false, placed: false });
      setTimeout(() => this.__place(), 60);
    },
    __dismiss() {
      if (!this.data.visible || this.data.closing) return;
      this.setData({ closing: true, open: false });
      this.__exitTimer = setTimeout(() => {
        this.__exitTimer = null;
        this.setData({ visible: false, closing: false, placed: false });
      }, 150);
    },

    /** Popper placement: under the trigger (min-width = trigger width),
        flipped above when clipped, clamped to 8px margins; the viewport
        scrolls past contentMaxHeight (or the room available). */
    __place() {
      this.createSelectorQuery()
        .select('.ll-select')
        .boundingClientRect((rect) => {
          if (!rect) return;
          const info = wx.getSystemInfoSync();
          const vw = info.windowWidth || 375;
          const vh = info.windowHeight || 667;
          const cap = Number(this.data.contentMaxHeight) || 0;
          const spaceBelow = Math.max(0, vh - rect.bottom - POPOVER_GAP - MARGIN);
          const spaceAbove = Math.max(0, rect.top - POPOVER_GAP - MARGIN);
          let side = 'bottom';
          // flip above only when the trigger is actually on screen (an
          // off-viewport trigger would make "above" the whole screen)
          if (spaceBelow < 60 && spaceAbove > spaceBelow && rect.top > 0 && rect.bottom < vh) side = 'top';
          const maxH = Math.max(60, Math.min(cap || Infinity, side === 'bottom' ? spaceBelow : spaceAbove, vh - MARGIN * 2));
          let left = Math.max(MARGIN, Math.min(rect.left, vw - MARGIN - rect.width));
          const panelStyle = `left:${Math.round(left)}px;top:${side === 'bottom' ? Math.round(rect.bottom + POPOVER_GAP) : 0}px;min-width:${Math.round(rect.width)}px;`;
          const viewportStyle = `max-height:${Math.round(maxH)}px;`;
          this.setData({ placed: true, panelStyle, viewportStyle, side });
          if (side === 'top') {
            // second hop: measure the real panel height, sit above the field
            this.__placeTimer = setTimeout(() => {
              this.createSelectorQuery()
                .select('.ll-select__panel')
                .boundingClientRect((p) => {
                  if (!p) return;
                  const style = this.data.panelStyle.replace(/top:-?[\d.]+px/, `top:${Math.max(MARGIN, Math.round(rect.top - POPOVER_GAP - p.height))}px;`);
                  this.setData({ panelStyle: style });
                })
                .exec();
            }, 50);
          }
        })
        .exec();
    },
  },
});
