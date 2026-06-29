import { PLANET_PALETTES } from "./colors";
import { CATEGORY_COLOR_MAP } from "../data/initialTips";

const registry = {};
let nextIdx = 0;

const usedByPreset = new Set(Object.values(CATEGORY_COLOR_MAP));
const availableIndices = [];
for (let i = 0; i < PLANET_PALETTES.length; i++) {
  if (!usedByPreset.has(i)) availableIndices.push(i);
}
for (let i = 0; i < PLANET_PALETTES.length; i++) {
  if (usedByPreset.has(i)) availableIndices.push(i);
}

for (const [cat, idx] of Object.entries(CATEGORY_COLOR_MAP)) {
  registry[cat] = idx;
}

export function getCategoryColorIdx(cat) {
  if (registry[cat] !== undefined) return registry[cat];
  registry[cat] = availableIndices[nextIdx % availableIndices.length];
  nextIdx++;
  return registry[cat];
}

getCategoryColorIdx._registry = registry;
