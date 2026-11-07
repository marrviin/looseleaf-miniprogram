/**
 * Entry for script/bundle-ink.mjs — bundles the upstream looseleaf ink engine
 * (pure TS, zero React deps) into packages/ui/src/common/ink-engine.js.
 *
 * Only the recipes listed in RECIPES are pulled in; tree-shaking drops the
 * rest of the upstream recipe/catalog (charts, paper, textures...). Add a
 * recipe here when porting a new component.
 */
import { bucketBox, runRecipe } from '@/lib/ink/recipes';
import { buttonRecipe } from '@/lib/ink/recipes/button-ink';

export const RECIPES = {
  button: buttonRecipe,
};

export { runRecipe, bucketBox };
