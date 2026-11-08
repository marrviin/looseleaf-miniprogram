import { createComponent } from '../../common/component';
import { props } from './props';

/** ll-prompt-input — upstream PromptInput folded into one component: a
    napkin sheet (ll-paper) hosting the drawn writing line (the
    prompt-input-body recipe), a script-face textarea in blue felt, a tools
    slot and hint on the footer's left and a send button on the right that
    flies the paper plane on submit and becomes a stop button while
    `status` is submitted/streaming.

    Events: `submit` {value} (keyboard send key or the button),
    `valuechange` {value}, `stop`, `focus`, `blur`,
    `triggerchange` {char, query, from, to} (empty char when the trigger
    word is gone), `suggestionselect` {insert}.

    Named slots: `attachments` (the chip row above the text) and `tools`
    (icon buttons next to the hint). */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
    // two named slots (attachments, tools) — without this only the default
    // single slot resolves and named slot content silently never renders
    multipleSlots: true,
  },
  properties: props,
  data: {
    llInkRecipe: 'prompt-input-body',
    llInkSelector: '.ll-prompt-body',
    inner: '',
    busy: false,
    locked: false,
    focusVisible: false,
    sendDisabled: true,
    sugItems: [],
    sugOpen: false,
    flying: false,
    maxHeight: '',
  },
  observers: {
    'status, disabled, lockWhileStreaming, allowEmpty'() {
      this.__syncState();
    },
    value(v) {
      // external (controlled) writes only — our own writes land equal to inner
      if (String(v ?? '') !== this.data.inner) {
        this.setData({ inner: String(v ?? '') });
        this.__detect();
      }
      this.__syncState();
    },
    suggestions() {
      this.__detect();
    },
    triggers() {
      this.__triggers = this.__normalizeTriggers(this.data.triggers);
      this.__detect();
    },
    maxRows() {
      this.__syncMaxHeight();
    },
  },
  lifetimes: {
    attached() {
      this.__inkParams = () => ({ disabled: !!this.data.disabled });
      this.__triggers = this.__normalizeTriggers(this.data.triggers);
      this.__trig = null;
      this.setData({ inner: String(this.data.value ?? this.data.defaultValue ?? '') });
      this.__syncState();
      this.__syncMaxHeight();
      setTimeout(() => this.__detect(), 0);
    },
  },
  methods: {
    noop() {},
    __normalizeTriggers(triggers) {
      return (triggers || [])
        .map((t) =>
          t && typeof t === 'object'
            ? { char: String(t.char || ''), atStart: !!t.atStart }
            : { char: String(t || ''), atStart: false }
        )
        .filter((t) => t.char);
    },
    __syncState() {
      const d = this.data;
      const busy = d.status === 'submitted' || d.status === 'streaming';
      this.setData({
        busy,
        locked: !!d.lockWhileStreaming && busy,
        sendDisabled: !d.allowEmpty && !String(d.inner || '').trim(),
      });
    },
    /** upstream calc(maxRows * 2rem + 1rem): a 2rem line is 56rpx, 1rem 32rpx */
    __syncMaxHeight() {
      const rows = Number(this.data.maxRows);
      this.setData({ maxHeight: rows > 0 ? `${rows * 56 + 32}rpx` : '' });
    },
    __setValue(v) {
      this.setData({ inner: v, value: v });
      this.triggerEvent('valuechange', { value: v });
      this.__syncState();
      this.__detect();
    },
    /** upstream detectTrigger — the caret is always the end of the text
        (the native textarea doesn't report selection), so a trigger only
        fires on the word being typed at the very end. */
    __detect() {
      const d = this.data;
      // observers can fire before attached() — normalize lazily
      if (!this.__triggers) this.__triggers = this.__normalizeTriggers(d.triggers);
      const value = String(d.inner || '');
      const caret = value.length;
      let trig = null;
      if (this.__triggers.length && caret >= 1) {
        let start = caret;
        while (start > 0 && !/\s/.test(value[start - 1])) start--;
        const word = value.slice(start, caret);
        for (const t of this.__triggers) {
          if (word.startsWith(t.char) && (!t.atStart || start === 0)) {
            trig = { char: t.char, query: word.slice(t.char.length), from: start, to: caret };
            break;
          }
        }
      }
      const prev = this.__trig;
      const same =
        prev === trig || (!!prev && !!trig && prev.char === trig.char && prev.query === trig.query && prev.from === trig.from);
      this.__trig = trig;
      if (!same) {
        this.triggerEvent(
          'triggerchange',
          trig
            ? { char: trig.char, query: trig.query, from: trig.from, to: trig.to }
            : { char: '', query: '', from: -1, to: -1 }
        );
      }
      let items = [];
      if (trig) {
        const q = trig.query.toLowerCase();
        items = (d.suggestions || [])
          .filter((s) => s && String(s.char || '') === trig.char)
          .filter((s) => String(s.text || '').toLowerCase().startsWith(q))
          .map((s) => ({
            icon: s.icon || '',
            text: String(s.text || ''),
            hint: s.hint || '',
            insert: s.insert != null ? String(s.insert) : trig.char + s.text,
          }));
      }
      this.setData({ sugItems: items, sugOpen: items.length > 0 });
    },
    __replace(text) {
      const trig = this.__trig;
      if (!trig) return;
      const value = String(this.data.inner || '');
      const before = value.slice(0, trig.from);
      const after = value.slice(trig.to);
      const insert = text + (!after.startsWith(' ') ? ' ' : '');
      this.__setValue(before + insert + after);
      this.__detect();
    },
    onSugTap(e) {
      const item = this.data.sugItems[e.currentTarget.dataset.index];
      if (!item) return;
      this.triggerEvent('suggestionselect', { insert: item.insert });
      this.__replace(item.insert);
    },
    onInput(e) {
      this.__setValue(String(e.detail.value || ''));
    },
    /** The textarea grew a row — the writing line follows the new box. */
    onLineChange() {
      setTimeout(() => this.__measureInk(), 50);
    },
    onFocus() {
      this.setData({ focusVisible: true });
      this.triggerEvent('focus', {});
    },
    onBlur() {
      this.setData({ focusVisible: false });
      this.triggerEvent('blur', {});
    },
    /** The keyboard's send key (confirm-type="send") = upstream Enter. */
    onConfirm() {
      this.submit();
    },
    submit() {
      const d = this.data;
      if (d.disabled || d.busy) return false;
      const value = String(d.inner || '');
      if (!d.allowEmpty && !value.trim()) return false;
      this.triggerEvent('submit', { value });
      if (d.clearOnSubmit) this.setData({ inner: '', value: '' });
      this.__fly();
      this.__detect();
      this.__syncState();
      return true;
    },
    stop() {
      this.triggerEvent('stop', {});
    },
    onSubmitTap() {
      if (this.data.busy) this.stop();
      else this.submit();
    },
    /** upstream ll-plane keyframes — toggled off/on so repeated submits
        restart the flight. */
    __fly() {
      this.setData({ flying: false });
      setTimeout(() => this.setData({ flying: true }), 30);
      setTimeout(() => this.setData({ flying: false }), 1000);
    },
    focus() {
      this.setData({ focusVisible: true });
    },
  },
});
