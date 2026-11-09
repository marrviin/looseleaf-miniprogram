const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-drawer', () => {
  test('renders nothing while closed', () => {
    const comp = mount('drawer/drawer');
    expect(comp.querySelector('.ll-drawer')).toBeFalsy();
  });

  test('open prop mounts the bottom slip: torn top edge + grab tape', async () => {
    const comp = mount('drawer/drawer', { open: true });
    await simulate.sleep(10);
    const root = comp.querySelector('.ll-drawer');
    expect(root).toBeTruthy();
    expect(root.dom.className).toContain('ll-drawer--bottom');
    expect(comp.instance.data.tapeVisible).toBe(true);
    expect(comp.instance.data.paperEdge).toEqual({ top: 'torn' });
    expect(comp.instance.data.dimStyle).toBe('opacity:1;');
  });

  test('side drawers are plain cut slips without a grab tape', async () => {
    const comp = mount('drawer/drawer', { open: true, direction: 'right' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-drawer').dom.className).toContain('ll-drawer--right');
    expect(comp.instance.data.tapeVisible).toBe(false);
    expect(comp.instance.data.paperEdge).toBe('cut');
  });

  test('overlay tap emits close + change (controlled stays open)', async () => {
    const comp = mount('drawer/drawer', { open: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-drawer__overlay').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    expect(comp.instance.data.visible).toBe(true);
  });

  test('open=false unmounts after the exit animation', async () => {
    const comp = mount('drawer/drawer', { open: true });
    await simulate.sleep(10);
    comp.setData({ open: false });
    await simulate.sleep(10);
    expect(comp.instance.data.closing).toBe(true);
    await simulate.sleep(350);
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-drawer')).toBeFalsy();
  });

  test('a drag past 25% of the edge puts the slip away', async () => {
    const comp = mount('drawer/drawer', { open: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    const inst = comp.instance;
    inst.onPageTouchStart({ touches: [{ clientX: 0, clientY: 100 }] });
    inst.onPageTouchMove({ touches: [{ clientX: 0, clientY: 400 }] });
    expect(comp.instance.data.dragging).toBe(true);
    inst.onPageTouchEnd();
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
  });

  test('snapPoints: a small drag settles back and announces snapchange', async () => {
    const comp = mount('drawer/drawer', { open: true, snapPoints: [0.3, 0.7] });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    const inst = comp.instance;
    inst.onPageTouchStart({ touches: [{ clientX: 0, clientY: 100 }] });
    inst.onPageTouchMove({ touches: [{ clientX: 0, clientY: 109 }] });
    inst.onPageTouchMove({ touches: [{ clientX: 0, clientY: 112 }] });
    inst.onPageTouchEnd();
    // 852 * 0.08 = ~68px sill — a 12px drag stays in
    expect(trigger).not.toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('snapchange', { index: 0, snap: 0.3 });
    // parked at the first snap: sheet sized to the largest snap, translate carries the rest
    expect(inst.data.pageStyle).toContain('translateY(340px)');
    expect(inst.data.pageStyle).toContain('height:596px');
  });
});
