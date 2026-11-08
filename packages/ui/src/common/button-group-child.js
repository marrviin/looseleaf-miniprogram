// Behavior for the children of an ll-button-group (ll-button, ll-input,
// ll-button-group-text, ll-button-group-separator, nested ll-button-groups):
// they register with their NEAREST ancestor group, report their center for
// the seam order and receive the ready clip-path string as `trimStyle`.
//
// The group hands out one shared stroke: a child that is not first loses its
// start edge, one before a separator loses its end edge (upstream
// [--cl-s:15px] / [--cl-e:15px] + clip-path on the ink svg).
//
// The ancestor relation itself must be declared by each child component
// (relations did not link when declared only here): pair this behavior with
// buttonGroupChildRelation() in the component's own `relations`. The key must
// be the same relative path passed to the behavior's `groupKey`.
export const BUTTON_GROUP_CHILD_RELATION = buttonGroupChildRelation('../button-group/button-group');

export function buttonGroupChildRelation(_groupKey) {
  return {
    type: 'ancestor',
    linked() {
      if (this.__depth != null) this.__depth = null; // depth may have changed
      setTimeout(() => this.__pickGroup(), 0);
    },
    unlinked() {
      this.__depth = null;
      setTimeout(() => this.__pickGroup(), 0);
    },
  };
}

export function buttonGroupChildBehavior(rootSelector, groupKey = '../button-group/button-group') {
  return Behavior({
    lifetimes: {
      detached() {
        if (this.__bg) {
          this.__bg.__kidExit(this);
          this.__bg = null;
        }
      },
    },
    methods: {
      __trimIsSep() {
        return false;
      },
      __isGroup() {
        return false;
      },
      /** Choose the nearest ancestor button-group (the deepest one — a
          nested group trims its own kids) and join its trim order. */
      __pickGroup() {
        const groups = this.getRelationNodes(groupKey) || [];
        if (this.__bg) {
          this.__bg.__kidExit(this);
          this.__bg = null;
        }
        if (!groups.length) return;
        let best = groups[0];
        for (const g of groups) if (g.__getDepth() > best.__getDepth()) best = g;
        this.__bg = best;
        best.__kidEnter(this);
      },
      /** Center of this child's root box, for the group's axis ordering. */
      __trimCenter(cb) {
        wx
          .createSelectorQuery()
          .in(this)
          .select(rootSelector)
          .boundingClientRect((r) => {
            cb(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height } : { x: 0, y: 0, w: 0, h: 0 });
          })
          .exec();
      },
    },
  });
}
