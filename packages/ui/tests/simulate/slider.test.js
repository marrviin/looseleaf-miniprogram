const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// The stubbed track is 300x48 at left/top 0 in the tests that plant
// __trackRect by hand (see the touch tests) — thumb travel = 280px.
describe('ll-slider', () => {
  test('attaches with defaultValue, else falls back to [min]', async () => {
    const comp = mount('slider/slider', { defaultValue: [10] });
    await simulate.sleep(20);
    expect(comp.instance.data.values).toEqual([10]);

    const bare = mount('slider/slider');
    await simulate.sleep(20);
    expect(bare.instance.data.values).toEqual([0]);
  });

  test('a new value prop snaps to step and clamps to min/max', async () => {
    const comp = mount('slider/slider', { value: [50] });
    await simulate.sleep(20);
    expect(comp.instance.data.values).toEqual([50]);

    comp.setData({ value: [123, -5] });
    await simulate.sleep(20);
    expect(comp.instance.data.values).toEqual([100, 0]);
  });

  test('two thumbs produce two positions and a range clip window', async () => {
    const comp = mount('slider/slider', { defaultValue: [20, 80] });
    await simulate.sleep(20);
    expect(comp.instance.data.thumbPos).toHaveLength(2);
    expect(comp.instance.data.rangeClip).toContain('clip-path:inset(');
    // single-thumb range starts at the groove start
    const one = mount('slider/slider', { defaultValue: [40] });
    await simulate.sleep(20);
    expect(one.instance.data.thumbPos).toHaveLength(1);
    expect(one.instance.data.rangeClip).toContain('100% - 20px');
  });

  test('touch drag snaps the thumb and fires changing then change', async () => {
    const comp = mount('slider/slider', { defaultValue: [10] });
    await simulate.sleep(20);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    // the component-scoped track measurement reports 0-width boxes under
    // simulate — plant the rect onTouchStart would have measured (300px track)
    inst.__trackRect = { w: 300, h: 48, left: 0, top: 0 };
    inst.__activeThumb = 0;
    inst.__applyTouch({ touches: [{ clientX: 150, clientY: 5 }] });
    await simulate.sleep(10);
    // pct = (150-10)/280*100 = 50
    expect(trigger).toHaveBeenCalledWith('changing', { value: [50] });
    expect(inst.data.values).toEqual([50]);

    inst.onTouchEnd();
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: [50] });
  });

  test('minStepsBetweenThumbs keeps neighbors apart during a drag', async () => {
    const comp = mount('slider/slider', { defaultValue: [40, 60], minStepsBetweenThumbs: 2 });
    await simulate.sleep(20);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.__trackRect = { w: 300, h: 48, left: 0, top: 0 };
    inst.__activeThumb = 0;
    // raw drag to 70% would land on 70 — clamped to 2 steps before thumb 1 (60)
    inst.__applyTouch({ touches: [{ clientX: 206, clientY: 5 }] });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('changing', { value: [58, 60] });
  });

  test('disabled ignores touch entirely', async () => {
    const comp = mount('slider/slider', { defaultValue: [10], disabled: true });
    await simulate.sleep(20);
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    inst.onTouchStart({ touches: [{ clientX: 150, clientY: 5 }] });
    inst.onTouchMove({ touches: [{ clientX: 150, clientY: 5 }] });
    inst.onTouchEnd();
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(inst.data.values).toEqual([10]);
    expect(inst.__activeThumb).toBeUndefined();
  });

  test('vertical orientation flips thumb placement math', async () => {
    const comp = mount('slider/slider', { defaultValue: [50], orientation: 'vertical' });
    await simulate.sleep(20);
    expect(comp.querySelector('.ll-slider').dom.className).toContain('ll-slider--vertical');
    expect(comp.instance.data.thumbPos[0]).toContain('bottom:');
  });
});
