import { crosshatch, formatCrosshatch } from './crosshatch';
import { hiddenSingles, formatHiddenSingles } from './hidden-singles';
import { nakedPairs } from './naked-pairs';
import { nakedTriples } from './naked-triples';
import { hiddenPairs } from './hidden-pairs';
import { hiddenTriples } from './hidden-triples';
import { nakedQuads } from './naked-quads';
import { hiddenQuads } from './hidden-quads';

export const strategies = {
  crosshatch,
  hiddenSingles,
  nakedPairs,
  nakedTriples,
  hiddenPairs,
  hiddenTriples,
  nakedQuads,
  hiddenQuads,
} as const;

export { formatCrosshatch, formatHiddenSingles };

export type Strategy = keyof typeof strategies;
