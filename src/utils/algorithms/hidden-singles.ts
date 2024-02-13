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

export const formatHiddenSingles = (step: Step) => {
  const { eliminations } = step;
  if (eliminations.length === 0) return '';
  const elimination = eliminations[0];
  const { referenceCells, referenceValues, removedValues } = elimination;
  const cell = referenceCells[0];
  const value = referenceValues[0];
  const removedValue = removedValues[0];
  return `The cell at row ${cell.rowIndex + 1}, column ${
    cell.columnIndex + 1
  } can only be ${value} so we can remove ${removedValue} from the hint values.`;
};
