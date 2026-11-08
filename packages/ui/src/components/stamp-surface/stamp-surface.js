import { createComponent } from '../../common/component';
import { hashSeed } from '../../common/ink';
import { props } from './props';

const clamp01 = (v) => Math.min(0.96, Math.max(0.04, v));
const titleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');
const finite = (v, fallback) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

/** Whole an impression (upstream heals hand-written JSON the same way
    wholeItems mends board stickers). */
const wholeImpression = (i, idx) => {
  const h = hashSeed(String(i.seed ?? `${i.id}#${i.press ?? idx}`));
  return {
    id: String(i.id ?? `stamp-${idx}`),
    press: finite(i.press, 1),
    x: clamp01(finite(i.x, 0.5)),
    y: clamp01(finite(i.y, 0.5)),
    name: String(i.name ?? ''),
    text: String(i.text ?? ''),
    shape: String(i.shape ?? ''),
    ink: String(i.ink ?? ''),
    sub: String(i.sub ?? ''),
    ring: String(i.ring ?? ''),
    w: finite(i.w, 0),
    h: finite(i.h, 0),
    size: finite(i.size, 0),
    ghost: i.ghost ? true : false,
    dashed: !!i.dashed,
    turn: finite(i.turn, ((h % 700) - 350) / 100),
    seed: String(i.seed ?? `${i.id ?? 'stamp'}#${i.press ?? idx}`),
  };
};

const keyOf = (i) => `${i.id}#${i.press}`;

/** Upstream `StampSurface` — the page that takes stamps: it shows the
    impressions above its content, gives 2px under each strike and
    announces it politely. strike() is the tool's target — wire an
    ll-stamp-button's `stamp` event to it (upstream reaches it through
    React context; state cannot cross a component boundary here, so the
    page plays match-maker).
    Events: `valuechange` {value}. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  data: {
    cells: [],
    freshKey: '',
    status: '',
    give: false,
  },
  observers: {
    value() {
      if (Array.isArray(this.data.value)) this.__rebuild();
    },
  },
  lifetimes: {
    attached() {
      if (!Array.isArray(this.data.value) && Array.isArray(this.data.defaultValue)) {
        this.__inner = this.data.defaultValue.map(wholeImpression);
      }
      this.__rebuild();
    },
  },
  methods: {
    noop() {},
    __items() {
      return Array.isArray(this.data.value)
        ? (this.data.value || []).map(wholeImpression)
        : this.__inner || [];
    },
    __commit(next) {
      if (Array.isArray(this.data.value)) {
        // controlled: report only; the observer rebuilds when the prop moves
      } else {
        this.__inner = next;
      }
      this.triggerEvent('valuechange', { value: next });
      if (!Array.isArray(this.data.value)) this.__rebuild();
    },
    __rebuild() {
      const cells = this.__items().map((i) => ({
        ...i,
        key: keyOf(i),
        words: titleCase(i.text || String(i.name || '').replace(/^stamp-/, '').replace(/-/g, ' ')),
        posStyle:
          `left:${i.x * 100}%;top:${i.y * 100}%;` +
          `transform:translate(-50%,-50%) rotate(${i.turn}deg);`,
      }));
      this.setData({ cells });
    },
    /** Upstream strike(): one press of a stamp. The same id replaces its
        own impression (own wear, own turn, one in five a double strike). */
    strike(aim) {
      if (!aim) return null;
      const a = {
        ...aim,
        x: finite(aim.x, 0.5),
        y: finite(aim.y, 0.5),
      };
      const before = this.__items().find((i) => i.id === a.id);
      const press = ((before && before.press) || 0) + 1;
      const h = hashSeed(`${a.id}|${press}`);
      const wander = (bits) => (((h >>> bits) % 1000) / 1000 - 0.5) * 0.06;
      const impression = {
        ...a,
        name: String(a.name || ''),
        text: String(a.text || ''),
        x: clamp01(a.x + wander(0)),
        y: clamp01(a.y + wander(10)),
        ghost: a.ghost ? true : h % 5 === 0,
        press,
        turn: ((h % 700) - 350) / 100,
        seed: `${a.id}#${press}`,
      };
      let next = [...this.__items().filter((i) => i.id !== a.id), impression];
      const max = Number(this.data.max) || 0;
      if (max && next.length > max) next = next.slice(next.length - max);
      this.__commit(next);
      const say = String(aim.say || impression.text || impression.name || 'stamp');
      this.setData({ freshKey: keyOf(impression), status: `${titleCase(say)} stamped.` });
      // the page gives a little (upstream node.animate translate 0 2px)
      this.setData({ give: true });
      setTimeout(() => this.setData({ give: false }), 200);
      return impression;
    },
    /** Drop everything (the demo's Reset). */
    clear() {
      this.__commit([]);
      this.setData({ freshKey: '' });
      return true;
    },
  },
});
