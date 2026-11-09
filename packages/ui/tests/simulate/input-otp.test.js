const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-input-otp', () => {
  test('maxLength decides the slot count; the value slices in and fills slots', async () => {
    const comp = mount('input-otp/input-otp', { maxLength: 4, value: '12345' });
    await simulate.sleep(10);
    const slots = comp.instance.data.slots;
    expect(slots).toHaveLength(4);
    expect(slots.map((s) => s.char)).toEqual(['1', '2', '3', '4']);
    expect(slots.every((s) => s.filled)).toBe(true);
    expect(comp.instance.data.inner).toBe('1234');
  });

  test('onInput filters by pattern, fires change on every edit and complete when full', async () => {
    const comp = mount('input-otp/input-otp', { maxLength: 4, pattern: '[0-9]' });
    await simulate.sleep(10);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onInput({ detail: { value: 'a1b2' } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: '12' });
    expect(inst.data.inner).toBe('12');
    expect(inst.data.inputType).toBe('number');
    expect(trigger).not.toHaveBeenCalledWith('complete', expect.anything());

    inst.onInput({ detail: { value: '1234' } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('complete', { value: '1234' });
    expect(inst.data.slots.every((s) => s.filled)).toBe(true);
  });

  test('separatorAfter feeds the slot sync without disturbing the slot count', async () => {
    // NOTE: the sep flags themselves are computed inside __paint, which needs a
    // real slot measurement — under simulate the scoped query reports 0-width
    // boxes, so painting never completes (harness limitation, see report).
    const comp = mount('input-otp/input-otp', { maxLength: 4, separatorAfter: [1] });
    await simulate.sleep(20);
    expect(comp.instance.data.slots).toHaveLength(4);
    expect(comp.instance.data.slots[0].filled).toBe(false);
    expect(comp.instance.data.inner).toBe('');
  });

  test('empty slots show the placeholder ghost char', async () => {
    const comp = mount('input-otp/input-otp', { maxLength: 3, placeholder: '·' });
    await simulate.sleep(20);
    expect(comp.instance.data.slots[0].filled).toBe(false);
    expect(comp.querySelector('.ll-otp-slot__ph').dom.textContent).toBe('·');
  });

  test('disabled wears the disabled class and never marks a slot active', async () => {
    const comp = mount('input-otp/input-otp', { disabled: true });
    await simulate.sleep(20);
    expect(comp.querySelector('.ll-otp').dom.className).toContain('ll-otp--disabled');
    expect(comp.instance.data.slots.every((s) => !s.active)).toBe(true);
  });

  test('focus/onFocus/onBlur track the focused flag and re-emit', async () => {
    const comp = mount('input-otp/input-otp');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-otp-input').dispatchEvent('focus');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('focus', {});
    expect(comp.instance.data.focused).toBe(true);

    comp.querySelector('.ll-otp-input').dispatchEvent('blur');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('blur', {});
    expect(comp.instance.data.focused).toBe(false);

    comp.instance.focus();
    await simulate.sleep(10);
    expect(comp.instance.data.focused).toBe(true);
  });
});
