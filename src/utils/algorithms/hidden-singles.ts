import { Cell, CellValue, Elimination, Step, getRegions } from '..';

export const hiddenSingles = (board: Cell[][]) => {
  const step: Step = {
    type: 'hiddenSingles',
    boardSnapshot: JSON.parse(JSON.stringify(board)),
    eliminations: [],
  };
  const regions = getRegions(board);
  regions.forEach(({ cells }) => {
    const hintValueMap: Record<string, Cell[]> = {};
    cells.forEach((cell) => {
      const hintValues = cell.hintValues.map((hint) => `${hint}`);
      hintValues.forEach((hint) => {
        if (!hintValueMap[hint]) hintValueMap[hint] = [];
        const cellsWithHint = hintValueMap[hint];
        if (cellsWithHint) cellsWithHint.push(cell);
      });
    });
    Object.keys(hintValueMap).forEach((hint) => {
      const cellsWithHint = hintValueMap[hint];
      if (cellsWithHint && cellsWithHint.length === 1) {
        const cell = cellsWithHint[0];
        // ignore solved cells
        if (cell && cell.hintValues.length > 1) {
          const value = Number(hint) as CellValue;
          const elimination: Elimination = {
            referenceCells: [cell],
            referenceValues: [value],
            modifiedCells: [cell],
            removedValues: cell.hintValues.filter((hint) => hint !== value),
          };
          step.eliminations.push(elimination);
        }
      }
    });
  });
  return step;
};
