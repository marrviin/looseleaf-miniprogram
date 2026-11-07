import { createComponent } from '../../common/component';
import { props, validators } from './props';

/** Upstream `ToggleGroup` — a row (or column) of toggles that belong together:
    single = radio semantics, multiple = a toolbar of aria-pressed buttons.
    With variant outline and spacing 0 the group is the ink host and draws the
    one box around every item (toggle-group recipe) while its items draw only
    their seams; otherwise the items draw themselves. Items register through
    the descendant relation and read variant/size/tone/spacing/orientation/
    disabled/invalid — and their on state, derived from the group's value —
    from here (upstream: React context). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'toggle-group',
    o: 'horizontal',
  },
  relations: {
    '../toggle/toggle': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__sync(), 0);
      },
      unlinked() {
        setTimeout(() => this.__sync(), 0);
      },
    },
  },
  observers: {
    orientation(o) {
      this.setData({ o: validators.orientation.includes(o) ? o : 'horizontal' });
    },
    'value, variant, size, spacing, tone, orientation, disabled, invalid'() {
      setTimeout(() => {
        this.__renderInk();
        this.__sync();
      }, 0);
    },
  },
  lifetimes: {
    attached() {
      const d = this.data;
      const multiple = validators.type.includes(d.type) ? d.type : 'multiple';
      this.setData({
        o: validators.orientation.includes(d.orientation) ? d.orientation : 'horizontal',
        type: multiple,
        // Adopt the controlled value, else the default, else the empty state.
        // (Unset `type: null` properties arrive as null, not undefined.)
        value: d.value != null ? d.value : d.defaultValue != null ? d.defaultValue : multiple === 'single' ? '' : [],
      });
      setTimeout(() => this.__sync(), 0);
    },
  },
  methods: {
    /** The group's own ink params (toggle-group recipe): joined = one shared
        box — spacing 0 and (outline variant or disabled). */
    __inkParams() {
      const d = this.data;
      return {
        joined: d.spacing === 0 && (d.variant === 'outline' || !!d.disabled),
        disabled: !!d.disabled,
        invalid: !d.disabled && !!d.invalid,
      };
    },
    /** Push the current context/state onto every item (document order —
        the first joined item uses the index to drop its seam). */
    __sync() {
      const nodes = this.getRelationNodes('../toggle/toggle') || [];
      nodes.forEach((n, i) => {
        n.__tgIndex = i;
        if (n.__onGroup) n.__onGroup();
      });
    },
    /** Used by items for the seam-strip decision. */
    __isFirst(item) {
      const nodes = this.getRelationNodes('../toggle/toggle') || [];
      return nodes[0] === item || item.__tgIndex === 0;
    },
    /** An item was tapped: fold it into the group value, announce it. */
    __onItemToggle(value, pressed) {
      const d = this.data;
      let next;
      if (d.type === 'single') {
        next = pressed ? value : '';
      } else {
        const list = Array.isArray(d.value) ? d.value.slice() : [];
        const i = list.indexOf(value);
        if (pressed && i === -1) list.push(value);
        if (!pressed && i !== -1) list.splice(i, 1);
        next = list;
      }
      this.setData({ value: next });
      this.triggerEvent('change', { value: next });
      this.__sync();
    },
  },
});
