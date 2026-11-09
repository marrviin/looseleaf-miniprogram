const { mount } = require('./helpers/mount.cjs');

describe('ll-field', () => {
  test('orientation picks the layout class (default vertical)', () => {
    const comp = mount('field/field');
    expect(comp.querySelector('.ll-field').dom.className).toContain('ll-field--vertical');

    const horizontal = mount('field/field', { orientation: 'horizontal' });
    expect(horizontal.querySelector('.ll-field').dom.className).toContain('ll-field--horizontal');
  });

  test('invalid flips the invalid class', async () => {
    const comp = mount('field/field');
    expect(comp.querySelector('.ll-field').dom.className).not.toContain('ll-field--invalid');
    comp.setData({ invalid: true });
    const simulate = require('miniprogram-simulate');
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-field').dom.className).toContain('ll-field--invalid');
  });

  test('customStyle lands on the host element', () => {
    const comp = mount('field/field', { customStyle: 'padding:4px;' });
    expect(comp.querySelector('.ll-field').dom.getAttribute('style')).toContain('padding:4px;');
  });
});
