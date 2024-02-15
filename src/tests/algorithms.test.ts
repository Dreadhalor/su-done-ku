import { expect, test } from 'vitest';
import { hiddenPairPuzzle, hiddenQuadPuzzle } from '../boards';
import { executeStep, parseBoard, strategies } from '../utils';
import {
  hiddenPairPuzzleSnapshot,
  hiddenQuadPuzzleSnapshot,
} from './board-snapshots';
import { convertBoardToSnapshot } from '../utils/index';

test('hidden quad is found', () => {
  const puzzle = hiddenQuadPuzzle;
  const parsedPuzzle = parseBoard(puzzle);
  const step1 = executeStep(parsedPuzzle, strategies.crosshatch(parsedPuzzle));
  const step2 = executeStep(step1, strategies.nakedPairs(step1));
  const step3 = executeStep(step2, strategies.hiddenQuads(step2));
  const result = convertBoardToSnapshot(step3);
  expect(result).toMatchObject(hiddenQuadPuzzleSnapshot);
});

test('hidden pairs are found', () => {
  const puzzle = hiddenPairPuzzle;
  const parsedPuzzle = parseBoard(puzzle);
  const step1 = executeStep(parsedPuzzle, strategies.crosshatch(parsedPuzzle));
  const step2 = executeStep(step1, strategies.hiddenSingles(step1));
  const step3 = executeStep(step2, strategies.hiddenPairs(step2));
  const result = convertBoardToSnapshot(step3);
  expect(result).toMatchObject(hiddenPairPuzzleSnapshot);
});
