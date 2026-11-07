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
import { kbdRecipe } from '@/lib/ink/recipes/kbd-ink';
import { emptyFrameRecipe, emptyMediaRecipe } from '@/lib/ink/recipes/empty-ink';
import { radioRecipe } from '@/lib/ink/recipes/radio-group-ink';
import { cardRuleRecipe } from '@/lib/ink/recipes/card-ink';
import { hasFace, splitFaces, translatePath } from '@/lib/ink/paper/faces';
import { STICKY_VEIL, TOOTH_TILES, stockOf } from '@/lib/ink/paper/stocks';
import { farShadow, tileOffsets } from '@/lib/ink/paper/shadows';
import { labelTagRecipe } from '@/lib/ink/recipes/label-tag-ink';
import { ribbonRecipe } from '@/lib/ink/recipes/ribbon-ink';
import { sealArt } from '@/lib/ink/recipes/seal-ink';
import { stamp } from '@/lib/ink/art/rubber-stamp';
import { badgesStamps } from '@/lib/ink/art/stickers/badges-stamps';
import { stickyNoteRecipe } from '@/lib/ink/recipes/sticky-note-ink';
import { napkinRecipe } from '@/lib/ink/recipes/napkin-ink';
import { bookmarkRecipe } from '@/lib/ink/recipes/bookmark-ink';
import { ticketRecipe } from '@/lib/ink/recipes/ticket-ink';
import { receiptCircleRecipe, barcode } from '@/lib/ink/recipes/receipt-ink';
import { stickerFace, kissCut, stickerLabel, hasSticker } from '@/lib/ink/recipes/sticker-ink';
import {
  stickerSheetRecipe,
  stickerSlotRecipe,
} from '@/lib/ink/recipes/sticker-sheet-ink';
import { markerRuleRecipe } from '@/lib/ink/recipes/marker-ink';
import { indexCardRecipe } from '@/lib/ink/recipes/index-card-ink';
import { polaroidPhotoRecipe } from '@/lib/ink/recipes/polaroid-ink';
import { separatorRecipe } from '@/lib/ink/recipes/separator-ink';
import { breadcrumbPageRecipe } from '@/lib/ink/recipes/breadcrumb-ink';
import { tabsRecipe } from '@/lib/ink/recipes/tabs-ink';
import {
  accordionRuleRecipe,
  accordionTriggerRecipe,
} from '@/lib/ink/recipes/accordion-ink';
import { marginBracketRecipe } from '@/lib/ink/recipes/margin-bracket-ink';
import { buttonGroupTextRecipe } from '@/lib/ink/recipes/button-group-ink';
import { switchRecipe, switchThumbRecipe } from '@/lib/ink/recipes/switch-ink';
import { toggleRecipe } from '@/lib/ink/recipes/toggle-ink';
import { toggleGroupRecipe } from '@/lib/ink/recipes/toggle-group-ink';
import {
  navBaselineRecipe,
  navTabRecipe,
  underlineMark,
} from '@/lib/ink/recipes/navigation-menu-ink';
import { drawSkeleton } from '@/lib/ink/art-draw';
import { renderSticker } from '@/lib/ink/art-draw';
import { icons, resolveIconName } from '@/lib/ink/art/icons';
import { drawMascot } from '@/lib/ink/art/mascot-draw';
import { mascot, mascotProps } from '@/lib/ink/art/mascots';
import { stickers, stickerBatches } from '@/lib/ink/art/stickers';
import { doodles } from '@/lib/ink/art/doodles';
import { spinnerMark } from '@/lib/ink/recipes/spinner-ink';
import { typingIndicatorRecipe, typingGeometry } from '@/lib/ink/recipes/typing-indicator-ink';
import { SKELETON_BOIL_S, SKELETON_FRAMES } from '@/lib/ink/recipes/skeleton-ink';
import {
  CIRCLE,
  EDGE_LEN,
  EDGE_TH,
  HATCH,
  circleTile,
  edgeTile,
  hatchTile,
} from '@/lib/ink/recipes/pencil-tiles-ink';
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
import { sheetRecipe } from '@/lib/ink/recipes/paper-ink';
// Text marks (ll-highlight/strike/underline/scribble/circled/bracket/squiggle):
// per-line recipes driven by the shared mark behavior (common/mark.js).
import { highlightRecipe } from '@/lib/ink/recipes/highlight-ink';
import { strikeRecipe } from '@/lib/ink/recipes/strike-ink';
import { underlineRecipe } from '@/lib/ink/recipes/underline-ink';
import { scribbleRecipe } from '@/lib/ink/recipes/scribble-ink';
import { squiggleRecipe } from '@/lib/ink/recipes/squiggle-ink';
import { circledRecipe } from '@/lib/ink/recipes/circled-ink';
import { bracketRecipe } from '@/lib/ink/recipes/bracket-ink';
import { GUESS_RATIOS, lineMetrics } from '@/lib/ink/recipes/text-marks-ink';
import { sheetBindingRecipe } from '@/lib/ink/recipes/sheet-ink';
import { closeMarkRecipe, pointerMark } from '@/lib/ink/recipes/overlay-ink';
import {
  binderClip,
  clip,
  pin,
  staple,
  tape,
} from '@/lib/ink/paper/props';
import { isCutEdge, edgeInset } from '@/lib/ink/paper/edges';
import { tiltFor, sheetShadow, SHADOW_LAYERS } from '@/lib/ink/paper/shadows';

