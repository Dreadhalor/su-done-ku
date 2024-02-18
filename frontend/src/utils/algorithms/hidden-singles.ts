import { Cell, Elimination, Step, filterHintCounts, getRegions } from '..';

export const hiddenSingles = (board: Cell[][]) => {
  const step: Step = {
    type: 'hiddenSingles',
    boardSnapshot: JSON.parse(JSON.stringify(board)),
    eliminations: [],
  };
  const regions = getRegions(board);

  regions.forEach(({ cells }) => {
    const counts = filterHintCounts(cells, [1]);
    const hintValues = counts.map(({ hint }) => hint);
    hintValues.forEach((hint) => {
      const cellsWithHint = counts.find(({ hint: _hint }) => _hint === hint)
        ?.cells;
      if (cellsWithHint && cellsWithHint.length === 1) {
        const cell = cellsWithHint[0];
        // ignore solved cells
        if (cell && cell.hintValues.length > 1) {
          const elimination: Elimination = {
            referenceCells: [cell],
            referenceValues: [hint],
            modifiedCells: [cell],
            removedValues: cell.hintValues.filter((_hint) => _hint !== hint),
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
