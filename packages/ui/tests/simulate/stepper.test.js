const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-stepper', () => {
  test('starts from value, else defaultValue, else empty', async () => {
    const fromProp = mount('stepper/stepper', { value: 5 });
    await simulate.sleep(20);
    expect(fromProp.instance.data.inner).toBe(5);
    expect(fromProp.instance.data.shown).toBe('5');

    const fromDefault = mount('stepper/stepper', { defaultValue: 3 });
    await simulate.sleep(20);
    expect(fromDefault.instance.data.inner).toBe(3);

    const empty = mount('stepper/stepper');
    await simulate.sleep(20);
    expect(empty.instance.data.inner).toBeNull();
    expect(empty.instance.data.shown).toBe('');
  });

  test('button taps step by the step size, animate and fire change', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 5, step: 2 });
    await simulate.sleep(20);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onIncTap();
    await simulate.sleep(10);
    expect(inst.data.inner).toBe(7);
    expect(trigger).toHaveBeenCalledWith('change', { value: 7 });
    expect(inst.data.tick).toContain('up-');

    inst.onDecTap();
    await simulate.sleep(10);
    expect(inst.data.inner).toBe(5);
    expect(inst.data.tick).toContain('down-');
  });

  test('adjust(delta) moves by the raw delta', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 5 });
    await simulate.sleep(20);
    comp.instance.adjust(3);
    await simulate.sleep(10);
    expect(comp.instance.data.inner).toBe(8);
    expect(comp.instance.data.tick).toContain('up-');
  });

  test('clamps at min/max; nudging at a bound rattles without a change event', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 1, min: 0, max: 2 });
    await simulate.sleep(20);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.adjust(-2);
    await simulate.sleep(10);
    expect(inst.data.inner).toBe(0);
    expect(inst.data.atMin).toBe(true);
    expect(trigger).toHaveBeenCalledWith('change', { value: 0 });

    trigger.mockClear();
    inst.adjust(-1); // already at min -> nudge
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(inst.data.limit).toBeGreaterThan(0);
    expect(inst.data.inner).toBe(0);
  });

  test('commitText parses plain numbers and decimals, refuses junk', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 1 });
    await simulate.sleep(20);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    expect(inst.commitText('7')).toBe(true);
    expect(inst.data.inner).toBe(7);
    expect(trigger).toHaveBeenCalledWith('change', { value: 7 });

    expect(inst.commitText('abc')).toBe(false);
    expect(inst.data.inner).toBe(7);

    inst.commitText('');
    expect(inst.data.inner).toBeNull();
  });

  test('required refuses an empty commit', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 1, required: true });
    await simulate.sleep(20);
    const inst = comp.instance;
    expect(inst.commitText('')).toBe(false);
    expect(inst.data.inner).toBe(1);
  });

  test('onBlur commits a good draft and puts back a non-number', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 5 });
    await simulate.sleep(20);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onInput({ detail: { value: '9' } });
    expect(inst.data.draft).toEqual({ text: '9', base: '5' });
    inst.onBlur({});
    await simulate.sleep(10);
    expect(inst.data.draft).toBeNull();
    expect(inst.data.inner).toBe(9);
    expect(trigger).toHaveBeenCalledWith('change', { value: 9 });

    trigger.mockClear();
    inst.onInput({ detail: { value: 'not-a-number' } });
    inst.onBlur({});
    await simulate.sleep(10);
    expect(inst.data.draft).toBeNull();
    expect(inst.data.shown).toBe('9'); // restored
    expect(trigger).not.toHaveBeenCalled();
  });

  test('disabled blocks adjust and button taps entirely', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 5, disabled: true });
    await simulate.sleep(20);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.adjust(1);
    inst.onIncTap();
    inst.onDecTap();
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(inst.data.inner).toBe(5);
    expect(inst.data.limit).toBe(0);
  });

  test('snap rounds to step multiples from min; prefix/suffix format the shown text', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 4, step: 5, snap: true, min: 0, prefix: '$', suffix: ' g' });
    await simulate.sleep(20);
    const inst = comp.instance;
    expect(inst.data.shown).toBe('$4 g');
    inst.onIncTap(); // 4 + 5 = 9, snapped to 10
    await simulate.sleep(10);
    expect(inst.data.inner).toBe(10);
    expect(inst.data.shown).toBe('$10 g');
  });

  test('precision forces decimal places in the shown text', async () => {
    const comp = mount('stepper/stepper', { defaultValue: 2.5, precision: 2 });
    await simulate.sleep(20);
    expect(comp.instance.data.shown).toBe('2.50');
  });
});
