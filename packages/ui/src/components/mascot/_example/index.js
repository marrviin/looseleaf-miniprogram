// All 15 poses (mascot map keys, baked snapshot — pages cannot require the
// npm engine module).
const POSES = ['idle', 'wave', 'think', 'write', 'sketch', 'celebrate', 'oops', 'shrug', 'sleep', 'peek', 'point', 'carry', 'halt', 'search', 'unplug'];

Component({
  data: {
    poses: POSES,
    shown: POSES.slice(0, 6),
    more: false,
    sizes: [24, 32, 48, 96, 160],
  },
  methods: {
    more() {
      this.setData({ shown: this.data.poses, more: true });
    },
  },
});
