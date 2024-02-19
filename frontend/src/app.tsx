import { Button, Card, CardContent } from 'dread-ui';
import { useEffect } from 'react';
import { Cell, Step, convertBoardToSnapshot } from './utils';
import { StepPanel } from './components/step-panel';
import { useBoard } from './providers/board-context';
import { CellGrid } from './components/cell-grid';
import { PreviewToggle } from './components/preview-toggle';
import { HistorySlider } from './components/history-slider';
import { GeneratePuzzleButton } from './components/generate-puzzle-button';
import { LoadExamplePuzzleButton } from './components/load-example-puzzle-button';

// create a sudoku board with a 9x9 grid of cells, where each cell is a 3x3 grid of cells containing numbers 1-9
function App() {
  const { step, resetSteps, addStep } = useBoard();

  useEffect(() => {
    const newBoard: Cell[][] = Array.from({ length: 9 }).map((_, rowIndex) =>
      Array.from({ length: 9 }).map(
        (_, columnIndex) =>
          ({
            hintValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            rowIndex,
            columnIndex,
            boxIndex:
              Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3),
            isLocked: false,
          }) as Cell,
      ),
    );

    newBoard[4]![5]!.hintValues = [1];
    newBoard[2]![2]!.hintValues = [4];

    const initStep: Step = {
      type: 'start',
      boardSnapshot: JSON.parse(JSON.stringify(newBoard)),
      eliminations: [],
    };
    resetSteps();
    addStep(initStep);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='flex h-full w-full items-center justify-center gap-4 border-4 border-white text-black'>
      <div className='flex flex-col gap-2'>
        <PreviewToggle />
        <CellGrid />
        <Card>
          <CardContent noHeader className='p-2'>
            <HistorySlider />
          </CardContent>
        </Card>
      </div>
      <div className='flex flex-col gap-4'>
        <LoadExamplePuzzleButton />
        <Card>
          <CardContent noHeader className='flex p-1'>
            <GeneratePuzzleButton />
          </CardContent>
        </Card>
        <StepPanel />
        {/* <Button
          onClick={() =>
            console.log(convertBoardToSnapshot(step?.boardSnapshot || []))
          }
        >
          Export board
        </Button> */}
      </div>
    </div>
  );
}

export { App };
