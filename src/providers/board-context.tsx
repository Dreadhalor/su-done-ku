import { createContext, useContext, useState } from 'react';
import { Cell, Step } from '../utils';

type BoardContextType = {
  board: Cell[][];
  setBoard: React.Dispatch<React.SetStateAction<Cell[][]>>;
  step: Step | null;
  setStep: React.Dispatch<React.SetStateAction<Step | null>>;
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
  const [step, setStep] = useState<Step | null>(null);
  return (
    <BoardContext.Provider value={{ board, setBoard, step, setStep }}>
      {children}
    </BoardContext.Provider>
  );
};
