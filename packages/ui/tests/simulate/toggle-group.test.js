const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-toggle-group', () => {
  test('single mode adopts an empty value at attach; invalid type falls back to multiple', () => {
    const single = mount('toggle-group/toggle-group', { type: 'single' });
    expect(single.instance.data.type).toBe('single');
    expect(single.instance.data.value).toBe('');

    const bogus = mount('toggle-group/toggle-group', { type: 'radio' });
    expect(bogus.instance.data.type).toBe('multiple');
    expect(bogus.instance.data.value).toEqual([]);
  });

  test('an invalid orientation falls back to horizontal', async () => {
    const comp = mount('toggle-group/toggle-group', { orientation: 'diagonal' });
    expect(comp.instance.data.o).toBe('horizontal');
    comp.setData({ orientation: 'vertical' });
    await simulate.sleep(10);
    expect(comp.instance.data.o).toBe('vertical');
    expect(comp.querySelector('.ll-toggle-group--vertical')).toBeTruthy();
  });

  test('single mode: item toggle sets the value and announces change', () => {
    const comp = mount('toggle-group/toggle-group', { type: 'single' });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onItemToggle('a', true);
    expect(comp.instance.data.value).toBe('a');
    expect(trigger).toHaveBeenCalledWith('change', { value: 'a' });
    comp.instance.__onItemToggle('a', false);
    expect(comp.instance.data.value).toBe('');
  });

  test('multiple mode: item toggles fold into the value array', () => {
    const comp = mount('toggle-group/toggle-group');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__onItemToggle('a', true);
    comp.instance.__onItemToggle('b', true);
    expect(comp.instance.data.value).toEqual(['a', 'b']);
    expect(trigger).toHaveBeenLastCalledWith('change', { value: ['a', 'b'] });
    comp.instance.__onItemToggle('a', false);
    expect(comp.instance.data.value).toEqual(['b']);
  });

  test('joined ink params: zero spacing + outline (or disabled) joins the box', () => {
    const comp = mount('toggle-group/toggle-group', { variant: 'outline', spacing: 0 });
    expect(comp.instance.__inkParams()).toEqual({ joined: true, disabled: false, invalid: false });
    comp.setData({ spacing: 2 });
    expect(comp.instance.__inkParams().joined).toBe(false);
    comp.setData({ spacing: 0, variant: 'default', disabled: true });
    expect(comp.instance.__inkParams().joined).toBe(true);
    expect(comp.instance.__inkParams().disabled).toBe(true);
  });

  test('invalid beats only when not disabled', () => {
    const comp = mount('toggle-group/toggle-group', { invalid: true });
    expect(comp.instance.__inkParams().invalid).toBe(true);
    comp.setData({ disabled: true });
    expect(comp.instance.__inkParams().invalid).toBe(false);
  });
});
