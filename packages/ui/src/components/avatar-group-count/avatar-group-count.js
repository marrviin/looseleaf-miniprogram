import { createComponent } from '../../common/component';
import { ensureHandFont } from '../../common/hand-font';
import { props } from './props';

ensureHandFont();

/** Upstream `AvatarGroupCount` — the sketched dashed disc for everyone who
    did not fit (avatar-count recipe: paper-shade wash + a dashed pencil
    circle). Content is text ("+3") via the slot; an Icon child is a
    placeholder until ll-icon lands (M2). Set `size` to the group's avatar
    size — upstream derives it with group-has selectors we cannot do. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'avatar-count',
    llInkSelector: '.ll-avatar-group-count',
  },
});
