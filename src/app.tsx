import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'dread-ui';
import { useEffect, useState } from 'react';
import { Cell, parseBoard } from './utils';
import {
  hiddenSingle,
  nakedPair,
  hiddenPair,
  nakedTriple,
  hiddenTriple,
  hiddenQuad,
  pointingPair,
} from './boards';
import { StepPanel } from './components/step-panel';
import { useBoard } from './providers/board-context';
import { FaCheck } from 'react-icons/fa';
import { CellGrid } from './components/cell-grid';
import { StepDescriptionPanel } from './components/step-description-panel';

type PresetPuzzle =
  | 'nakedTriple'
  | 'hiddenSingle'
  | 'nakedPair'
  | 'hiddenPair'
  | 'hiddenTriple'
  | 'hiddenQuad'
  | 'pointingPair';

// create a sudoku board with a 9x9 grid of cells, where each cell is a 3x3 grid of cells containing numbers 1-9
function App() {
  const { setBoard } = useBoard();
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
    switch (puzzle) {
      case 'hiddenSingle':
        setBoard(parseBoard(hiddenSingle));
        break;
      case 'nakedPair':
        setBoard(parseBoard(nakedPair));
        break;
      case 'nakedTriple':
        setBoard(parseBoard(nakedTriple));
        break;
      case 'hiddenPair':
        setBoard(parseBoard(hiddenPair));
        break;
      case 'hiddenTriple':
        setBoard(parseBoard(hiddenTriple));
        break;
      case 'hiddenQuad':
        setBoard(parseBoard(hiddenQuad));
        break;
      case 'pointingPair':
        setBoard(parseBoard(pointingPair));
        break;
      default:
        break;
    }
  };

  return (
    <div className='flex h-full w-full items-center justify-center gap-4 border-4 border-white text-black'>
      <div className='flex flex-col gap-2'>
        <CellGrid />
        <StepDescriptionPanel />
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-nowrap'>
          <Select value={sudokuToLoad} onValueChange={setSudokuToLoad}>
            <SelectTrigger className='w-[150px]'>
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
      </div>
    </div>
  );
}

export { App };
