import { createComponent } from '../../common/component';

/** ll-dialog-body — the scrolling middle for long content. The sheet itself
    never scrolls (its shadow and tape would clip); max-h 60dvh upstream,
    expressed as 60vh here. A scroll-view, not an overflow view: the overlay
    catches touchmove to keep the page behind from scrolling. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
