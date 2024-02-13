import { Cell, Elimination, Step, getRegions } from '..';

export const hiddenPairs = (board: Cell[][]) => {
  const step: Step = {
    type: 'hiddenPairs',
    boardSnapshot: JSON.parse(JSON.stringify(board)),
    eliminations: [],
  };
  const regions = getRegions(board);
  regions.forEach(({ cells }) => {
    // create a map of hint values to cells to count how many cells have each hint value
    const hintValueMap: Record<string, Cell[]> = {};
    cells.forEach((cell) => {
      const hintValues = cell.hintValues.map((hint) => `${hint}`);
      hintValues.forEach((hint) => {
        if (!hintValueMap[hint]) hintValueMap[hint] = [];
        const cellsWithHint = hintValueMap[hint];
        if (cellsWithHint) cellsWithHint.push(cell);
      });
    });
    // any hint value with more or less than 2 cells can't be part of a hidden pair, so we can ignore it
    const hints = Object.keys(hintValueMap).filter(
      (hint) => hintValueMap[hint]!.length === 2,
    );
    const candidatePairs = hints.map((hint) => ({
      hint,
      cells: hintValueMap[hint]!,
    }));
    for (let i = 0; i < candidatePairs.length - 1; i++) {
      for (let j = i + 1; j < candidatePairs.length; j++) {
        const { hint: hint1, cells: cells1 } = candidatePairs[i]!;
        const { hint: hint2, cells: cells2 } = candidatePairs[j]!;
        const uniqueCells = new Set([...cells1, ...cells2]);
        if (uniqueCells.size !== 2) break;
        const [a_0, a_1] = [...uniqueCells];
        // if both cells only have 2 hint values, they're a naked pair & we have no inner value to eliminate
        if (a_0?.hintValues.length === 2 && a_1?.hintValues.length === 2) break;
        const referenceValues = [Number(hint1), Number(hint2)];
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
