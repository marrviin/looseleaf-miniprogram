const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-tooltip', () => {
  test('the trigger is always there; the note only when open', () => {
    const comp = mount('tooltip/tooltip');
    expect(comp.querySelector('.ll-tooltip__trigger')).toBeTruthy();
    expect(comp.querySelector('.ll-tooltip__panel')).toBeFalsy();
    expect(comp.instance.data.side).toBe('top'); // Radix tooltip default
    expect(comp.instance.data.arrow).toBe(true);
  });

  test('long-press opens the note (hover has no touch equivalent)', async () => {
    const comp = mount('tooltip/tooltip');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-tooltip__trigger').dispatchEvent('longpress');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: true });
    expect(comp.querySelector('.ll-tooltip__panel')).toBeTruthy();
    expect(comp.querySelector('.ll-tooltip__catcher')).toBeTruthy();
  });

  test('the next tap anywhere closes the note', async () => {
    const comp = mount('tooltip/tooltip');
    comp.querySelector('.ll-tooltip__trigger').dispatchEvent('longpress');
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-tooltip__catcher').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    await simulate.sleep(170); // pop exit is 150ms
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-tooltip__panel')).toBeFalsy();
  });

  test('controlled open prop shows and hides', async () => {
    const comp = mount('tooltip/tooltip', { open: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-tooltip__panel')).toBeTruthy();
    comp.setData({ open: false });
    await simulate.sleep(170);
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-tooltip__panel')).toBeFalsy();
  });

  test('opens placed and with its arrow when the controlled prop is set', async () => {
    const comp = mount('tooltip/tooltip', { open: true });
    await simulate.sleep(90); // the 60ms measure hop has run
    expect(comp.instance.data.visible).toBe(true);
    expect(comp.instance.data.placed).toBe(true);
    expect(comp.instance.data.panelStyle).toContain('top:');
    // the stubbed trigger sits at the viewport's top edge, so side='top'
    // flips to 'bottom' (simplified Radix collision) and the arrow turns
    expect(comp.instance.data.side).toBe('bottom');
    expect(comp.instance.data.arrowUri).toContain('data:image/svg');
    expect(comp.instance.data.arrowStyle).toContain('rotate(180deg)');
  });
});
