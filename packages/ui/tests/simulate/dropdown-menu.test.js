const { mount, loadDefinition } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

/** ll-dropdown-menu.__place writes `side` unconditionally; real WeChat
    observers fire only on value changes, but simulate fires them on every
    setData that touches the key — so placement re-enters forever and the
    suite OOMs. Cap re-entrant placement (the first pass does the real
    work); the 50ms height-correction pass is suppressed with it. */
function capPlacement(comp) {
  const inst = comp.instance;
  const orig = inst.__place;
  let done = false;
  inst.__place = () => {
    if (done) return;
    done = true;
    orig.call(inst);
  };
}

describe('ll-dropdown-menu', () => {
  test('the trigger is always there; the slip only when open', () => {
    const comp = mount('dropdown-menu/dropdown-menu');
    expect(comp.querySelector('.ll-dropdown-menu__trigger')).toBeTruthy();
    expect(comp.querySelector('.ll-dropdown-menu__panel')).toBeFalsy();
    expect(comp.instance.data.align).toBe('start'); // Radix dropdown default
  });

  test('trigger tap emits change and mounts + places the slip', async () => {
    const comp = mount('dropdown-menu/dropdown-menu');
    capPlacement(comp);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-dropdown-menu__trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('change', { value: true });
    expect(comp.instance.data.visible).toBe(true);
    await simulate.sleep(80); // the measure hop (60ms)
    expect(comp.instance.data.placed).toBe(true);
    expect(comp.querySelector('.ll-dropdown-menu__panel')).toBeTruthy();
    expect(comp.instance.data.panelStyle).toContain('width:128px;');
    expect(comp.instance.data.viewportStyle).toContain('max-height:');
    expect(comp.querySelector('.ll-dropdown-menu__viewport')).toBeTruthy();
  });

  test('controlled open prop shows, outside tap announces and the flip closes', async () => {
    const comp = mount('dropdown-menu/dropdown-menu', { open: true });
    capPlacement(comp);
    await simulate.sleep(80);
    expect(comp.querySelector('.ll-dropdown-menu__panel')).toBeTruthy();
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-dropdown-menu__catcher').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    // controlled: the page flips `open`, the observer plays the exit
    comp.setData({ open: false });
    await simulate.sleep(350);
    expect(comp.instance.data.visible).toBe(false);
    expect(comp.querySelector('.ll-dropdown-menu__panel')).toBeFalsy();
  });

  test('a bubbled select from a row closes the menu', async () => {
    const comp = mount('dropdown-menu/dropdown-menu');
    capPlacement(comp);
    comp.querySelector('.ll-dropdown-menu__trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onItemSelect();
    expect(trigger).toHaveBeenCalledWith('close');
    expect(trigger).toHaveBeenCalledWith('change', { value: false });
    await simulate.sleep(170);
    expect(comp.instance.data.visible).toBe(false);
  });

  test('a slotted item bubbles select up and closes the menu', async () => {
    const rootId = simulate.load({
      path: '/test/composite',
      template:
        '<ll-dropdown-menu class="menu"><ll-dropdown-menu-item class="it" value="x">Row</ll-dropdown-menu-item></ll-dropdown-menu>',
      usingComponents: {
        'll-dropdown-menu': loadDefinition('dropdown-menu', 'dropdown-menu'),
        'll-dropdown-menu-item': loadDefinition('dropdown-menu-item', 'dropdown-menu-item'),
      },
    });
    const comp = simulate.render(rootId);
    comp.attach(document.createElement('parent-wrapper'));
    await simulate.sleep(10);
    const menu = comp.querySelector('.menu');
    capPlacement(menu);
    const it = comp.querySelector('.it');
    menu.querySelector('.ll-dropdown-menu__trigger').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(menu.instance.data.visible).toBe(true);
    // the row's tap bubbles `select` through the slot into the panel
    it.querySelector('.ll-menu-row').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(menu.instance.data.closing).toBe(true);
    await simulate.sleep(170);
    expect(menu.instance.data.visible).toBe(false);
  });
});

describe('ll-dropdown-menu-item', () => {
  test('tap bubbles select with the row value', async () => {
    const comp = mount('dropdown-menu-item/dropdown-menu-item', { value: 'export' });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.querySelector('.ll-menu-row').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).toHaveBeenCalledWith('select', { value: 'export' }, { bubbles: true, composed: true });
  });

  test('disabled rows stay silent; destructive flips the modifier class', async () => {
    const comp = mount('dropdown-menu-item/dropdown-menu-item', {
      value: 'del',
      disabled: true,
      variant: 'destructive',
    });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    expect(comp.querySelector('.ll-menu-row').dom.className).toContain('ll-menu-row--destructive');
    expect(comp.querySelector('.ll-menu-row').dom.className).toContain('ll-menu-row--disabled');
    comp.querySelector('.ll-menu-row').dispatchEvent('tap');
    await simulate.sleep(10);
    expect(trigger).not.toHaveBeenCalled();
  });
});
