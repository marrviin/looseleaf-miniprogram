const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-item', () => {
  test('variant and size classes follow the (validated) props', async () => {
    const comp = mount('item/item');
    expect(comp.querySelector('.ll-item--default')).toBeTruthy();
    comp.setData({ variant: 'outline', size: 'sm' });
    await simulate.sleep(10);
    const cls = comp.querySelector('.ll-item').dom.className;
    expect(cls).toContain('ll-item--outline');
    expect(cls).toContain('ll-item--sm');
  });

  test('an invalid variant falls back to the first entry of the validator list', async () => {
    const comp = mount('item/item', { variant: 'neon' });
    expect(comp.instance.data.v).toBe('default');
    comp.setData({ variant: 'muted' });
    await simulate.sleep(10);
    expect(comp.instance.data.v).toBe('muted');
  });

  test('link rows wear the highlighter swipe while the finger is down', async () => {
    const comp = mount('item/item', { link: true });
    const root = comp.querySelector('.ll-item');
    expect(root.dom.className).toContain('ll-item--link');
    comp.instance.onTouchStart();
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-item').dom.className).toContain('ll-item--swiped');
    comp.instance.onTouchEnd();
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-item').dom.className).not.toContain('ll-item--swiped');
  });

  test('non-link rows never swipe', async () => {
    const comp = mount('item/item');
    comp.instance.onTouchStart();
    comp.instance.onTouchEnd();
    await simulate.sleep(10);
    expect(comp.instance.data.swiped).toBe(false);
  });

  test('the row draws its frame vars inline (one of three hands by seed)', async () => {
    const comp = mount('item/item');
    const style = comp.querySelector('.ll-item').dom.getAttribute('style') || '';
    expect(style).toContain('--ll-it-eh');
    expect(style).toContain('--ll-it-ev');
    expect(style).toContain('--ll-it-r');

    comp.setData({ seed: 'row-7' });
    await simulate.sleep(10);
    const next = comp.querySelector('.ll-item').dom.getAttribute('style') || '';
    expect(next).toContain('--ll-it-eh');
  });
});
