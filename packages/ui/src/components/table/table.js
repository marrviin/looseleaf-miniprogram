import { createComponent } from '../../common/component';

/** Upstream `Table` — a display:table root inside the padded scroll
    container (-m-3 / p-3 bleed so the hanging rules and swipes are not
    clipped). `sticky` turns the container into a vertical scroller so the
    header row can pin (TableHeader reads it through the ancestor
    relation). WeChat has no className channel, so containerClassName is a
    ready style string (containerStyle). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  relations: {
    '../table-header/table-header': { type: 'descendant' },
    '../table-body/table-body': { type: 'descendant' },
    '../table-footer/table-footer': { type: 'descendant' },
  },
  properties: {
    sticky: {
      type: Boolean,
      value: false,
    },
    customStyle: String,
    containerStyle: String,
    /** Programmatic scroll of the container (verification/testing channel;
        upstream needs none — the browser scrolls it). */
    scrollTop: {
      type: null,
      optionalTypes: [Number, String],
      value: 0,
    },
  },
});
