export * from './algorithms/crosshatch';
export * from './algorithms/hidden-singles';
export * from './algorithms/naked-pairs';
export * from './algorithms/naked-triples';
export * from './algorithms/naked-quads';

export type Cell = {
  hintValues: CellValue[];
  rowIndex: number;
  columnIndex: number;
  boxIndex: number;
  isLocked: boolean;
};
export type Region = {
  cells: Cell[];
  type: 'row' | 'column' | 'box';
};
export type NakedSet = {
  regionCells: Cell[];
  cells: Cell[];
  hintValues: CellValue[];
};
export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Elimination = {
  referenceCells: Cell[];
  modifiedCells: Cell[];
  referenceValues: CellValue[];
  removedValues: CellValue[];
};
export type Step = {
  type: string;
  boardSnapshot: Cell[][];
  eliminations: Elimination[];
};

type Board = Cell[][];

const getRow = (cell: Cell, board: Board) => board[cell.rowIndex] || [];
export const getRowMinusCell = (cell: Cell, board: Board) =>
  getRow(cell, board).filter(
    (c) => c.rowIndex !== cell.rowIndex || c.columnIndex !== cell.columnIndex,
  );
const getRowFromIndex = (rowIndex: number, board: Board) =>
  board[rowIndex] || [];
const getColumn = (cell: Cell, board: Board) =>
  board.map((row) => row[cell.columnIndex] ?? ({} as Cell)) || [];
export const getColumnMinusCell = (cell: Cell, board: Board) =>
  getColumn(cell, board).filter(
    (c) => c.rowIndex !== cell.rowIndex || c.columnIndex !== cell.columnIndex,
  );
const getColumnFromIndex = (columnIndex: number, board: Board) =>
  board.map((row) => row[columnIndex] ?? ({} as Cell)) || [];
const getBox = (cell: Cell, board: Board) =>
  board
    .slice(
      Math.floor(cell.rowIndex / 3) * 3,
      Math.floor(cell.rowIndex / 3) * 3 + 3,
    )
    .map((row) =>
      row.slice(
        Math.floor(cell.columnIndex / 3) * 3,
        Math.floor(cell.columnIndex / 3) * 3 + 3,
      ),
    )
    .flat();
export const getBoxMinusCell = (cell: Cell, board: Board) =>
  getBox(cell, board).filter(
    (c) => c.rowIndex !== cell.rowIndex || c.columnIndex !== cell.columnIndex,
  );
const getBoxFromIndex = (boxIndex: number, board: Board) => {
  const rowIndex = Math.floor(boxIndex / 3) * 3;
  const columnIndex = (boxIndex % 3) * 3;
  return board
    .slice(rowIndex, rowIndex + 3)
    .map((row) => row.slice(columnIndex, columnIndex + 3))
    .flat();
};
export const getRegions = (board: Cell[][]) => {
  const regions: Region[] = [];
  for (let i = 0; i < 9; i++) {
    regions.push({ cells: getRowFromIndex(i, board), type: 'row' });
    regions.push({ cells: getColumnFromIndex(i, board), type: 'column' });
    regions.push({ cells: getBoxFromIndex(i, board), type: 'box' });
  }
  return regions;
};

export const executeStep = (board: Cell[][], step: Step) => {
  step.eliminations.forEach((elimination) => {
    const { modifiedCells, removedValues } = elimination;
    modifiedCells.forEach((cell) => {
      cell.hintValues = cell.hintValues.filter(
        (hint) => !removedValues.includes(hint),
      );
    });
  });
  return [...board];
};

// export const hiddenPairs = (board: Cell2[][]) => {
//   const step: Step = {
//     type: 'hiddenPairs',
//     boardSnapshot: JSON.parse(JSON.stringify(board)),
//     eliminations: [],
//   };
//   const regions = getRegions(board);
//   regions.forEach(({ cells }) => {});
//   return step;
// };

export const parseBoard = (board: number[][]) =>
  board.map((row, rowIndex) =>
    row.map(
      (value, columnIndex) =>
        ({
          hintValues: value === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [value], // I don't think type checking is working here
          rowIndex,
          columnIndex,
          boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3),
          isLocked: value !== 0,
        }) as Cell,
    ),
  );
