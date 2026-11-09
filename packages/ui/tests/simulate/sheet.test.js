const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-sheet', () => {
  test('renders nothing while closed', () => {
    const comp = mount('sheet/sheet');
    expect(comp.querySelector('.ll-sheet')).toBeFalsy();
  });

  test('open prop mounts the right-hand page, bound along its left edge', async () => {
    const comp = mount('sheet/sheet', { open: true });
    await simulate.sleep(10);
    const root = comp.querySelector('.ll-sheet');
    expect(root).toBeTruthy();
    expect(root.dom.className).toContain('ll-sheet--right');
    expect(comp.instance.data.innerEdge).toBe('left');
    expect(comp.instance.data.bound).toBe(true);
    // the shadow casts toward the page underneath
    expect(comp.instance.data.shadowCss).toContain('7px 0 18px');
    expect(comp.querySelector('.ll-sheet__x')).toBeTruthy();
  });

  test('perf/torn bindings finish the inner edge as a paper edge, no strip', async () => {
    const comp = mount('sheet/sheet', { open: true, binding: 'perf' });
    await simulate.sleep(10);
    expect(comp.instance.data.bound).toBe(false);
    expect(comp.instance.data.paperEdge).toEqual({ left: 'perf' });
  });

  test('changing side while open re-computes the binding edge', async () => {
    const comp = mount('sheet/sheet', { open: true });
    await simulate.sleep(10);
    comp.setData({ side: 'top' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-sheet').dom.className).toContain('ll-sheet--top');
    expect(comp.instance.data.innerEdge).toBe('bottom');
    // bound sheets pad along the binding edge (the one facing the middle)
    expect(comp.instance.data.paperStyle).toContain('padding-bottom:48rpx');
  });

  test('the x re-emits close + change; open=false unmounts after the exit', async () => {
    const comp = mount('sheet/sheet', { open: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-sheet__x').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    expect(comp.instance.data.visible).toBe(true);

    comp.setData({ open: false });
    await simulate.sleep(350);
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-sheet')).toBeFalsy();
  });

  test('closable=false ignores the dim tap', async () => {
    const comp = mount('sheet/sheet', { open: true, closable: false });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-sheet__overlay').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.visible).toBe(true);
  });
});
