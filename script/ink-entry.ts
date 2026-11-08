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
import { sidebarMarkRecipe, sidebarRuleRecipe } from '@/lib/ink/recipes/sidebar-ink';
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
import { tableTiles } from '@/lib/ink/recipes/table-ink';
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
import { selectRecipe } from '@/lib/ink/recipes/select-ink';
import { alertMediaRecipe } from '@/lib/ink/recipes/alert-dialog-ink';
import { hoverCardMediaRecipe } from '@/lib/ink/recipes/hover-card-ink';
import { menubarRecipe } from '@/lib/ink/recipes/menubar-ink';
import { commandInputRecipe } from '@/lib/ink/recipes/command-ink';
import { comboboxChipsRecipe, comboboxChipRecipe } from '@/lib/ink/recipes/combobox-ink';
import { fieldChoiceRecipe } from '@/lib/ink/recipes/field-ink';
import { fieldErrorRecipe } from '@/lib/ink/recipes/field-error-ink';
import {
  inputGroupRecipe,
  inputGroupRuleRecipe,
} from '@/lib/ink/recipes/input-group-ink';
import { nativeSelectRecipe } from '@/lib/ink/recipes/native-select-ink';
import { otpSlotRecipe } from '@/lib/ink/recipes/input-otp-ink';
import { promptInputBodyRecipe } from '@/lib/ink/recipes/prompt-input-ink';
import {
  calendarGridRecipe,
  ringTile,
  washTile,
  underlineTile,
  bandTile,
  RING_HANDS,
  UNDERLINE_HANDS,
  BAND_FRAMES,
} from '@/lib/ink/recipes/calendar-ink';
import { underlineRecipe } from '@/lib/ink/recipes/underline-ink';
import { scribbleRecipe } from '@/lib/ink/recipes/scribble-ink';
import { squiggleRecipe } from '@/lib/ink/recipes/squiggle-ink';
import { circledRecipe } from '@/lib/ink/recipes/circled-ink';
import { bracketRecipe } from '@/lib/ink/recipes/bracket-ink';
// Charts (ll-chart): the whole chart family draws itself with the ink engine
// — one recipe per chart type, specs built by the component from plain rows.
import { xyRecipe } from '@/lib/ink/recipes/chart-ink/xy';
import { pieRecipe, radarRecipe, radialRecipe, gaugeRecipe } from '@/lib/ink/recipes/chart-ink/polar';
import { sparkRecipe, tallyRecipe, heatRecipe } from '@/lib/ink/recipes/chart-ink/mini';
import { markRecipe } from '@/lib/ink/recipes/chart-ink/mark';
import { buildXYRows, toNum } from '@/lib/ink/charts/chart-build';
import { layoutChart } from '@/lib/ink/charts/chart-layout';
import { hitIndex } from '@/lib/ink/charts/chart-layout';
import { formatCompact, formatNumber, shares, radarRim, lttb } from '@/lib/ink/charts/chart-scale';
import { slotKey, PATTERNS, MARKERS, DASHES, SLOT_KEYS } from '@/lib/ink/charts/chart-types';
import { buildCalendar, buildGrid } from '@/lib/ink/charts/chart-heat';
import { GUESS_RATIOS, lineMetrics } from '@/lib/ink/recipes/text-marks-ink';
// Sketchpad (ll-sketchpad): the toolbar buttons (tool/color/size) and the
// canvas frame are recipes; the strokes themselves are drawn stroke-by-stroke
// with strokeMarkup (raw SVG fragments in canvas space) and composited by the
// component into full-canvas SVG data URIs — the grain masks the fragments
// reference come from svgMaskDefs.
import {
  sketchToolRecipe,
  sketchSwatchRecipe,
  sketchSizeRecipe,
  canvasFrameRecipe,
  strokeMarkup,
  strokesToSvg,
  strokeHit,
  strokeBounds,
  cleanPoints,
  strokeWidth,
  svgDataUrl,
  DRAW_TOOLS,
  SKETCH_COLORS,
  SKETCH_SIZES,
  DARK_INKS,
} from '@/lib/ink/recipes/sketchpad-ink';
import { svgMaskDefs } from '@/lib/ink/textures';
// ll-signature-pad: the baseline rule (pencil, red when invalid) and the
// typed fallback (hand-lettered glyphs + a brush swash, an InkResult svg the
// component wraps and bakes into a data URI).
import {
  signatureBaselineRecipe,
  typedSignature,
} from '@/lib/ink/recipes/signature-pad-ink';
// ll-confetti: the six paper pieces (strip/dot/star/triangle/curl/scrap,
// hand-printed fills) and the flight simulator — no recipe, standalone
// InkResult + physics functions.
import {
  CONFETTI_KINDS,
  CONFETTI_COLORS,
  STEP_MS,
  confettiPiece,
  simulate,
} from '@/lib/ink/recipes/confetti-ink';
// ll-typewriter: the hand-drawn caret (block/bar/underscore) and the uneven
// typing plan (hold at the comma and the period).
import {
  typewriterCaretRecipe,
  typingPlan,
} from '@/lib/ink/recipes/typewriter-ink';
// ll-reveal: the marker tip that writes the wipe in.
import { revealNibRecipe } from '@/lib/ink/recipes/reveal-nib-ink';
// ll-marquee: the tape band behind the ticker and the round pause control.
import {
  marqueeBandRecipe,
  marqueeControlRecipe,
} from '@/lib/ink/recipes/marquee-ink';
// ll-flip-card: the pencil arrow hinting "this turns" in the corner.
import { flipTriggerRecipe } from '@/lib/ink/recipes/flip-card-ink';
// ll-clipboard: the hardboard/accent board behind the paper.
import { clipboardBoardRecipe, clipboardClip } from '@/lib/ink/recipes/clipboard-ink';
// ll-desk: the linen desk props scattered around the edges.
import { DESK_OBJECTS, pencil } from '@/lib/ink/recipes/desk-ink';
// ll-page: holes / reinforced holes / coffee stain decor over a sheet.
import { pageRecipe } from '@/lib/ink/recipes/page-ink';
// ll-page-title: the hand-drawn underline beneath a page heading.
import { titleMarkRecipe } from '@/lib/ink/recipes/paper-set-ink';
// ll-notebook: the binding + page edges drawn over a paper; the cover sheet.
import { notebookRecipe, notebookCoverRecipe } from '@/lib/ink/recipes/notebook-ink';
// ll-folder: the tab triggers and the crease on the body sheet.
import { folderTabRecipe, folderBodyRecipe } from '@/lib/ink/recipes/folder-ink';
// ll-envelope: the back sheet (flap lifts on open) and the front face.
import { envelopeBackRecipe, envelopeFrontRecipe } from '@/lib/ink/recipes/envelope-ink';
// ll-corkboard: the cork field, the push pins, and the note focus ring.
import { corkBoardRecipe, corkPinRecipe } from '@/lib/ink/recipes/corkboard-ink';
// ll-bubble: the felt-tip cloud (variants/tail/pen) and the reaction chip.
import { bubbleRecipe, bubbleReactionsRecipe } from '@/lib/ink/recipes/bubble-ink';
// D10: alert's sticky-note wash, quote-text's drawn rule, the carousel dot
// tick, the code-block header rule, and the hand-drawn arrow.
import { alertRecipe } from '@/lib/ink/recipes/alert-ink';
import { quoteRecipe } from '@/lib/ink/recipes/quote-ink';
import { carouselTickRecipe } from '@/lib/ink/recipes/carousel-ink';
import { codeRuleRecipe, codeBodyRecipe } from '@/lib/ink/recipes/code-block-ink';
import { arrowRecipe } from '@/lib/ink/recipes/arrow-ink';
// D11: the attachment slip (states/orientation), its media tile and
// progress bar, the dropzone's sewn-stitch field and item rule, and the
// signature's pen flourish.
import {
  attachmentRecipe,
  attachmentMediaRecipe,
  attachmentProgressRecipe,
} from '@/lib/ink/recipes/attachment-ink';
import { dropzoneRecipe, dropzoneItemRecipe } from '@/lib/ink/recipes/dropzone-ink';
import { signatureRecipe } from '@/lib/ink/recipes/signature-ink';
// D12: ll-sticker-board — the picked sticker's dashed frame with the corner
// ticks, the turn ring and the size square (params {selected, handles});
// composeBoardSvg is the export path (one standalone svg of the whole page).
import {
  stickerBoardItemRecipe,
  composeBoardSvg,
  wholeItems,
  HANDLE,
} from '@/lib/ink/recipes/sticker-board-ink';
import { stampButtonRecipe, stampInkList, STAMP_KNOB } from '@/lib/ink/recipes/stamp-button-ink';
import { tearSeamRecipe, tearHintRecipe } from '@/lib/ink/recipes/tear-off-ink';
import { Ink } from '@/lib/ink/builder';
import { solidFill, wash } from '@/lib/ink/fills';
import { pillPoly } from '@/lib/ink/geom';
import { box } from '@/lib/ink/shapes';
import { sheetBindingRecipe } from '@/lib/ink/recipes/sheet-ink';
import { closeMarkRecipe, pointerMark } from '@/lib/ink/recipes/overlay-ink';
import {
  binderClip,
  clip,
  coffeeRing,
  ruler,
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
  // ll-sidebar: the active row's highlighter swipe + margin bracket, and the
  // pencil line down an open sub-menu's start edge.
  'sidebar-mark': sidebarMarkRecipe,
  'sidebar-rule': sidebarRuleRecipe,
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
  // ll-select trigger: the drawn field frame (openable — the open layer
  // spreads the pencil box while the slip is up), params {disabled, invalid}.
  select: selectRecipe,
  // ll-field-label card mode: the hand-drawn choice card (rest/hover wash/
  // checked highlighter) drawn on the whole label row.
  'field-choice': fieldChoiceRecipe,
  // ll-field-error: the wavy red pencil underline under the message.
  'field-error': fieldErrorRecipe,
  // ll-alert-dialog-media: the hand-drawn round patch behind the icon,
  // params {tone: 'default' | 'danger' | 'info'}.
  'alert-media': alertMediaRecipe,
  // ll-hover-card-media: the pencil box around the photo window.
  'hover-card-media': hoverCardMediaRecipe,
  // ll-menubar: the paper strip — paper-shade wash, felt outline and the
  // pencil ruler's ticks along its foot.
  menubar: menubarRecipe,
  // ll-command-input: the double rule under the search row (a blue felt
  // line joins it when the field has focus).
  'command-input': commandInputRecipe,
  // ll-combobox: the chips field's pencil frame (multiline once the tags
  // wrap) and each hang-tag's pointed body with its punched hole
  // (params {tone, disabled}).
  'combobox-chips': comboboxChipsRecipe,
  'combobox-chip': comboboxChipRecipe,
  // ll-input-group: one drawn box around icon/text/button addons and the
  // control (rest; invalid replaces the box's pencil groups, disabled
  // dashes); the block addon's border-b/-t rule.
  'input-group': inputGroupRecipe,
  'input-group-rule': inputGroupRuleRecipe,
  // ll-native-select: the select frame around the platform picker
  // (drawSelectFrame, openable: false — no open layer).
  'native-select': nativeSelectRecipe,
  // ll-input-otp slot: pencil box empty, fine-liner filled, blue focus
  // ring on the active slot, red when invalid, dashed when disabled.
  'otp-slot': otpSlotRecipe,
  // ll-prompt-input body: the napkin's writing line (blue felt under
  // focus, dashed ticks when disabled).
  'prompt-input-body': promptInputBodyRecipe,
  // ll-calendar: the ruled lines behind the month grid (head rule + week
  // rules + column rules, red margin when week numbers show).
  'calendar-grid': calendarGridRecipe,
  // ll-chart: one recipe per chart type + the small marks (legend swatches,
  // cursor column/guide/ring/slice/cell/spoke).
  'chart-xy': xyRecipe,
  'chart-pie': pieRecipe,
  'chart-radar': radarRecipe,
  'chart-radial': radialRecipe,
  'chart-gauge': gaugeRecipe,
  'chart-spark': sparkRecipe,
  'chart-tally': tallyRecipe,
  'chart-heat': heatRecipe,
  'chart-mark': markRecipe,
  // ll-sketchpad toolbar: the tool buttons (a sample scribble of each pen,
  // an eraser block), the color swatches (pencil-looped blobs), the size
  // dots, and the pencil frame around the canvas sheet. Tool buttons carry
  // the current color so the felt/brush/marker samples match it.
  'sketchpad-tool': sketchToolRecipe,
  'sketchpad-swatch': sketchSwatchRecipe,
  'sketchpad-size': sketchSizeRecipe,
  'sketchpad-canvas': canvasFrameRecipe,
  // ll-signature-pad: the sign-here baseline rule under the strokes
  // (pencil at rest, red when the field reports invalid), params {invalid}.
  'signature-baseline': signatureBaselineRecipe,
  // ll-typewriter caret: the drawn block / bar / underscore caret,
  // params {shape}.
  'typewriter-caret': typewriterCaretRecipe,
  // ll-reveal nib: the marker tip writing along the wipe's bottom edge,
  // params {color}.
  'reveal-nib': revealNibRecipe,
  // ll-marquee: the tape band behind the ticker (params {kind, color}) and
  // the round pause control (params {paused}).
  'marquee-band': marqueeBandRecipe,
  'marquee-control': marqueeControlRecipe,
  // ll-flip-card: the corner arrow hint on the trigger overlay.
  'flip-card-trigger': flipTriggerRecipe,
  // ll-clipboard: the board sheet behind the paper, params {tone}.
  'clipboard-board': clipboardBoardRecipe,
  // ll-page: holes/stain decor, params {holes, reinforce, stain}.
  page: pageRecipe,
  // ll-page-title: the drawn underline, params {kind} (TitleMark).
  'title-mark': titleMarkRecipe,
  // ll-notebook: binding + page edges decor, params {binding, side, pages, tone, curl}.
  notebook: notebookRecipe,
  // ll-notebook-cover: the cover sheet, params {tone, band}.
  'notebook-cover': notebookCoverRecipe,
  // ll-folder: tab trigger (params {stock, disabled}) + body crease (params {crease}).
  'folder-tab': folderTabRecipe,
  folder: folderBodyRecipe,
  // ll-envelope: back sheet (params {stock}; rest/hover/open flap) + front face
  // (params {stock, stamp, postmark, airmail}).
  'envelope-back': envelopeBackRecipe,
  'envelope-front': envelopeFrontRecipe,
  // ll-corkboard: cork field (params {frame}) + push pin (params {color}).
  corkboard: corkBoardRecipe,
  'corkboard-pin': corkPinRecipe,
  // ll-bubble: the drawn cloud (params {variant, tail, pen, interactive};
  // rest/hover/focus) + the reaction chip (params {dashed}).
  bubble: bubbleRecipe,
  'bubble-reactions': bubbleReactionsRecipe,
  // ll-alert: the sticky-note paper wash around the alert body,
  // params {tone: 'default' | 'warning' | 'destructive'}.
  alert: alertRecipe,
  // ll-quote-text: the drawn quote rules / marker wash, params {tone, weight, size, rule}.
  quote: quoteRecipe,
  // ll-carousel-dot: the tick mark (plain dot or slash) in the pager, params {slash, pitch}.
  'carousel-tick': carouselTickRecipe,
  // ll-code-block: the dashed pencil rule under the header; the body recipe
  // only draws a lazy focus ring (no keyboard focus in the webview) — kept
  // registered for parity.
  'code-block-rule': codeRuleRecipe,
  'code-block-body': codeBodyRecipe,
  // ll-arrow: the hand-drawn arrow, params {direction, curve, head, tone,
  // weight, bend, mirror, dx, dy, animate}.
  arrow: arrowRecipe,
  // ll-attachment: the slip outline (idle dashed slot / error red wash /
  // pencil box, alpha by state), the media tile (wash blob + fine rule)
  // and the hatched progress bar (bar part clipped by the component).
  attachment: attachmentRecipe,
  'attachment-media': attachmentMediaRecipe,
  'attachment-progress': attachmentProgressRecipe,
  // ll-dropzone: the sewn-stitch dashed field (rest/hover/over/invalid/
  // disabled) and the item's pencil rule (red rule + squiggle on error).
  dropzone: dropzoneRecipe,
  'dropzone-item': dropzoneItemRecipe,
  // ll-signature: the pen flourish after the name (swoosh loop + underline
  // stroke, or a straight underline; 'none' draws nothing).
  signature: signatureRecipe,
  // ll-sticker-board item: the picked sticker's dashed blue frame with the
  // corner ticks, the ring handle above (turn) and the filled square at the
  // bottom-right (size) — params {selected, handles}.
  'sticker-board-item': stickerBoardItemRecipe,
  // ll-stamp-button: the wooden knob on the inked die (rest/hover/pressed/
  // focus/disabled), params {ink, disabled}.
  'stamp-button': stampButtonRecipe,
  // ll-tear-off: the printed dashes + scissors along the perforation
  // (params {scissors, inset}) and the curled pencil arrow that says which
  // way to pull (params {toward}).
  'tear-off-seam': tearSeamRecipe,
  'tear-off-hint': tearHintRecipe,
};

