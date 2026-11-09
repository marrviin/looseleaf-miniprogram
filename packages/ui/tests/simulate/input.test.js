const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-input', () => {
  test('input/focus/blur/confirm re-emit with the typed value', async () => {
    const comp = mount('input/input');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-input__control').dispatchEvent('input', { detail: { value: 'hi' } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('input', { value: 'hi' });

    comp.querySelector('.ll-input__control').dispatchEvent('focus');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('focus', {});
    expect(comp.instance.data.focusVisible).toBe(true);

    comp.querySelector('.ll-input__control').dispatchEvent('blur', { detail: { value: 'hi' } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('blur', { value: 'hi' });
    expect(comp.instance.data.focusVisible).toBe(false);

    comp.querySelector('.ll-input__control').dispatchEvent('confirm', { detail: { value: 'hi' } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('confirm', { value: 'hi' });
  });

  test('disabled paints the disabled control class', () => {
    const comp = mount('input/input', { disabled: true });
    expect(comp.querySelector('.ll-input__control').dom.className).toContain('ll-input__control--disabled');
  });

  test('readOnly and invalid feed the ink params', async () => {
    const comp = mount('input/input');
    comp.setData({ readOnly: true, invalid: true });
    await simulate.sleep(20);
    expect(comp.instance.__inkParams()).toEqual({ disabled: false, invalid: true, readOnly: true });
  });

  test('trimStyle is appended to the ink layer style', () => {
    const comp = mount('input/input', { trimStyle: 'clip-path:inset(0 4px);' });
    expect(comp.querySelector('.ll-ink-layer').dom.getAttribute('style')).toContain('clip-path:inset(0 4px);');
  });
});
