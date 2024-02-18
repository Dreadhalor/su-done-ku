import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Cell, CellValue, Step, executeStep } from '../utils';
import { editCell as _editCell } from '../utils/index';

type BoardContextType = {
  board: Cell[][];
  setBoard: React.Dispatch<React.SetStateAction<Cell[][]>>;
  visibleBoard: Cell[][];
  setVisibleBoard: React.Dispatch<React.SetStateAction<Cell[][]>>;
  step: Step | null;
  setStep: React.Dispatch<React.SetStateAction<Step | null>>;
  steps: Step[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  resetSteps: () => void;
  addStep: (newStep: Step) => void;
  editCell: (cell: Cell, hintValue: CellValue, enabled: boolean) => void;
  isSolved: boolean;
};

export const BoardContext = createContext<BoardContextType>(
  {} as BoardContextType,
);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

type BoardProviderProps = {
  children: React.ReactNode;
};
export const BoardProvider = ({ children }: BoardProviderProps) => {
  const [board, setBoard] = useState<Cell[][]>([[]]);
  const [visibleBoard, setVisibleBoard] = useState<Cell[][]>([[]]);
  const [step, setStep] = useState<Step | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    if (step) {
      setIsSolved(
        executeStep(step).every((row) =>
          row.every((cell) => cell.hintValues.length === 1),
        ) || false,
      );
    }
  }, [step]);

  useLayoutEffect(() => {
    setSliderValue(steps.length);
  }, [steps]);

  const resetSteps = () => {
    setSteps(() => []);
  };
  const addStep = (newStep: Step) => {
    setSteps((prev) => {
      const newSteps = prev
        .slice(0, sliderValue + 1)
        // make sure to remove any filler steps that are being overwritten
        .filter((s) => s.type !== 'none');
      return [...newSteps, newStep];
    });
    setStep(newStep);
  };

  const editCell = (cell: Cell, hintValue: CellValue, enabled: boolean) => {
    const _step = _editCell(executeStep(step!), cell, hintValue, enabled);
    if ((_step.additions?.length ?? 0) > 0 || _step.eliminations?.length > 0)
      addStep(_step);
  };

  // useLayoutEffect(() => {
  //   if (showPreview) {
  //     setBoard(step?.boardSnapshot || [[]]);
  //   }
  // }, [step, showPreview]);

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
        visibleBoard,
        setVisibleBoard,
        step,
        setStep,
        steps,
        setSteps,
        showPreview,
        setShowPreview,
        sliderValue,
        setSliderValue,
        resetSteps,
        addStep,
        editCell,
        isSolved,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
