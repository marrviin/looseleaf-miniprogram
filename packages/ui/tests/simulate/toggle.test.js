const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-toggle', () => {
  test('tap flips pressed and re-emits change', async () => {
    const comp = mount('toggle/toggle');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    const btn = comp.querySelector('.ll-toggle');
    btn.dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { pressed: true });
    expect(comp.instance.data.pressed).toBe(true);
    expect(comp.instance.data.checked).toBe(true);
    expect(comp.querySelector('.ll-toggle').dom.className).toContain('ll-toggle--sink');

    btn.dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenLastCalledWith('change', { pressed: false });
    expect(comp.instance.data.pressed).toBe(false);
  });

  test('the pressed prop drives the sink class', async () => {
    const comp = mount('toggle/toggle');
    comp.setData({ pressed: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-toggle').dom.className).toContain('ll-toggle--sink');
  });

  test('disabled renders the disabled branch and swallows taps', async () => {
    const comp = mount('toggle/toggle', { disabled: true });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    expect(comp.querySelector('.ll-toggle').dom.className).toContain('ll-toggle--disabled');
    comp.instance.onTap({ detail: {} });
    expect(trigger).not.toHaveBeenCalled();
  });

  test('size and variant classes follow the props', async () => {
    const comp = mount('toggle/toggle');
    comp.setData({ size: 'sm', variant: 'outline' });
    await simulate.sleep(10);
    const cls = comp.querySelector('.ll-toggle').dom.className;
    expect(cls).toContain('ll-toggle--sm');
    expect(cls).toContain('ll-toggle--outline');
  });
});
