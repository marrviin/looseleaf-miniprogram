const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// Harness note: descendant/ancestor relations never link under
// miniprogram-simulate (getRelationNodes stays empty), so the composite
// tabs-tree is untestable here. The root/trigger/content/list logic is
// exercised component-by-component; cross-component sync paths that don't
// need relations (__onGroup pushes, tap adoption + change events) are wired
// manually where the component would otherwise look the value up itself.

describe('ll-tabs (root)', () => {
  test('uncontrolled: defaultValue is adopted as the current tab', async () => {
    const comp = mount('tabs/tabs', { defaultValue: 'b' });
    await simulate.sleep(10);
    expect(comp.instance.data.current).toBe('b');
    // uncontrolled: the value prop itself stays untouched
    expect(comp.instance.data.value).toBe('');
  });

  test('__onTriggerTap adopts the value, syncs and emits change', async () => {
    const comp = mount('tabs/tabs');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onTriggerTap('x');
    expect(comp.instance.data.current).toBe('x');
    expect(trigger).toHaveBeenCalledWith('change', { value: 'x' });
    // same-value taps are no-ops
    trigger.mockClear();
    comp.instance.__onTriggerTap('x');
    expect(trigger).not.toHaveBeenCalled();
  });

  test('controlled value prop wins over defaultValue', async () => {
    const comp = mount('tabs/tabs', { defaultValue: 'b' });
    await simulate.sleep(10);
    comp.setData({ value: 'c' });
    await simulate.sleep(10);
    expect(comp.instance.data.current).toBe('c');
  });
});

describe('ll-tabs-trigger', () => {
  test('__onGroup flips checked and carries the orientation down', async () => {
    const comp = mount('tabs-trigger/tabs-trigger', { value: 'a' });
    comp.instance.__onGroup({ value: 'a', orientation: 'horizontal' });
    expect(comp.instance.data.checked).toBe(true);
    expect(comp.querySelector('.ll-tabs-trigger').dom.className).toContain('ll-tabs-trigger--active');
    comp.instance.__onGroup({ value: 'b', orientation: 'vertical' });
    expect(comp.instance.data.checked).toBe(false);
    expect(comp.instance.data.tabOrientation).toBe('vertical');
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-tabs-trigger').dom.className).toContain('ll-tabs-trigger--vertical');
  });

  test('tap forwards to the root through the group and re-emits tap', async () => {
    const comp = mount('tabs-trigger/tabs-trigger', { value: 'a' });
    const onTriggerTap = jest.fn();
    comp.instance.__group = { __onTriggerTap: onTriggerTap };
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-tabs-trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(onTriggerTap).toHaveBeenCalledWith('a');
    expect(trigger).toHaveBeenCalledWith('tap', { value: 'a' });
  });

  test('disabled triggers stay silent', async () => {
    const comp = mount('tabs-trigger/tabs-trigger', { value: 'a', disabled: true });
    const onTriggerTap = jest.fn();
    comp.instance.__group = { __onTriggerTap: onTriggerTap };
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    expect(comp.querySelector('.ll-tabs-trigger').dom.className).toContain('ll-tabs-trigger--disabled');
    comp.querySelector('.ll-tabs-trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(onTriggerTap).not.toHaveBeenCalled();
    expect(trigger).not.toHaveBeenCalled();
  });
});

describe('ll-tabs-content', () => {
  test('__onGroup mounts only the active panel', async () => {
    const comp = mount('tabs-content/tabs-content', { value: 'a' });
    expect(comp.querySelector('.ll-tabs-content')).toBeFalsy(); // inactive panels unmount
    comp.instance.__onGroup({ value: 'a', orientation: 'horizontal' });
    expect(comp.instance.data.active).toBe(true);
    expect(comp.querySelector('.ll-tabs-content')).toBeTruthy();
    comp.instance.__onGroup({ value: 'b', orientation: 'horizontal' });
    expect(comp.instance.data.active).toBe(false);
    expect(comp.querySelector('.ll-tabs-content')).toBeFalsy();
  });
});

describe('ll-tabs-list', () => {
  test('__onGroup syncs orientation and fans variant out to its triggers', () => {
    const comp = mount('tabs-list/tabs-list');
    comp.instance.__onGroup({ value: 'a', orientation: 'vertical' });
    expect(comp.instance.data.orientation).toBe('vertical');
    const seen = [];
    comp.instance.__triggers = [{ __onList: (d) => seen.push(d) }];
    comp.instance.__sync();
    expect(seen).toHaveLength(1);
    expect(seen[0]).toMatchObject({ orientation: 'vertical' });
  });
});
