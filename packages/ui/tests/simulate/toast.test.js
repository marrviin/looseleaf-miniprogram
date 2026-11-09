const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

describe('ll-toaster (sonner store)', () => {
  // The slip store is a module-level singleton — drain it between tests
  // (dismiss(null) marks every record closing; records drop after 200ms).
  async function drain(comp) {
    comp.instance.dismiss(null);
    await simulate.sleep(220);
  }

  test('renders no slips before anything is toasted', async () => {
    const comp = mount('toast/toast');
    await drain(comp);
    expect(comp.querySelector('.slip')).toBeFalsy();
    expect(comp.instance.data.slips).toEqual([]);
  });

  test('toast/success/error/loading add typed slips with drawn icons', async () => {
    const comp = mount('toast/toast', { visibleToasts: 4 });
    await drain(comp);
    const inst = comp.instance;
    inst.toast('hello');
    inst.success('saved');
    inst.error('bad');
    inst.loading('wait');
    await simulate.sleep(10);
    const slips = inst.data.slips;
    // top-center renders newest first
    expect(slips.map((s) => s.type)).toEqual(['loading', 'error', 'success', 'default']);
    expect(slips[3].title).toBe('hello');
    expect(slips[2].icon).toBe('circle-check');
    expect(slips[1].icon).toBe('octagon-x');
    expect(slips[0].icon).toBe('loader-circle');
    expect(slips[0].spinning).toBe(true);
  });

  test('dismiss flags the slip closing, then drops the record', async () => {
    const comp = mount('toast/toast');
    await drain(comp);
    const id = comp.instance.toast('bye');
    await simulate.sleep(10);
    expect(comp.instance.data.slips[0].title).toBe('bye');
    comp.instance.dismiss(id);
    await simulate.sleep(10);
    expect(comp.instance.data.slips[0].closing).toBe(true);
    expect(comp.querySelector('.slipbox').dom.className).toContain('slipbox--closing');
    await simulate.sleep(220);
    expect(comp.instance.data.slips).toEqual([]);
  });

  test('action/cancel rows run their callbacks and dismiss the slip', async () => {
    const comp = mount('toast/toast');
    await drain(comp);
    const onClick = jest.fn();
    const onCancel = jest.fn();
    comp.instance.toast('undo me', {
      action: { label: 'Undo', onClick },
      cancel: { label: 'No', onClick: onCancel },
    });
    await simulate.sleep(10);
    expect(comp.instance.data.slips[0].actionLabel).toBe('Undo');
    expect(comp.instance.data.slips[0].cancelLabel).toBe('No');
    comp.querySelector('.slip__action').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(comp.instance.data.slips[0].closing).toBe(true);
  });

  test('visibleToasts caps the stack (newest first on top positions)', async () => {
    const comp = mount('toast/toast');
    await drain(comp);
    for (const t of ['t1', 't2', 't3', 't4']) comp.instance.toast(t);
    await simulate.sleep(10);
    const slips = comp.instance.data.slips;
    expect(slips).toHaveLength(3);
    expect(slips.map((s) => s.title)).toEqual(['t4', 't3', 't2']);
  });

  test('promise morphs the loading slip in place when it settles', async () => {
    const comp = mount('toast/toast');
    await drain(comp);
    comp.instance.promise(Promise.resolve('ok'), {
      loading: 'Loading...',
      success: (d) => `done ${d}`,
    });
    // the loading record exists synchronously; the microtask that settles
    // the promise flushes on the first sleep
    expect(comp.instance.data.slips[0].type).toBe('loading');
    await simulate.sleep(20);
    expect(comp.instance.data.slips[0].type).toBe('success');
    expect(comp.instance.data.slips[0].title).toBe('done ok');
    expect(comp.instance.data.slips[0].description).toBe('');
  });

  test('toasterId tags slips so separate toasters render separate stacks', async () => {
    const a = mount('toast/toast');
    const b = mount('toast/toast', { toasterId: 'b' });
    await drain(a);
    await drain(b);
    a.instance.toast('a-only');
    b.instance.toast('b-only');
    await simulate.sleep(10);
    expect(a.instance.data.slips.map((s) => s.title)).toEqual(['a-only']);
    expect(b.instance.data.slips.map((s) => s.title)).toEqual(['b-only']);
    await drain(a);
  });
});
