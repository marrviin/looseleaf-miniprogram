import { createComponent } from '../../common/component';
import { attachInk } from '../../common/ink';
import { props } from './props';

/** Upstream `PolaroidImage` — the square, recessed window: bg paper-shade
    at 60%, an inner shadow, clipping its content. With `scene` the window
    is measured and the polaroid-photo recipe draws it (pad 4). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  behaviors: [attachInk()],
  properties: props,
  data: {
    llInkRecipe: '',
    llInkSelector: '.ll-polaroid-image',
    developing: false,
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ scene: this.data.scene || 'hills' });
      this.__update();
    },
  },
  observers: {
    'scene, seed, develop'() {
      this.__update();
    },
  },
  methods: {
    __update() {
      const d = this.data;
      const scene = d.scene && d.scene !== 'false';
      this.setData({
        llInkRecipe: scene ? 'polaroid-photo' : '',
        developing: d.develop === true || d.develop === 'true',
      });
      if (scene) this.__measureInk();
    },
  },
});
