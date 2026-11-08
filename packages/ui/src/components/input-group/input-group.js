import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-input-group — upstream InputGroup: one drawn box around an icon,
    some text, a button and the control. The recipe draws rest (pencil
    box), invalid (red box + wavy underline), disabled (dashes on a pale
    wash) as separate layers; upstream shows them with has-[...] CSS keyed
    on the control's state — a background stack has no CSS, so the control
    reports through the ancestor relation and the host composes the stack
    here: focus ring on top, then invalid (upstream hides the rest sketch's
    data-hide-on~=invalid groups while it shows), then rest.
    Events: none of its own — addons/controls handle taps; tapping the
    group's padding asks the control to focus (upstream clicks focus the
    input). */
const URI_PREFIX = 'data:image/svg+xml;charset=utf-8,';

/** Upstream hides rest-sketch groups with the CSS rule keyed on
    data-hide-on (looseleaf.css "svg [data-hide-on~=…]"). The ink layer is
    a stacked background-image, so the groups are cut out of the rest SVG
    text instead — same balanced <g> scan as common/ink.js's stripHideOn,
    applied to the decoded data URI. */
function stripHideOn(uri, token) {
  if (!uri || uri.indexOf('data-hide-on') === -1) return uri;
  let svg;
  try {
    svg = decodeURIComponent(uri.slice(URI_PREFIX.length));
  } catch {
    return uri;
  }
  let out = '';
  let depth = 0;
  let hideDepth = -1;
  let last = 0;
  let m;
  const re = /<(\/?)g\b[^>]*?(\/?)>/g;
  while ((m = re.exec(svg))) {
    if (m[1] === '/') {
      depth--;
      if (hideDepth !== -1) {
        if (depth === hideDepth) hideDepth = -1;
      } else {
        out += svg.slice(last, m.index) + m[0];
      }
    } else if (m[2] === '/') {
      if (hideDepth === -1) {
        const hide = /data-hide-on="([^"]*)"/.exec(m[0]);
        if (hide && hide[1].split(/\s+/).includes(token)) {
          out += svg.slice(last, m.index);
        } else {
          out += svg.slice(last, m.index) + m[0];
        }
      }
    } else {
      if (hideDepth === -1) {
        const hide = /data-hide-on="([^"]*)"/.exec(m[0]);
        if (hide && hide[1].split(/\s+/).includes(token)) {
          out += svg.slice(last, m.index);
          hideDepth = depth;
        } else {
          out += svg.slice(last, m.index) + m[0];
        }
      }
      depth++;
    }
    last = re.lastIndex;
  }
  out += svg.slice(last);
  if (out === svg) return uri;
  return URI_PREFIX + encodeURIComponent(out);
}

createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'input-group',
    llInkSelector: '.ll-input-group',
    ctrlFocus: false,
    ctrlInvalid: false,
    ctrlDisabled: false,
    hasBlock: false,
    multiline: false,
  },
  observers: {
    disabled() {
      this.__applyInkLayer();
    },
    invalid() {
      this.__applyInkLayer();
    },
  },
  relations: {
    '../input-group-input/input-group-input': {
      type: 'descendant',
      linked(child) {
        this.__controls = this.__controls || [];
        if (this.__controls.indexOf(child) === -1) this.__controls.push(child);
        if (child.data.multiline) this.setData({ multiline: true, hasBlock: true });
        setTimeout(() => child.reportState && child.reportState(), 0);
      },
      unlinked(child) {
        this.__controls = (this.__controls || []).filter((c) => c !== child);
      },
    },
    '../input-group-textarea/input-group-textarea': {
      type: 'descendant',
      linked(child) {
        this.__controls = this.__controls || [];
        if (this.__controls.indexOf(child) === -1) this.__controls.push(child);
        this.setData({ multiline: true });
        setTimeout(() => child.reportState && child.reportState(), 0);
      },
      unlinked(child) {
        this.__controls = (this.__controls || []).filter((c) => c !== child);
      },
    },
    '../input-group-addon/input-group-addon': {
      type: 'descendant',
      linked(child) {
        if (String(child.data.align || '').indexOf('block-') === 0) {
          this.setData({ hasBlock: true });
        }
      },
    },
  },
  lifetimes: {
    attached() {
      this.__controls = [];
    },
  },
  methods: {
    /** A control reports {focus, invalid, disabled}; the group folds them
        with its own group-level props. */
    syncControl(state) {
      this.setData({
        ctrlFocus: !!state.focus,
        ctrlInvalid: !!state.invalid,
        ctrlDisabled: !!state.disabled,
      });
      this.__applyInkLayer();
    },
    /** Addon tap (not on a button inside it) → focus the first control. */
    focusControl() {
      const c = (this.__controls || [])[0];
      if (c && c.focus) c.focus();
    },
    onTap() {
      this.focusControl();
    },
    /** Override attachInk's composer: invalid stacks the red layer over the
        rest sketch minus its hidden groups; disabled swaps the dashed layer. */
    __applyInkLayer() {
      const entry = this.__inkEntry;
      if (!entry) return;
      const d = this.data;
      const effDisabled = d.disabled || d.ctrlDisabled;
      if (effDisabled && entry.uris.disabled !== null) {
        if (entry.uris.disabled === undefined) this.__applyDisabled(entry);
        if (entry.uris.disabled) return;
      }
      const effInvalid = d.invalid || d.ctrlInvalid;
      const stack = [];
      if (d.ctrlFocus && entry.uris.focus) stack.push(entry.uris.focus);
      if (effInvalid && entry.uris.invalid) {
        stack.push(entry.uris.invalid);
        if (this.__restFor !== entry.uris.rest) {
          this.__restFor = entry.uris.rest;
          this.__restInvalid = stripHideOn(entry.uris.rest, 'invalid');
        }
        stack.push(this.__restInvalid);
      } else if (entry.uris.rest) {
        stack.push(entry.uris.rest);
      }
      if (!stack.length) return;
      const imgs = stack
        .map((u) => (typeof u === 'string' ? u : ''))
        .filter(Boolean)
        .map((u) => `url("${u}")`)
        .join(',');
      this.setData({ inkFaced: false, inkStyle: `inset:${-entry.pad}px;background-image:${imgs}` });
    },
  },
});
