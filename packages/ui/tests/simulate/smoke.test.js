/**
 * Parametric attach smoke — mounts EVERY component with default props and
 * asserts attach + first render + ink pipeline survive.
 *
 * Purpose: catch attach-time crashes (bad json refs, lifecycle errors, ink
 * regressions) across all 368 components without 368 bespoke suites. Behavior
 * beyond "it mounts" lives in per-component Tier A suites.
 *
 * SKIP: components that drive real canvas/node APIs in jsdom-hostile ways.
 * Each skip needs a reason; the gate script asserts SKIP entries exist.
 */
const { mount } = require('./helpers/mount.cjs');

const SKIP = {
  reveal: 'drives canvas node (OffscreenCanvas) — jsdom has no canvas',
  typewriter: 'drives canvas node (measureText) — jsdom has no canvas',
};

const fs = require('fs');
const path = require('path');

const COMPONENTS = fs
  .readdirSync(path.resolve(__dirname, '../../src/components'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

test('SKIP list only names real components', () => {
  for (const name of Object.keys(SKIP)) expect(COMPONENTS).toContain(name);
});

describe.each(COMPONENTS.filter((n) => !SKIP[n]))('%s', (name) => {
  test('attaches with default props without crashing', () => {
    const comp = mount(`${name}/${name}`);
    expect(comp.instance).toBeTruthy();
    expect(comp.dom).toBeTruthy();
    // NOTE: empty render is legal here — closed dialogs, collapsed accordion
    // content, slot-only wrappers render nothing by default. Crash-freedom is
    // the contract; visible default UI is each component's Tier A suite.
  });
});
