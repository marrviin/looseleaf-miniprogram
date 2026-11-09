const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// Harness note: descendant/ancestor relations never link under
// miniprogram-simulate, so the composite accordion tree is untestable here.
// Root/leaf state machines are exercised component-by-component with the
// item→trigger/content wiring injected by hand.

describe('ll-accordion (root)', () => {
  test('single: a trigger tap opens its row and announces the value', async () => {
    const comp = mount('accordion/accordion');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onTriggerTap('a');
    expect(comp.instance.data.open).toEqual(['a']);
    expect(trigger).toHaveBeenCalledWith('change', { value: 'a' });
  });

  test('single + non-collapsible: an open row cannot be closed by its trigger', () => {
    const comp = mount('accordion/accordion');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onTriggerTap('a');
    trigger.mockClear();
    comp.instance.__onTriggerTap('a');
    expect(comp.instance.data.open).toEqual(['a']);
    expect(trigger).not.toHaveBeenCalled();
  });

  test('single + collapsible: the second tap closes the row', () => {
    const comp = mount('accordion/accordion', { collapsible: true });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onTriggerTap('a');
    comp.instance.__onTriggerTap('a');
    expect(comp.instance.data.open).toEqual([]);
    expect(trigger).toHaveBeenLastCalledWith('change', { value: '' });
  });

  test('multiple: rows toggle independently and report arrays', () => {
    const comp = mount('accordion/accordion', { type: 'multiple', collapsible: true });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onTriggerTap('a');
    comp.instance.__onTriggerTap('b');
    expect(comp.instance.data.open).toEqual(['a', 'b']);
    expect(trigger).toHaveBeenLastCalledWith('change', { value: ['a', 'b'] });
    comp.instance.__onTriggerTap('a');
    expect(comp.instance.data.open).toEqual(['b']);
    expect(trigger).toHaveBeenLastCalledWith('change', { value: ['b'] });
  });

  test('controlled value prop re-syncs the open set', async () => {
    const comp = mount('accordion/accordion');
    comp.setData({ value: 'r2' });
    await simulate.sleep(10);
    expect(comp.instance.data.open).toEqual(['r2']);
    comp.setData({ value: ['r1', 'r2'] });
    await simulate.sleep(10);
    expect(comp.instance.data.open).toEqual(['r1', 'r2']);
  });

  test('defaultValue seeds the initial open set', () => {
    const comp = mount('accordion/accordion', { defaultValue: 'r1' });
    expect(comp.instance.data.open).toEqual(['r1']);
  });
});

describe('ll-accordion-item', () => {
  test('__onRoot applies open/disabled/bracket and forwards to trigger+content', () => {
    const comp = mount('accordion-item/accordion-item', { value: 'r1' });
    const fwd = [];
    comp.instance.__trigger = { __onItem: (s) => fwd.push(['trigger', s]) };
    comp.instance.__content = { __onItem: (s) => fwd.push(['content', s]) };
    comp.instance.__onRoot({ open: ['r1'], disabled: false, bracket: 'square' });
    expect(comp.instance.data.open).toBe(true);
    expect(comp.instance.data.bracket).toBe('square');
    expect(fwd).toEqual([
      ['trigger', { open: true, rowDisabled: false, bracket: 'square' }],
      ['content', { open: true, rowDisabled: false, bracket: 'square' }],
    ]);
  });

  test('rootDisabled freezes the row even when the row itself is not disabled', () => {
    const comp = mount('accordion-item/accordion-item', { value: 'r1' });
    comp.instance.__onRoot({ open: ['r1'], disabled: true, bracket: 'curly' });
    expect(comp.instance.data.rowDisabled).toBe(true);
  });

  test('__onTriggerTap is a no-op on a disabled row and harmless without a parent', () => {
    const comp = mount('accordion-item/accordion-item', { value: 'r1' });
    comp.instance.__onRoot({ open: [], disabled: true, bracket: 'curly' });
    expect(() => comp.instance.__onTriggerTap()).not.toThrow(); // rowDisabled guard
    comp.setData({ disabled: false });
    comp.instance.__onRoot({ open: [], disabled: false, bracket: 'curly' });
    expect(() => comp.instance.__onTriggerTap()).not.toThrow(); // relations dead → no parent
  });
});

describe('ll-accordion-trigger', () => {
  test('__onItem pushes open/disabled; tap forwards to the row item', async () => {
    const comp = mount('accordion-trigger/accordion-trigger');
    const onTriggerTap = jest.fn();
    comp.instance.__item = { __onTriggerTap: onTriggerTap };
    comp.instance.__onItem({ open: true, rowDisabled: false });
    expect(comp.instance.data.open).toBe(true);
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-accordion-trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(onTriggerTap).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveBeenCalledWith('tap', {});
    expect(comp.querySelector('.ll-accordion-trigger__chevron').dom.className)
      .toContain('ll-accordion-trigger__chevron--open');
  });

  test('disabled rows: no tap, but the touch highlighter stays off', async () => {
    const comp = mount('accordion-trigger/accordion-trigger');
    const onTriggerTap = jest.fn();
    comp.instance.__item = { __onTriggerTap: onTriggerTap };
    comp.instance.__onItem({ open: false, rowDisabled: true });
    expect(comp.querySelector('.ll-accordion-trigger').dom.className).toContain('ll-accordion-trigger--disabled');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-accordion-trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(onTriggerTap).not.toHaveBeenCalled();
    expect(trigger).not.toHaveBeenCalled();
  });
});

describe('ll-accordion-content', () => {
  test('__onItem mounts only the open panel with its margin bracket', async () => {
    const comp = mount('accordion-content/accordion-content');
    expect(comp.querySelector('.ll-accordion-content')).toBeFalsy();
    comp.instance.__onItem({ open: true, rowDisabled: false, bracket: 'curly' });
    expect(comp.instance.data.open).toBe(true);
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-accordion-content')).toBeTruthy();
    expect(comp.querySelector('.ll-accordion-content__inner').dom.className)
      .toContain('ll-accordion-content__inner--bracketed');
    comp.instance.__onItem({ open: false, rowDisabled: false, bracket: 'curly' });
    expect(comp.querySelector('.ll-accordion-content')).toBeFalsy();
  });
});
