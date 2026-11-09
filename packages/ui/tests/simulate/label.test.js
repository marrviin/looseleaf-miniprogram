const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-label', () => {
  test('renders a label wrapping the slot content', () => {
    const comp = mount('label/label');
    expect(comp.querySelector('.ll-label')).toBeTruthy();
    expect(comp.querySelector('.ll-label__content')).toBeTruthy();
  });

  test('disabled flips the disabled class', async () => {
    const comp = mount('label/label');
    expect(comp.querySelector('.ll-label').dom.className).not.toContain('ll-label--disabled');
    comp.setData({ disabled: true });
    await simulate.sleep(10);
    expect(comp.querySelector('.ll-label').dom.className).toContain('ll-label--disabled');
  });

  test('required draws the red star (inline data-uri background)', async () => {
    const comp = mount('label/label', { required: true });
    await simulate.sleep(10);
    expect(comp.instance.data.starStyle).toContain('background-image:url(');
    expect(comp.querySelector('.ll-label__required')).toBeTruthy();
    expect(comp.querySelector('.ll-label__required').dom.getAttribute('style')).toContain('data:image/svg+xml');
  });

  test('not required → no star node, no star style', () => {
    const comp = mount('label/label');
    expect(comp.querySelector('.ll-label__required')).toBeFalsy();
    expect(comp.instance.data.starStyle).toBe('');
  });
});
