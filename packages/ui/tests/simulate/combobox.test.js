const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

const ITEMS = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta' },
  { separator: true },
  { group: 'More', items: [{ value: 'gamma', disabled: true }] },
];

describe('ll-combobox', () => {
  test("single: the picked item's label shows; unknown values fall back to themselves", async () => {
    const comp = mount('combobox/combobox', { items: ITEMS, value: 'alpha' });
    await simulate.sleep(10);
    expect(comp.instance.data.fieldText).toBe('Alpha');
    expect(comp.instance.data.hasValue).toBe(true);

    comp.setData({ value: 'nope' });
    await simulate.sleep(10);
    expect(comp.instance.data.fieldText).toBe('nope');
  });

  test('trigger tap opens the slip (openchange true); tapping again closes', async () => {
    const comp = mount('combobox/combobox', { items: ITEMS });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-combobox__field').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('openchange', { value: true });
    expect(comp.instance.data.visible).toBe(true);

    trigger.mockClear();
    comp.querySelector('.ll-combobox__field').dispatchEvent('tap');
    await simulate.sleep(200);
    expect(trigger).toHaveBeenCalledWith('openchange', { value: false });
    expect(comp.instance.data.visible).toBe(false);
  });

  test('search filtering hides non-matches (subsequence over value+label)', async () => {
    const comp = mount('combobox/combobox', { items: ITEMS });
    const inst = comp.instance;
    inst.__show();
    await simulate.sleep(10);

    inst.onSearchInput({ detail: { value: 'alp' } });
    await simulate.sleep(10);
    expect(inst.data.query).toBe('alp');
    const rows = inst.data.rows.filter((r) => r.type === 'item');
    expect(rows.find((r) => r.value === 'alpha').hidden).toBe(false);
    expect(rows.find((r) => r.value === 'beta').hidden).toBe(true);
    expect(inst.data.visibleCount).toBe(1);

    inst.onSearchInput({ detail: { value: 'zzz' } });
    await simulate.sleep(10);
    expect(inst.data.emptyVisible).toBe(true);
  });

  test('single pick: item tap sets the value, fires change + openchange and closes', async () => {
    const comp = mount('combobox/combobox', { items: ITEMS });
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.__show();
    await simulate.sleep(20);
    inst.onItemTap({ currentTarget: { dataset: { value: 'alpha' } } });
    await simulate.sleep(200);
    expect(trigger).toHaveBeenCalledWith('change', { value: 'alpha' });
    expect(trigger).toHaveBeenCalledWith('openchange', { value: false });
    expect(inst.data.value).toBe('alpha');
    expect(inst.data.visible).toBe(false);
  });

  test('multiple: chips render from the value array; taps toggle membership', async () => {
    const comp = mount('combobox/combobox', { items: ITEMS, multiple: true, value: ['alpha', 'beta'] });
    await simulate.sleep(20);
    const inst = comp.instance;
    expect(inst.data.chips.map((c) => c.label)).toEqual(['Alpha', 'beta']);
    expect(inst.data.chipPlaceholder).toBe(''); // chips present → no placeholder

    const trigger = jest.spyOn(inst, 'triggerEvent');
    inst.onItemTap({ currentTarget: { dataset: { value: 'beta' } } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: ['alpha'] });

    inst.onItemTap({ currentTarget: { dataset: { value: 'beta' } } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: ['alpha', 'beta'] });
  });

  test('chip remove fires change with the remaining array', async () => {
    const comp = mount('combobox/combobox', { items: ITEMS, multiple: true, value: ['alpha', 'beta'] });
    await simulate.sleep(20);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.instance.onChipRemove({ currentTarget: { dataset: { value: 'alpha' } } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: ['beta'] });
    expect(comp.instance.data.chips.map((c) => c.label)).toEqual(['beta']);
  });

  test('creatable: typed unknown text offers "Add ..." and create adopts it', async () => {
    const comp = mount('combobox/combobox', { items: ITEMS, editable: true, creatable: true });
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onFieldInput({ detail: { value: 'zzz' } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('openchange', { value: true });
    expect(inst.data.createValue).toBe('zzz');
    expect(inst.data.emptyVisible).toBe(false);

    inst.onCreateTap();
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('create', { value: 'zzz' });
    expect(trigger).toHaveBeenCalledWith('change', { value: 'zzz' });
    expect(inst.data.value).toBe('zzz');
  });

  test('clear button empties the value and fires change with ""', async () => {
    const comp = mount('combobox/combobox', { items: ITEMS, value: 'alpha', editable: true, showClear: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onClearTap();
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: '' });
    expect(comp.instance.data.fieldText).toBe('');
    expect(comp.instance.data.hasValue).toBe(false);
  });
});
