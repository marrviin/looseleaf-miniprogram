/**
 * PROTOTYPE — validates the simulate harness against the three riskiest
 * pieces of this repo: the createComponent factory, virtualHost components,
 * and the attachInk behavior (which measures the box at attach).
 *
 * If this file passes, the harness generalizes to the other 367 components.
 */
const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('prototype: ll-button under miniprogram-simulate', () => {
  test('attaches and renders its default variant class', () => {
    const comp = mount('button/button');
    const btn = comp.querySelector('.ll-button');
    expect(btn).toBeTruthy();
    expect(btn.dom.className).toContain('ll-button--default');
    expect(btn.dom.innerHTML).toContain('ll-ink-layer');
  });

  test('prop changes flip the variant class', async () => {
    const comp = mount('button/button');
    comp.setData({ variant: 'destructive' });
    expect(comp.querySelector('.ll-button').dom.className).toContain('ll-button--destructive');
  });

  test('tap re-emits the tap event unless disabled/loading', async () => {
    const comp = mount('button/button');
    const inst = comp.instance;
    const trigger = jest.spyOn(inst, 'triggerEvent');

    // DOM-level tap → the handler re-emits.
    comp.querySelector('.ll-button').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('tap', expect.anything());

    // disabled/loading must short-circuit in the handler (the native disabled
    // button behavior itself is runtime territory — L3).
    comp.setData({ disabled: true });
    await simulate.sleep(10);
    trigger.mockClear();
    inst.onTap({ detail: {} });
    expect(trigger).not.toHaveBeenCalled();

    comp.setData({ disabled: false, loading: true });
    await simulate.sleep(10);
    inst.onTap({ detail: {} });
    expect(trigger).not.toHaveBeenCalled();
  });
});
