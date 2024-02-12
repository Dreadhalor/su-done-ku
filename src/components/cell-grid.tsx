import { cn } from '@repo/utils';
import { useBoard } from '../providers/board-context';
import { Button } from 'dread-ui';
import { CellValue } from '../utils';

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
  const { board, setBoard } = useBoard();
  return (
    <div className='flex flex-col'>
      <GridTopAndBottom />
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className='flex flex-nowrap'>
          <GridLeftAndRight index={rowIndex} />
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={cn(
                'bg-background relative h-12 w-12 items-center justify-center border border-black',
                cell.value ? 'text-black' : 'text-gray-400',
                cell.value
                  ? 'flex'
                  : 'grid grid-cols-3 grid-rows-3 place-items-center',
                cell.rowIndex % 3 === 2 && cell.rowIndex < 8 && 'border-b-4',
                cell.columnIndex % 3 === 2 &&
                  cell.columnIndex < 8 &&
                  'border-r-4',
              )}
            >
              {/* <div className='absolute right-0 top-0 text-xs'>
                  {cell.rowIndex}, {cell.columnIndex}
                </div> */}
              {cell.value && cell.value}
              {!cell.value &&
                Array.from({ length: 9 }).map((_, index) => (
                  <Button
                    key={index}
                    variant='ghost'
                    className='h-4 w-4 rounded-none p-0 text-xs'
                    onClick={() => {
                      cell.hintValues = cell.hintValues.includes(
                        (index + 1) as CellValue,
                      )
                        ? cell.hintValues.filter((hint) => hint !== index + 1)
                        : [...cell.hintValues, (index + 1) as CellValue];
                      setBoard([...board]);
                    }}
                  >
                    {cell.hintValues.includes((index + 1) as CellValue)
                      ? index + 1
                      : ''}
                  </Button>
                ))}
            </div>
          ))}
          <GridLeftAndRight index={rowIndex} />
        </div>
      ))}
      <GridTopAndBottom />
    </div>
  );
};

export { CellGrid };
