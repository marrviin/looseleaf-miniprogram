const { mount } = require('./helpers/mount.cjs');

describe('ll-message-group', () => {
  test('renders its root column', () => {
    const comp = mount('message-group/message-group');
    expect(comp.querySelector('.ll-message-group')).toBeTruthy();
  });

  test('customStyle reaches the root node', () => {
    const comp = mount('message-group/message-group', { customStyle: 'padding:12px' });
    expect(comp.querySelector('.ll-message-group').dom.getAttribute('style')).toContain('padding:12px');
  });
});
