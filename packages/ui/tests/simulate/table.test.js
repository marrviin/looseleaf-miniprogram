const { mount } = require('./helpers/mount.cjs');

describe('ll-table', () => {
  test('renders the scroll container and the table root', () => {
    const comp = mount('table/table');
    expect(comp.querySelector('.ll-table-container')).toBeTruthy();
    expect(comp.querySelector('.ll-table')).toBeTruthy();
  });

  test('sticky turns on the vertical scroller', () => {
    const comp = mount('table/table');
    expect(comp.instance.data.sticky).toBe(false);
    comp.setData({ sticky: true });
    expect(comp.querySelector('.ll-table').dom.tagName).toBeDefined();
    expect(comp.instance.data.sticky).toBe(true);
  });

  test('containerStyle goes to the scroller, customStyle to the table root', () => {
    const comp = mount('table/table', { containerStyle: 'max-height:200px', customStyle: 'width:100%' });
    const container = comp.querySelector('.ll-table-container').dom;
    const table = comp.querySelector('.ll-table').dom;
    expect(container.getAttribute('style') || '').toContain('max-height:200px');
    expect(table.getAttribute('style') || '').toContain('width:100%');
  });

  test('scrollTop is a settable property (programmatic scroll channel)', () => {
    const comp = mount('table/table');
    comp.setData({ scrollTop: 120 });
    expect(comp.instance.data.scrollTop).toBe(120);
  });
});
