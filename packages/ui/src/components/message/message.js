import { createComponent } from '../../common/component';
import { props } from './props';

/** Upstream `Message` — the row: avatar + content column. Pushes align (and
    whether a footer exists, which lifts the avatar) to its parts. */
createComponent({
  options: {
    styleIsolation: 'isolated',
    virtualHost: true,
  },
  properties: props,
  relations: {
    '../message-avatar/message-avatar': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__push(), 0);
      },
      unlinked() {
        setTimeout(() => this.__push(), 0);
      },
    },
    '../message-header/message-header': { type: 'descendant' },
    '../message-footer/message-footer': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__push(), 0);
      },
      unlinked() {
        setTimeout(() => this.__push(), 0);
      },
    },
    '../bubble/bubble': {
      type: 'descendant',
      linked() {
        setTimeout(() => this.__push(), 0);
      },
      unlinked() {
        setTimeout(() => this.__push(), 0);
      },
    },
  },
  observers: {
    align() {
      this.__push();
    },
  },
  lifetimes: {
    attached() {
      setTimeout(() => this.__push(), 0);
    },
  },
  methods: {
    __push() {
      const d = this.data;
      const avatars = this.getRelationNodes('../message-avatar/message-avatar') || [];
      const footers = this.getRelationNodes('../message-footer/message-footer') || [];
      const headers = this.getRelationNodes('../message-header/message-header') || [];
      const bubbles = this.getRelationNodes('../bubble/bubble') || [];
      avatars.forEach((c) => c.__onMessage({ align: d.align, hasFooter: footers.length > 0 }));
      headers.forEach((c) => c.__onMessage({ align: d.align }));
      footers.forEach((c) => c.__onMessage({ align: d.align }));
      bubbles.forEach((c) => c.__onMessageAlign(d.align));
    },
  },
});
