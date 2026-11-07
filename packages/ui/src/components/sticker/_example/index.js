// ll-sticker demo — mirrors the upstream docs page (#/components/sticker).
// The gallery shelves are a snapshot of stickerBatches minus the stamp-*
// presets (upstream example 04): pages can't require engine subpaths in
// WeChat, so the lists are baked. Refresh when a sticker batch lands.
const SHELVES = [
  {
    key: 'statusPointers',
    label: 'Status',
    names: 'done wip new sale beta pro ok wow cursor-click hand-point-right hand-point-up arrow-curved arrow-striped arrow-down-bounce eyes-look scribble-circle'.split(' '),
  },
  {
    key: 'spaceWeather',
    label: 'Space',
    names: 'rocket sun-shades cloud-smile rainbow ringed-planet astronaut-helmet ufo comet moon-sleepy raindrop-pal snowflake storm-cloud'.split(' '),
  },
  {
    key: 'foodDrink',
    label: 'Food',
    names: 'coffee-to-go boba-tea pizza-slice donut cupcake teacup ice-cream-cone avocado-half cookie-bitten cherries lemon-slice popcorn-tub'.split(' '),
  },
  {
    key: 'officeDesk',
    label: 'Office',
    names: 'notebook laptop-open highlighter magnifier pencil-cup stapler scissors tape-roll ruler calculator desk-lamp envelope-heart'.split(' '),
  },
  {
    key: 'natureAnimals',
    label: 'Nature',
    names: 'cactus potted-plant cat-loaf sunflower watering-can monstera-leaf acorn-pair puppy fox owl bunny frog turtle bee'.split(' '),
  },
  {
    key: 'facesCelebrate',
    label: 'Faces',
    names: 'smiley shocked ghost-boo party-popper wink-tongue heart-eyes cool-shades sleepy thinking-face thumbs-up balloon-bunch cake-slice gift-wrapped fireworks'.split(' '),
  },
  {
    key: 'badgesStamps',
    label: 'Badges',
    names: 'rating-five first-place number-one a-plus hundred twenty-four-seven question-badge exclamation-badge'.split(' '),
  },
];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    defaults: ['done', 'sale', 'cursor-click', 'hand-point-right'],
    peels: [
      { name: 'done', label: 'peel' },
      { name: 'sale', label: 'peel=22' },
      { name: 'cursor-click', label: 'peel, rotate=-5' },
      { name: 'hand-point-right', label: 'peel=16, rotate=4' },
    ],
    shelves: SHELVES,
  },
  methods: {},
});
