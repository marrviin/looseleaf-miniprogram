import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';

ensureHandFont();

/** ll-command — upstream Command (cmdk's Command): the palette root. It
    lies on a slip of paper of its own (stock slip, cut edge, lift shadow —
    `sheet: false` draws none, e.g. inside a dialog that already is paper).
    The rows are ll-command-item descendants; typing in ll-command-input
    calls onSearch here, which fuzzy-matches each item against its
    value/keywords/label, hides misses, highlights the first hit, recounts
    groups and tells the empty state and the separators. WeChat has no
    arrow keys — the highlight marks the first match and picking is a tap. */
createComponent({
  options: {
    styleIsolation: 'isolated',
  },
  properties: {
    /** Draw the slip (Paper stock slip, edge cut, tilt off, shadow lift). */
    sheet: {
      type: Boolean,
      value: true,
    },
    /** Accessible name. */
    ariaLabel: String,
    /** cmdk shouldFilter — false leaves every row in (server-side results). */
    shouldFilter: {
      type: Boolean,
      value: true,
    },
    // Paper overrides (upstream sheet={stock:'napkin'} etc.).
    stock: {
      type: String,
      value: 'slip',
    },
    edge: {
      type: null,
      optionalTypes: [String, Object],
      value: 'cut',
    },
    tilt: {
      type: null,
      optionalTypes: [Boolean, Number, String],
      value: false,
    },
    tape: {
      type: null,
      optionalTypes: [String, Boolean],
      value: false,
    },
    seed: {
      type: null,
      optionalTypes: [String, Number],
      value: '',
    },
    customStyle: String,
  },
  data: {},
  relations: {
    '../command-input/command-input': {
      type: 'descendant',
      linked() {},
      unlinked() {},
    },
    '../command-item/command-item': {
      type: 'descendant',
      linked() {},
      unlinked() {},
    },
    '../command-group/command-group': {
      type: 'descendant',
      linked() {},
      unlinked() {},
    },
    '../command-empty/command-empty': {
      type: 'descendant',
      linked() {},
      unlinked() {},
    },
    '../command-separator/command-separator': {
      type: 'descendant',
      linked() {},
      unlinked() {},
    },
  },
  lifetimes: {
    ready() {
      // Initial pass: highlight the first row (cmdk selects the first item).
      // Relations settle after ready; give them a beat.
      setTimeout(() => this.onSearch(''), 50);
    },
    detached() {
      if (this.__linkTimer) clearTimeout(this.__linkTimer);
    },
  },
  methods: {
    /** A row/group/empty mounted or unmounted (wx:if in the demo — e.g. a
        server search swaps the list for Stubby): recount on the next tick
        so the freshly-mounted tree reflects the current search. */
    onChildLinked() {
      if (this.__linkTimer) return;
      this.__linkTimer = setTimeout(() => {
        this.__linkTimer = null;
        this.onSearch(this.__search || '');
      }, 0);
    },
    /** The input typed — filter, re-highlight, recount. */
    onSearch(raw) {
      const q = String(raw || '').trim().toLowerCase();
      this.__search = q;
      const items = this.getRelationNodes('../command-item/command-item') || [];
      let count = 0;
      let first = null;
      const doFilter = this.data.shouldFilter;
      items.forEach((it) => {
        let hit = true;
        if (doFilter && q) hit = this.__matches(q, it.__matchText());
        if (doFilter) it.__setHidden(!hit);
        else it.__setHidden(false);
        if (hit && !it.data.disabled) {
          count += 1;
          if (!first) first = it;
        }
      });
      items.forEach((it) => it.__setSelected(it === first));
      (this.getRelationNodes('../command-group/command-group') || []).forEach((g) => g.recount());
      (this.getRelationNodes('../command-separator/command-separator') || []).forEach((s) =>
        s.setSearching(!!q)
      );
      (this.getRelationNodes('../command-empty/command-empty') || []).forEach((e) => e.setCount(count));
      (this.getRelationNodes('../command-input/command-input') || []).forEach((i) =>
        i.setStatus(q, count)
      );
      this.triggerEvent('search', { value: raw, count });
    },
    /** cmdk's fuzzy match, simplified: every query char in order
        (subsequence) over value + keywords + label. */
    __matches(q, text) {
      const t = String(text || '').toLowerCase();
      let i = 0;
      for (let k = 0; k < t.length && i < q.length; k++) {
        if (t[k] === q[i]) i += 1;
      }
      return i === q.length;
    },
    noop() {},
  },
});
