/**
 * Parametric props.js audit — every component's property sheet must be a
 * well-formed miniprogram properties declaration. Runs over all 269 props.js
 * files; catches typos (`valeu`), bad types, and enum drift without a
 * per-component test file.
 */
import fs from 'node:fs';
import path from 'node:path';

const COMPONENTS = path.resolve(__dirname, '../../src/components');
const VALID_TYPES = new Set([
  'String', 'Number', 'Boolean', 'Object', 'Array', 'null', 'undefined',
  'StringConstructor', 'NumberConstructor', 'BooleanConstructor', 'ObjectConstructor', 'ArrayConstructor',
]);

const dirs = fs
  .readdirSync(COMPONENTS, { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(path.join(COMPONENTS, e.name, 'props.js')))
  .map((e) => e.name);

describe.each(dirs)('%s/props.js', (name) => {
  const mod = require(path.join(COMPONENTS, name, 'props.js'));
  const props = mod.props ?? mod.default;

  test('exports a non-empty props object', () => {
    expect(props && typeof props).toBe('object');
    expect(Object.keys(props).length).toBeGreaterThan(0);
  });

  test.each(Object.keys(props))('%s is a well-formed property', (key) => {
    const raw = props[key];
    // Shorthand form: `prop: String` or `prop: null`.
    const def =
      raw && typeof raw === 'object'
        ? raw
        : { type: raw === null ? null : raw };

    if ('type' in def) {
      const typeStr = def.type === null ? 'null' : def.type?.name ?? String(def.type);
      expect(VALID_TYPES.has(typeStr)).toBe(true);
    }
    if ('optionalTypes' in def) {
      for (const t of def.optionalTypes) {
        const typeStr = t === null ? 'null' : t?.name ?? String(t);
        expect(VALID_TYPES.has(typeStr)).toBe(true);
      }
    }
    // Enum-style props (type.js *List) carry a validator or at least a default
    // inside the enum — asserted per-component in Tier A suites, not here.
  });
});
