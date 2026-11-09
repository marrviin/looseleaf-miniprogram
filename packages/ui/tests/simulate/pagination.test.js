const { mount, loadDefinition } = require('./helpers/mount.cjs');
const simulate = require('miniprogram-simulate');

// Harness note: components whose template root is a bare <ll-button> render
// as an opaque <virtual> when mounted directly — the inner button is not
// queryable from the parent. The rendered chrome is asserted through a
// composite wrapper (which renders fully); the tap re-emission through the
// handler on the directly-mounted instance (ll-button's own tap path is
// covered in button.test.js). simulate also drops aria-role/aria-label
// attributes from the DOM, so aria assertions use the instance data.

function wrapIn(template, data) {
  const rootId = simulate.load({
    path: '/test/composite',
    template,
    usingComponents: {
      'll-pagination-link': loadDefinition('pagination-link', 'pagination-link'),
      'll-pagination-previous': loadDefinition('pagination-previous', 'pagination-previous'),
    },
    data,
  });
  const comp = simulate.render(rootId);
  comp.attach(document.createElement('parent-wrapper'));
  return comp;
}

describe('ll-pagination', () => {
  test('renders the nav landmark with its default label', () => {
    const comp = mount('pagination/pagination');
    const nav = comp.querySelector('.ll-pagination');
    expect(nav).toBeTruthy();
    expect(comp.instance.data.ariaLabel).toBe('pagination');
  });
});

describe('ll-pagination-link', () => {
  test('isActive draws secondary, others ghost', async () => {
    const comp = wrapIn('<ll-pagination-link class="pl" is-active="{{a}}" />', { a: true });
    expect(comp.dom.innerHTML).toContain('ll-button--secondary');
    comp.setData({ a: false });
    await simulate.sleep(10);
    expect(comp.dom.innerHTML).toContain('ll-button--ghost');
    expect(comp.dom.innerHTML).not.toContain('ll-button--secondary');
  });

  test('the wrapped ll-button tap re-emits for the page', () => {
    const comp = mount('pagination-link/pagination-link');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onTap({ detail: { page: 2 } });
    expect(trigger).toHaveBeenCalledWith('tap', { page: 2 });
  });

  test('disabled propagates to the inner button', () => {
    const comp = wrapIn('<ll-pagination-link disabled="{{true}}" />', {});
    expect(comp.dom.innerHTML).toContain('disabled');
  });
});

describe('ll-pagination-previous / -next', () => {
  test('previous carries the drawn chevron + label', () => {
    const comp = wrapIn('<ll-pagination-previous class="pv" />', {});
    // the chevron is a drawn felt-tip SVG (icon art), not text
    expect(comp.dom.innerHTML).toContain('data:image/svg');
    expect(comp.dom.innerHTML).toContain('ll-pagination-previous__label');
    expect(comp.dom.innerHTML).toContain('Previous');
  });

  test('previous re-emits tap', () => {
    const comp = mount('pagination-previous/pagination-previous');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onTap({ detail: {} });
    expect(trigger).toHaveBeenCalledWith('tap', {});
  });

  test('next re-emits tap', () => {
    const comp = mount('pagination-next/pagination-next');
    const trigger = jest.spyOn(comp.instance, 'triggerEvent');
    comp.instance.onTap({ detail: {} });
    expect(trigger).toHaveBeenCalledWith('tap', {});
  });
});

describe('ll-pagination-item / -ellipsis', () => {
  test('item is a plain li slot, ellipsis renders its slot square', () => {
    const item = mount('pagination-item/pagination-item');
    expect(item.querySelector('.ll-pagination-item')).toBeTruthy();
    const ell = mount('pagination-ellipsis/pagination-ellipsis');
    expect(ell.querySelector('.ll-pagination-ellipsis')).toBeTruthy();
  });
});
