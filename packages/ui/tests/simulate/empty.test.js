const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-empty', () => {
  test('unframed by default: no frame class, no ink recipe', () => {
    const comp = mount('empty/empty');
    expect(comp.instance.data.framed).toBe(false);
    expect(comp.querySelector('.ll-empty').dom.className).not.toContain('ll-empty--framed');
    expect(comp.instance.data.llInkRecipe).toBe('');
    expect(comp.querySelector('.ll-ink-layer')).toBeFalsy();
  });

  test('framed draws the sketched frame (class + conditional ink layer)', async () => {
    const comp = mount('empty/empty', { framed: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-empty').dom.className).toContain('ll-empty--framed');
    expect(comp.instance.data.llInkRecipe).toBe('empty-frame');
    expect(comp.querySelector('.ll-ink-layer')).toBeTruthy();
  });

  test('framed can be flipped at runtime, both ways', async () => {
    const comp = mount('empty/empty');
    comp.setData({ framed: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-empty--framed')).toBeTruthy();
    expect(comp.querySelector('.ll-ink-layer')).toBeTruthy();
    comp.setData({ framed: false });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-empty--framed')).toBeFalsy();
    expect(comp.querySelector('.ll-ink-layer')).toBeFalsy();
    expect(comp.instance.data.llInkRecipe).toBe('');
  });
});
