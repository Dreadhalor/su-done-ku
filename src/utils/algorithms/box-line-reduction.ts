import { groupBy } from 'lodash';
import { Cell, Step, filterHintCounts, getLines } from '..';

export const boxLineReduction = (board: Cell[][]) => {
  const step: Step = {
    type: 'boxLineReduction',
    boardSnapshot: JSON.parse(JSON.stringify(board)),
    eliminations: [],
  };
  const lines = getLines(board);
  lines.forEach((line) => {
    const candidateValues = filterHintCounts(line, [2, 3]);
    candidateValues.forEach(({ hint, cells }) => {
      const boxes = groupBy(cells, (cell) => cell.boxIndex);
      console.log(boxes);
    });
  });
  return step;
};
