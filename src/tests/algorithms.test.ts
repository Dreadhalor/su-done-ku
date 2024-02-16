import { expect, test } from 'vitest';
import {
  hiddenPairPuzzle,
  hiddenQuadPuzzle,
  hiddenTriplePuzzle,
} from '../boards';
import { executeStep, parseBoard, strategies } from '../utils';
import {
  hiddenPairPuzzleSnapshot,
  hiddenQuadPuzzleSnapshot,
  hiddenTriplePuzzleSnapshot,
} from './board-snapshots';
import { convertBoardToSnapshot } from '../utils/index';

test('hidden pairs are found', () => {
  const puzzle = hiddenPairPuzzle;
  const parsedPuzzle = parseBoard(puzzle);
  const step1 = executeStep(parsedPuzzle, strategies.crosshatch(parsedPuzzle));
  const step2 = executeStep(step1, strategies.hiddenSingles(step1));
  const step3 = executeStep(step2, strategies.hiddenPairs(step2));
  const result = convertBoardToSnapshot(step3);
  expect(result).toMatchObject(hiddenPairPuzzleSnapshot);
});

test('hidden triples are found', () => {
  const puzzle = hiddenTriplePuzzle;
  const parsedPuzzle = parseBoard(puzzle);
  const step1 = executeStep(parsedPuzzle, strategies.crosshatch(parsedPuzzle));
  const step2 = executeStep(step1, strategies.hiddenSingles(step1));
  const step3 = executeStep(step2, strategies.nakedPairs(step2));
  const step4 = executeStep(step3, strategies.crosshatch(step3));
  const step5 = executeStep(step4, strategies.hiddenSingles(step4));
  const step6 = executeStep(step5, strategies.nakedPairs(step5));
  const step7 = executeStep(step6, strategies.nakedTriples(step6));
  const step8 = executeStep(step7, strategies.crosshatch(step7));
  const step9 = executeStep(step8, strategies.hiddenSingles(step8));
  const step10 = executeStep(step9, strategies.hiddenTriples(step9));
  const result = convertBoardToSnapshot(step10);
  expect(result).toMatchObject(hiddenTriplePuzzleSnapshot);
});

test('hidden quad is found', () => {
  const puzzle = hiddenQuadPuzzle;
  const parsedPuzzle = parseBoard(puzzle);
  const step1 = executeStep(parsedPuzzle, strategies.crosshatch(parsedPuzzle));
  const step2 = executeStep(step1, strategies.nakedPairs(step1));
  const step3 = executeStep(step2, strategies.hiddenQuads(step2));
  const result = convertBoardToSnapshot(step3);
  expect(result).toMatchObject(hiddenQuadPuzzleSnapshot);
});
