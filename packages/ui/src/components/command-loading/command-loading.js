import { createComponent } from '../../common/component';

/** ll-command-loading — upstream CommandLoading (cmdk's Loading): a line
    of cursive loops and your words, results on their way. Presentational:
    render it while the search runs (wx:if in the demo), like upstream. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    customStyle: String,
  },
});
