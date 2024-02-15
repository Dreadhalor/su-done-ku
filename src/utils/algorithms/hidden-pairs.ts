import { Cell, Elimination, Step, filterHintCounts, getRegions } from '..';

export const hiddenPairs = (board: Cell[][]) => {
  const step: Step = {
    type: 'hiddenPairs',
    boardSnapshot: JSON.parse(JSON.stringify(board)),
    eliminations: [],
  };
  const regions = getRegions(board);
  regions.forEach(({ cells }) => {
    // any hint value with more or less than 2 cells can't be part of a hidden pair, so we can ignore it
    const candidatePairs = filterHintCounts(cells, 2);
    for (let i = 0; i < candidatePairs.length - 1; i++) {
      for (let j = i + 1; j < candidatePairs.length; j++) {
        const { hint: hint1, cells: cells1 } = candidatePairs[i]!;
        const { hint: hint2, cells: cells2 } = candidatePairs[j]!;
        const uniqueCells = new Set([...cells1, ...cells2]);
        if (uniqueCells.size !== 2) continue;
        const [a_0, a_1] = [...uniqueCells];
        // if both cells only have 2 hint values, they're a naked pair & we have no inner value to eliminate
        if (a_0?.hintValues.length === 2 && a_1?.hintValues.length === 2)
          continue;
        const referenceValues = [hint1, hint2];
        // only cells that have hint values that aren't part of the pair are modified
        const modifiedCells = [a_0, a_1].filter(
          (cell) =>
            cell &&
            cell.hintValues.some((hint) => referenceValues.includes(hint)),
        );
        const removedValues = [
          ...new Set([
            ...a_0!.hintValues.filter(
              (hint) => !referenceValues.includes(hint),
            ),
            ...a_1!.hintValues.filter(
              (hint) => !referenceValues.includes(hint),
            ),
          ]),
        ];
        const elimination = {
          referenceCells: [a_0, a_1],
          referenceValues,
          modifiedCells,
          removedValues,
        } as Elimination;
        step.eliminations.push(elimination);
      }
    }
  });
  return step;
};
