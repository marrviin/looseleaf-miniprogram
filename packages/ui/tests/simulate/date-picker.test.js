const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-date-picker', () => {
  test('value renders through the format (PP default: "Mar 5, 2024")', async () => {
    const comp = mount('date-picker/date-picker', { value: '2024-03-05' });
    await simulate.sleep(10);
    expect(comp.instance.data.shown).toBe('Mar 5, 2024');
    expect(comp.instance.data.hasValue).toBe(true);
  });

  test('defaultValue is adopted when value is empty', async () => {
    const comp = mount('date-picker/date-picker', { defaultValue: '2024-03-05' });
    await simulate.sleep(10);
    expect(comp.instance.data.shown).toBe('Mar 5, 2024');
    expect(comp.instance.data.value).toBe('2024-03-05');
  });

  test('range mode shows "from – to" and a trailing dash for an open range', async () => {
    const comp = mount('date-picker/date-picker', { mode: 'range', value: ['2024-03-05', '2024-03-09'] });
    await simulate.sleep(10);
    expect(comp.instance.data.shown).toBe('Mar 5, 2024 – Mar 9, 2024');

    const open = mount('date-picker/date-picker', { mode: 'range', value: ['2024-03-05'] });
    await simulate.sleep(10);
    expect(open.instance.data.shown).toBe('Mar 5, 2024 –');
  });

  test('typed keywords commit on confirm ("today" resolves via today prop)', async () => {
    const comp = mount('date-picker/date-picker', { today: '2024-03-01' });
    await simulate.sleep(10);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onInput({ detail: { value: 'today' } });
    expect(inst.data.shown).toBe('today');
    inst.onConfirm();
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: '2024-03-01' });
    expect(inst.data.value).toBe('2024-03-01');
    expect(inst.data.bad).toBe(false);
  });

  test('unreadable text sets the bad flag and fires no change; editing clears it', async () => {
    const comp = mount('date-picker/date-picker', { value: '2024-03-05' });
    await simulate.sleep(10);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onInput({ detail: { value: 'garbage' } });
    inst.onConfirm();
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalledWith('change', expect.anything());
    expect(inst.data.bad).toBe(true);

    inst.onInput({ detail: { value: '' } });
    expect(inst.data.bad).toBe(false);
  });

  test('min hatches earlier days: committing one turns the box red, no change', async () => {
    const comp = mount('date-picker/date-picker', { min: '2024-03-10', today: '2024-03-01' });
    await simulate.sleep(10);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onInput({ detail: { value: 'Mar 5, 2024' } });
    inst.onConfirm();
    await simulate.sleep(10);
    expect(inst.data.bad).toBe(true);
    expect(trigger).not.toHaveBeenCalledWith('change', expect.anything());
  });

  test('presets resolve keywords ("today") and close the slip when complete', async () => {
    const comp = mount('date-picker/date-picker', {
      presets: [{ label: 'Today', value: 'today' }, { label: 'Next week', value: 'in-a-week' }],
      today: '2024-03-01',
    });
    await simulate.sleep(10);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onPresetTap({ currentTarget: { dataset: { i: 1 } } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: '2024-03-08' });
    expect(trigger).toHaveBeenCalledWith('openchange', { value: false });
    expect(inst.data.value).toBe('2024-03-08');
  });

  test('calendar min/max flow into the disabled matchers', async () => {
    const comp = mount('date-picker/date-picker', { min: '2024-03-10', max: '2024-03-20' });
    await simulate.sleep(10);
    expect(comp.instance.data.calDisabled).toEqual([{ before: '2024-03-10' }, { after: '2024-03-20' }]);
  });

  test('placeholder and calendar label defaults follow the mode', async () => {
    const single = mount('date-picker/date-picker');
    await simulate.sleep(10);
    expect(single.instance.data.ph).toBe('Pick a date');
    expect(single.instance.data.calLabel).toBe('Choose date');

    const range = mount('date-picker/date-picker', { mode: 'range' });
    await simulate.sleep(10);
    expect(range.instance.data.ph).toBe('Pick a date range');
    expect(range.instance.data.calLabel).toBe('Choose dates');
  });
});
