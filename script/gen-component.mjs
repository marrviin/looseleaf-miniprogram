#!/usr/bin/env node
/**
 * Scaffold a new component from .templates/
 *
 *   npm run gen button
 *   npm run gen button -- --force
 *
 * Generates packages/ui/src/components/<name>/ with the 4-piece files,
 * props.js, type.js, _example/ and README.md, pre-filled with the component name.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = path.join(root, 'packages/ui/src/components');
const templateDir = path.join(root, '.templates/component');

const name = process.argv[2];
const force = process.argv.includes('--force');

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Usage: npm run gen <kebab-case-name>');
  process.exit(1);
}

const target = path.join(componentsDir, name);
if (fs.existsSync(target) && !force) {
  console.error(`Component "${name}" already exists at ${target}. Use --force to overwrite.`);
  process.exit(1);
}

/** kebab-case -> PascalCase, for demo titles */
const pascal = name
  .split('-')
  .map((s) => s[0].toUpperCase() + s.slice(1))
  .join('');

/** Copy the template tree, replacing __NAME__ placeholders in file content and paths. */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name.replaceAll('__NAME__', name));
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      const content = fs.readFileSync(s, 'utf8').replaceAll('__NAME__', name).replaceAll('__PASCAL__', pascal);
      fs.writeFileSync(d, content);
    }
  }
}

copyDir(templateDir, target);
console.log(`✓ Created component "${name}" (${pascal}) at packages/ui/src/components/${name}`);
console.log(`  Next: npm run build, then check packages/example for the generated demo page.`);
