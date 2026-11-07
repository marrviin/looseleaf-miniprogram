import { createComponent } from '../../common/component';
import { buttonGroupChildBehavior, buttonGroupChildRelation } from '../../common/button-group-child';
import { props, validators } from './props';

const EDGE = 14; // clip bleed the ink keeps on untrimmed sides (upstream -14px)
const TRIM = 15; // how much of the seam edge is clipped away (upstream 15px)

/** Upstream `ButtonGroup` — buttons, fields and printed cells joined into one
    row (or column) that share their seams. The group draws nothing itself:
    it hands each child a clip-path (trimStyle) so a child that is not first
    loses its start edge, and one that sits before a separator loses its end
    edge — a seam is one stroke, not two.

    Children register over relations and report their own center; the group
    sorts along the axis and assigns the trims. A child nested in two groups
    registers only with the nearest one (a nested group trims its own kids). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  // Nested groups register with their outer group (via the child behavior's
  // ancestor relation) so the outer can turn the nested gap on.
  behaviors: [buttonGroupChildBehavior('.ll-button-group', './button-group')],
  data: {
    o: 'horizontal',
    nested: false,
  },
  relations: {
    // Self-nested groups need BOTH directions toward the same component file,
    // which one key can't express: the descendant role (outer group → inner
    // groups) uses the canonical path, the ancestor role (inner group → outer
    // group) uses the './' spelling of the same file — two keys, one target.
    '../button-group/button-group': { type: 'descendant', linked() { this.__relChange(); }, unlinked() { this.__relChange(); } },
    './button-group': buttonGroupChildRelation('./button-group'),
    '../button/button': { type: 'descendant', linked() { this.__relChange(); }, unlinked() { this.__relChange(); } },
    '../button-group-text/button-group-text': { type: 'descendant', linked() { this.__relChange(); }, unlinked() { this.__relChange(); } },
    '../input/input': { type: 'descendant', linked() { this.__relChange(); }, unlinked() { this.__relChange(); } },
    '../button-group-separator/button-group-separator': { type: 'descendant', linked() { this.__relChange(); }, unlinked() { this.__relChange(); } },
  },
  observers: {
    orientation(orientation) {
      this.setData({ o: validators.orientation.includes(orientation) ? orientation : 'horizontal' });
      this.__schedule(true);
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        o: validators.orientation.includes(this.data.orientation) ? this.data.orientation : 'horizontal',
      });
      setTimeout(() => this.__rescan(), 0);
    },
  },
  methods: {
    /** Depth among nested groups (0 = topmost); children pick the deepest
        ancestor group as their trim owner. */
    __getDepth() {
      if (this.__depth != null) return this.__depth;
      const parents = this.getRelationNodes('./button-group');
      this.__depth = parents && parents.length ? parents[0].__getDepth() + 1 : 0;
      return this.__depth;
    },
    /** A child linked or unlinked anywhere in the subtree. */
    __relChange() {
      setTimeout(() => this.__rescan(), 0);
    },
    /** Re-decide which children register here (nearest group wins) and
        re-apply the trims. Called on any link/unlink in the subtree. */
    __rescan() {
      for (const rel of [
        '../button-group/button-group', // nested groups pick their outer group
        '../button/button',
        '../button-group-text/button-group-text',
        '../input/input',
        '../button-group-separator/button-group-separator',
      ]) {
        for (const node of this.getRelationNodes(rel)) {
          if (node.__pickGroup) node.__pickGroup();
        }
      }
    },
    __isGroup() {
      return true;
    },
    /** A child picked this group as its nearest — join the trim order. */
    __kidEnter(node) {
      if (node.__isGroup()) {
        // A nested group: no trim of its own, just the outer gap.
        if (!this.data.nested) this.setData({ nested: true });
        return;
      }
      const kids = this.__kids || (this.__kids = []);
      const seps = this.__seps || (this.__seps = []);
      if (node.__trimIsSep()) {
        if (!seps.includes(node)) seps.push(node);
      } else if (!kids.includes(node)) {
        kids.push(node);
      }
      this.__schedule();
    },
    __kidExit(node) {
      if (this.__kids) this.__kids = this.__kids.filter((k) => k !== node);
      if (this.__seps) this.__seps = this.__seps.filter((k) => k !== node);
      this.__schedule();
    },
    __schedule(force) {
      if (this.__t) clearTimeout(this.__t);
      this.__t = setTimeout(() => {
        this.__t = null;
        this.__applyTrims(force);
      }, 80);
    },
    /** Probe every registered child's center, order them along the axis and
        hand out the clip-paths. */
    __applyTrims(force) {
      const nodes = [...(this.__kids || []), ...(this.__seps || [])];
      if (!nodes.length) return;
      let pending = nodes.length;
      const centers = [];
      let retried = false;
      const done = () => {
        if (--pending > 0) return;
        if (centers.some((c) => !c || (c.w === 0 && c.h === 0)) && !retried) {
          // not laid out yet — try once more
          retried = true;
          pending = nodes.length;
          setTimeout(() => probeAll(), 120);
          return;
        }
        this.__assign(centers);
      };
      const probeAll = () => {
        centers.length = 0;
        pending = nodes.length;
        for (const n of nodes) {
          n.__trimCenter((c) => {
            centers.push({ node: n, ...c });
            done();
          });
        }
      };
      probeAll();
      if (force) this.__sorted = null;
    },
    __assign(centers) {
      const vertical = this.data.o === 'vertical';
      const key = (c) => (vertical ? c.y * 100000 + c.x : c.x * 100000 + c.y);
      centers.sort((a, b) => key(a) - key(b));
      const kids = new Set(this.__kids || []);
      centers.forEach((c, i) => {
        if (!kids.has(c.node)) return; // separators take no trim
        const prev = centers[i - 1];
        const next = centers[i + 1];
        // A child that is not first loses its start edge; one right after a
        // separator still does (the separator draws that seam). A child
        // before a separator loses its end edge.
        const trimStart = !!prev;
        const trimEnd = !!(next && !kids.has(next.node));
        const e = trimEnd ? TRIM : -EDGE;
        const s = trimStart ? TRIM : -EDGE;
        const style = vertical
          ? `clip-path:inset(${s}px -${EDGE}px ${e}px -${EDGE}px)`
          : `clip-path:inset(-${EDGE}px ${e}px -${EDGE}px ${s}px)`;
        if (c.node.data.trimStyle !== style) c.node.setData({ trimStyle: style });
      });
    },
  },
});
