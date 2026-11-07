// Baked snapshot of Object.keys(doodles) from the ink engine (pages cannot
// require the npm engine module) — refresh it when doodle batches land.
const GALLERY = ['star', 'sparkle', 'sun', 'moon', 'cloud', 'lightning', 'flower', 'leaf', 'sparkle-trio', 'rain-cloud', 'tulip', 'tree', 'mushroom', 'sprout', 'feather', 'wave', 'heart', 'cup', 'cat-face', 'key', 'crown', 'smiley', 'house', 'balloon', 'paper-plane', 'light-bulb', 'pencil', 'eye', 'umbrella', 'music-note', 'fish', 'book', 'arrow-swoop', 'arrow-loop', 'spiral', 'asterisk-burst', 'radial-burst', 'underline-flourish', 'corner-flourish', 'confetti', 'squiggle-border', 'arrow-bounce', 'arrow-block', 'swirl', 'underline-scribble', 'corner-vine', 'dotted-trail', 'exclaim-burst'];

Component({
  data: {
    defaults: ['star', 'sun', 'flower', 'mushroom'],
    sizes: [32, 48, 64, 96, 128],
    gallery: GALLERY,
  },
});
