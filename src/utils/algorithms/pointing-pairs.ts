import {
  Cell,
  CellValue,
  Step,
  countHintValues,
  getBoxes,
  getColumnFromIndex,
  getRowFromIndex,
} from '..';

export const pointingPairs = (board: Cell[][]) => {
  const step: Step = {
    type: 'pointingPairs',
    boardSnapshot: JSON.parse(JSON.stringify(board)),
    eliminations: [],
  };
  const boxes = getBoxes(board);
  boxes.forEach((box) => {
    const hintValues = countHintValues(box);
    const candidatePairs = Object.keys(hintValues)
      .filter((hint) => hintValues[hint]!.length === 2)
      .map((hint) => hintValues[hint]!);
    candidatePairs.forEach(([cell_a, cell_b], index) => {
      if (!cell_a || !cell_b) return;
      const hint = Number(Object.keys(hintValues)[index]!) as CellValue;
      if (cell_a.columnIndex === cell_b.columnIndex) {
        const columnIndex = cell_a.columnIndex;
        const modifiedCells = getColumnFromIndex(columnIndex, board)
          .filter(
            (cell) =>
              cell.rowIndex !== cell_a.rowIndex &&
              cell.rowIndex !== cell_b.rowIndex,
          )
          .filter((cell) => cell.hintValues.includes(hint));
        if (modifiedCells.length === 0) return;
        step.eliminations.push({
          referenceCells: [cell_a, cell_b],
          referenceValues: [hint],
          modifiedCells,
          removedValues: [hint],
        });
      }
      if (cell_a.rowIndex === cell_b.rowIndex) {
        const rowIndex = cell_a.rowIndex;
        const modifiedCells = getRowFromIndex(rowIndex, board)
          .filter(
            (cell) =>
              cell.columnIndex !== cell_a.columnIndex &&
              cell.columnIndex !== cell_b.columnIndex,
          )
          .filter((cell) => cell.hintValues.includes(hint));
        if (modifiedCells.length === 0) return;
        step.eliminations.push({
          referenceCells: [cell_a, cell_b],
          referenceValues: [hint],
          modifiedCells,
          removedValues: [hint],
        });
      }
    });
  });
  return step;
};