export const RECIPES = {
  'avatar-badge': avatarBadgeRecipe,
  'avatar-count': avatarCountRecipe,
  'avatar-fallback': avatarFallbackRecipe,
  'avatar-ring': avatarRingRecipe,
  badge: badgeRecipe,
  button: buttonRecipe,
  checkbox: checkboxRecipe,
  kbd: kbdRecipe,
  // ll-empty: the dashed placeholder frame (Empty with `border`) and the
  // 44px icon tile (EmptyMedia variant="icon").
  'empty-frame': emptyFrameRecipe,
  'empty-media': emptyMediaRecipe,
  'radio-group': radioRecipe,
  'card-rule': cardRuleRecipe,
  'label-tag': labelTagRecipe,
  ribbon: ribbonRecipe,
  'marker-rule': markerRuleRecipe,
  'index-card-decor': indexCardRecipe,
  'polaroid-photo': polaroidPhotoRecipe,
  separator: separatorRecipe,
  'breadcrumb-page': breadcrumbPageRecipe,
  tabs: tabsRecipe,
  'accordion-rule': accordionRuleRecipe,
  'accordion-trigger': accordionTriggerRecipe,
  'margin-bracket': marginBracketRecipe,
  'button-group-text': buttonGroupTextRecipe,
  switch: switchRecipe,
  'switch-thumb': switchThumbRecipe,
  toggle: toggleRecipe,
  'toggle-group': toggleGroupRecipe,
  'navigation-menu-tab': navTabRecipe,
  'navigation-menu-baseline': navBaselineRecipe,
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
  // Paper sheets (torn/deckle/… edges — cut edges are pure CSS upstream and
  // skip the recipe entirely) and the dialog close mark.
  sheet: sheetRecipe,
  'sheet-binding': sheetBindingRecipe,
  'close-mark': closeMarkRecipe,
  // ll-typing-indicator: three dots (or a cursive scrawl) and Stubby's pencil.
  'typing-indicator': typingIndicatorRecipe,
  // Text marks (D1): run once per measured text line (or once per host box
  // for circled/bracket/squiggle) with the line metrics folded into params.
  highlight: highlightRecipe,
  strike: strikeRecipe,
  underline: underlineRecipe,
  scribble: scribbleRecipe,
  squiggle: squiggleRecipe,
  circled: circledRecipe,
  bracket: bracketRecipe,
  // ll-sticky-note: the tick-box decor (pencil box + felt tick reveal),
  // drawn on the note box when the note is tickable.
  'sticky-note-decor': stickyNoteRecipe,
  // ll-napkin: the fold creases + coffee ring stain on the tissue.
  'napkin-decor': napkinRecipe,
  // ll-bookmark: the woven cloth ribbon — pencil ghost at rest, ribbon when
  // checked, the pointer wash on hover, a pale ghost when disabled.
  'bookmark-ribbon': bookmarkRecipe,
  // ll-ticket: the whole ticket silhouette — notched stub tear, punch and
  // scan holes, pressed frame — a faced sheet recipe (paperFill face).
  'ticket-sheet': ticketRecipe,
  // ll-receipt-total: the felt-tip pen loop around a circled total.
  'receipt-circle': receiptCircleRecipe,
  // ll-sticker-sheet: the dashed cut print on the backing paper, and the
  // slot's focus ring (frame kind) around each kiss-cut cell.
  'sticker-sheet': stickerSheetRecipe,
  'sticker-slot': stickerSlotRecipe,
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
// ll-empty-media: `mascot` maps pose → ArtDef for drawMascot; `doodles`
// maps name → ArtDef for drawSkeleton (tone 'doodle').
export { spinnerMark, drawMascot, mascotProps, mascot, doodles };

// ll-seal: intrinsic art (badge generator + ringed seal + wax), drawn at its
// `size` like upstream's svg — no recipe pipeline, one svg per
// (params, px, seed, tier) via the same art-draw pens as the stickers.
export { sealArt };

// ll-stamp: the rubber-stamp generator (solid ink through a worn pad) plus
// the eight stamp presets from the sticker library (stamp-approved, ...).
export { stamp, badgesStamps };

// ll-typing-indicator: the SMIL post-processing needs the dot/scrawl span,
// and the animation laps mirror the upstream CSS keyframes.
export { typingGeometry, SKELETON_FRAMES, SKELETON_BOIL_S };

// ll-receipt-barcode: seeded bar widths from the number under the bars.
export { barcode };

// ll-sticker: the die-cut vinyl sticker library. `stickers` maps name →
// StickerDef (drawn or generated); renderSticker runs the die-cut pipeline
// (white border, cut line, optional peel) at the requested px size;
// stickerBatches powers the demo gallery shelves.
export { stickers, stickerBatches, renderSticker };

// ll-sticker-sheet: stickerFace cuts one sticker's silhouette + tight box
// (for centering in the cell), kissCut draws the slot's cut outline /
// backing, stickerLabel titles it, hasSticker guards unknown names.
export { stickerFace, kissCut, stickerLabel, hasSticker };

// ll-skeleton: the boiling outline/hatch are CSS masks over three shared
// pencil tiles per frame (upstream skeletonCss bakes them into a stylesheet;
// here the component sets them as inline CSS custom properties).
export { edgeTile, hatchTile, circleTile, EDGE_LEN, EDGE_TH, HATCH, CIRCLE };

// ll-mark behavior (common/mark.js): the text-mark recipes take one LineParams
// set per measured line — lineMetrics folds a line box + font size into the
// params the recipes expect, GUESS_RATIOS is the fallback font metric table
// (upstream's own when canvas measureText is unavailable).
export { lineMetrics, GUESS_RATIOS };

// ll-paper props: tape strips and fasteners are drawn by these standalone
// InkResult functions (not recipes) — fixed-size static SVGs rendered as
// data-URI backgrounds. sheetShadow/tiltFor power the cut-edge CSS face
// (box-shadow + seeded tilt); isCutEdge/edgeInset classify the edge spec.
export { tape, clip, pin, staple, binderClip, tiltFor, sheetShadow, SHADOW_LAYERS, isCutEdge, edgeInset };

// ll-popover arrow: the felt-tip pointer (points DOWN as drawn; the popover
// rotates it per side) — same fixed-size PropSvg path as the paper props.
// ll-navigation-menu-indicator: underlineMark draws the blue felt underline
// (fixed 96x8 + 3pad, stretched to the indicator's width like upstream's
// preserveAspectRatio="none").
export { pointerMark, underlineMark };
