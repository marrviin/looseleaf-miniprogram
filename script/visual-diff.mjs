#!/usr/bin/env node
/**
 * L4 — visual regression: compare automator screenshots against baselines.
 *
 *   node script/visual-diff.mjs [--device iphone15pro] [--update] [--threshold 0.02]
 *
 *   current : test-artifacts/automator/<device>/*.png   (from automator-smoke)
 *   baseline: test-artifacts/visual/<device>/*.png      (committed or local)
 *   diffs   : test-artifacts/visual/<device>-diff/      (artifacts, not committed)
 *
 * --update copies current shots over the baselines (run after an INTENDED
 * visual change, ideally on the same machine + DevTools version as the
 * original baseline — renderer versions differ).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : null;
};
const device = arg('device') || 'iphone15pro';
const threshold = Number(arg('threshold') || 0.02);
const update = argv.includes('--update');

const currentDir = path.join(root, 'test-artifacts/automator', device);
const baselineDir = path.join(root, 'test-artifacts/visual', device);
const diffDir = path.join(root, 'test-artifacts/visual', `${device}-diff`);

if (!fs.existsSync(currentDir)) {
  console.error(`✗ no current shots at ${path.relative(root, currentDir)} — run script/automator-smoke.mjs first`);
  process.exit(2);
}

if (update) {
  fs.rmSync(baselineDir, { recursive: true, force: true });
  fs.cpSync(currentDir, baselineDir, { recursive: true });
  console.log(`✓ baselines updated from current shots (${device})`);
  process.exit(0);
}

fs.mkdirSync(diffDir, { recursive: true });
const shots = fs.readdirSync(currentDir).filter((f) => f.endsWith('.png'));
let failures = 0;
let missing = 0;

for (const shot of shots) {
  const base = path.join(baselineDir, shot);
  if (!fs.existsSync(base)) {
    console.log(`? no baseline for ${shot}`);
    missing++;
    continue;
  }
  const a = PNG.sync.read(fs.readFileSync(base));
  const b = PNG.sync.read(fs.readFileSync(path.join(currentDir, shot)));
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`✗ ${shot}: size changed ${a.width}x${a.height} → ${b.width}x${b.height}`);
    failures++;
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const mismatches = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0.1,
    includeAA: false,
  });
  const ratio = mismatches / (a.width * a.height);
  if (ratio > threshold) {
    fs.writeFileSync(path.join(diffDir, shot), PNG.sync.write(diff));
    console.log(`✗ ${shot}: ${(ratio * 100).toFixed(2)}% pixels differ (diff → ${path.relative(root, path.join(diffDir, shot))})`);
    failures++;
  }
}

console.log(`\n${failures} mismatch(es), ${missing} missing baseline(s), ${shots.length} shots compared (threshold ${(threshold * 100).toFixed(1)}%)`);
process.exit(failures > 0 ? 1 : 0);
