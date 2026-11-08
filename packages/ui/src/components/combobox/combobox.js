import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { attachInk, renderLayers, hashSeed } from '../../common/ink';
import { bucketBox } from '../../common/ink-engine';

ensureHandFont();

/** ll-combobox — upstream Combobox folded into one component (the select
    precedent: state can't cross slots). One field, three shapes:
    the press-to-open trigger, the editable field (ComboboxInput on its
    own), and the hang-tag chips field of a `multiple` combobox — over a
    slip that carries the command search row, loading loops, Stubby's
    empty state and, when `creatable`, the "Add ..." row. Ink: the field
    frame reuses the select recipe (trigger) / combobox-chips recipe;
    each chip runs the combobox-chip recipe; the search row draws the
    command-input rule via a manual renderLayers (ll-switch precedent). */
const MARGIN = 8;
const POPOVER_GAP = 6; // upstream sideOffset 6
const TONES = ['hi', 'sky', 'grass', 'bubblegum'];

/** tone="auto": each value picks its own tag color from its text. */
function chipToneOf(value) {
  let h = 0;
  const s = String(value ?? '');
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachInk()],
  properties: {
    /** (string | {value, label?, disabled?, keywords?})[] | {group, items[]} | {separator:true} */
    items: {
      type: Array,
      value: [],
    },
    /** string (single) or string[] (multiple) */
    value: {
      type: null,
      optionalTypes: [String, Array],
      value: '',
    },
    multiple: {
      type: Boolean,
      value: false,
    },
    /** ComboboxInput-on-its-own: the field itself is the search box. */
    editable: {
      type: Boolean,
      value: false,
    },
    /** Editable field: the small x that empties it. */
    showClear: {
      type: Boolean,
      value: false,
    },
    /** Offer to create what was typed ("Add \"text\""), fires `create`. */
    creatable: {
      type: Boolean,
      value: false,
    },
    shouldFilter: {
      type: Boolean,
      value: true,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '',
    },
    /** The slip's search row (trigger shape only). */
    searchPlaceholder: {
      type: String,
      value: '',
    },
    emptyText: {
      type: String,
      value: 'No results found.',
    },
    loadingText: {
      type: String,
      value: 'Searching...',
    },
    /** '"hi" | "sky" | "grass" | "bubblegum" | "auto"'. */
    chipTone: {
      type: String,
      value: 'hi',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    readOnly: {
      type: Boolean,
      value: false,
    },
    invalid: {
      type: Boolean,
      value: false,
    },
    /** Slip list max height in px (upstream min(20rem, available)). */
    contentMaxHeight: {
      type: null,
      optionalTypes: [Number, String],
      value: 320,
    },
    ariaLabel: {
      type: String,
      value: '',
    },
    customStyle: String,
  },
  data: {
    llInkRecipe: 'select',
    llInkSelector: '.ll-combobox__field',
    open: false,
    visible: false,
    closing: false,
    placed: false,
    panelStyle: '',
    viewportStyle: '',
    fieldText: '',
    hasValue: false,
    query: '',
    dirty: false,
    rows: [],
    visibleCount: 0,
    emptyVisible: false,
    createValue: '',
    chips: [],
    chipPlaceholder: '',
    searchInkStyle: '',
    searchFocus: false,
    inputFocus: false,
  },
  observers: {
    'items, value'() {
      this.__applyValue();
    },
    loading() {
      this.__refilter();
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
      this.__seen = {}; // value -> label registry (created values)
      if (this.data.multiple) this.setData({ llInkRecipe: 'combobox-chips' });
      this.__applyValue();
    },
    detached() {
      if (this.__placeTimer) clearTimeout(this.__placeTimer);
      if (this.__exitTimer) clearTimeout(this.__exitTimer);
      if (this.__chipTimer) clearTimeout(this.__chipTimer);
      if (this.__focusTimer) clearTimeout(this.__focusTimer);
    },
  },
  methods: {
    noop() {},

    // ----- value plumbing --------------------------------------------------
    __labelFor(v) {
      for (const it of this.data.items || []) {
        if (!it || it.group || it.separator || it.value === undefined) continue;
        if (it.value === v) return it.label === undefined ? it.value : it.label;
        if (it.group) continue;
      }
      for (const it of this.data.items || []) {
        if (it && it.group) {
          for (const o of it.items || []) {
            if (o.value === v) return o.label === undefined ? o.value : o.label;
          }
        }
      }
      // observers can fire before attached — the registry lazy-inits
      const seen = this.__seen || (this.__seen = {});
      return seen[v] !== undefined ? seen[v] : v;
    },
    __valueArray() {
      const v = this.data.value;
      return this.data.multiple ? (Array.isArray(v) ? v : []) : v ? [v] : [];
    },
    __hasItem(text) {
      const t = String(text || '').trim().toLowerCase();
      if (!t) return false;
      const flat = [];
      for (const it of this.data.items || []) {
        if (!it) continue;
        if (typeof it === 'string') flat.push({ value: it, label: it });
        else if (it.group) flat.push(...(it.items || []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o)));
        else if (it.value !== undefined) flat.push(it);
      }
      for (const it of flat) {
        if (String(it.value).toLowerCase() === t) return true;
        if (it.label !== undefined && String(it.label).toLowerCase() === t) return true;
      }
      const seen = this.__seen || (this.__seen = {});
      for (const k of Object.keys(seen)) {
        if (k.toLowerCase() === t || String(seen[k]).toLowerCase() === t) return true;
      }
      return false;
    },

    __applyValue() {
      const d = this.data;
      const val = this.__valueArray();
      const rows = [];
      const pushItem = (o) => {
        if (!o || o.value === undefined) return;
        rows.push({
          type: 'item',
          key: o.value,
          value: o.value,
          label: o.label === undefined ? o.value : o.label,
          disabled: !!o.disabled,
          keywords: o.keywords || [],
        });
      };
      for (const o of d.items || []) {
        if (!o) continue;
        if (typeof o === 'string') {
          pushItem({ value: o });
          continue;
        }
        if (o.separator) {
          rows.push({ type: 'sep', key: `sep${rows.length}` });
          continue;
        }
        if (o.group) {
          rows.push({ type: 'label', key: `g:${o.group}`, label: o.group });
          for (const it of o.items || []) pushItem(typeof it === 'string' ? { value: it } : it);
          continue;
        }
        pushItem(o);
      }
      const patch = { rows };
      if (d.multiple) {
        const chips = val.map((v) => ({
          value: v,
          label: this.__labelFor(v),
          tone: d.chipTone === 'auto' ? chipToneOf(v) : d.chipTone,
          inkStyle: '',
        }));
        patch.chips = chips;
        patch.chipPlaceholder = chips.length ? '' : d.placeholder;
      } else {
        const first = val[0] || '';
        patch.fieldText = first ? this.__labelFor(first) : d.placeholder || '';
        patch.hasValue = !!first;
      }
      this.setData(patch);
      this.__refilter();
      if (d.multiple) {
        if (this.__chipTimer) clearTimeout(this.__chipTimer);
        this.__chipTimer = setTimeout(() => this.__renderChipInk(), 60);
        if (typeof this.__measureInk === 'function') this.__measureInk();
      }
    },

    /** cmdk's match: a case-insensitive subsequence over value+keywords+label. */
    __matches(q, text) {
      let i = 0;
      for (let j = 0; j < text.length && i < q.length; j++) {
        if (text[j] === q[i]) i++;
      }
      return i === q.length;
    },

    __refilter() {
      const d = this.data;
      // An un-dirtied editable field shows the whole list (upstream's
      // cmdkFilter: fieldMode single && !dirty -> 1).
      const raw = (d.editable && !d.dirty) ? '' : d.query;
      const q = String(raw || '').trim().toLowerCase();
      const val = this.__valueArray();
      const rows = (d.rows || []).map((r) => {
        if (r.type !== 'item') return r;
        const text = [r.value, ...(r.keywords || []), r.label].join(' ').toLowerCase();
        const visible = !d.shouldFilter || !q || this.__matches(q, text);
        return {
          ...r,
          hidden: !visible,
          checked: d.multiple ? val.includes(r.value) : val[0] === r.value,
        };
      });
      let visibleCount = 0;
      const firstHit = { value: '' };
      for (const r of rows) {
        if (r.type !== 'item' || r.hidden || r.disabled) continue;
        visibleCount++;
        r.selected = false;
        if (!firstHit.value) firstHit.value = r.value;
      }
      for (const r of rows) {
        if (r.type === 'item') r.selected = r.value === firstHit.value;
      }
      const createValue =
        d.creatable && !d.readOnly && !(d.editable && !d.dirty) && q && !this.__hasItem(q)
          ? String(raw || '').trim()
          : '';
      this.setData({
        rows,
        visibleCount,
        emptyVisible: !d.loading && visibleCount === 0 && !createValue,
        createValue,
      });
    },

    // ----- open / close ----------------------------------------------------
    onFieldTap() {
      if (this.data.disabled || this.data.closing) return;
      if (this.data.multiple) {
        // the chips field is the anchor: typing opens, the input takes focus
        if (!this.data.readOnly && !this.data.visible) this.__show();
        return;
      }
      if (this.data.editable) return; // the input handles its own focus
      if (this.data.readOnly) return;
      if (this.data.visible) {
        this.triggerEvent('openchange', { value: false });
        this.__dismiss();
      } else {
        this.triggerEvent('openchange', { value: true });
        this.__show();
      }
    },
    onOutsideTap(e) {
      // In field/chips mode a tap on the field itself is not "outside"
      // (upstream prevents interact-outside inside the anchor) — give the
      // input its focus back and keep the slip up.
      const t = e.changedTouches && e.changedTouches[0];
      if (t && this.__fieldRect && (this.data.editable || this.data.multiple)) {
        const r = this.__fieldRect;
        if (t.clientX >= r.left && t.clientX <= r.right && t.clientY >= r.top && t.clientY <= r.bottom) {
          if (this.data.multiple) this.__refocusInput();
          return;
        }
      }
      this.triggerEvent('openchange', { value: false });
      this.__dismiss();
    },
    __refocusInput() {
      this.setData({ inputFocus: false });
      if (this.__focusTimer) clearTimeout(this.__focusTimer);
      this.__focusTimer = setTimeout(() => this.setData({ inputFocus: true }), 60);
    },

    __show() {
      if (this.__exitTimer) {
        clearTimeout(this.__exitTimer);
        this.__exitTimer = null;
      }
      // open stacks the recipe's open layer over the pencil box (select
      // precedent — attachInk re-stacks on `open`)
      this.setData({
        open: true,
        visible: true,
        closing: false,
        placed: false,
        query: '',
        dirty: false,
        inputFocus: false,
        searchFocus: false,
      });
      this.__refilter();
      setTimeout(() => this.__place(), 60);
      if (this.__focusTimer) clearTimeout(this.__focusTimer);
      // the slip's search row takes focus in trigger shape; the field input
      // in editable/chips shape (re-toggling `focus` re-triggers the keyboard)
      if (this.data.editable) {
        this.__focusTimer = setTimeout(() => this.setData({ inputFocus: true }), 80);
      } else if (this.data.multiple) {
        this.__focusTimer = setTimeout(() => this.setData({ inputFocus: true }), 80);
      } else {
        this.__focusTimer = setTimeout(() => this.setData({ searchFocus: true }), 80);
      }
    },
    __dismiss() {
      if (!this.data.visible || this.data.closing) return;
      this.setData({
        closing: true,
        open: false,
        query: '',
        dirty: false,
        inputFocus: false,
        searchFocus: false,
        searchInkStyle: '',
      });
      this.__refilter();
      this.__exitTimer = setTimeout(() => {
        this.__exitTimer = null;
        this.setData({ visible: false, closing: false, placed: false });
      }, 150);
    },

    /** Popper placement (select precedent): under the field, min-width =
        field width, flipped above when clipped, clamped to 8px margins. */
    __place() {
      this.createSelectorQuery()
        .select('.ll-combobox__field')
        .boundingClientRect((rect) => {
          if (!rect) return;
          this.__fieldRect = rect;
          const info = wx.getSystemInfoSync();
          const vw = info.windowWidth || 375;
          const vh = info.windowHeight || 667;
          const cap = Number(this.data.contentMaxHeight) || 0;
          const spaceBelow = Math.max(0, vh - rect.bottom - POPOVER_GAP - MARGIN);
          const spaceAbove = Math.max(0, rect.top - POPOVER_GAP - MARGIN);
          let side = 'bottom';
          if (spaceBelow < 60 && spaceAbove > spaceBelow && rect.top > 0 && rect.bottom < vh) side = 'top';
          const maxH = Math.max(60, Math.min(cap || Infinity, side === 'bottom' ? spaceBelow : spaceAbove, vh - MARGIN * 2));
          const left = Math.max(MARGIN, Math.min(rect.left, vw - MARGIN - rect.width));
          const panelStyle = `left:${Math.round(left)}px;top:${side === 'bottom' ? Math.round(rect.bottom + POPOVER_GAP) : 0}px;min-width:${Math.round(rect.width)}px;`;
          const viewportStyle = `max-height:${Math.round(maxH)}px;`;
          this.setData({ placed: true, panelStyle, viewportStyle });
          if (side === 'top') {
            this.__placeTimer = setTimeout(() => {
              this.createSelectorQuery()
                .select('.ll-combobox__panel')
                .boundingClientRect((p) => {
                  if (!p) return;
                  const style = this.data.panelStyle.replace(/top:-?[\d.]+px/, `top:${Math.max(MARGIN, Math.round(rect.top - POPOVER_GAP - p.height))}px;`);
                  this.setData({ panelStyle: style });
                })
                .exec();
            }, 50);
          }
          if (!this.data.multiple && !this.data.editable) this.__renderSearchInk();
        })
        .exec();
    },

    // ----- inputs ----------------------------------------------------------
    onSearchInput(e) {
      const v = e.detail.value;
      this.setData({ query: v });
      this.triggerEvent('input', { value: v });
      this.__refilter();
    },
    onFieldInput(e) {
      const v = e.detail.value;
      if (this.data.readOnly) return;
      this.setData({ query: v, dirty: true });
      this.triggerEvent('input', { value: v });
      if (!this.data.visible) {
        this.triggerEvent('openchange', { value: true });
        this.__show();
        // __show resets query; put the typed text back
        this.setData({ query: v, dirty: true });
      }
      this.__refilter();
    },
    onSearchFocus() {
      this.setData({ searchFocus: true });
      this.__restackSearchInk();
    },
    onSearchBlur() {
      this.setData({ searchFocus: false });
      this.__restackSearchInk();
    },
    onClearTap() {
      if (this.data.disabled || this.data.readOnly) return;
      this.__seen = {};
      this.setData({ value: '', query: '', dirty: false, inputFocus: true });
      this.triggerEvent('change', { value: '' });
      this.__applyValue();
    },

    // ----- picking ---------------------------------------------------------
    onItemTap(e) {
      const { value, disabled } = e.currentTarget.dataset;
      if (disabled || this.data.readOnly) return;
      const v = String(value);
      if (this.data.multiple) {
        const val = this.__valueArray();
        const next = val.includes(v) ? val.filter((x) => x !== v) : [...val, v];
        this.setData({ value: next, query: '', dirty: false });
        this.triggerEvent('change', { value: next });
        this.__applyValue();
        this.__refocusInput();
      } else {
        this.setData({ value: v });
        this.triggerEvent('change', { value: v });
        this.triggerEvent('openchange', { value: false });
        this.__dismiss();
      }
    },
    onCreateTap() {
      const text = this.data.createValue;
      if (!text || this.data.readOnly) return;
      this.__seen[text] = text;
      this.triggerEvent('create', { value: text });
      if (this.data.multiple) {
        const next = [...this.__valueArray(), text];
        this.setData({ value: next, query: '', dirty: false });
        this.triggerEvent('change', { value: next });
        this.__applyValue();
        this.__refocusInput();
      } else {
        this.setData({ value: text });
        this.triggerEvent('change', { value: text });
        this.triggerEvent('openchange', { value: false });
        this.__dismiss();
      }
    },
    onChipRemove(e) {
      if (this.data.disabled || this.data.readOnly) return;
      const v = String(e.currentTarget.dataset.value);
      const next = this.__valueArray().filter((x) => x !== v);
      this.setData({ value: next });
      this.triggerEvent('change', { value: next });
      this.__applyValue();
      this.__refocusInput();
    },

    // ----- second-recipe ink (ll-switch precedent) --------------------------
    /** The command-input double rule under the slip's search row. */
    __renderSearchInk() {
      this.createSelectorQuery()
        .select('.ll-combobox__search')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width || !rect.height) return;
          const seed = String(hashSeed('command-input:combobox'));
          this.__searchEntry = renderLayers('command-input', bucketBox(rect.width, rect.height), {}, seed);
          this.__restackSearchInk();
        })
        .exec();
    },
    __restackSearchInk() {
      const entry = this.__searchEntry;
      if (!entry) return;
      const stack = [];
      if (this.data.searchFocus && entry.uris.focus) stack.push(entry.uris.focus);
      if (entry.uris.rest) stack.push(entry.uris.rest);
      this.setData({ searchInkStyle: stack.length ? `inset:${-entry.pad}px;background-image:${stack.map((u) => `url("${u}")`).join(',')}` : '' });
    },

    /** One hang-tag drawing per chip (combobox-chip recipe), at its real size. */
    __renderChipInk() {
      if (!this.data.multiple) return;
      const d = this.data;
      this.createSelectorQuery()
        .selectAll('.ll-combobox__chip')
        .boundingClientRect((rects) => {
          const chips = d.chips || [];
          if (!rects || rects.length !== chips.length) return;
          let changed = false;
          const next = chips.map((chip, i) => {
            const r = rects[i];
            if (!r || !r.width || !r.height) return chip;
            const seed = String(hashSeed(`chip|${chip.value}`));
            const entry = renderLayers('combobox-chip', bucketBox(r.width, r.height), { tone: chip.tone, disabled: !!d.disabled }, seed);
            if (!entry) return chip;
            const uri = d.disabled && entry.uris.disabled ? entry.uris.disabled : entry.uris.rest;
            const style = uri ? `inset:${-entry.pad}px;background-image:url("${typeof uri === 'string' ? uri : uri.before}"),url("${typeof uri === 'string' ? uri : uri.after}")` : '';
            if (style !== chip.inkStyle) changed = true;
            return { ...chip, inkStyle: style };
          });
          if (changed) this.setData({ chips: next });
        })
        .exec();
    },
  },
});
