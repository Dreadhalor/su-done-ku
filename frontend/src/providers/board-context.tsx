import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Cell, CellValue, Step, executeStep, parseAPIBoard } from '../utils';
import { editCell as _editCell } from '../utils/index';
import { ApiResponseBody } from '@repo/su-done-ku-backend/src/routes/random';

type BoardContextType = {
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
  isErrored: boolean;
  generatePuzzleWithApi: (difficulty?: string) => void;
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
  const [step, setStep] = useState<Step | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isErrored, setIsErrored] = useState<boolean>(false);

  useEffect(() => {
    if (step) {
      setIsSolved(
        executeStep(step).every((row) =>
          row.every((cell) => cell.hintValues.length === 1),
        ) || false,
      );
      setIsErrored(
        executeStep(step).some((row) =>
          row.some((cell) => cell.hintValues.length === 0),
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

  const generatePuzzleWithApi = async (difficulty?: string) => {
    const response = (await fetch(
      `http://localhost:3000/api/puzzle/random${
        difficulty ? `?difficulty=${difficulty}` : ''
      }`,
    ).then((res) => res.json())) as ApiResponseBody;
    const puzzle = parseAPIBoard(response);
    const initStep: Step = {
      type: 'start',
      boardSnapshot: JSON.parse(JSON.stringify(puzzle)),
      eliminations: [],
    };
    console.log(initStep);
    resetSteps();
    addStep(initStep);
  };

  return (
    <BoardContext.Provider
      value={{
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
        isErrored,
        generatePuzzleWithApi,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
