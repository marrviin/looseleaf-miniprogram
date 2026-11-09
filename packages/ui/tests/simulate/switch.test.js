const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-switch', () => {
  test('tap toggles and fires change with the new boolean value', async () => {
    const comp = mount('switch/switch');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-switch').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: true });
    expect(comp.instance.data.checked).toBe(true);

    trigger.mockClear();
    comp.querySelector('.ll-switch').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
  });

  test('the thumb slides right when checked (tx 4 → 24, sm: 4 → 20)', async () => {
    const comp = mount('switch/switch');
    await simulate.sleep(10);
    expect(comp.instance.data.tx).toBe(4);
    expect(comp.instance.data.tw).toBe(16);

    comp.setData({ checked: true });
    await simulate.sleep(10);
    expect(comp.instance.data.tx).toBe(24);

    comp.setData({ size: 'sm', checked: false });
    await simulate.sleep(10);
    expect(comp.instance.data.tx).toBe(4);
    comp.setData({ checked: true });
    await simulate.sleep(10);
    expect(comp.instance.data.tx).toBe(20);
    expect(comp.instance.data.tw).toBe(12);
  });

  test('disabled swallows taps', async () => {
    const comp = mount('switch/switch', { checked: false });
    comp.setData({ disabled: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.instance.onTap({ detail: {} });
    comp.querySelector('.ll-switch').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.checked).toBe(false);
  });

  test('size="sm" wears the sm class', () => {
    const comp = mount('switch/switch', { size: 'sm' });
    expect(comp.querySelector('.ll-switch').dom.className).toContain('ll-switch--sm');
  });

  test('checked flips the thumb transform on the thumb element', async () => {
    const comp = mount('switch/switch');
    expect(comp.querySelector('.ll-switch-thumb').dom.getAttribute('style')).toContain('translateX(4px)');
    comp.setData({ checked: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-switch-thumb').dom.getAttribute('style')).toContain('translateX(24px)');
  });
});
