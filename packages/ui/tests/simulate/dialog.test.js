const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// The stub is a phone (windowWidth 393 < 640): the sheet lays flat (tilt 0,
// no tape) with the safe-area foot.
describe('ll-dialog', () => {
  test('renders nothing while closed', () => {
    const comp = mount('dialog/dialog');
    expect(comp.querySelector('.ll-dialog')).toBeFalsy();
    expect(comp.instance.data.visible).toBe(false);
  });

  test('open prop mounts the portal (phone: flat, untaped)', async () => {
    const comp = mount('dialog/dialog', { open: true });
    await simulate.sleep(10);
    const root = comp.querySelector('.ll-dialog');
    expect(root).toBeTruthy();
    expect(root.dom.className).not.toContain('ll-dialog--closing');
    expect(comp.instance.data.visible).toBe(true);
    expect(comp.instance.data.phone).toBe(true);
    expect(comp.instance.data.paperTilt).toBe(0);
    expect(comp.instance.data.paperTape).toBe(false);
    // the sheet pads its foot by the safe area on a phone
    expect(comp.instance.data.paperStyle).toContain('env(safe-area-inset-bottom)');
    expect(comp.querySelector('.ll-dialog__x')).toBeTruthy();
  });

  test('tapping the x re-emits close + change but stays open (controlled)', async () => {
    const comp = mount('dialog/dialog', { open: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-dialog__x').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    // the page owns `open` — the portal must still be up
    expect(comp.instance.data.visible).toBe(true);
  });

  test('flipping open=false plays the exit animation then unmounts', async () => {
    const comp = mount('dialog/dialog', { open: true });
    await simulate.sleep(10);
    comp.setData({ open: false });
    await simulate.sleep(10);
    expect(comp.instance.data.closing).toBe(true);
    expect(comp.querySelector('.ll-dialog').dom.className).toContain('ll-dialog--closing');
    await simulate.sleep(350);
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-dialog')).toBeFalsy();
  });

  test('closable=false ignores the overlay tap', async () => {
    const comp = mount('dialog/dialog', { open: true, closable: false });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-dialog__overlay').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.visible).toBe(true);
  });

  test('showCloseButton=false drops the corner x', async () => {
    const comp = mount('dialog/dialog', { open: true, showCloseButton: false });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-dialog__x')).toBeFalsy();
  });

  test('overlay tap closes when closable (default)', async () => {
    const comp = mount('dialog/dialog', { open: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-dialog__overlay').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
  });
});
