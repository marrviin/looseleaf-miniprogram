import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AccordionItem` — a row with a drawn pencil rule at its foot
    (hidden on the last row via :last-child). Mediates root state to this
    row's trigger and content. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'accordion-rule',
    // The rule draws at the item's real width on a thin host view.
    llInkSelector: '.ll-accordion-item__rule',
    open: false,
    rowDisabled: false,
    bracket: 'curly',
  },
  relations: {
    '../accordion/accordion': {
      type: 'ancestor',
      linked(parent) {
        setTimeout(() => parent.__sync(), 0);
      },
    },
    '../accordion-trigger/accordion-trigger': {
      type: 'descendant',
      linked(child) {
        this.__trigger = child;
      },
      unlinked() {
        this.__trigger = null;
      },
    },
    '../accordion-content/accordion-content': {
      type: 'descendant',
      linked(child) {
        this.__content = child;
      },
      unlinked() {
        this.__content = null;
      },
    },
  },
  observers: {
    disabled() {
      this.__apply();
    },
  },
  methods: {
    /** ll-accordion root pushes the open set + root disabled + bracket. */
    __onRoot(ctx) {
      this.__apply(ctx.open.includes(this.data.value), ctx.disabled, ctx.bracket);
    },
    __apply(open, rootDisabled, bracket) {
      const rowDisabled = this.data.disabled || !!rootDisabled;
      const next = {
        open,
        rowDisabled,
        bracket: bracket ?? this.data.bracket,
      };
      this.setData(next);
      if (this.__trigger) this.__trigger.__onItem(next);
      if (this.__content) this.__content.__onItem(next);
    },
    /** The row's trigger was tapped. */
    __onTriggerTap() {
      if (this.data.rowDisabled) return;
      const parent = this.getRelationNodes('../accordion/accordion')[0];
      if (parent) parent.__onTriggerTap(this.data.value);
    },
  },
});
