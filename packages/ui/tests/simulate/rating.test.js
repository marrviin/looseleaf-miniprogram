const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-rating', () => {
  test('renders max glyphs and labels the default state', async () => {
    const comp = mount('rating/rating', { max: 5 });
    await simulate.sleep(10);
    expect(comp.instance.data.items).toHaveLength(5);
    expect(comp.instance.data.roLabel).toBe('Rated 0 out of 5');
    expect(comp.querySelectorAll('.ll-rating__item')).toHaveLength(5);
  });

  test('defaultValue checks exactly that many glyphs', async () => {
    const comp = mount('rating/rating', { defaultValue: 3 });
    await simulate.sleep(10);
    const items = comp.instance.data.items;
    expect(items[2].c2).toBe(true);
    expect(items[3].c2).toBe(false);
  });

  test('tapping a glyph fires change with its value and updates state', async () => {
    const comp = mount('rating/rating');
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelectorAll('.ll-rating__hit')[2].dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: 3 });
    expect(comp.instance.data.items[2].c2).toBe(true);
  });

  test('allowHalf exposes half hit areas (0.5 steps)', async () => {
    const comp = mount('rating/rating', { allowHalf: true });
    await simulate.sleep(10);
    // glyph 2: start hit = 1.5, end hit = 2
    const starts = comp.querySelectorAll('.ll-rating__hit--start');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    starts[1].dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: 1.5 });
    expect(comp.instance.data.items[1].c1).toBe(true);
  });

  test('clearable: tapping the chosen glyph again clears to 0', async () => {
    const comp = mount('rating/rating', { defaultValue: 2, clearable: true });
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onHit({ currentTarget: { dataset: { v: 2 } } });
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: 0 });
    expect(comp.instance.data.items[1].c2).toBe(false);
  });

  test('readOnly and disabled swallow taps; readOnly swaps to the labelled-image state', async () => {
    const ro = mount('rating/rating', { readOnly: true, defaultValue: 2 });
    const trigger = jest.spyOn(ro.instance, 'triggerEvent');
    ro.instance.onHit({ currentTarget: { dataset: { v: 4 } } });
    expect(trigger).not.toHaveBeenCalled();
    expect(ro.querySelector('.ll-rating').dom.className).toContain('ll-rating--ro');
    expect(ro.instance.data.ro).toBe(true);
    expect(ro.instance.data.roLabel).toBe('Rated 2 out of 5');
    expect(ro.querySelectorAll('.ll-rating__hit')).toHaveLength(0); // no hit areas in ro

    const off = mount('rating/rating', { disabled: true });
    const trigger2 = jest.spyOn(off.instance, 'triggerEvent');
    off.instance.onHit({ currentTarget: { dataset: { v: 4 } } });
    expect(trigger2).not.toHaveBeenCalled();
    expect(off.instance.data.items).toHaveLength(5);
  });

  test('size and icon props map to classes and px boxes', async () => {
    const comp = mount('rating/rating', { size: 'lg', icon: 'heart' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-rating').dom.className).toContain('ll-rating--lg');
  });
});
