import {
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
} from 'dread-ui';
import { useEffect, useState } from 'react';
import { Cell, convertBoardToSnapshot, parseBoard } from './utils';
import {
  hiddenSinglePuzzle,
  nakedPairPuzzle,
  hiddenPairPuzzle,
  nakedTriplePuzzle,
  hiddenTriplePuzzle,
  hiddenQuadPuzzle,
  pointingPairPuzzle,
  pointingTriplePuzzle,
  boxLineReductionPuzzle,
} from './boards';
import { StepPanel } from './components/step-panel';
import { useBoard } from './providers/board-context';
import { FaCheck } from 'react-icons/fa';
import { CellGrid } from './components/cell-grid';
import { StepDescriptionPanel } from './components/step-description-panel';
import { PreviewToggle } from './components/preview-toggle';

type PresetPuzzle =
  | 'nakedTriple'
  | 'hiddenSingle'
  | 'nakedPair'
  | 'hiddenPair'
  | 'hiddenTriple'
  | 'hiddenQuad'
  | 'pointingPair'
  | 'pointingTriple'
  | 'boxLineReduction';

// create a sudoku board with a 9x9 grid of cells, where each cell is a 3x3 grid of cells containing numbers 1-9
function App() {
  const {
    board,
    setBoard,
    steps,
    setStep,
    sliderValue,
    setSliderValue,
    showPreview,
    setShowPreview,
  } = useBoard();
  const [sudokuToLoad, setSudokuToLoad] = useState<string>('');

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

    setBoard(newBoard);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const generatePuzzleWithApi = async () => {
  //   const response = await fetch(
  //     'https://sugoku.onrender.com/board?difficulty=medium',
  //   );
  //   const puzzle = await response.json();
  //   const apiBoard = puzzle.board;
  //   setBoard(parseBoard(apiBoard));
  // };

  const loadPuzzle = (puzzle: PresetPuzzle) => {
    setStep(null);
    switch (puzzle) {
      case 'hiddenSingle':
        setBoard(parseBoard(hiddenSinglePuzzle));
        break;
      case 'nakedPair':
        setBoard(parseBoard(nakedPairPuzzle));
        break;
      case 'nakedTriple':
        setBoard(parseBoard(nakedTriplePuzzle));
        break;
      case 'hiddenPair':
        setBoard(parseBoard(hiddenPairPuzzle));
        break;
      case 'hiddenTriple':
        setBoard(parseBoard(hiddenTriplePuzzle));
        break;
      case 'hiddenQuad':
        setBoard(parseBoard(hiddenQuadPuzzle));
        break;
      case 'pointingPair':
        setBoard(parseBoard(pointingPairPuzzle));
        break;
      case 'pointingTriple':
        setBoard(parseBoard(pointingTriplePuzzle));
        break;
      case 'boxLineReduction':
        setBoard(parseBoard(boxLineReductionPuzzle));
        break;
      default:
        break;
    }
  };

  return (
    <div className='flex h-full w-full items-center justify-center gap-4 border-4 border-white text-black'>
      <div className='flex flex-col gap-2'>
        <PreviewToggle />
        <CellGrid />
        <Card>
          <CardContent noHeader className='p-3'>
            <Slider
              className='w-auto'
              min={0}
              max={steps.length}
              value={[sliderValue]}
              onValueChange={(e) => {
                console.log(e);
                const stepIndex = e[0]!;
                const _step = steps[stepIndex]!;
                setSliderValue(stepIndex);
                setStep(_step);
              }}
            />
          </CardContent>
        </Card>
        <StepDescriptionPanel />
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-nowrap'>
          <Select value={sudokuToLoad} onValueChange={setSudokuToLoad}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Load sudoku'></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='hiddenSingle'>Hidden Single</SelectItem>
              <SelectItem value='nakedPair'>Naked Pair</SelectItem>
              <SelectItem value='nakedTriple'>Naked Triple</SelectItem>
              <SelectItem value='hiddenPair'>Hidden Pair</SelectItem>
              <SelectItem value='hiddenTriple'>Hidden Triple</SelectItem>
              <SelectItem value='hiddenQuad'>Hidden Quad</SelectItem>
              <SelectItem value='pointingPair'>Pointing Pair</SelectItem>
              <SelectItem value='pointingTriple'>Pointing Triple</SelectItem>
              <SelectItem value='boxLineReduction'>
                Box/Line Reduction
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => loadPuzzle(sudokuToLoad as PresetPuzzle)}
            className='h-9 w-9 shrink-0 rounded-l-none rounded-r-full p-0'
          >
            <FaCheck />
          </Button>
        </div>
        <StepPanel />
        <Button onClick={() => console.log(convertBoardToSnapshot(board))}>
          Export board
        </Button>
      </div>
    </div>
  );
}

export { App };
