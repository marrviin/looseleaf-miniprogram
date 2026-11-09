const { mount } = require('./helpers/mount.cjs');

describe('ll-card', () => {
  test('composes ll-paper — the paper root carries the card class', () => {
    const comp = mount('card/card');
    // simulate's querySelector does not cross into the ll-paper child tree,
    // so assert the composed DOM through jsdom: the external ll-class rides
    // onto the paper root, next to ll-paper.
    const paperRoot = comp.dom.querySelector('[class*="ll-paper"][class*="ll-card"]');
    expect(paperRoot).toBeTruthy();
    expect(paperRoot.className).toContain('ll-paper');
    expect(paperRoot.className).toContain('ll-card');
  });

  test('defaults to the card stock with no rules (upstream Card = Paper stock=card rules=none)', () => {
    const comp = mount('card/card');
    expect(comp.instance.data.stock).toBe('card');
    expect(comp.instance.data.rules).toBe('none');
  });

  test('paper props pass through to the sheet', () => {
    const comp = mount('card/card', { stock: 'kraft', tape: 'corner', seed: 'fixed' });
    expect(comp.instance.data.stock).toBe('kraft');
    expect(comp.instance.data.tape).toBe('corner');
    // the sheet visual is drawn by ll-paper inside the composition
    expect(comp.dom.querySelector('[class*="ll-paper__sheet"]')).toBeTruthy();
  });
});
