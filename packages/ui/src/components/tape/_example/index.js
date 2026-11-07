const KINDS = ['masking', 'washi-dots', 'washi-stripes', 'washi-zigzag', 'washi-gingham', 'kraft', 'clear'];

const STRIPS = [
  { label: 'saw', kind: 'masking', ends: 'saw', length: 160, height: 24 },
  { label: 'torn', kind: 'masking', ends: 'torn', length: 160, height: 24 },
  { label: 'scissor', kind: 'washi-dots', ends: 'scissor', length: 160, height: 24, color: 'sky' },
  { label: 'straight', kind: 'washi-dots', ends: 'straight', length: 160, height: 24, color: 'grape' },
  { label: 'short, 64 x 18', kind: 'washi-stripes', length: 64, height: 18, color: 'grass' },
  { label: 'wide, 220 x 34', kind: 'kraft', length: 220, height: 34 },
];

const LABELS = [
  { kind: 'masking', text: 'fragile' },
  { kind: 'kraft', text: 'this side up' },
  { kind: 'washi-gingham', text: 'picnic' },
];

Component({
  data: { kinds: KINDS, strips: STRIPS, labels: LABELS },
});
