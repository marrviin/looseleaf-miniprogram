import { createComponent } from '../../common/component';
import { stickerBatches, stickerFace, stickerLabel, hasSticker } from '../../common/ink-engine';
import { resolvePaint } from '../../common/ink';
import { props } from './props';

/** Upstream CATEGORY_LABEL (sticker-ink.ts). */
const CATEGORY_LABEL = {
  statusPointers: 'Status & pointers',
  spaceWeather: 'Space & weather',
  foodDrink: 'Food & drink',
  officeDesk: 'Office & desk',
  natureAnimals: 'Nature & animals',
  facesCelebrate: 'Faces & celebrate',
  badgesStamps: 'Badges & stamps',
};

/** Upstream categoryLabel fallback: kebab-case the key, title the words. */
const categoryLabel = (key) =>
  CATEGORY_LABEL[key] ||
  stickerLabel(key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase());

const wrapSvg = (inner, w, h) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${resolvePaint(inner)}</svg>`
  )}`;

/** Upstream `StickerPicker` (+ Trigger/Content/useStickerPicker, folded in):
    a popover of stickers to choose from — a search field, category chips and
    a grid. Tap a sticker and it peels its corner; tapping again (with
    closeOnSelect off) or another one chooses it. The body resets on open,
    like upstream's remount. Events: `select` {name, label, category,
    categoryLabel, tags}, `change` {value} (the slip's open state). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
    multipleSlots: true,
  },
  properties: props,
  data: {
    visible: false,
    query: '',
    category: 'all',
    cats: [],
    sections: [],
    activeKey: '',
    activeLabel: '',
    activeCat: '',
    emptyText: 'No stickers to choose from.',
  },
  observers: {
    open(v) {
      if (!!v !== this.data.visible) this.setData({ visible: !!v });
    },
    'stickers, size'() {
      this.__catalog = null;
      if (this.data.visible) this.__refresh();
    },
    'value, recent'() {
      if (this.data.visible) this.__refresh();
    },
  },
  lifetimes: {
    detached() {
      if (this.__reveal) clearTimeout(this.__reveal);
    },
  },
  methods: {
    noop() {},
    onTriggerTap() {
      this.setData({ visible: true });
      this.triggerEvent('change', { value: true });
      // upstream PickerBody remounts per open: fresh search, fresh category
      this.setData({ query: '', category: 'all', activeKey: '' });
      this.__refresh();
    },
    onOutsideClose() {
      if (!this.data.visible) return;
      this.setData({ visible: false });
      this.triggerEvent('change', { value: false });
    },
    onQuery(e) {
      this.setData({ query: String(e.detail.value || ''), activeKey: '' });
      this.__refresh();
    },
    onCatTap(e) {
      const key = e.currentTarget.dataset.key;
      if (key === this.data.category) return;
      this.setData({ category: key, activeKey: '' });
      this.__refresh();
    },
    /** Touch (pointer-down equivalent) lights the cell: peel + tilt. */
    onCellTouch(e) {
      const { s, i, key } = e.currentTarget.dataset;
      if (key === this.data.activeKey) return;
      const c = this.data.sections[s] && this.data.sections[s].cells[i];
      if (!c) return;
      const patch = { activeKey: key, activeLabel: c.label, activeCat: c.cat };
      if (!c.peelUri) {
        const px = Math.max(32, Math.round(Number(this.data.size) || 44));
        const peel = stickerFace(c.name, px, c.name, { peel: true, idPrefix: 'll-sp-p' });
        if (peel) patch[`sections[${s}].cells[${i}].peelUri`] = wrapSvg(peel.svg, peel.w, peel.h);
      }
      this.setData(patch);
    },
    onCellTap(e) {
      const { s, i } = e.currentTarget.dataset;
      const c = this.data.sections[s] && this.data.sections[s].cells[i];
      if (!c) return;
      this.triggerEvent('select', {
        name: c.name,
        label: c.label,
        category: c.category,
        categoryLabel: c.cat,
        tags: c.tags || [],
      });
      if (this.data.closeOnSelect) this.onOutsideClose();
    },

    // --- catalog ------------------------------------------------------------
    __entries() {
      if (!this.__catalog) {
        const all = [];
        for (const [category, defs] of Object.entries(stickerBatches)) {
          for (const [name, def] of Object.entries(defs || {})) {
            all.push({
              name,
              label: stickerLabel(name),
              category,
              cat: categoryLabel(category),
              tags: (def && def.tags) || [],
            });
          }
        }
        this.__all = all;
        this.__known = new Map(all.map((e) => [e.name, e]));
        this.__catalog = true;
      }
      const list = this.data.stickers;
      if (!Array.isArray(list)) return this.__all;
      // upstream catalogFrom — the given names, under your own labels
      return list
        .map((raw) => {
          const name = typeof raw === 'string' ? raw : raw && raw.name;
          if (!name) return null;
          const base =
            this.__known.get(name) ||
            (hasSticker(name)
              ? { name, label: stickerLabel(name), category: 'stickers', cat: 'Stickers', tags: [] }
              : null);
          if (!base) return null;
          if (typeof raw === 'string') return base;
          const category = raw.category || base.category;
          return {
            ...base,
            label: raw.label || base.label,
            category,
            cat: raw.category ? categoryLabel(raw.category) : base.cat,
            tags: [...base.tags, ...(raw.tags || [])],
          };
        })
        .filter(Boolean);
    },
    __matches(e, words) {
      const hay = `${e.label} ${e.name} ${e.cat} ${e.tags.join(' ')}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    },
    __cell(e, key) {
      const px = Math.max(32, Math.round(Number(this.data.size) || 44));
      const face = stickerFace(e.name, px, e.name, { idPrefix: 'll-sp' });
      if (!face) return null;
      return {
        key,
        name: e.name,
        label: e.label,
        category: e.category,
        cat: e.cat,
        tags: e.tags,
        sel: this.data.value === e.name,
        uri: wrapSvg(face.svg, face.w, face.h),
        w: face.w,
        h: face.h,
        peelUri: '',
      };
    },
    __refresh() {
      if (this.__reveal) clearTimeout(this.__reveal);
      const d = this.data;
      const entries = this.__entries();
      // category chips (catalog order, "All" first)
      const seen = new Map();
      for (const e of entries) if (!seen.has(e.category)) seen.set(e.category, e.cat);
      const cats = [...seen].map(([key, label]) => ({ key, label }));

      const words = d.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const unfiltered = words.length === 0 && d.category === 'all';
      let all = [];
      let emptyText = '';
      if (!unfiltered) {
        const found = entries.filter((e) => (d.category === 'all' || e.category === d.category) && this.__matches(e, words));
        all = found.length
          ? [{
              key: 'found',
              label: words.length ? `${found.length} found` : seen.get(d.category) || '',
              cells: found.map((e, _i) => this.__cell(e, `found:${e.name}`)).filter(Boolean),
            }]
          : [];
        emptyText = d.query.trim()
          ? `Nothing looks like "${d.query.trim()}".`
          : 'No stickers to choose from.';
      } else {
        const byName = new Map(entries.map((e) => [e.name, e]));
        const recent = (Array.isArray(d.recent) ? d.recent : [])
          .map((n) => byName.get(n))
          .filter(Boolean);
        if (recent.length) {
          all.push({ key: 'recent', label: 'Recent', cells: recent.map((e, _i) => this.__cell(e, `recent:${e.name}`)).filter(Boolean) });
        }
        for (const [key, label] of seen) {
          all.push({
            key,
            label,
            cells: entries.filter((e) => e.category === key).map((e, _i) => this.__cell(e, `${key}:${e.name}`)).filter(Boolean),
          });
        }
      }
      all = all.filter((s) => s.cells.length);

      // progressive disclosure — upstream reveals two sections per 24ms
      this.__allSections = all;
      const total = all.reduce((n, s) => n + s.cells.length, 0);
      const first = all[0] && all[0].cells[0];
      const shown = unfiltered ? Math.min(2, all.length) : all.length;
      const activeKey = d.activeKey && all.some((s) => s.cells.some((c) => c.key === d.activeKey))
        ? d.activeKey
        : (first && first.key) || '';
      const flat = new Map();
      for (const s of all) for (const c of s.cells) flat.set(c.key, c);
      this.__flat = flat;
      const cur = flat.get(activeKey);
      this.setData({
        cats,
        sections: all.slice(0, shown),
        total,
        emptyText,
        activeKey,
        activeLabel: cur ? cur.label : '',
        activeCat: cur ? cur.cat : '',
      });
      if (unfiltered && shown < all.length) {
        this.__shown = shown;
        this.__revealMore();
      }
    },
    __revealMore() {
      this.__reveal = setTimeout(() => {
        this.__shown = Math.min((this.__shown || 0) + 2, this.__allSections.length);
        this.setData({ sections: this.__allSections.slice(0, this.__shown) });
        if (this.__shown < this.__allSections.length && this.data.visible) this.__revealMore();
      }, 24);
    },
  },
});
