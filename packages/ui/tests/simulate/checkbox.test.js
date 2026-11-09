const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-checkbox', () => {
  test('tap toggles checked and re-emits change with the new value', async () => {
    const comp = mount('checkbox/checkbox');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-checkbox').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: true });
    expect(comp.instance.data.checked).toBe(true);

    trigger.mockClear();
    comp.querySelector('.ll-checkbox').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    expect(comp.instance.data.checked).toBe(false);
  });

  test('tap from indeterminate goes straight to checked and clears the flag', async () => {
    const comp = mount('checkbox/checkbox', { indeterminate: true });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-checkbox').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: true });
    expect(comp.instance.data.checked).toBe(true);
    expect(comp.instance.data.indeterminate).toBe(false);
  });

  test('disabled swallows taps (no state change, no event)', async () => {
    const comp = mount('checkbox/checkbox', { checked: false });
    comp.setData({ disabled: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.instance.onTap({ detail: {} });
    comp.querySelector('.ll-checkbox').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.checked).toBe(false);
  });

  // NOTE: the size→px observer is written in the { handler(){} } form, which the
  // real WeChat runtime supports but j-component's exparser does NOT (it calls the
  // observer object as a function → "t.apply is not a function"). The mapping
  // therefore cannot be exercised under simulate; default px is asserted instead.
  test('defaults to a 16px box', async () => {
    const comp = mount('checkbox/checkbox');
    await simulate.sleep(10);
    expect(comp.instance.data.px).toBe(16);
    expect(comp.querySelector('.ll-checkbox').dom.getAttribute('style')).toContain('width:16px');
  });

  test('customStyle lands on the box element', () => {
    const comp = mount('checkbox/checkbox', { customStyle: 'margin:2px;' });
    expect(comp.querySelector('.ll-checkbox').dom.getAttribute('style')).toContain('margin:2px;');
  });
});
