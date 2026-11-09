const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');
const { tallyWidth } = require('../../src/common/ink-engine');

describe('ll-badge', () => {
  test('a count switches to count mode and renders as digits', async () => {
    const comp = mount('badge/badge');
    expect(comp.instance.data.countMode).toBe(false);
    comp.setData({ count: 5 });
    await simulate.sleep(10);
    expect(comp.instance.data.countMode).toBe(true);
    expect(comp.instance.data.shown).toBe('5');
    expect(comp.querySelector('.ll-badge').dom.className).toContain('ll-badge--count');
    expect(comp.querySelector('.ll-badge__num').dom.textContent).toBe('5');
  });

  test('counts above max collapse to "N+"', async () => {
    const comp = mount('badge/badge', { count: 150 });
    await simulate.sleep(10);
    expect(comp.instance.data.shown).toBe('99+');
    comp.setData({ max: 9, count: 10 });
    await simulate.sleep(10);
    expect(comp.instance.data.shown).toBe('9+');
  });

  test('tally mode (1-20) sizes the tally bar from tallyWidth; above 20 falls back to digits', async () => {
    const comp = mount('badge/badge', { count: 7, tally: true });
    await simulate.sleep(10);
    expect(comp.instance.data.tallied).toBe(true);
    expect(comp.instance.data.tallyStyle).toBe(`width:${tallyWidth(7, 24) * 2}rpx`);
    expect(comp.querySelector('.ll-badge__tally')).toBeTruthy();
    // sr-only digits stay in the tree for accessibility
    expect(comp.querySelector('.ll-badge__sr').dom.textContent).toBe('7');

    const over = mount('badge/badge', { count: 25, tally: true });
    await simulate.sleep(10);
    expect(over.instance.data.tallied).toBe(false);
    expect(over.instance.data.shown).toBe('25');
  });

  test('tally never applies to zero or missing counts', async () => {
    const zero = mount('badge/badge', { count: 0, tally: true });
    await simulate.sleep(10);
    expect(zero.instance.data.tallied).toBe(false);
    expect(zero.instance.data.shown).toBe('0');

    const none = mount('badge/badge', { tally: true });
    await simulate.sleep(10);
    expect(none.instance.data.countMode).toBe(false);
    expect(none.instance.data.tallied).toBe(false);
  });

  test('variant and size classes follow the props', async () => {
    const comp = mount('badge/badge');
    comp.setData({ variant: 'outline', size: 'lg' });
    await simulate.sleep(10);
    const cls = comp.querySelector('.ll-badge').dom.className;
    expect(cls).toContain('ll-badge--outline');
    expect(cls).toContain('ll-badge--lg');
  });
});
