const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// Harness note: relations never link under miniprogram-simulate, so the
// root's __sync fan-out is untestable as a tree. The root state machine
// (value toggle + shared-slip sizing) and the trigger/content push paths
// are exercised component-by-component with the owner wiring injected.

describe('ll-navigation-menu (root)', () => {
  test('starts closed with no shared slip', () => {
    const comp = mount('navigation-menu/navigation-menu');
    expect(comp.querySelector('.ll-navigation-menu')).toBeTruthy();
    expect(comp.instance.data.value).toBe('');
    expect(comp.querySelector('.ll-navigation-menu__slip')).toBeFalsy();
  });

  test('__onTrigger toggles the panel value and announces change', () => {
    const comp = mount('navigation-menu/navigation-menu');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onTrigger('docs');
    expect(comp.instance.data.value).toBe('docs');
    expect(trigger).toHaveBeenCalledWith('change', { value: 'docs' });
    comp.instance.__onTrigger('docs');
    expect(comp.instance.data.value).toBe('');
    expect(trigger).toHaveBeenLastCalledWith('change', { value: '' });
  });

  test('__reportPanel sizes the shared slip for the open panel only', async () => {
    const comp = mount('navigation-menu/navigation-menu');
    comp.instance.__onTrigger('docs');
    comp.instance.__reportPanel('docs', 300, 48);
    expect(comp.instance.data.slipW).toBe(300);
    expect(comp.instance.data.slipH).toBe(48);
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-navigation-menu__slip')).toBeTruthy();
    // a stale report from another panel is ignored
    comp.instance.__reportPanel('other', 120, 40);
    expect(comp.instance.data.slipW).toBe(300);
    // a zero size from the still-open panel clears it
    comp.instance.__reportPanel('docs', 0, 0);
    expect(comp.instance.data.slipW).toBe(0);
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-navigation-menu__slip')).toBeFalsy();
  });

  test('a stale zero report never hides the slip under a fresh panel', () => {
    const comp = mount('navigation-menu/navigation-menu');
    comp.instance.__onTrigger('b');
    comp.instance.__reportPanel('b', 200, 60);
    expect(comp.instance.data.slipW).toBe(200);
    comp.instance.__reportPanel('a', 0, 0); // panel A closing while B opens
    expect(comp.instance.data.slipW).toBe(200);
  });

  test('defaultValue/controlled value adoption', async () => {
    const comp = mount('navigation-menu/navigation-menu', { defaultValue: 'docs' });
    await simulate.sleep(10);
    expect(comp.instance.data.value).toBe('docs');
    comp.setData({ value: 'api' });
    await simulate.sleep(10);
    expect(comp.instance.data.value).toBe('api');
  });

  test('viewport=false drops the shared slip from the render', async () => {
    const comp = mount('navigation-menu/navigation-menu', { viewport: false });
    comp.instance.__onTrigger('docs');
    comp.instance.__reportPanel('docs', 300, 48);
    await simulate.sleep(10);
    // slipW is still reported, but the viewport-mode node isn't rendered
    expect(comp.querySelector('.ll-navigation-menu__slip')).toBeFalsy();
    expect(comp.querySelector('.ll-navigation-menu').dom.className).not.toContain('ll-navigation-menu--vp');
  });
});

describe('ll-navigation-menu-trigger', () => {
  test('__onRoot flips the open state; tap toggles through the root', async () => {
    const comp = mount('navigation-menu-trigger/navigation-menu-trigger');
    comp.instance.__navValue = 'docs';
    const onTrigger = jest.fn();
    comp.instance.__root = { __onTrigger: onTrigger };
    comp.instance.__onRoot({ open: true });
    expect(comp.instance.data.open).toBe(true);
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-navigation-menu-tab').dom.className).toContain('ll-navigation-menu-tab--open');
    comp.querySelector('.ll-navigation-menu-tab').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(onTrigger).toHaveBeenCalledWith('docs');
  });

  test('disabled triggers do not toggle', async () => {
    const comp = mount('navigation-menu-trigger/navigation-menu-trigger', { disabled: true });
    const onTrigger = jest.fn();
    comp.instance.__navValue = 'docs';
    comp.instance.__root = { __onTrigger: onTrigger };
    comp.querySelector('.ll-navigation-menu-tab').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(onTrigger).not.toHaveBeenCalled();
  });
});

describe('ll-navigation-menu-content', () => {
  test('__onRoot opens/closes the panel; closing reports a zero size', () => {
    const comp = mount('navigation-menu-content/navigation-menu-content');
    comp.instance.__navValue = 'docs';
    const report = jest.fn();
    comp.instance.__root = { __reportPanel: report };
    comp.instance.__onRoot({ open: true, viewport: true });
    expect(comp.instance.data.open).toBe(true);
    expect(comp.instance.data.inVp).toBe(true);
    comp.instance.__onRoot({ open: false, viewport: true });
    expect(comp.instance.data.open).toBe(false);
    expect(report).toHaveBeenCalledWith('docs', 0, 0);
  });

  test('no-viewport mode draws its own paper instead of the shared slip', () => {
    const comp = mount('navigation-menu-content/navigation-menu-content');
    comp.instance.__navValue = 'docs';
    comp.instance.__onRoot({ open: true, viewport: false });
    expect(comp.instance.data.inVp).toBe(false);
    expect(comp.querySelector('.ll-navigation-menu-content--own')).toBeTruthy();
  });
});

describe('ll-navigation-menu-item', () => {
  test('explicit value wins; auto item-<index> is the fallback', () => {
    const comp = mount('navigation-menu-item/navigation-menu-item');
    expect(comp.instance.__ensureValue()).toBe('item-0');
    comp.setData({ value: 'explicit' });
    comp.instance.__resolveValue();
    expect(comp.instance.__ensureValue()).toBe('explicit');
  });
});
