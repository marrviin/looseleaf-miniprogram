const { mount } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// Harness note: relations never link under miniprogram-simulate, so the
// provider↔sidebar context bridge is exercised by calling __onProvider with
// a hand-built context object (exactly what the provider pushes). The
// provider's own state machine is mounted standalone.

// The wx.* stub reports a phone (windowWidth 393 < 768): the provider runs
// in mobile mode — the pad renders inside a Sheet and toggles openMobile.
describe('ll-sidebar-provider', () => {
  test('starts expanded on desktop state, mobile sheet shut', async () => {
    const comp = mount('sidebar-provider/sidebar-provider');
    await simulate.sleep(10);
    expect(comp.instance.data.isMobile).toBe(true);
    expect(comp.instance.data.effOpen).toBe(true); // defaultOpen
    expect(comp.instance.data.state).toBe('expanded');
    expect(comp.instance.data.openMobile).toBe(false);
  });

  test('__toggle on a phone flips openMobile and announces it', () => {
    const comp = mount('sidebar-provider/sidebar-provider');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__toggle();
    expect(comp.instance.data.openMobile).toBe(true);
    expect(trigger).toHaveBeenCalledWith('change', { openMobile: true });
    comp.instance.__toggle();
    expect(comp.instance.data.openMobile).toBe(false);
  });

  test('__toggle on desktop flips the persisted open state', () => {
    const comp = mount('sidebar-provider/sidebar-provider');
    comp.instance.setData({ isMobile: false });
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.__toggle();
    expect(comp.instance.data.effOpen).toBe(false);
    expect(comp.instance.data.state).toBe('collapsed');
    expect(trigger).toHaveBeenCalledWith('change', { open: false });
  });

  test('the controlled open prop drives effOpen', async () => {
    const comp = mount('sidebar-provider/sidebar-provider', { open: false });
    expect(comp.instance.data.effOpen).toBe(false);
    comp.setData({ open: true });
    await simulate.sleep(10);
    expect(comp.instance.data.effOpen).toBe(true);
    expect(comp.instance.data.state).toBe('expanded');
  });

  test('__reportSidebar mirrors the pad variant/side for the insets', () => {
    const comp = mount('sidebar-provider/sidebar-provider');
    comp.instance.__reportSidebar('floating', 'right');
    expect(comp.instance.data.variant).toBe('floating');
    expect(comp.instance.data.side).toBe('right');
  });
});

describe('ll-sidebar', () => {
  test('default (mobile, no provider yet): sheet branch, clip auto-drawn', async () => {
    const comp = mount('sidebar/sidebar');
    await simulate.sleep(10);
    expect(comp.instance.data.renderMobile).toBe(true);
    expect(comp.instance.data.clipAuto).toBe(true);
    // mobile renders the sheet branch (a sheet body, not a docked pad)
    expect(comp.querySelector('.ll-sidebar__body')).toBeTruthy();
    expect(comp.querySelector('.ll-sidebar')).toBeFalsy();
    // the binder clip is a drawn SVG standing on the paper
    expect(comp.instance.data.clipStyle).toContain('background-image:url("data:image/svg');
  });

  test('desktop context: docked pad classes and expanded data-state', async () => {
    const comp = mount('sidebar/sidebar');
    comp.instance.__onProvider({ isMobile: false, open: true, openMobile: false, root: null, variant: 'sidebar', side: 'left' });
    await simulate.sleep(10);
    expect(comp.instance.data.renderMobile).toBe(false);
    const pad = comp.querySelector('.ll-sidebar');
    expect(pad).toBeTruthy();
    expect(pad.dom.className).toContain('is-desktop');
    expect(pad.dom.className).toContain('is-side-left');
    expect(pad.dom.className).toContain('is-sidebar');
    expect(pad.dom.getAttribute('data-state')).toBe('expanded');
  });

  test('collapsible="icon" + closed context collapses to the icon strip', async () => {
    const comp = mount('sidebar/sidebar', { collapsible: 'icon' });
    comp.instance.__onProvider({ isMobile: false, open: false, openMobile: false, root: null, variant: 'sidebar', side: 'left' });
    await simulate.sleep(10);
    expect(comp.instance.data.collapsed).toBe(true);
    const pad = comp.querySelector('.ll-sidebar');
    expect(pad.dom.className).toContain('is-collapsed');
    expect(pad.dom.getAttribute('data-state')).toBe('collapsed');
  });

  test('side/variant flow through the docked classes', async () => {
    const comp = mount('sidebar/sidebar', { side: 'right', variant: 'floating' });
    comp.instance.__onProvider({ isMobile: false, open: true, openMobile: false, root: null, variant: 'floating', side: 'right' });
    await simulate.sleep(10);
    const pad = comp.querySelector('.ll-sidebar');
    expect(pad.dom.className).toContain('is-side-right');
    expect(pad.dom.className).toContain('is-floating');
  });

  test('collapsible="none" renders the static pad branch', async () => {
    const comp = mount('sidebar/sidebar', { collapsible: 'none' });
    await simulate.sleep(10);
    const pad = comp.querySelector('.ll-sidebar');
    expect(pad.dom.className).toContain('is-none');
    expect(comp.querySelector('.ll-sidebar__body')).toBeFalsy();
  });

  test('clip=false removes the inside clip; paperShadow none flushes the docked pad', async () => {
    const comp = mount('sidebar/sidebar', { clip: false, paperShadow: 'none' });
    comp.instance.__onProvider({ isMobile: false, open: true, openMobile: false, root: null, variant: 'sidebar', side: 'left' });
    await simulate.sleep(10);
    expect(comp.instance.data.clipAuto).toBe(false);
    expect(comp.instance.data.dockedShadow).toBe('');
    expect(comp.querySelector('.ll-sidebar__clip')).toBeFalsy();
  });

  test('the collapsed/mobile context fans out to the pad family', () => {
    const comp = mount('sidebar/sidebar', { collapsible: 'icon' });
    const seen = [];
    // __push walks the (relation-less) descendant lists — inject one listener
    comp.instance.getRelationNodes = (path) =>
      path.indexOf('sidebar-menu-item') !== -1 ? [{ __onSidebar: (ctx) => seen.push(ctx) }] : [];
    comp.instance.__onProvider({ isMobile: false, open: false, openMobile: false, root: null, variant: 'sidebar', side: 'left' });
    expect(seen).toEqual([{ collapsed: true, renderMobile: false }]);
  });
});
