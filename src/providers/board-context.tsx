import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { Cell, Step } from '../utils';

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

  useLayoutEffect(() => {
    setSliderValue(steps.length);
  }, [steps]);

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
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