// ll-attachment-progress draws its bar clipped to the value (the web build
// clips the recipe's 'bar' part with CSS, which the webview cannot do), so
// the component builds the track and the bar as two separate fixed-size
// SVGs at its measured width and reveals the bar through an overflow clip.
export function attachmentProgressTrack(seed: string, w: number, h: number, calm = false) {
  // grain:false — grain masks reference defs the standalone SVG
  // doesn't carry; a dangling mask hides the whole group in the webview.
  const ink = new Ink(`${seed}|track`, { tier: 'hi', calm, grain: false });
  ink.layer('rest', () => {
    wash(ink, pillPoly(1.5, 1.5, w - 3, h - 3), 'paper-shade', { alpha: 0.8, material: 'wash' });
    box(ink, 0, 0, w, h, { pen: calm ? 'pencil.fine' : 'ink.fine', corner: h / 2 });
  });
  const res = ink.toSvg({ w, h, pad: 6 });
  return { svg: res.parts.rest ?? '', w, h, pad: 6 };
}

export function attachmentProgressBar(seed: string, w: number, h: number) {
  const ink = new Ink(`${seed}|bar`, { tier: 'hi', grain: false });
  ink.layer('rest', () => {
    solidFill(ink, pillPoly(2.4, 2.4, w - 4.8, h - 4.8), 'marker', { alpha: 0.94 });
  });
  const res = ink.toSvg({ w, h, pad: 6 });
  return { svg: res.parts.rest ?? '', w, h, pad: 6 };
}

