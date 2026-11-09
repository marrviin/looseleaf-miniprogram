const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-progress', () => {
  test('no value → indeterminate: the clip window is the sliding band', async () => {
    const comp = mount('progress/progress');
    await simulate.sleep(10);
    expect(comp.instance.data.indeterminate).toBe(true);
    expect(comp.instance.data.fillClip).toContain('inset(-12px 30% -12px 30%)');
    expect(comp.querySelector('.ll-progress__fill--waiting')).toBeTruthy();
    expect(comp.instance.data.now).toBe(null);
  });

  test('value/max drives the fill clip percentage and aria-valuenow', async () => {
    const comp = mount('progress/progress', { value: 50, max: 200 });
    await simulate.sleep(10);
    expect(comp.instance.data.indeterminate).toBe(false);
    expect(comp.instance.data.fillClip).toContain('calc(100% - 25%)');
    expect(comp.instance.data.now).toBe(50);
  });

  test('values clamp to [0, max]', async () => {
    const comp = mount('progress/progress', { value: 300, max: 100 });
    await simulate.sleep(10);
    expect(comp.instance.data.now).toBe(100);
    expect(comp.instance.data.fillClip).toContain('calc(100% - 100%)');

    comp.setData({ value: -5 });
    await simulate.sleep(10);
    expect(comp.instance.data.now).toBe(0);
    expect(comp.instance.data.fillClip).toContain('calc(100% - 0%)');
  });

  test('a non-numeric value (NaN) reads as indeterminate', async () => {
    const comp = mount('progress/progress', { value: 40 });
    await simulate.sleep(10);
    expect(comp.instance.data.indeterminate).toBe(false);
    comp.setData({ value: NaN });
    await simulate.sleep(10);
    expect(comp.instance.data.indeterminate).toBe(true);
  });

  test('size classes follow the prop', async () => {
    const comp = mount('progress/progress');
    comp.setData({ size: 'lg' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-progress').dom.className).toContain('ll-progress--lg');
  });
});
