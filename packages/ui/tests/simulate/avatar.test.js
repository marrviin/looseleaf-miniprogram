const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-avatar', () => {
  test('renders the size class', async () => {
    const comp = mount('avatar/avatar');
    expect(comp.querySelector('.ll-avatar--default')).toBeTruthy();
    comp.setData({ size: 'lg' });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-avatar--lg')).toBeTruthy();
  });

  test('ring="none" removes the ink layer; a real ring brings it back', async () => {
    const comp = mount('avatar/avatar');
    expect(comp.querySelector('.ll-ink-layer')).toBeTruthy();
    comp.setData({ ring: 'none' });
    await simulate.sleep(10);
    expect(comp.instance.data.drawn).toBe(false);
    expect(comp.querySelector('.ll-ink-layer')).toBeFalsy();
    comp.setData({ ring: 'marker' });
    await simulate.sleep(10);
    expect(comp.instance.data.drawn).toBe(true);
    expect(comp.querySelector('.ll-ink-layer')).toBeTruthy();
  });

  test('the ink params report the ring (none maps to ink)', () => {
    const comp = mount('avatar/avatar', { ring: 'you' });
    expect(comp.instance.__inkParams()).toEqual({ ring: 'you' });
    const none = mount('avatar/avatar', { ring: 'none' });
    expect(none.instance.__inkParams()).toEqual({ ring: 'ink' });
  });
});
