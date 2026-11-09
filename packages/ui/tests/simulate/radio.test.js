const { mount, loadDefinition } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// --- composite helpers -------------------------------------------------------
// j-component never fires exparser relation linking for these components (the
// '../radio-group/radio-group' style relation keys don't match the simulated
// load ids), so the composite tree below proves coexistence/rendering only.
// The group<->radio registry (__group / __radios) is wired by hand - the same
// state radio's linked/unlinked callbacks would establish - and the actual
// sync/tap logic runs for real on the real instances.
function walkNodes(node, out = []) {
  out.push(node);
  (node.childNodes || []).forEach((c) => walkNodes(c, out));
  if (node.shadowRoot) (node.shadowRoot.childNodes || []).forEach((c) => walkNodes(c, out));
  return out;
}

function mountGroup(extraGroupProps = '') {
  const parentId = loadDefinition('radio-group', 'radio-group');
  const childId = loadDefinition('radio', 'radio');
  const rootId = simulate.load({
    path: '/test/radio-composite',
    template: `<ll-radio-group ${extraGroupProps}><ll-radio value="a" /><ll-radio value="b" /></ll-radio-group>`,
    usingComponents: { 'll-radio-group': parentId, 'll-radio': childId },
  });
  const comp = simulate.render(rootId);
  comp.attach(document.createElement('parent-wrapper'));
  const nodes = walkNodes(comp._exparserNode);
  const group = nodes.find((n) => n.is === parentId).__methodCaller;
  const radios = nodes.filter((n) => n.is === childId).map((n) => n.__methodCaller);
  // wire what radio's relation linked callback would have done
  radios.forEach((r) => { r.__group = group; });
  group.__radios = radios;
  return { comp, group, radios };
}

describe('ll-radio (standalone)', () => {
  test('tap checks it and fires change once; a second tap is a no-op', async () => {
    const comp = mount('radio/radio', { value: 'a' });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');

    comp.querySelector('.ll-radio').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: 'a' });
    expect(comp.instance.data.checked).toBe(true);

    trigger.mockClear();
    comp.querySelector('.ll-radio').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.checked).toBe(true);
  });

  test('disabled swallows taps (off flag set, no event)', async () => {
    const comp = mount('radio/radio', { value: 'a' });
    comp.setData({ disabled: true });
    await simulate.sleep(10);
    expect(comp.instance.data.off).toBe(true);

    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onTap({ detail: {} });
    expect(trigger).not.toHaveBeenCalled();
    expect(comp.instance.data.checked).toBe(false);
  });

  test('size maps to px (default 16, floor 8)', async () => {
    const comp = mount('radio/radio');
    comp.setData({ size: 20 });
    await simulate.sleep(10);
    expect(comp.instance.data.px).toBe(20);
    comp.setData({ size: 2 });
    await simulate.sleep(10);
    expect(comp.instance.data.px).toBe(8);
  });

  test('own invalid flag marks bad without a group', async () => {
    const comp = mount('radio/radio', { invalid: true });
    await simulate.sleep(10);
    expect(comp.instance.data.bad).toBe(true);
  });
});

describe('ll-radio inside ll-radio-group', () => {
  test('tapping a radio adopts its value in the group and checks only it', async () => {
    const { group, radios } = mountGroup();
    await simulate.sleep(20);
    const groupTrigger = jest.spyOn(group, 'triggerEvent');

    radios[0].onTap();
    await simulate.sleep(30);
    expect(group.data.value).toBe('a');
    expect(groupTrigger).toHaveBeenCalledWith('change', { value: 'a' });
    expect(radios[0].data.checked).toBe(true);
    expect(radios[1].data.checked).toBe(false);
  });

  test('group value prop change syncs child checked state', async () => {
    const { group, radios } = mountGroup();
    await simulate.sleep(20);
    group.setData({ value: 'b' });
    await simulate.sleep(30);
    expect(radios[0].data.checked).toBe(false);
    expect(radios[1].data.checked).toBe(true);
  });

  test('a disabled group disables every child and swallows taps', async () => {
    const { group, radios } = mountGroup('disabled');
    await simulate.sleep(20);
    expect(radios[0].data.off).toBe(true);

    const groupTrigger = jest.spyOn(group, 'triggerEvent');
    radios[0].onTap();
    await simulate.sleep(20);
    expect(groupTrigger).not.toHaveBeenCalled();
    expect(group.data.value).toBe('');
  });

  test('group invalid flag propagates to children (bad = own OR group)', async () => {
    const { radios } = mountGroup('invalid');
    await simulate.sleep(20);
    expect(radios[0].data.bad).toBe(true);
  });
});
