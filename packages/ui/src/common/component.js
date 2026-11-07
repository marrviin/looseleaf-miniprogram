/**
 * Component factory — the single place where cross-component conventions are
 * injected (TDesign `common/component.ts` pattern).
 *
 * Every ll-* component is created through this factory so that:
 *  - ink rendering behavior is attached uniformly;
 *  - externalClasses / styleIsolation defaults stay consistent;
 *  - later cross-cutting concerns (debug logging, theme) have one entry point.
 */
import { attachInk } from './ink';

export function createComponent(options = {}) {
  const { properties = {}, behaviors = [], lifetimes = {}, ...rest } = options;

  return Component({
    options: {
      addGlobalClass: true,
      ...options.options,
    },
    externalClasses: ['ll-class', ...(options.externalClasses || [])],
    behaviors: [...behaviors, attachInk()],
    properties,
    lifetimes: {
      ...lifetimes,
      attached() {
        lifetimes.attached?.call(this);
      },
    },
    ...rest,
  });
}
