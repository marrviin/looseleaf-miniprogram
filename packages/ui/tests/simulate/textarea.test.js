const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-textarea', () => {
  test('showCount counts the current value and renders the counter', async () => {
    const comp = mount('textarea/textarea', { showCount: true, value: 'hello' });
    await simulate.sleep(10);
    expect(comp.instance.data.count).toBe(5);
    expect(comp.querySelector('.ll-textarea__count').dom.textContent).toContain('5');

    comp.setData({ value: 'hi!' });
    await simulate.sleep(10);
    expect(comp.instance.data.count).toBe(3);
    expect(comp.querySelector('.ll-textarea__count').dom.textContent).toBe('3');
  });

  test('counter appends the maxlength limit when positive', async () => {
    const comp = mount('textarea/textarea', { showCount: true, maxlength: 20, value: 'ab' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-textarea__count').dom.textContent).toBe('2/20');
  });

  test('ruled flips the ruled class', () => {
    const comp = mount('textarea/textarea', { ruled: true });
    expect(comp.querySelector('.ll-textarea').dom.className).toContain('ll-textarea--ruled');
  });

  test('input/focus/blur re-emit with values', async () => {
    const comp = mount('textarea/textarea');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-textarea__control').dispatchEvent('input', { detail: { value: 'x' } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('input', { value: 'x' });

    comp.querySelector('.ll-textarea__control').dispatchEvent('focus');
    await simulate.sleep(10);
    expect(comp.instance.data.focusVisible).toBe(true);
    expect(trigger).toHaveBeenCalledWith('focus', {});

    comp.querySelector('.ll-textarea__control').dispatchEvent('blur', { detail: { value: 'x' } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('blur', { value: 'x' });
    expect(comp.instance.data.focusVisible).toBe(false);
  });

  test('disabled paints the disabled control class', () => {
    const comp = mount('textarea/textarea', { disabled: true });
    expect(comp.querySelector('.ll-textarea__control').dom.className).toContain('ll-textarea__control--disabled');
  });
});
