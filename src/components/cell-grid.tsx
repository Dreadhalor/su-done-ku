import { useBoard } from '../providers/board-context';
import { Cell } from './cell';

const GridTopAndBottom = () => {
  return (
    <div className='flex h-5 flex-nowrap justify-center text-sm text-white'>
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className='flex w-12 items-center justify-center border'
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};
const GridLeftAndRight = ({ index }: { index: number }) => {
  // count up from A
  return (
    <div className='flex w-5 items-center justify-center border text-sm text-white'>
      {String.fromCharCode(65 + index)}
    </div>
  );
};

const CellGrid = () => {
  const { board, step } = useBoard();
  const { eliminations } = step || { eliminations: [] };

  return (
    <div className='flex flex-col'>
      <GridTopAndBottom />
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className='flex flex-nowrap'>
          <GridLeftAndRight index={rowIndex} />
          {row.map((cell, cellIndex) => (
            <Cell key={cellIndex} cell={cell} eliminations={eliminations} />
          ))}
          <GridLeftAndRight index={rowIndex} />
        </div>
      ))}
      <GridTopAndBottom />
    </div>
  );
};

export { CellGrid };
