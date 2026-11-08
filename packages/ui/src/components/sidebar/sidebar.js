import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { svgDataUri } from '../../common/ink';
import { binderClip } from '../../common/ink-engine';
import { props, validators } from './props';

ensureHandFont();

/** Upstream `Sidebar` — the pad. On a phone it is the same pad in a Sheet;
    on a wide window (or with `static`, the docs-demo escape hatch) a docked
    Paper with a gap reserving its width. Collapsible-to-icon squeezes both
    to a 3rem strip — the children hear `collapsed` through the descendant
    relation and hide their labels/badges/clip. The inside clip (phone sheet
    and collapsible="none") is drawn here — the docked pad's clip hangs in
    the gutter and is the paper's own binder-clip fastener. */
const SIDE_SHADOW = {
  left: '7px 0 18px -6px rgba(58,44,30,0.34), 1px 0 1.5px rgba(58,44,30,0.24)',
  right: '-7px 0 18px -6px rgba(58,44,30,0.34), -1px 0 1.5px rgba(58,44,30,0.24)',
};

const inList = (v, list, fallback) => (list.includes(v) ? v : fallback);

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    sideCls: 'left',
    variantCls: 'sidebar',
    collapsibleCls: 'offcanvas',
    renderMobile: true,
    activeOpen: false,
    collapsed: false,
    clipAuto: true,
    clipStyle: '',
    dockedShadow: '',
  },
  relations: {
    '../sidebar-menu-item/sidebar-menu-item': { type: 'descendant' },
    '../sidebar-group-label/sidebar-group-label': { type: 'descendant' },
    '../sidebar-group-action/sidebar-group-action': { type: 'descendant' },
    '../sidebar-menu-action/sidebar-menu-action': { type: 'descendant' },
    '../sidebar-menu-badge/sidebar-menu-badge': { type: 'descendant' },
    '../sidebar-menu-sub/sidebar-menu-sub': { type: 'descendant' },
    '../sidebar-rail/sidebar-rail': { type: 'descendant' },
  },
  lifetimes: {
    attached() {
      this.__adoptProps();
    },
  },
  observers: {
    'side, variant, collapsible, clip, static, paperShadow'() {
      this.__adoptProps();
    },
  },
  methods: {
    __adoptProps() {
      const d = this.data;
      const side = inList(d.side, validators.side, 'left');
      const variant = inList(d.variant, validators.variant, 'sidebar');
      const collapsible = inList(d.collapsible, validators.collapsible, 'offcanvas');
      const clipAuto = d.clip === null ? collapsible !== 'none' : !!d.clip;
      // paperShadow="none" flushes the docked pad: no SIDE_SHADOW css (it
      // would win over the Paper shadow prop — shadowCss beats shadow).
      const dockedShadow =
        d.paperShadow === 'none' || variant !== 'sidebar' ? '' : SIDE_SHADOW[side];
      this.setData({ sideCls: side, variantCls: variant, collapsibleCls: collapsible, clipAuto, dockedShadow });
      if (this.__provider) this.__provider.__reportSidebar(variant, side);
      this.__syncClip();
      this.__syncState();
    },
    /** Inside clip: a fixed-size static drawing (the paper props pipeline),
        centered on the pad's top edge and standing ON the paper. */
    __syncClip() {
      const res = binderClip(`${this.data.seed || 'll-sidebar'}|clip`, { width: 52 });
      const pad = res.pad || 0;
      this.setData({
        clipStyle:
          `top:${(4 - pad) * 2}rpx;left:50%;margin-left:${(-res.w / 2 - pad) * 2}rpx;` +
          `width:${res.w + pad * 2}px;height:${res.h + pad * 2}px;` +
          `background-image:url("${svgDataUri(res.svg, res)}");` +
          'background-size:100% 100%;background-repeat:no-repeat;',
      });
    },
    /** Provider context landed — decide sheet vs docked and the active open
        state (on a phone the toggle target is the sheet's openMobile). */
    __onProvider(ctx) {
      this.__provider = ctx.root;
      this.__providerCtx = ctx;
      this.__syncState();
    },
    __syncState() {
      const ctx = this.__providerCtx;
      const d = this.data;
      const isMobile = ctx ? ctx.isMobile : true;
      const openMobile = ctx ? ctx.openMobile : false;
      const open = ctx ? ctx.open : true;
      const renderMobile = d.static ? false : isMobile;
      const activeOpen = isMobile ? openMobile : open;
      const collapsed = d.collapsibleCls === 'icon' && !activeOpen;
      this.setData({ renderMobile, activeOpen, collapsed });
      this.__push();
    },
    /** Collapsed state fans out to the rows/badges/labels through the
        descendant relation (the accordion __sync pattern). */
    __push() {
      const ctx = { collapsed: this.data.collapsed, renderMobile: this.data.renderMobile };
      ['../sidebar-menu-item/sidebar-menu-item', '../sidebar-group-label/sidebar-group-label', '../sidebar-group-action/sidebar-group-action', '../sidebar-menu-action/sidebar-menu-action', '../sidebar-menu-badge/sidebar-menu-badge', '../sidebar-menu-sub/sidebar-menu-sub', '../sidebar-rail/sidebar-rail'].forEach((path) => {
        (this.getRelationNodes(path) || []).forEach((c) => c.__onSidebar && c.__onSidebar(ctx));
      });
    },
  },
});
