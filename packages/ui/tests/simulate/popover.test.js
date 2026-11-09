const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-popover', () => {
  test('the trigger is always there; the panel only when open', () => {
    const comp = mount('popover/popover');
    expect(comp.querySelector('.ll-popover__trigger')).toBeTruthy();
    expect(comp.querySelector('.ll-popover__panel')).toBeFalsy();
  });

  test('trigger tap emits change and mounts + places the panel', async () => {
    const comp = mount('popover/popover');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-popover__trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: true });
    expect(comp.instance.data.visible).toBe(true);
    await simulate.sleep(80); // two measure hops (60ms + 50ms)
    expect(comp.instance.data.placed).toBe(true);
    expect(comp.querySelector('.ll-popover__panel')).toBeTruthy();
    expect(comp.instance.data.panelStyle).toContain('width:288px;');
    expect(comp.instance.data.panelStyle).toContain('left:');
    expect(comp.instance.data.panelStyle).toContain('top:');
  });

  test('a tap outside dismisses and announces close + change', async () => {
    const comp = mount('popover/popover');
    comp.querySelector('.ll-popover__trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-popover__catcher').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    expect(comp.instance.data.closing).toBe(true);
    await simulate.sleep(170); // pop exit is 150ms
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-popover__panel')).toBeFalsy();
  });

  test('long-press also opens (the ll-button inside swallows taps)', async () => {
    const comp = mount('popover/popover');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-popover__trigger').dispatchEvent('longpress');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: true });
    expect(comp.instance.data.visible).toBe(true);
  });

  test('controlled open prop shows and hides', async () => {
    const comp = mount('popover/popover', { open: true });
    await simulate.sleep(80);
    expect(comp.querySelector('.ll-popover__panel')).toBeTruthy();
    comp.setData({ open: false });
    await simulate.sleep(170);
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-popover__panel')).toBeFalsy();
  });

  test('arrow=true draws the felt-tip arrow facing the trigger', async () => {
    const comp = mount('popover/popover', { arrow: true });
    comp.querySelector('.ll-popover__trigger').dispatchEvent('tap');
    await simulate.sleep(90);
    expect(comp.instance.data.arrowUri).toContain('data:image/svg');
    expect(comp.instance.data.arrowStyle).toContain('rotate(180deg)');
  });
});
