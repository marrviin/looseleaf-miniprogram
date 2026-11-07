// ll-icon demo — mirrors the upstream docs page (#/components/icon).
// The gallery is a snapshot of Object.keys(icons) (upstream example 05):
// pages can't require('looseleaf-miniprogram/...') subpaths in WeChat, so the list
// is baked. Refresh it when an icon batch lands.
const GALLERY = 'chevron-down chevron-up chevron-right chevron-left arrow-right arrow-left arrow-down arrow-up arrow-up-right chevrons-up-down chevrons-left chevrons-right arrow-up-down undo-2 redo-2 rotate-cw check x minus circle circle-check plus dot circle-x circle-plus circle-minus circle-dot square-check badge-check asterisk square slash triangle-alert octagon-x info loader-circle circle-alert circle-question-mark bell loader ban shield-check flag bug lightbulb life-buoy octagon-alert shield-alert panel-left panel-left-close panel-left-open grip-vertical ellipsis ellipsis-vertical search menu list list-filter layout-dashboard layout-grid sliders-horizontal eye eye-off frame file file-text file-code folder folder-open upload download save paperclip copy clipboard image trash file-plus folder-plus archive mail mail-check send message-square message-circle inbox share link external-link user users user-plus circle-user log-in log-out video settings lock chart-pie trending-up settings-2 terminal square-terminal code command key-round bot chart-column chart-line trending-down table git-branch bold italic underline pencil book-open sun moon house star heart bookmark globe sparkles map face-slightly-smiling cloud play pause circle-play skip-back skip-forward repeat volume-2 volume-off mic music camera audio-lines shuffle headphones film audio-waveform shopping-cart credit-card tag calculator dollar-sign calendar calendar-plus calendar-days calendar-check clock wallet receipt gift timer rotate-ccw-clock hourglass'.split(' ');

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    defaults: ['check', 'x', 'plus', 'minus', 'search', 'chevron-down', 'arrow-right', 'copy', 'trash', 'pencil', 'user', 'settings', 'calendar', 'ellipsis'],
    sizes: [12, 16, 20, 24, 32, 48],
    redrawn: ['check', 'search', 'triangle-alert', 'settings'],
    toneIcons: ['triangle-alert', 'info', 'bell', 'search', 'user', 'calendar', 'circle-check'],
    accents: ['tomato', 'tangerine', 'grass', 'teal', 'sky', 'grape', 'bubblegum'],
    status: [
      { icon: 'circle-check', text: 'Saved to your notebook', color: '#3b7a4b' },
      { icon: 'info', text: 'Drafts are kept for thirty days', color: '#2c4f9e' },
      { icon: 'triangle-alert', text: 'This page has unsaved changes', color: '#a4502a' },
      { icon: 'octagon-x', text: 'Could not reach the server', color: '#c2412d' },
    ],
    gallery: GALLERY,
  },
  methods: {},
});
