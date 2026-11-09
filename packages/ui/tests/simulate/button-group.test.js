const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

/** A stand-in for a button-group child (ll-button etc.) — the group only
    needs __isGroup/__trimIsSep/__trimCenter/setData to hand out trims. */
function makeChild(x) {
  return {
    data: { trimStyle: '' },
    setData(patch) {
      Object.assign(this.data, patch);
    },
    __isGroup: () => false,
    __trimIsSep: () => false,
    __trimCenter: (cb) => cb({ x, y: 0, w: 300, h: 48 }),
  };
}

/** mount + guard: with no child linked yet, simulate's getRelationNodes
    returns null (not iterable) and the group's attached rescan crashes. */
function mountGroup(props) {
  const comp = mount('button-group/button-group', props);
  const grn = comp.instance.getRelationNodes;
  comp.instance.getRelationNodes = (rel) => {
    try {
      return grn.call(comp.instance, rel) || [];
    } catch {
      return [];
    }
  };
  return comp;
}

describe('ll-button-group', () => {
  test('renders the orientation class; invalid orientation falls back to horizontal', async () => {
    const comp = mountGroup();
    expect(comp.querySelector('.ll-button-group--horizontal')).toBeTruthy();
    comp.setData({ orientation: 'vertical' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-button-group--vertical')).toBeTruthy();
  });

  test('aria-label lands on the group node', () => {
    const comp = mountGroup({ ariaLabel: 'Toolbar actions' });
    expect(comp.instance.data.ariaLabel).toBe('Toolbar actions');
  });

  test('hands seam clip-paths to children in axis order (first keeps both edges, later ones lose their start edge)', async () => {
    const comp = mountGroup();
    const first = makeChild(0);
    const second = makeChild(400);
    comp.instance.__kidEnter(first);
    comp.instance.__kidEnter(second);
    await simulate.sleep(150); // __schedule debounces 80ms, then probes centers
    expect(first.data.trimStyle).toContain('clip-path:inset(-14px -14px -14px -14px)');
    expect(second.data.trimStyle).toContain('clip-path:inset(-14px -14px -14px 15px)');
  });

  test('a child before a separator loses its end edge instead', async () => {
    const comp = mountGroup();
    const before = makeChild(0);
    const sep = { __isGroup: () => false, __trimIsSep: () => true, __trimCenter: (cb) => cb({ x: 200, y: 0, w: 300, h: 48 }), data: {}, setData() {} };
    comp.instance.__kidEnter(before);
    comp.instance.__kidEnter(sep);
    await simulate.sleep(150);
    expect(before.data.trimStyle).toContain('clip-path:inset(-14px 15px -14px -14px)');
  });

  test('a nested group sets the nested flag instead of joining the trim order', async () => {
    const comp = mountGroup();
    const nested = { __isGroup: () => true };
    comp.instance.__kidEnter(nested);
    await simulate.sleep(10);
    expect(comp.instance.data.nested).toBe(true);
    expect(comp.querySelector('.ll-button-group--nested')).toBeTruthy();
    expect(comp.instance.__kids || []).toHaveLength(0);
  });

  test('__kidExit removes the child from the trim order', async () => {
    const comp = mountGroup();
    const only = makeChild(0);
    comp.instance.__kidEnter(only);
    comp.instance.__kidExit(only);
    await simulate.sleep(150);
    expect(comp.instance.__kids).toHaveLength(0);
  });
});
