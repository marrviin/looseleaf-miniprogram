const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-radio-group', () => {
  test('orientation picks the layout class', async () => {
    const comp = mount('radio-group/radio-group', { orientation: 'horizontal' });
    expect(comp.querySelector('.ll-radio-group').dom.className).toContain('ll-radio-group--horizontal');

    comp.setData({ orientation: 'vertical' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-radio-group').dom.className).toContain('ll-radio-group--vertical');
  });

  test('__onRadioTap adopts a new value and fires change', async () => {
    const comp = mount('radio-group/radio-group', { value: 'a' });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.instance.__onRadioTap('b');
    await simulate.sleep(10);
    expect(comp.instance.data.value).toBe('b');
    expect(trigger).toHaveBeenCalledWith('change', { value: 'b' });
  });

  test('__onRadioTap with the current value is a no-op', async () => {
    const comp = mount('radio-group/radio-group', { value: 'a' });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.instance.__onRadioTap('a');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.value).toBe('a');
  });

  test('a disabled group ignores radio taps', async () => {
    const comp = mount('radio-group/radio-group', { value: 'a', disabled: true });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.instance.__onRadioTap('b');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.value).toBe('a');
  });

  test('value/disabled/invalid changes re-sync registered radios', async () => {
    const comp = mount('radio-group/radio-group');
    const radios = [{ data: {}, __onGroup: jest.fn() }, { data: {}, __onGroup: jest.fn() }];
    comp.instance.__radios = radios;

    comp.setData({ value: 'x', disabled: true, invalid: true });
    await simulate.sleep(20);
    expect(radios[0].__onGroup).toHaveBeenCalled();
    const payload = radios[0].__onGroup.mock.calls[0][0];
    expect(payload.value).toBe('x');
    expect(payload.disabled).toBe(true);
    expect(payload.invalid).toBe(true);
  });
});
