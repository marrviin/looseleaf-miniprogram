import { createComponent } from '../../common/component';

/** ll-hover-card-media — the photo window at the top of the card slip: an
    icon (or any art) on a paper-shade wash, framed by the hover-card-media
    recipe's pencil box (upstream: h-28 rounded-md bg-paper-shade/60 p-2). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    /** Frame height override (e.g. "192rpx"); default is h-28 (224rpx). */
    height: {
      type: null,
      optionalTypes: [String, Number],
      value: '',
    },
    customStyle: String,
  },
  data: {
    llInkRecipe: 'hover-card-media',
    llInkSelector: '.ll-hover-card-media__frame',
  },
});
