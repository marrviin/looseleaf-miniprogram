const { mount, loadDefinition } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-alert-dialog', () => {
  test('renders nothing while closed', () => {
    const comp = mount('alert-dialog/alert-dialog');
    expect(comp.querySelector('.ll-alert-dialog')).toBeFalsy();
  });

  test('open prop mounts the question sheet — no corner x, no dim-dismiss', async () => {
    const comp = mount('alert-dialog/alert-dialog', { open: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-alert-dialog')).toBeTruthy();
    expect(comp.querySelector('.ll-alert-dialog__overlay')).toBeTruthy();
    // Radix alertdialog: no close button anywhere
    expect(comp.querySelector('.ll-alert-dialog__x')).toBeFalsy();
    expect(comp.instance.data.closable).toBe(false);
  });

  test('size="sm" flips the modifier class; overlay tap never closes', async () => {
    const comp = mount('alert-dialog/alert-dialog', { open: true, size: 'sm' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-alert-dialog').dom.className).toContain('ll-alert-dialog--sm');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-alert-dialog__overlay').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.visible).toBe(true);
  });

  test('onCancel (bubbled from ll-alert-dialog-cancel) closes and announces', async () => {
    const comp = mount('alert-dialog/alert-dialog', { open: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onCancel();
    expect(trigger).toHaveBeenCalledWith('cancel');
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    // controlled: the page flips `open`, the observer plays the exit
    comp.setData({ open: false });
    await simulate.sleep(350);
    expect(comp.instance.data.visible).toBe(false);
  });

  test('onAction closes by default, but keepOpen keeps the sheet up', async () => {
    const comp = mount('alert-dialog/alert-dialog', { open: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onAction({ detail: { keepOpen: true } });
    expect(trigger).toHaveBeenCalledWith('action');
    expect(trigger).not.toHaveBeenCalledWith('close');
    expect(comp.instance.data.visible).toBe(true);

    comp.instance.onAction({ detail: {} });
    expect(trigger).toHaveBeenCalledWith('close');
    comp.setData({ open: false });
    await simulate.sleep(350);
    expect(comp.instance.data.visible).toBe(false);
  });

  test('a slotted answer button bubbles alert-cancel up through the sheet', async () => {
    const rootId = simulate.load({
      path: '/test/composite',
      template:
        '<ll-alert-dialog class="dlg" open="{{open}}"><ll-alert-dialog-cancel class="cxl" /></ll-alert-dialog>',
      usingComponents: {
        'll-alert-dialog': loadDefinition('alert-dialog', 'alert-dialog'),
        'll-alert-dialog-cancel': loadDefinition('alert-dialog-cancel', 'alert-dialog-cancel'),
      },
      data: { open: true },
    });
    const comp = simulate.render(rootId);
    comp.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(10);
    const dlg = comp.querySelector('.dlg');
    expect(dlg.querySelector('.ll-alert-dialog__overlay')).toBeTruthy();
    const trigger = jest.spyOn(dlg.instance, 'triggerEvent');
    // the cancel child's tap bubbles up as alert-cancel (exparser event
    // system — the DOM tap through ll-button is ll-button territory)
    comp.querySelector('.cxl').instance.onTap();
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('cancel');
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    comp.setData({ open: false });
    await simulate.sleep(350);
    expect(dlg.instance.data.visible).toBe(false);
  });
});
