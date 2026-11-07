/**
 * Entry for script/bundle-ink.mjs — bundles the upstream looseleaf ink engine
 * (pure TS, zero React deps) into packages/ui/src/common/ink-engine.js.
 *
 * Only the recipes listed in RECIPES are pulled in; tree-shaking drops the
 * rest of the upstream recipe/catalog (charts, paper, textures...). Add a
 * recipe here when porting a new component.
 */
import { bucketBox, runRecipe } from '@/lib/ink/recipes';
import {
  avatarBadgeRecipe,
  avatarCountRecipe,
  avatarFallbackRecipe,
  avatarRingRecipe,
  avatarTone,
} from '@/lib/ink/recipes/avatar-ink';
import { badgeRecipe, tallyWidth } from '@/lib/ink/recipes/badge-ink';
import { buttonRecipe } from '@/lib/ink/recipes/button-ink';
import { checkboxRecipe } from '@/lib/ink/recipes/checkbox-ink';
import { radioRecipe } from '@/lib/ink/recipes/radio-group-ink';
import { cardRuleRecipe } from '@/lib/ink/recipes/card-ink';
import { hasFace, splitFaces, translatePath } from '@/lib/ink/paper/faces';
import { STICKY_VEIL, TOOTH_TILES, stockOf } from '@/lib/ink/paper/stocks';
import { farShadow, tileOffsets } from '@/lib/ink/paper/shadows';
import { labelTagRecipe } from '@/lib/ink/recipes/label-tag-ink';
import { separatorRecipe } from '@/lib/ink/recipes/separator-ink';
import { switchRecipe, switchThumbRecipe } from '@/lib/ink/recipes/switch-ink';
import { drawSkeleton } from '@/lib/ink/art-draw';
import { icons, resolveIconName } from '@/lib/ink/art/icons';
import { drawMascot } from '@/lib/ink/art/mascot-draw';
import { mascotProps } from '@/lib/ink/art/mascots';
import { spinnerMark } from '@/lib/ink/recipes/spinner-ink';
import { inputRecipe } from '@/lib/ink/recipes/input-ink';
import { textareaRecipe } from '@/lib/ink/recipes/textarea-ink';
import {
  sliderRangeRecipe,
  sliderThumbRecipe,
  sliderTrackRecipe,
} from '@/lib/ink/recipes/slider-ink';
import { progressFillRecipe, progressRecipe } from '@/lib/ink/recipes/progress-ink';
import {
  stepperRecipe,
  stepperTallyRecipe,
  tallyWidth as stepperTallyWidth,
  TALLY_H as stepperTallyH,
} from '@/lib/ink/recipes/stepper-ink';
import { ratingRecipe } from '@/lib/ink/recipes/rating-ink';

export const RECIPES = {
  'avatar-badge': avatarBadgeRecipe,
  'avatar-count': avatarCountRecipe,
  'avatar-fallback': avatarFallbackRecipe,
  'avatar-ring': avatarRingRecipe,
  badge: badgeRecipe,
  button: buttonRecipe,
  checkbox: checkboxRecipe,
  'radio-group': radioRecipe,
  'card-rule': cardRuleRecipe,
  'label-tag': labelTagRecipe,
  separator: separatorRecipe,
  switch: switchRecipe,
  'switch-thumb': switchThumbRecipe,
  input: inputRecipe,
  textarea: textareaRecipe,
  'slider-track': sliderTrackRecipe,
  'slider-range': sliderRangeRecipe,
  'slider-thumb': sliderThumbRecipe,
  progress: progressRecipe,
  'progress-fill': progressFillRecipe,
  stepper: stepperRecipe,
  'stepper-tally': stepperTallyRecipe,
  rating: ratingRecipe,
};

// tallyWidth sizes the DOM element that reserves space for badge tally marks.
// avatarTone picks one of the eight stationery colors from a name — the same
// person is the same color everywhere (hashSeed of the trimmed, lowercased
// name). Exported so ll-avatar-fallback can compute it in JS.
export { runRecipe, bucketBox, tallyWidth, avatarTone };

// ll-stepper-tally sizes itself with the stepper recipe's own tally metrics
// (badge's tallyWidth above is a different formula).
export { stepperTallyWidth, stepperTallyH };

// Sheet-kind recipes (label-tag, ...) embed <!--ll-face:...--> marks in their
// parts. Upstream renders those as CSS, not SVG: splitFaces peels the specs
// out of each layer, and the face becomes a .ll-face span — stock color,
// tooth texture tiles, paper-light gradient, clip-path to the sheet shape —
// sandwiched between the stroke groups, with farShadow box-shadows behind.
// (faces.ts faceSvg is only the static-export path.) The runtime ink behavior
// (common/ink.js) mirrors that DOM structure; these helpers power it.
export { hasFace, splitFaces, translatePath, stockOf, TOOTH_TILES, STICKY_VEIL, tileOffsets, farShadow };

// ll-icon skips the recipe pipeline: upstream Icon.tsx calls drawSkeleton
// directly on the ArtDef from the icons map (~80 hand-drawn glyphs). The
// component resolves names (aliases included) and draws one skeleton per
// (name, size, tone, accent, seed, weight) — art-draw memoizes them.
export { drawSkeleton, icons, resolveIconName };

// ll-spinner: spinnerMark draws the scribble/loops marks (reveal-masked);
// the write variant is Stubby's three mascot frames flipped by CSS opacity.
export { spinnerMark, drawMascot, mascotProps };