// ll-chart spec building & layout: the component builds specs from plain
// rows (buildXYRows), lays them out at the measured box (layoutChart) and
// hit-tests taps (hitIndex). chart-mark/cursorParams live in the component.
export {
  buildXYRows,
  toNum,
  layoutChart,
  hitIndex,
  formatCompact,
  formatNumber,
  shares,
  radarRim,
  lttb,
  slotKey,
  PATTERNS,
  MARKERS,
  DASHES,
  SLOT_KEYS,
  buildCalendar,
  buildGrid,
};

// ll-calendar day tiles (ring/wash/underline/band) — the component bakes
// currentColor to real hexes itself (background-image URIs can't inherit).
export {
  ringTile,
  washTile,
  underlineTile,
  bandTile,
  RING_HANDS,
  UNDERLINE_HANDS,
  BAND_FRAMES,
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
// ll-stamp-button: the pad inks the tool comes in and the knob height
// (the tool's fixed paddingTop / die offset).
export { stampInkList, STAMP_KNOB };

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

// ll-sticker-board: the picked sticker's frame recipe (RECIPES above),
// composeBoardSvg the export path, wholeItems mends hand-written JSON,
// HANDLE sizes the turn/size touch targets.
export { composeBoardSvg, wholeItems, HANDLE };

// ll-skeleton: the boiling outline/hatch are CSS masks over three shared
// pencil tiles per frame (upstream skeletonCss bakes them into a stylesheet;
// here the component sets them as inline CSS custom properties).
export { edgeTile, hatchTile, circleTile, EDGE_LEN, EDGE_TH, HATCH, CIRCLE };

// ll-table: the ruled lines are flat repeat-x mask tiles over a 960px sheet
// (upstream tableCss bakes them into a stylesheet; here table.js sets them
// as inline CSS custom properties, item-family style).
export { tableTiles };

// ll-mark behavior (common/mark.js): the text-mark recipes take one LineParams
// set per measured line — lineMetrics folds a line box + font size into the
// params the recipes expect, GUESS_RATIOS is the fallback font metric table
// (upstream's own when canvas measureText is unavailable).
export { lineMetrics, GUESS_RATIOS };

// ll-sketchpad stroke pipeline: strokeMarkup renders one stroke into a raw
// SVG fragment (canvas space, pad 2, cached by fingerprint — the eraser's
// live dim and replay reuse it constantly); strokeHit/strokeBounds power the
// eraser hit-test; cleanPoints/strokeWidth are the sampling and width rules;
// svgMaskDefs builds the per-kind grain <defs> the stroke fragments point at
// (same 'll' id prefix on both sides); strokesToSvg/svgDataUrl are the
// export path (toSVG / clipboard JSON+SVG in the demo).
export {
  strokeMarkup,
  strokesToSvg,
  strokeHit,
  strokeBounds,
  cleanPoints,
  strokeWidth,
  svgDataUrl,
  svgMaskDefs,
  DRAW_TOOLS,
  SKETCH_COLORS,
  SKETCH_SIZES,
  DARK_INKS,
};

// ll-signature-pad type mode: typedSignature renders the typed name as hand
// lettering (glyph font 'hand', jitter + slight rotation) with a brush swash
// underneath — an InkResult svg fragment the component wraps into a full
// svg and bakes to a data URI (upstream same, over the baseline).
export { typedSignature };

// ll-confetti: confettiPiece renders one paper piece at its intrinsic size
// (cached per kind|color|variant); simulate integrates the flight physics
// (cone + drag + sway + spin + flip, STEP_MS 50 frames) — the component
// builds one SMIL-animated svg data URI per burst.
export { confettiPiece, simulate, STEP_MS, CONFETTI_KINDS, CONFETTI_COLORS };

// ll-typewriter: typingPlan folds phrases + speed/pause/mode/loop into the
// timed steps ({at, text}) the component plays on a setTimeout chain.
export { typingPlan };

// ll-paper props: tape strips and fasteners are drawn by these standalone
// InkResult functions (not recipes) — fixed-size static SVGs rendered as
// data-URI backgrounds. sheetShadow/tiltFor power the cut-edge CSS face
// (box-shadow + seeded tilt); isCutEdge/edgeInset classify the edge spec.
export { tape, clip, pin, staple, binderClip, coffeeRing, ruler, tiltFor, sheetShadow, SHADOW_LAYERS, isCutEdge, edgeInset };

// ll-popover arrow: the felt-tip pointer (points DOWN as drawn; the popover
// rotates it per side) — same fixed-size PropSvg path as the paper props.
// ll-navigation-menu-indicator: underlineMark draws the blue felt underline
// (fixed 96x8 + 3pad, stretched to the indicator's width like upstream's
// preserveAspectRatio="none").
export { pointerMark, underlineMark };
export { clipboardClip, DESK_OBJECTS, pencil };

// ll-label required star: three crossing pencil strokes (upstream
// label.tsx's RequiredMark — drawSkeleton on a fixed 12px icon, tone 'ui').
// The svg paints with currentColor; the component resolves it to the red
// token before inlining. pad 2 keeps the stroke overhang visible.
const LABEL_STAR = {
  kind: 'icon',
  grid: 24,
  parts: [
    ['s', 'M12.3 4.4 L11.7 19.6', 1.25],
    ['s', 'M4.9 8.3 L19.3 15.9', 1.25],
    ['s', 'M18.7 8.6 L6.4 15.4', 1.25],
  ],
  small: [
    ['s', 'M12.4 3.4 L11.6 20.6', 1.05],
    ['s', 'M3.9 7.6 L20.2 16.6', 1.05],
    ['s', 'M19.4 7.9 L5.4 16.1', 1.05],
  ],
};

export function labelStar(seed: string | number) {
  const res = drawSkeleton(LABEL_STAR, 12, seed, { tone: 'ui', kind: 'icon' });
  return { ...res, pad: 2 };
}
