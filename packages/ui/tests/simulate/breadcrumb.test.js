const { mount } = require('./helpers/mount.cjs');

describe('ll-breadcrumb', () => {
  test('renders its root node', () => {
    const comp = mount('breadcrumb/breadcrumb');
    expect(comp.querySelector('.ll-breadcrumb')).toBeTruthy();
    expect(comp.instance.data.ariaLabel).toBe('breadcrumb');
  });

  test('a custom aria-label wins', () => {
    const comp = mount('breadcrumb/breadcrumb', { ariaLabel: 'You are here' });
    expect(comp.instance.data.ariaLabel).toBe('You are here');
  });

  test('customStyle reaches the root node', () => {
    const comp = mount('breadcrumb/breadcrumb', { customStyle: 'padding:4px' });
    expect(comp.querySelector('.ll-breadcrumb').dom.getAttribute('style')).toContain('padding:4px');
  });
});
