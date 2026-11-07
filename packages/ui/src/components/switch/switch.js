import { createComponent } from '../../common/component';
import { renderLayers, hashSeed } from '../../common/ink';
import { bucketBox } from '../../common/ink-engine';
import { props } from './props';

/** Upstream `Switch` — a felt pill track (switch recipe: slip wash + outline,
    marker fill when checked) with a paper-coin thumb drawn by the separate
    switch-thumb recipe. The thumb slides with a CSS transform (upstream's
    transition-transform), so switching never redraws ink. The thumb is part
    of this component: renderLayers('switch-thumb') is called directly, the
    same DOM position as upstream's nested SwitchThumb. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'switch',
    llInkSelector: '.ll-switch',
    tw: 16, // thumb diameter (--sw-t)
    tx: 4, // thumb x: 4px off, --sw-on when checked
    thumbStyle: '',
  },
  observers: {
    checked() {
      this.__applyInkLayer();
      this.__updateThumbPos();
    },
    size() {
      this.setData({ tw: this.data.size === 'sm' ? 12 : 16 });
      this.__updateThumbPos();
      this.__renderThumb();
    },
    'disabled, invalid'() {
      this.__inkParams = () => ({ disabled: !!this.data.disabled, invalid: !!this.data.invalid });
      setTimeout(() => {
        this.__renderInk();
        this.__renderThumb();
      }, 0);
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ disabled: !!this.data.disabled, invalid: !!this.data.invalid });
      this.__updateThumbPos();
      this.__renderThumb();
    },
  },
  methods: {
    __updateThumbPos() {
      const sm = this.data.size === 'sm';
      this.setData({ tx: this.data.checked ? (sm ? 20 : 24) : 4 });
    },
    /** Draw the coin: the thumb box is fixed by size (16 / 12 px), not measured. */
    __renderThumb() {
      const t = this.data.size === 'sm' ? 12 : 16;
      const seed = `${hashSeed(`switch-thumb|${this.data.seed ?? ''}|${t}`)}`;
      const entry = renderLayers('switch-thumb', bucketBox(t, t), { disabled: !!this.data.disabled }, seed);
      if (!entry || !entry.uris.rest) return;
      this.setData({ thumbStyle: `inset:${-entry.pad}px;background-image:url("${entry.uris.rest}")` });
    },
    onTap() {
      if (this.data.disabled) return;
      const checked = !this.data.checked;
      this.setData({ checked });
      this.triggerEvent('change', { value: checked });
    },
  },
});
