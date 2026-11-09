const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b' },
  { separator: true },
  { group: 'More', items: [{ value: 'c', disabled: true }, { value: 'd' }] },
];

describe('ll-select', () => {
  test('options fold into rows (items, separators, group labels) and the picked label shows', async () => {
    const comp = mount('select/select', { options: OPTIONS, value: 'a' });
    await simulate.sleep(10);
    const rows = comp.instance.data.rows;
    expect(rows.map((r) => r.type)).toEqual(['item', 'item', 'sep', 'label', 'item', 'item']);
    expect(comp.instance.data.displayLabel).toBe('Alpha');
    expect(comp.instance.data.hasValue).toBe(true);
    // the disabled item keeps its flag; plain strings in groups fold to their value
    expect(rows[4]).toMatchObject({ value: 'c', disabled: true });
    expect(rows[5]).toMatchObject({ value: 'd', label: 'd' });
  });

  test('without a match the placeholder shows and hasValue is false', async () => {
    const comp = mount('select/select', { options: OPTIONS, placeholder: 'Pick one' });
    await simulate.sleep(10);
    expect(comp.instance.data.displayLabel).toBe('Pick one');
    expect(comp.instance.data.hasValue).toBe(false);
  });

  test('trigger tap opens the slip and fires openchange; second tap closes', async () => {
    const comp = mount('select/select', { options: OPTIONS });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-select').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('openchange', { value: true });
    expect(comp.instance.data.open).toBe(true);
    expect(comp.instance.data.visible).toBe(true);

    trigger.mockClear();
    comp.querySelector('.ll-select').dispatchEvent('tap');
    await simulate.sleep(200); // 150ms exit animation
    expect(trigger).toHaveBeenCalledWith('openchange', { value: false });
    expect(comp.instance.data.visible).toBe(false);
  });

  test('picking an item sets the value and closes with change + openchange', async () => {
    const comp = mount('select/select', { options: OPTIONS });
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.__show();
    await simulate.sleep(20);
    inst.onItemTap({ currentTarget: { dataset: { value: 'b' } } });
    await simulate.sleep(200);
    expect(trigger).toHaveBeenCalledWith('change', { value: 'b' });
    expect(trigger).toHaveBeenCalledWith('openchange', { value: false });
    expect(inst.data.value).toBe('b');
    expect(inst.data.displayLabel).toBe('b');
    expect(inst.data.visible).toBe(false);
  });

  test('a disabled item ignores taps', () => {
    const comp = mount('select/select', { options: OPTIONS });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onItemTap({ currentTarget: { dataset: { value: 'c', disabled: true } } });
    expect(trigger).not.toHaveBeenCalled();
  });

  test('a disabled trigger never opens', async () => {
    const comp = mount('select/select', { options: OPTIONS, disabled: true });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-select').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.visible).toBe(false);
  });

  test('size class follows the size prop; disabled class too', () => {
    const comp = mount('select/select', { size: 'sm', disabled: true });
    const cls = comp.querySelector('.ll-select').dom.className;
    expect(cls).toContain('ll-select--sm');
    expect(cls).toContain('ll-select--disabled');
  });
});
