import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `AvatarBadge` — a presence dot on the corner of the face, drawn
    by the avatar-badge recipe (slip under-fill, a marker blob in the status
    color, an ink loop round it). Its size follows the avatar's via the
    --ll-avatar-badge var the parent root sets per size. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'avatar-badge',
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ status: this.data.status });
    },
  },
  observers: {
    status() {
      this.__inkParams = () => ({ status: this.data.status });
      setTimeout(() => this.__measureInk(), 60);
    },
  },
});
