import { Cell, Elimination, Step, getRegions } from '..';

export const hiddenQuads = (board: Cell[][]) => {
  const step: Step = {
    type: 'hiddenQuads',
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
    // any hint value with more than 4 cells or less than 2 can't be part of a hidden quad, so we can ignore it
    const hints = Object.keys(hintValueMap).filter((hint) => {
      const len = hintValueMap[hint]!.length;
      return len === 2 || len === 3 || len === 4;
    });
    const candidateTriples = hints.map((hint) => ({
      hint,
      cells: hintValueMap[hint]!,
    }));
    for (let i = 0; i < candidateTriples.length - 3; i++) {
      for (let j = i + 1; j < candidateTriples.length - 2; j++) {
        for (let k = j + 1; k < candidateTriples.length - 1; k++) {
          for (let l = k + 1; l < candidateTriples.length; l++) {
            const { hint: hint1, cells: cells1 } = candidateTriples[i]!;
            const { hint: hint2, cells: cells2 } = candidateTriples[j]!;
            const { hint: hint3, cells: cells3 } = candidateTriples[k]!;
            const { hint: hint4, cells: cells4 } = candidateTriples[l]!;
            const uniqueCells = new Set([
              ...cells1,
              ...cells2,
              ...cells3,
              ...cells4,
            ]);
            if (uniqueCells.size !== 4) continue;
            const [a_0, a_1, a_2, a_3] = [...uniqueCells];
            // if no cells have more than 4 hint values, they're a naked quad & we have no inner value to eliminate
            if (
              a_0!.hintValues.length <= 4 &&
              a_1!.hintValues.length <= 4 &&
              a_2!.hintValues.length <= 4 &&
              a_3!.hintValues.length <= 4
            )
              continue;
            const referenceValues = [
              Number(hint1),
              Number(hint2),
              Number(hint3),
              Number(hint4),
            ];
            // only cells that have hint values that aren't part of the quad are modified
            const modifiedCells = [a_0, a_1, a_2, a_3].filter(
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
                ...a_2!.hintValues.filter(
                  (hint) => !referenceValues.includes(hint),
                ),
                ...a_3!.hintValues.filter(
                  (hint) => !referenceValues.includes(hint),
                ),
              ]),
            ];
            const elimination = {
              referenceCells: [a_0, a_1, a_2, a_3],
              referenceValues,
              modifiedCells,
              removedValues,
            } as Elimination;
            step.eliminations.push(elimination);
          }
        }
      }
    }
  });

  return step;
};
