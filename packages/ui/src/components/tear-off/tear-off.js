import { createComponent } from '../../common/component';
import { renderLayers } from '../../common/ink';
import { props, validators } from './props';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const GONE_MS = 420;

/** Upstream `TearOff` (+ Body + Stub, folded in): a coupon, ticket or
    raffle strip with a stub you tear off along a perforated line. Pull the
    stub and it swings off its far corner, tap it and it comes away; the
    ticket keeps a torn edge. The body and the stub take named slots
    ("body" / "stub"); the state is here, where context cannot carry it.
    Events: `tear` (once, when a person tears it off), `tornchange`
    {torn}. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
    multipleSlots: true,
  },
  properties: props,
  data: {
    tornRender: false,
    gone: false,
    editable: true,
    dragStyle: '',
    // the printed perforation (scissors + dashes) and the pull hint
    seamStyle: '',
    hintStyle: '',
    // per-side paper edges ({right: 'perf'} → torn), kept in data because
    // the wxml compiler rejects object-literal bindings
    bodyEdge: { right: 'perf' },
    stubEdge: { left: 'perf' },
  },
  observers: {
    // controlled `torn` from the page — only act when it actually moves
    torn(v) {
      if (v === null || v === undefined) return;
      if (!!v !== this.__inner) this.__applyTorn(!!v);
    },
    'disabled, orientation'() {
      this.setData({ editable: !this.data.disabled });
      this.__syncEdges();
      this.__drawDecor();
    },
  },
  lifetimes: {
    attached() {
      this.setData({ editable: !this.data.disabled });
      this.__inner = !!this.data.defaultTorn;
      this.__applyTorn(this.__inner);
      this.__measureStub(0);
    },
  },
  methods: {
    noop() {},
    __isTorn() {
      return !!this.__inner;
    },
    __applyTorn(on) {
      clearTimeout(this.__goneTimer);
      this.__inner = on;
      if (on) {
        this.setData({ tornRender: true, gone: false, dragStyle: '' });
        this.__goneTimer = setTimeout(() => {
          if (this.__isTorn()) this.setData({ gone: true });
        }, GONE_MS);
      } else {
        const was = this.data.tornRender;
        this.setData({ tornRender: false, gone: false });
        if (was) {
          // a fresh stub drops onto the ticket
          this.setData({ restored: true });
          setTimeout(() => this.setData({ restored: false }), 500);
        }
      }
      this.__syncEdges();
      this.__drawDecor();
    },
    /** Body's seam side (right/bottom) and stub's (left/top) go torn. */
    __syncEdges() {
      const vertical = (validators.orientation.includes(this.data.orientation) ? this.data.orientation : 'horizontal') === 'vertical';
      const kind = this.__isTorn() ? 'torn' : 'perf';
      this.setData({
        bodyEdge: vertical ? { bottom: kind } : { right: kind },
        stubEdge: vertical ? { top: kind } : { left: kind },
      });
    },
    /** Upstream tear() — once; a person can only attach it back through the
        controlled prop. */
    tear() {
      if (this.__isTorn() || !this.data.editable) return false;
      if (this.data.torn === null || this.data.torn === undefined) {
        this.__applyTorn(true);
      }
      this.triggerEvent('tornchange', { torn: true });
      this.triggerEvent('tear');
      return true;
    },
    /** Put a fresh stub on or tear it off from code (verification hook; the
        demo's Reset drives the controlled prop, which lands here too). */
    setTorn(on) {
      if (this.data.torn === null || this.data.torn === undefined) {
        this.__applyTorn(!!on);
      } else {
        this.triggerEvent('tornchange', { torn: !!on });
      }
      return true;
    },
    /** Verification hook: the laid-out boxes of the halves. */
    boxes() {
      return new Promise((res) => {
        this.createSelectorQuery()
          .select('.ll-tear-off__body')
          .boundingClientRect((b) =>
            this.createSelectorQuery()
              .select('.ll-tear-off__stub')
              .boundingClientRect((s) =>
                res({
                  body: b && { left: Math.round(b.left), top: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) },
                  stub: s && { left: Math.round(s.left), top: Math.round(s.top), w: Math.round(s.width), h: Math.round(s.height) },
                }),
              )
              .exec(),
          )
          .exec();
      });
    },

    // --- decoration (perforation + hint) ------------------------------------
    __measureStub(n) {
      this.createSelectorQuery()
        .select('.ll-tear-off__paper')
        .boundingClientRect((rect) => {
          if (rect && rect.width) {
            this.__stubBox = { w: rect.width, h: rect.height };
            this.__drawDecor();
          } else if (n < 300) {
            const t = [50, 250, 1000][Math.min(2, Math.floor(n / 60))] || 50;
            setTimeout(() => this.__measureStub(n + 1), t);
          }
        })
        .exec();
    },
    __drawDecor() {
      const d = this.data;
      if (this.__isTorn()) return; // the torn edge is the seam's job now
      const vertical = (validators.orientation.includes(d.orientation) ? d.orientation : 'horizontal') === 'vertical';
      const box = this.__stubBox || { w: 128, h: 100 };
      const seed = 'll-tear-off';
      // the seam strip rides the stub's seam edge (upstream inset-y-3 w-4)
      const seamBox = vertical
        ? { w: Math.max(16, box.w - 24), h: 16 }
        : { w: 16, h: Math.max(16, box.h - 24) };
      const seam = renderLayers('tear-off-seam', seamBox, { scissors: true, inset: 5 }, seed);
      // the curled pencil arrow (36×28) at the stub's pull corner
      const hint = renderLayers('tear-off-hint', { w: 36, h: 28 }, { toward: vertical ? 'down' : 'right' }, seed);
      this.setData({
        seamStyle: seam && seam.uris.rest ? `inset:${-seam.pad}px;background-image:url("${seam.uris.rest}")` : '',
        hintStyle: hint && hint.uris.rest ? `inset:${-hint.pad}px;background-image:url("${hint.uris.rest}")` : '',
      });
    },

    // --- drag to tear ---------------------------------------------------------
    onStubDown(e) {
      if (!this.data.editable || this.__isTorn()) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      const vertical = (validators.orientation.includes(this.data.orientation) ? this.data.orientation : 'horizontal') === 'vertical';
      this.__drag = {
        x: t.clientX,
        y: t.clientY,
        size: (this.__stubBox && (vertical ? this.__stubBox.h : this.__stubBox.w)) || 100,
        p: 0,
        moved: false,
        vertical,
        last: 0,
      };
    },
    onStubMove(e) {
      const d = this.__drag;
      if (!d) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      const along = d.vertical ? t.clientY - d.y : t.clientX - d.x;
      if (Math.abs(along) > 4) d.moved = true;
      d.p = clamp(along / Math.max(56, d.size * 0.7), 0, 1);
      const now = Date.now();
      if (now - d.last < 30 && d.p < 1) return;
      d.last = now;
      // upstream: translate(--tear * tx0, --tear * ty0) rotate(--tear * rot0)
      const tx = d.vertical ? 0 : 8;
      const ty = d.vertical ? 10 : 4;
      const rot = d.vertical ? -14 : 14;
      const origin = d.vertical ? 'top left' : 'bottom left';
      this.setData({
        dragStyle:
          `transform-origin:${origin};` +
          `transform:translate(${d.p * tx}px,${d.p * ty}px) rotate(${d.p * rot}deg);`,
      });
      if (d.p >= 1) {
        this.__drag = null;
        this.tear();
      }
    },
    onStubUp() {
      const d = this.__drag;
      this.__drag = null;
      if (!d) return;
      // a tap tears; a pull past half tears; a shorter pull springs back
      if (!d.moved || d.p >= 0.5) {
        this.tear();
      } else {
        this.setData({ dragStyle: '' });
      }
    },
  },
});
