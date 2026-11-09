const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// Harness note: relations never link under miniprogram-simulate, so the
// trigger↔root wiring is injected by stubbing getRelationNodes on the
// trigger instance (the real lookup returns [] here). The root/leaf state
// machines below are otherwise untouched component code.

describe('ll-collapsible (root)', () => {
  test('toggle() flips the state, announces openchange and renders is-open', async () => {
    const comp = mount('collapsible/collapsible');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    expect(comp.instance.toggle()).toBe(true);
    expect(comp.instance.data.open).toBe(true);
    expect(trigger).toHaveBeenCalledWith('openchange', { open: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-collapsible').dom.className).toContain('is-open');
    expect(comp.instance.toggle()).toBe(false);
  });

  test('the controlled open prop drives the state without firing openchange', () => {
    const comp = mount('collapsible/collapsible');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.setData({ open: true });
    expect(comp.instance.data.open).toBe(true);
    comp.setData({ open: false });
    expect(comp.instance.data.open).toBe(false);
    expect(trigger).not.toHaveBeenCalled(); // property path, not user toggle
  });

  test('defaultOpen starts expanded', () => {
    const comp = mount('collapsible/collapsible', { defaultOpen: true });
    expect(comp.instance.data.open).toBe(true);
  });

  test('__applyOpenProp is idempotent on same-value writes', () => {
    const comp = mount('collapsible/collapsible');
    comp.setData({ open: true });
    expect(comp.instance.data.open).toBe(true);
    comp.setData({ open: true }); // no state flip
    expect(comp.instance.data.open).toBe(true);
    comp.setData({ open: false });
    expect(comp.instance.data.open).toBe(false);
  });
});

describe('ll-collapsible-trigger', () => {
  test('tap toggles the root (relation injected) and re-emits toggle', async () => {
    const root = mount('collapsible/collapsible');
    const comp = mount('collapsible-trigger/collapsible-trigger');
    // relations never link here — inject the lookup on both ends
    comp.instance.getRelationNodes = () => [root.instance];
    root.instance.getRelationNodes = () => [comp.instance];
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onRoot({ open: false });
    expect(comp.instance.data.open).toBe(false);
    comp.querySelector('.ll-collapsible-trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(root.instance.data.open).toBe(true);
    expect(trigger).toHaveBeenCalledWith('toggle');
    expect(comp.instance.data.open).toBe(true); // the root pushed back
    comp.querySelector('.ll-collapsible-trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(root.instance.data.open).toBe(false);
    expect(comp.instance.data.open).toBe(false);
  });
});

describe('ll-collapsible-content', () => {
  test('__onRoot folds between the expanded height and 0', async () => {
    const comp = mount('collapsible-content/collapsible-content');
    expect(comp.instance.data.height).toBe('0px');
    comp.instance.__onRoot({ open: true });
    await simulate.sleep(80); // measure hop
    // the folded box measures 0 in jsdom, so the open height falls back to auto
    expect(comp.instance.data.height).toBe('auto');
    expect(comp.querySelector('.ll-collapsible-content').dom.className).toContain('is-open');
    comp.instance.__onRoot({ open: false });
    await simulate.sleep(80);
    expect(comp.instance.data.height).toBe('0px');
    expect(comp.querySelector('.ll-collapsible-content').dom.className).not.toContain('is-open');
  });

  test('same-value pushes are ignored; a true bracket arms the ink recipe', async () => {
    const comp = mount('collapsible-content/collapsible-content');
    comp.instance.__onRoot({ open: false }); // already closed — no fold
    expect(comp.instance.data.height).toBe('0px');
    comp.setData({ bracket: true });
    await simulate.sleep(10);
    expect(comp.instance.data.llInkRecipe).toBe('margin-bracket');
    expect(comp.instance.data.bracketKind).toBe('square');
  });
});
