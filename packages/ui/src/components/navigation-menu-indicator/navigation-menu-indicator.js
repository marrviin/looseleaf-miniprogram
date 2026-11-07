import { createComponent } from '../../common/component';
import { svgDataUri } from '../../common/ink';
import { underlineMark } from '../../common/ink-engine';

/** Upstream `NavigationMenuIndicator` — the felt-tip underline that rides
    under the open item (underlineMark, stretched to the trigger's width,
    preserveAspectRatio=none via background-size 100% 100%). The list
    measures and calls __setPosition. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: {
    // seed comes from attachInk's behavior properties.
    customStyle: {
      type: String,
      value: '',
    },
  },
  data: {
    visible: false,
    left: 0,
    width: 0,
    uri: '',
  },
  relations: {
    // Pairs with the list's descendant declaration; the list drives us.
    '../navigation-menu-list/navigation-menu-list': {
      type: 'ancestor',
    },
  },
  lifetimes: {
    attached() {
      const seed = `${this.data.seed || 'll-navigation-menu'}|underline`;
      const res = underlineMark(seed, {});
      this.setData({ uri: svgDataUri(res.svg, res) });
    },
  },
  methods: {
    /** The list probed the open trigger: slide under it (or hide). */
    __setPosition(pos) {
      if (!pos.visible) {
        this.setData({ visible: false });
        return;
      }
      this.setData({ visible: true, left: pos.left, width: pos.width });
    },
  },
});
