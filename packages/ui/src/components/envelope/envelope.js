import { createComponent } from '../../common/component';
import { tiltFor } from '../../common/ink-engine';
import { props } from './props';

/** Upstream `Envelope` — the back sheet (envelope-back ink: the flap stands
    up when it opens) with a spacer that grows so the letter has somewhere
    to slide into. Front, trigger and letter register through the descendant
    relations and get `{ open, stock, stamp, postmark, airmail, seed }`. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'envelope-back',
    llInkSelector: '.ll-envelope__sheet',
    openNow: false,
    tiltStyle: '',
    stampName: 'tomato',
  },
  relations: {
    '../envelope-front/envelope-front': {
      type: 'descendant',
      linked(child) {
        (this.__fronts = this.__fronts || []).push(child);
      },
      unlinked(child) {
        this.__fronts = (this.__fronts || []).filter((c) => c !== child);
      },
    },
    '../envelope-trigger/envelope-trigger': {
      type: 'descendant',
      linked(child) {
        (this.__triggers = this.__triggers || []).push(child);
      },
      unlinked(child) {
        this.__triggers = (this.__triggers || []).filter((c) => c !== child);
      },
    },
    '../envelope-letter/envelope-letter': {
      type: 'descendant',
      linked(child) {
        (this.__letters = this.__letters || []).push(child);
      },
      unlinked(child) {
        this.__letters = (this.__letters || []).filter((c) => c !== child);
      },
    },
  },
  observers: {
    'open, defaultOpen'(open) {
      const next = typeof open === 'boolean' ? open : this.data.defaultOpen;
      if (next !== this.data.openNow) this.setData({ openNow: next });
      setTimeout(() => this.__sync(), 0);
    },
    'stock, stamp, postmark, airmail, seed'() {
      setTimeout(() => this.__sync(), 0);
    },
  },
  lifetimes: {
    attached() {
      const { open, defaultOpen, tilt, seed } = this.data;
      // Snapshot before mirroring below — mirroring writes the `open`
      // property, which would make the uncontrolled envelope look controlled.
      this.__controlled = typeof open === 'boolean';
      const openNow = this.__controlled ? open : defaultOpen;
      const deg = tilt === false ? 0 : typeof tilt === 'number' ? tilt : tiltFor(`tilt:${seed || 'envelope'}`, 1.1);
      const tiltStyle = deg ? `transform:rotate(${deg}deg);` : '';
      // data.open drives the attachInk open layer (the raised flap); mirror
      // the uncontrolled state into it.
      this.setData({ openNow, open: openNow, tiltStyle });
      setTimeout(() => this.__sync(), 0);
    },
  },
  methods: {
    __sync() {
      const d = this.data;
      const ctx = {
        open: d.openNow,
        stock: d.stock || 'kraft',
        stamp: d.stamp === false || d.stamp === 'none' ? 'none' : d.stamp || 'tomato',
        postmark: !!d.postmark && d.stamp !== false && d.stamp !== 'none',
        airmail: !!d.airmail,
        seed: `${d.seed || 'envelope'}`,
      };
      (this.__fronts || []).forEach((c) => c.__onEnvelope(ctx));
      (this.__triggers || []).forEach((c) => c.__onEnvelope(ctx));
      (this.__letters || []).forEach((c) => c.__onEnvelope(ctx));
      if (d.openNow !== this.data.openNow) this.setData({ openNow: d.openNow });
    },
    /** The trigger (or any external call) toggles the envelope. */
    setOpen(next, source) {
      if (this.__controlled) this.triggerEvent('openchange', { open: next });
      else this.setData({ openNow: next, open: next });
      if (source !== 'observer') this.__sync();
    },
    __onTriggerTap() {
      if (this.data.disabled) return;
      this.setOpen(!this.data.openNow);
    },
  },
});
