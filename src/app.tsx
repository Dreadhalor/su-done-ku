import { cn } from '@repo/utils';
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
import { hiddenSingle, nakedPair, hiddenPair, nakedTriple } from './boards';
import { StepPanel } from './components/step-panel';
import { useBoard } from './providers/board-context';
import { FaCheck } from 'react-icons/fa';
import { CellGrid } from './components/cell-grid';

type PresetPuzzle = 'nakedTriple' | 'hiddenSingle' | 'nakedPair' | 'hiddenPair';

// create a sudoku board with a 9x9 grid of cells, where each cell is a 3x3 grid of cells containing numbers 1-9
function App() {
  const { board, setBoard } = useBoard();
  const [sudokuToLoad, setSudokuToLoad] = useState<string>('');

  useEffect(() => {
    const newBoard: Cell[][] = Array.from({ length: 9 }).map((_, rowIndex) =>
      Array.from({ length: 9 }).map(
        (_, columnIndex) =>
          ({
            value: null,
            hintValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            rowIndex,
            columnIndex,
            boxIndex:
              Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3),
            isLocked: false,
          }) as Cell,
      ),
    );

    newBoard[4]![5]!.value = 1;

    setBoard(newBoard);
  }, []);

  const generatePuzzle = () => {
    // generate a solved puzzle
    const solvedPuzzle: Cell[][] = Array.from({ length: 9 }).map(
      (_, rowIndex) =>
        Array.from({ length: 9 }).map(
          (_, columnIndex) =>
            ({
              value:
                ((rowIndex * 3 + Math.floor(rowIndex / 3) + columnIndex) % 9) +
                1,
              hintValues: [],
              rowIndex,
              columnIndex,
              boxIndex:
                Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3),
              isLocked: true,
            }) as Cell,
        ),
    );

    // remove a random number of cells from the solved puzzle
    const puzzle: Cell[][] = solvedPuzzle.map((row) =>
      row.map((cell) =>
        Math.random() < 0.5
          ? {
              ...cell,
              value: null,
              isLocked: false,
              hintValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            }
          : cell,
      ),
    );

    setBoard(puzzle);
  };

  const generatePuzzleWithApi = async () => {
    const response = await fetch(
      'https://sugoku.onrender.com/board?difficulty=medium',
    );
    const puzzle = await response.json();
    const apiBoard = puzzle.board;
    setBoard(parseBoard(apiBoard));
  };

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
      default:
        break;
    }
  };

  return (
    <div className='flex h-full w-full items-center justify-center gap-4 border-4 border-white text-black'>
      <CellGrid />
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
