const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

const STROKE = {
  id: 's0',
  tool: 'felt',
  color: 'ink-you',
  size: 1.2,
  pts: [
    { x: 10, y: 20, t: 0 },
    { x: 60, y: 40, t: 30 },
    { x: 120, y: 30, t: 60 },
  ],
};

/** mount + measure patch: j-component's own createSelectorQuery measures the
    real jsdom DOM (width 0), so __measure would retry forever. Point the
    instance at the setup.cjs wx stub (fixed 300x48 rect) instead — the next
    120ms measure retry then succeeds. */
function mountSig(props) {
  const comp = mount('signature-pad/signature-pad', props);
  comp.instance.createSelectorQuery = () => global.wx.createSelectorQuery();
  return comp;
}

describe('ll-signature-pad', () => {
  test('starts in draw mode with the Sign here placeholder and a baseline', async () => {
    const comp = mountSig();
    await simulate.sleep(200); // __measure retries at 120ms with the stub rect
    expect(comp.instance.data.mode).toBe('draw');
    expect(comp.instance.data.placeholder).toBe(true);
    expect(comp.instance.data.placeholderText).toBe('Sign here');
    expect(comp.instance.data.canClear).toBe(false);
    expect(comp.instance._st.box).toEqual({ w: 300, h: 112.5 });
    expect(comp.instance.data.baselineStyle).toContain('background-image:url("data:image/svg+xml');
  });

  test('draw mode: pad strokes compose an SVG data-URL signature and enable Clear', async () => {
    const comp = mountSig();
    const change = jest.fn();
    comp.addEventListener('change', change);
    comp.instance.onPadChange({ detail: { strokes: [STROKE] } });
    await simulate.sleep(10);
    expect(comp.instance.data.canClear).toBe(true);
    expect(comp.instance.data.placeholder).toBe(false);
    expect(change).toHaveBeenCalled();
    const arg = change.mock.calls[0][0];
    const emitted = arg && arg.detail !== undefined ? arg.detail : arg;
    expect(emitted.mode).toBe('draw');
    expect(emitted.value).toContain('data:image/svg+xml');
    comp.instance.onClear();
    expect(comp.instance.data.canClear).toBe(false);
    expect(comp.instance.data.placeholder).toBe(true);
  });

  test('invalid flips invalidNow, the class and the alert message', async () => {
    const comp = mountSig();
    comp.setData({ invalid: true });
    await simulate.sleep(10);
    expect(comp.instance.data.invalidNow).toBe(true);
    expect(comp.querySelector('.ll-signature').dom.className).toContain('is-invalid');
    expect(comp.querySelector('.ll-signature__message').dom.textContent).toBe('Please sign in the box.');
  });

  test('type mode: the mode toggle swaps the hint, emits modechange and publishes the typed name', async () => {
    const comp = mountSig();
    const modeChange = jest.fn();
    comp.addEventListener('modechange', modeChange);
    comp.instance.onToggleMode();
    await simulate.sleep(10);
    expect(comp.instance.data.mode).toBe('type');
    const mArg = modeChange.mock.calls[0][0];
    expect(mArg && mArg.detail !== undefined ? mArg.detail : mArg).toEqual({ mode: 'type' });
    expect(comp.instance.data.placeholderText).toBe('Type your name below');

    comp.instance.onTyped({ detail: { value: 'Marrviin' } });
    await simulate.sleep(10);
    expect(comp.instance.data.canClear).toBe(true);
    expect(comp.instance.data.overlayStyle).toContain('data:image/svg+xml');

    comp.instance.onToggleMode();
    expect(comp.instance.data.mode).toBe('draw');
    expect(comp.instance.data.placeholderText).toBe('Sign here');
  });

  test('readOnly / disabled pad refuses clear and mode toggles', async () => {
    const comp = mountSig({ readOnly: true });
    comp.instance.onPadChange({ detail: { strokes: [STROKE] } });
    expect(comp.instance.data.canClear).toBe(true);
    comp.instance.onClear();
    expect(comp.instance.data.canClear).toBe(true); // refused
    comp.instance.onToggleMode();
    expect(comp.instance.data.mode).toBe('draw'); // refused
  });

  test('signature() returns the published value; clear() is a public alias', async () => {
    const comp = mountSig();
    // typed text only publishes in type mode (draw mode composes strokes)
    comp.instance.onToggleMode();
    comp.instance.onTyped({ detail: { value: 'Marrviin' } });
    await simulate.sleep(10);
    expect(comp.instance.signature()).toContain('data:image/svg+xml');
    comp.instance.clear();
    expect(comp.instance.data.canClear).toBe(false);
  });
});
