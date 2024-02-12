export type Cell = {
  value: number | null;
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
export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type CellValueString = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

const getRow = (cell: Cell, board: Cell[][]) => board[cell.rowIndex] || [];
const getRowFromIndex = (rowIndex: number, board: Cell[][]) =>
  board[rowIndex] || [];
const getColumn = (cell: Cell, board: Cell[][]) =>
  board.map((row) => row[cell.columnIndex] ?? ({} as Cell)) || [];
const getColumnFromIndex = (columnIndex: number, board: Cell[][]) =>
  board.map((row) => row[columnIndex] ?? ({} as Cell)) || [];
const getBox = (cell: Cell, board: Cell[][]) =>
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
const getBoxFromIndex = (boxIndex: number, board: Cell[][]) => {
  const rowIndex = Math.floor(boxIndex / 3) * 3;
  const columnIndex = (boxIndex % 3) * 3;
  return board
    .slice(rowIndex, rowIndex + 3)
    .map((row) => row.slice(columnIndex, columnIndex + 3))
    .flat();
};
const getRegions = (board: Cell[][]) => {
  const regions: Region[] = [];
  for (let i = 0; i < 9; i++) {
    regions.push({ cells: getRowFromIndex(i, board), type: 'row' });
    regions.push({ cells: getColumnFromIndex(i, board), type: 'column' });
    regions.push({ cells: getBoxFromIndex(i, board), type: 'box' });
  }
  return regions;
};

type Elimination = {
  boardSnapshot: Cell[][];
  type: string;
  referenceCells: Cell[];
  modifiedCells: Cell[];
  removedValues: CellValue[];
};

// look at every cell with a value and remove that value from the hintValues of every cell in the same row, column, and 3x3 grid
export const crossHatch = (board: Cell[][]) => {
  // get all the cells with a value
  const cellsWithValue = board
    .map((row) => row.filter((cell) => cell.value !== null))
    .flat();
  // for each cell with a value, remove that value from the hintValues of every cell in the same row, column, and 3x3 box
  cellsWithValue.forEach((cell) => {
    const { value } = cell;
    const row = getRow(cell, board);
    const column = getColumn(cell, board);
    const box = getBox(cell, board);

    row.forEach((cell) => {
      if (cell.value === null) {
        cell.hintValues = cell.hintValues.filter((hint) => hint !== value);
      }
    });

    column.forEach((cell) => {
      if (cell?.value === null) {
        cell.hintValues = cell.hintValues.filter((hint) => hint !== value);
      }
    });

    box.forEach((cell) => {
      if (cell.value === null) {
        cell.hintValues = cell.hintValues.filter((hint) => hint !== value);
      }
    });
  });

  return [...board];
};

// look at every cell with only one possible value and fill in that value
export const nakedSingles = (board: Cell[][]) => {
  // look at every cell
  board.forEach((row) => {
    row.forEach((cell) => {
      // if the cell has only one possible value, fill in that value
      if (cell.value === null && cell.hintValues.length === 1) {
        cell.value = cell.hintValues[0] as number;
        cell.hintValues = [];
      }
    });
  });

  return [...board];
};

export const hiddenSingles = (board: Cell[][]) => {
  const regions = getRegions(board);
  regions.forEach(({ cells }) => {
    const cellValues = cells.map((cell) => cell.value);
    const hintValues = cells
      .filter((cell) => cell.value === null)
      .map((cell) => cell.hintValues)
      .flat();
    const uniqueHintValues = Array.from(new Set(hintValues));
    uniqueHintValues.forEach((value) => {
      const cellsWithHint = cells.filter(
        (cell) => cell.value === null && cell.hintValues.includes(value),
      );
      if (cellsWithHint.length === 1 && !cellValues.includes(value)) {
        cellsWithHint[0].value = value;
        cellsWithHint[0].hintValues = [];
      }
    });
  });

  return [...board];
};

// undefined behavior if crosshatching is not run first
export const nakedPairs = (board: Cell[][]) => {
  const regions = getRegions(board);
  regions.forEach(({ cells }) => {
    cells.forEach((cell) => {
      if (cell.value === null) {
        const matchingCells = cells.filter(
          (c) =>
            c.value === null &&
            c.hintValues.length === 2 &&
            c.hintValues.join('') === cell.hintValues.join('') &&
            c !== cell,
        );
        if (matchingCells.length === 1) {
          cells.forEach((c) => {
            if (c !== cell && c !== matchingCells[0]) {
              c.hintValues = c.hintValues.filter(
                (hint) =>
                  hint !== cell.hintValues[0] && hint !== cell.hintValues[1],
              );
            }
          });
        }
      }
    });
  });

  return [...board];
};

type NakedSet = {
  regionCells: Cell[];
  cells: Cell[];
  hintValues: number[];
};
// undefined behavior if crosshatching is not run first
export const nakedTriples = (board: Cell[][]) => {
  const regions = getRegions(board);
  const foundTriples: NakedSet[] = [] as NakedSet[];
  regions.forEach(({ cells }) => {
    const cellsWithThreeOrLessHints = cells.filter(
      (cell) => cell.value === null && cell.hintValues.length <= 3,
    );
    for (let i = 0; i < cellsWithThreeOrLessHints.length - 2; i++) {
      for (let j = i + 1; j < cellsWithThreeOrLessHints.length - 1; j++) {
        for (let k = j + 1; k < cellsWithThreeOrLessHints.length; k++) {
          const c_1 = cellsWithThreeOrLessHints[i];
          const c_2 = cellsWithThreeOrLessHints[j];
          const c_3 = cellsWithThreeOrLessHints[k];
          if (c_1 && c_2 && c_3) {
            const hints = Array.from(
              new Set([
                ...c_1.hintValues,
                ...c_2.hintValues,
                ...c_3.hintValues,
              ]),
            );

            if (hints.length === 3) {
              foundTriples.push({
                regionCells: cells,
                cells: [c_1, c_2, c_3],
                hintValues: hints,
              });
            }
          }
        }
      }
    }
  });

  foundTriples.forEach(({ regionCells, cells, hintValues }) => {
    regionCells.forEach((cell) => {
      if (cell.value === null && !cells.includes(cell)) {
        cell.hintValues = cell.hintValues.filter(
          (hint) => !hintValues.includes(hint),
        );
      }
    });
  });

  return [...board];
};

export const nakedQuads = (board: Cell[][]) => {
  const regions = getRegions(board);
  const foundQuads: NakedSet[] = [] as NakedSet[];
  regions.forEach(({ cells }) => {
    const cellsWithFourOrLessHints = cells.filter(
      (cell) => cell.value === null && cell.hintValues.length <= 4,
    );
    for (let i = 0; i < cellsWithFourOrLessHints.length - 3; i++) {
      for (let j = i + 1; j < cellsWithFourOrLessHints.length - 2; j++) {
        for (let k = j + 1; k < cellsWithFourOrLessHints.length - 1; k++) {
          for (let l = k + 1; l < cellsWithFourOrLessHints.length; l++) {
            const c_1 = cellsWithFourOrLessHints[i];
            const c_2 = cellsWithFourOrLessHints[j];
            const c_3 = cellsWithFourOrLessHints[k];
            const c_4 = cellsWithFourOrLessHints[l];
            if (c_1 && c_2 && c_3 && c_4) {
              const hints = Array.from(
                new Set([
                  ...c_1.hintValues,
                  ...c_2.hintValues,
                  ...c_3.hintValues,
                  ...c_4.hintValues,
                ]),
              );

              if (hints.length === 4) {
                foundQuads.push({
                  regionCells: cells,
                  cells: [c_1, c_2, c_3, c_4],
                  hintValues: hints,
                });
              }
            }
          }
        }
      }
    }
  });

  foundQuads.forEach(({ regionCells, cells, hintValues }) => {
    regionCells.forEach((cell) => {
      if (cell.value === null && !cells.includes(cell)) {
        cell.hintValues = cell.hintValues.filter(
          (hint) => !hintValues.includes(hint),
        );
      }
    });
  });

  return [...board];
};

export const hiddenPairs = (board: Cell[][]) => {
  const regions = getRegions(board);
  regions.forEach(({ cells: regionCells }) => {
    const cellsWithHints = regionCells.filter(
      (cell) => cell.value === null && cell.hintValues.length > 0,
    );
    const hintValueMap: Record<CellValueString, Cell[]> = {} as Record<
      CellValue,
      Cell[]
    >;
    cellsWithHints.forEach((cell) => {
      cell.hintValues.forEach((hint) => {
        if (!hintValueMap[hint]) {
          hintValueMap[hint] = [];
        }
        hintValueMap[hint].push(cell);
      });
    });
    const hintValueDoubles = [] as number[];
    Object.keys(hintValueMap).forEach((hint) => {
      if (hintValueMap[hint].length === 2) {
        hintValueDoubles.push(Number(hint));
      }
    });
    for (let i = 0; i < hintValueDoubles.length - 1; i++) {
      for (let j = i + 1; j < hintValueDoubles.length; j++) {
        const hint_1 = hintValueDoubles[i];
        const hint_2 = hintValueDoubles[j];
        const cellsWithHint_1 = hintValueMap[hint_1];
        const cellsWithHint_2 = hintValueMap[hint_2];
        if (
          cellsWithHint_1[0] === cellsWithHint_2[0] &&
          cellsWithHint_1[1] === cellsWithHint_2[1]
        ) {
          cellsWithHint_1[0].hintValues = [hint_1, hint_2];
          cellsWithHint_1[1].hintValues = [hint_1, hint_2];
        }
      }
    }
  });

  return [...board];
};

export const parseBoard = (board: number[][]) =>
  board.map((row, rowIndex) =>
    row.map((value, columnIndex) => ({
      value: value === 0 ? null : value,
      hintValues:
        value === 0 ? ([1, 2, 3, 4, 5, 6, 7, 8, 9] as CellValue[]) : [], // I don't think type checking is working here
      rowIndex,
      columnIndex,
      boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3),
      isLocked: value !== 0,
    })),
  );
