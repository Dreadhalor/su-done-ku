import { cn } from '@repo/utils';
import { Cell, CellValue, Elimination } from '../utils';
import { Button } from 'dread-ui';
import { useBoard } from '../providers/board-context';

type CellProps = {
  cell: Cell;
  eliminations: Elimination[];
};
const CellComponent = ({ cell, eliminations }: CellProps) => {
  const { rowIndex, columnIndex, hintValues } = cell;
  const { board, setBoard, step } = useBoard();
  const value = cell.hintValues.length === 1 ? cell.hintValues[0] : null;
  if (rowIndex === 0 && columnIndex === 0) console.log(eliminations);

  const relevantEliminations = eliminations
    .filter((elimination) =>
      elimination.modifiedCells.some(
        (modifiedCell) =>
          modifiedCell.rowIndex === rowIndex &&
          modifiedCell.columnIndex === columnIndex,
      ),
    )
    .map((elimination) => elimination.removedValues)
    .reduce((acc, removedValues) => {
      removedValues.forEach((removedValue) => {
        if (!acc.includes(removedValue) && hintValues.includes(removedValue)) {
          acc.push(removedValue);
        }
      });
      return acc;
    }, [] as CellValue[]);
  // if (relevantEliminations.length > 0) console.log({ relevantEliminations });

  const relevantEliminationReferences = eliminations.filter((elimination) =>
    elimination.referenceCells.some(
      (referenceCell) =>
        referenceCell.rowIndex === rowIndex &&
        referenceCell.columnIndex === columnIndex,
    ),
  );
  const relevantNumberReferences = relevantEliminationReferences
    .map((elimination) => elimination.referenceValues)
    .reduce((acc, referenceValues) => {
      referenceValues.forEach((referenceValue) => {
        if (!acc.includes(referenceValue)) acc.push(referenceValue);
      });
      return acc;
    }, [] as CellValue[]);

  if (relevantEliminationReferences.length > 0)
    console.log(
      'relevantEliminationReferences',
      relevantEliminationReferences,
      'relevantNumberReferences',
      relevantNumberReferences,
    );

  return (
    <div
      className={cn(
        'bg-background relative h-12 w-12 items-center justify-center border border-black',
        value ? 'text-black' : 'text-gray-400',
        value ? 'flex' : 'grid grid-cols-3 grid-rows-3 place-items-center',
        rowIndex % 3 === 2 && rowIndex < 8 && 'border-b-4',
        columnIndex % 3 === 2 && columnIndex < 8 && 'border-r-4',
        relevantEliminations.length > 0 && 'bg-red-200',
        relevantEliminationReferences.length > 0 && 'bg-green-200',
        step && 'pointer-events-none',
      )}
    >
      {value && value}
      {!value &&
        Array.from({ length: 9 }).map((_, index) => (
          <Button
            key={index}
            variant='ghost'
            className={cn(
              'h-4 w-4 rounded-none p-0 text-xs',
              relevantEliminations.includes(index + 1) && 'bg-red-500',
              relevantNumberReferences.includes(index + 1) &&
                hintValues.includes(index + 1) &&
                'bg-green-500',
            )}
            onClick={() => {
              cell.hintValues = hintValues.includes((index + 1) as CellValue)
                ? hintValues.filter((hint) => hint !== index + 1)
                : [...hintValues, (index + 1) as CellValue];
              setBoard([...board]);
            }}
          >
            {hintValues.includes((index + 1) as CellValue) ? index + 1 : ''}
          </Button>
        ))}
    </div>
  );
};
export { CellComponent as Cell };
