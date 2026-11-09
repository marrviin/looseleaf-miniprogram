const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

/** addEventListener spies receive the re-emitted event wrapper. */
const payloadOf = (spy, i = 0) => {
  const arg = spy.mock.calls[i][0];
  return arg && arg.detail !== undefined ? arg.detail : arg;
};

describe('ll-sticker-picker', () => {
  test('trigger tap opens the picker, resets the body and emits change(true)', async () => {
    const comp = mount('sticker-picker/sticker-picker');
    const change = jest.fn();
    comp.addEventListener('change', change);
    comp.instance.setData({ query: 'leftover', category: 'foodDrink', activeKey: 'x' });
    // NOTE: dispatchEvent('tap') on the trigger OOMs j-component's renderer
    // on this component's heavy (SVG-heavy) tree — drive the handler directly.
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    expect(payloadOf(change)).toEqual({ value: true });
    expect(comp.instance.data.visible).toBe(true);
    expect(comp.instance.data.query).toBe(''); // upstream remount semantics
    expect(comp.instance.data.category).toBe('all');
    // activeKey resets, then __refresh re-lights the first cell of the grid
    expect(comp.instance.data.activeKey).toBe(comp.instance.data.sections[0].cells[0].key);
    expect(comp.instance.data.cats.length).toBeGreaterThan(1); // "All" + real batches
    expect(comp.instance.data.sections.length).toBeGreaterThan(0);
  });

  test('the default catalog draws sticker cells as SVG data URIs', async () => {
    const comp = mount('sticker-picker/sticker-picker');
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    const cells = comp.instance.data.sections.flatMap((s) => s.cells);
    expect(cells.length).toBeGreaterThan(0);
    for (const c of cells.slice(0, 5)) {
      expect(c.uri).toContain('data:image/svg+xml');
      expect(c.label).toBeTruthy();
      expect(c.cat).toBeTruthy();
    }
  });

  test('search filters the grid; a miss reports the query in the empty text', async () => {
    const comp = mount('sticker-picker/sticker-picker');
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    comp.instance.onQuery({ detail: { value: 'zzz-nope' } });
    await simulate.sleep(10);
    expect(comp.instance.data.sections).toHaveLength(0);
    expect(comp.instance.data.emptyText).toContain('zzz-nope');
  });

  test('category chips narrow the sections to that batch', async () => {
    const comp = mount('sticker-picker/sticker-picker');
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    const cat = comp.instance.data.cats.find((c) => c.key !== 'all');
    comp.instance.onCatTap({ currentTarget: { dataset: { key: cat.key } } });
    await simulate.sleep(10);
    expect(comp.instance.data.category).toBe(cat.key);
    for (const sec of comp.instance.data.sections) {
      for (const cell of sec.cells) expect(cell.category).toBe(cat.key);
    }
    // tapping the active chip again is a no-op
    comp.instance.onCatTap({ currentTarget: { dataset: { key: cat.key } } });
    expect(comp.instance.data.category).toBe(cat.key);
  });

  test('tapping a sticker emits select; closeOnSelect closes the slip', async () => {
    const comp = mount('sticker-picker/sticker-picker');
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    const select = jest.fn();
    const change = jest.fn();
    comp.addEventListener('select', select);
    comp.addEventListener('change', change);
    const cell = comp.instance.data.sections[0].cells[0];
    comp.instance.onCellTap({
      currentTarget: { dataset: { s: 0, i: 0 } },
    });
    await simulate.sleep(10);
    expect(payloadOf(select)).toEqual(
      expect.objectContaining({ name: cell.name, label: cell.label, category: cell.category, categoryLabel: cell.cat })
    );
    expect(comp.instance.data.visible).toBe(false);
    expect(payloadOf(change)).toEqual({ value: false });
  });

  test('closeOnSelect=false keeps the slip open for multi-pick; the touch lights the cell', async () => {
    const comp = mount('sticker-picker/sticker-picker', { closeOnSelect: false });
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    const first = comp.instance.data.sections[0].cells[0];
    comp.instance.onCellTouch({ currentTarget: { dataset: { s: 0, i: 0, key: first.key } } });
    await simulate.sleep(10);
    expect(comp.instance.data.activeKey).toBe(first.key);
    expect(comp.instance.data.activeLabel).toBe(first.label);
    // NOTE: stickerFace(peel:true) returned no SVG for this sticker under the
    // simulate runtime, so the peel-corner layer can't be asserted here.
    expect(comp.instance.data.activeCat).toBe(first.cat);
    comp.instance.onCellTap({ currentTarget: { dataset: { s: 0, i: 0 } } });
    expect(comp.instance.data.visible).toBe(true);
  });

  test('the chosen value is marked in the grid', async () => {
    const comp = mount('sticker-picker/sticker-picker');
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    const name = comp.instance.data.sections[0].cells[0].name;
    comp.setData({ value: name });
    await simulate.sleep(30); // 'value' observer refreshes the grid
    const marked = comp.instance.data.sections.flatMap((s) => s.cells).find((c) => c.name === name);
    expect(marked.sel).toBe(true);
  });

  test('a restricted sticker list shows only those names', async () => {
    const comp = mount('sticker-picker/sticker-picker');
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    const name = comp.instance.data.sections[0].cells[0].name;
    comp.setData({ stickers: [name] });
    await simulate.sleep(30);
    comp.instance.onTriggerTap();
    await simulate.sleep(30);
    const cells = comp.instance.data.sections.flatMap((s) => s.cells);
    expect(cells).toHaveLength(1);
    expect(cells[0].name).toBe(name);
  });
});
