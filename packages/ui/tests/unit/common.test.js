/**
 * Unit tests for common/ pure logic — no wx runtime, no component attach.
 */
import { hashSeedFx, makeRng } from '../../src/common/rng';
import { Truthy, oneOf, range } from '../../src/common/validator';
import path from 'node:path';
import { hashSeed, resolvePaint } from '../../src/common/ink';
import TOKENS from '../../src/common/tokens';

describe('rng — seeded, avalanche-ported determinism', () => {
  test('hashSeedFx is deterministic for the same string', () => {
    expect(hashSeedFx('button|default|default')).toBe(hashSeedFx('button|default|default'));
  });

  test('hashSeedFx differs across distinct seeds', () => {
    const seen = new Set(Array.from({ length: 200 }, (_, i) => hashSeedFx(`seed-${i}`)));
    expect(seen.size).toBe(200);
  });

  test('hashSeedFx matches the number path for numeric seeds', () => {
    expect(hashSeedFx(42)).toBe(hashSeedFx(42));
    expect(hashSeedFx(42)).not.toBe(hashSeedFx(43));
  });

  test('makeRng(seed) produces a stable, reusable sequence', () => {
    const a = makeRng('wobble');
    const first = [a(), a(), a()];
    const b = makeRng('wobble');
    expect([b(), b(), b()]).toEqual(first);
  });

  test('different seeds diverge', () => {
    const a = makeRng('wobble')();
    const b = makeRng('wobble-2')();
    expect(a).not.toBe(b);
  });
});

describe('validator helpers', () => {
  test('oneOf / range / Truthy behave as predicates', () => {
    const isVariant = oneOf(['default', 'outline']);
    expect(isVariant('default')).toBe(true);
    expect(isVariant('nope')).toBe(false);
    expect(range(0, 10)(5)).toBe(true);
    expect(range(0, 10)(11)).toBe(false);
    expect(Truthy('x')).toBe(true);
    expect(Truthy('')).toBe(false);
  });
});

describe('ink helpers', () => {
  test('hashSeed is deterministic and stable across string/number input', () => {
    expect(hashSeed('button:default:default:default:')).toBe(hashSeed('button:default:default:default:'));
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
  });

  test('resolvePaint bakes token vars and currentColor', () => {
    const svg = '<path fill="var(--ll-ink)" stroke="currentColor"/>';
    const out = resolvePaint(svg, '#c2412d');
    expect(out).toContain(`fill="${TOKENS['--ll-ink']}"`);
    expect(out).toContain('stroke="#c2412d"');
    expect(out).not.toContain('var(');
    expect(out).not.toContain('currentColor');
  });

  test('resolvePaint falls back for unknown tokens', () => {
    expect(resolvePaint('var(--ll-not-a-token)', undefined)).toContain('#2a2420');
  });
});

describe('tokens — design token sheet integrity', () => {
  const COLORISH = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|\d{1,3} \d{1,3} \d{1,3})$/;

  test('every token value is a non-empty string', () => {
    for (const [key, value] of Object.entries(TOKENS)) {
      expect(`${key}: ${JSON.stringify(value)}`).toMatch(/^--[\w-]+: ".+"$/);
    }
  });

  test('paint tokens used by resolvePaint are color values', () => {
    // resolvePaint bakes any var(--ll-*) found in recipe SVG output; the
    // colors it can hit must be real colors, not spaces/knobs.
    for (const [key, value] of Object.entries(TOKENS)) {
      if (!key.startsWith('--ll-')) continue;
      if (['1px', '2px', '3px', '4px', '6px'].some((s) => value === s)) continue;
      if (COLORISH.test(value)) continue;
      // Non-color --ll-* knobs (stroke widths, tilts, spaces…) are allowed —
      // they're referenced by wxss, never baked into SVG.
      expect(`${key}: ${value}`).toMatch(/^--ll-(stroke|bleed|misreg|jitter|tilt|wobble|hover|press|shadow-k|grain|blend|space|hit|ink-room|ease|z-|peel|wipe|boil|draw|motion|sheet-radius|tex-|radius)/);
    }
  });

  test('tokens.js stays in sync with tokens.wxss (bake drift guard)', () => {
    const fs = require('node:fs');
    const css = fs.readFileSync(
      path.resolve(__dirname, '../../src/common/style/tokens.wxss'),
      'utf8'
    );
    const cssKeys = [...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]);
    const jsKeys = Object.keys(TOKENS);
    expect(cssKeys.filter((k) => !jsKeys.includes(k))).toEqual([]);
    expect(jsKeys.filter((k) => !cssKeys.includes(k))).toEqual([]);
  });
});
