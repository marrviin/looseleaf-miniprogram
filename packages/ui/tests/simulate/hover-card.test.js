const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

/** addEventListener spies receive the re-emitted event wrapper. */
const payloadOf = (spy, i = 0) => {
  const arg = spy.mock.calls[i][0];
  return arg && arg.detail !== undefined ? arg.detail : arg;
};

/** mount + guard: __place setData's `side`, and simulate fires the
    'side,…' observer on every setData (not only on change) — which would
    re-enter __place forever. Let it run exactly once per open. */
function mountCard(props) {
  const comp = mount('hover-card/hover-card', props);
  const inst = comp.instance;
  // j-component's own createSelectorQuery measures the real jsdom DOM
  // (width 0) — point the instance at the setup.cjs wx stub (300x48 rect at
  // top-left) so __place computes its anchor deterministically.
  inst.createSelectorQuery = () => global.wx.createSelectorQuery();
  const orig = inst.__place.bind(inst);
  let armed = true;
  inst.__place = () => {
    if (!armed) return;
    armed = false;
    orig();
  };
  const origShow = inst.__show.bind(inst);
  inst.__show = () => {
    armed = true;
    origShow();
  };
  return comp;
}

describe('ll-hover-card', () => {
  test('trigger tap emits change and shows the panel; placed style anchors it to the stubbed trigger rect', async () => {
    const comp = mountCard();
    const change = jest.fn();
    comp.addEventListener('change', change);
    comp.querySelector('.ll-hover-card__trigger').dispatchEvent('tap');
    await simulate.sleep(20);
    expect(payloadOf(change)).toEqual({ value: true });
    expect(comp.instance.data.visible).toBe(true);
    await simulate.sleep(120); // __place runs at 60ms, panel re-measure at +50ms
    expect(comp.instance.data.placed).toBe(true);
    // stub trigger rect is 300x48 at the origin: side stays 'bottom', and a
    // center-aligned 256px panel lands at left = 150 - 128 = 22 (no clamp)
    expect(comp.instance.data.panelStyle).toContain('width:256px');
    expect(comp.instance.data.panelStyle).toContain('left:22px');
    expect(comp.instance.data.side).toBe('bottom');
    expect(comp.querySelector('.ll-hover-card__panel')).toBeTruthy();
  });

  test('openDelay defers the opening', async () => {
    const comp = mountCard({ openDelay: 60 });
    comp.querySelector('.ll-hover-card__trigger').dispatchEvent('tap');
    await simulate.sleep(20);
    expect(comp.instance.data.visible).toBe(false);
    await simulate.sleep(80);
    expect(comp.instance.data.visible).toBe(true);
  });

  test('controlled open: setting the prop shows the card, clearing it dismisses after the exit animation', async () => {
    const comp = mountCard();
    comp.setData({ open: true });
    await simulate.sleep(100);
    expect(comp.instance.data.visible).toBe(true);
    comp.setData({ open: false });
    await simulate.sleep(20);
    expect(comp.instance.data.closing).toBe(true);
    expect(comp.querySelector('.ll-hover-card__panel--closing')).toBeTruthy();
    await simulate.sleep(200);
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-hover-card__panel')).toBeFalsy();
  });

  test('a tap on the outside catcher closes with change(false) (uncontrolled)', async () => {
    const comp = mountCard();
    // open via the trigger (uncontrolled): outside tap may dismiss it itself;
    // with a controlled `open` the page owns the dismissal
    comp.querySelector('.ll-hover-card__trigger').dispatchEvent('tap');
    await simulate.sleep(100);
    expect(comp.instance.data.visible).toBe(true);
    const change = jest.fn();
    comp.addEventListener('change', change);
    comp.instance.onOutsideTap();
    await simulate.sleep(200);
    expect(payloadOf(change)).toEqual({ value: false });
    expect(comp.instance.data.visible).toBe(false);
  });

  test('long-press opens when closed', async () => {
    const comp = mountCard();
    comp.instance.onTriggerLongPress();
    await simulate.sleep(10);
    expect(comp.instance.data.visible).toBe(true);
  });
});
