// ll-empty demo — mirrors the upstream docs page (#/components/empty).
// Touch adaptation: 03's drag-and-drop has no touch equivalent, so the file
// list is fed by the button alone (tapping "Choose files" fills a pretend
// picker result; tapping again clears it). 04's search is a real filter.
const PEOPLE = ['Ada Lovelace', 'Jo Okafor', 'Mika Kobayashi', 'Sam Reyes', 'Priya Nair', 'Tomas Berg'];

// 02-stubby: pose / title / text / optional action, verbatim from upstream
const STATES = [
  { pose: 'search', title: 'No results', text: 'Nothing matches “ghost pepper”. Try a shorter word.', action: 'Clear search' },
  { pose: 'sleep', title: 'All quiet', text: 'Nothing is scheduled today. Enjoy it.' },
  { pose: 'unplug', title: 'You are offline', text: 'Changes are kept on this page and sent when the line is back.', action: 'Try again' },
];

// 50-icon: shadcn's four bare empty states
const BARE = [
  { icon: 'inbox', title: 'No messages', text: 'Your inbox is empty. New messages will appear here.' },
  { icon: 'star', title: 'No favorites', text: 'Items you mark as favorites will appear here.' },
  { icon: 'heart', title: 'No likes yet', text: 'Content you like will be saved here for easy access.' },
  { icon: 'bookmark', title: 'No bookmarks', text: 'Save interesting content by bookmarking it.' },
];

Component({
  options: { styleIsolation: 'apply-shared' },
  data: {
    states: STATES,
    bare: BARE,
    // 03-dropzone: a pretend picker result (drag-drop has no touch equivalent)
    files: [],
    // 04-no-results: starts with a query that matches nobody
    query: 'ghost pepper',
    shown: [],
  },
  lifetimes: {
    attached() {
      this.__filter(this.data.query);
    },
  },
  methods: {
    // 03: toggle the pretend file pick (upstream: a hidden file input)
    onChooseFiles() {
      const files = this.data.files.length ? [] : ['field-notes.pdf', 'margins.png'];
      this.setData({ files });
    },
    // 04: filter the contacts by the typed query
    onQueryInput(e) {
      const query = e.detail.value;
      this.setData({ query });
      this.__filter(query);
    },
    onClearQuery() {
      this.setData({ query: '' });
      this.__filter('');
    },
    __filter(query) {
      const q = String(query).trim().toLowerCase();
      this.setData({ shown: q ? PEOPLE.filter((p) => p.toLowerCase().includes(q)) : PEOPLE });
    },
  },
});
