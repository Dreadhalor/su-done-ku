import { Button, Checkbox, Label } from 'dread-ui';
import { useBoard } from '../providers/board-context';
import {
  // crossHatch,
  nakedSingles,
  hiddenSingles,
  nakedPairs,
  nakedTriples,
  hiddenPairs,
  nakedQuads,
  crossHatchAsStep,
  executeStep,
} from '../utils';
import { useState } from 'react';
import { cn } from '@repo/utils';

type StepControlProps = {
  id: string;
  checked: boolean;
  name: string;
  onCheckedChange: (checked: boolean) => void;
};
const StepControl = ({
  id,
  checked,
  name,
  onCheckedChange,
}: StepControlProps) => {
  const { step } = useBoard();

  return (
    <div
      className={cn(
        'flex flex-nowrap gap-2',
        step?.type === id && 'bg-yellow-200',
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => {
          if (typeof checked === 'boolean') {
            onCheckedChange(checked);
          }
        }}
      />
      <Label htmlFor={id}>{name}</Label>
    </div>
  );
};

const StepPanel = () => {
  const { board, setBoard, step, setStep } = useBoard();
  const [useNakedSingle, setUseNakedSingle] = useState(false);
  const [useCrossHatch, setUseCrossHatch] = useState(true);
  const [useHiddenSingles, setUseHiddenSingles] = useState(false);
  const [useNakedPairs, setUseNakedPairs] = useState(false);
  const [useNakedTriples, setUseNakedTriples] = useState(false);
  const [useHiddenPairs, setUseHiddenPairs] = useState(false);
  const [useNakedQuads, setUseNakedQuads] = useState(false);
  return (
    <div className='bg-background flex flex-col gap-2 rounded-sm border'>
      <Button
        onClick={() => {
          if (step) {
            setBoard(executeStep(board, step));
            setStep(null);
            return;
          }
          let newBoard = board;
          if (useNakedSingle) newBoard = nakedSingles(newBoard);
          // if (useCrossHatch) newBoard = crossHatch(newBoard);
          if (useCrossHatch) setStep(crossHatchAsStep(newBoard));
          if (useHiddenSingles) newBoard = hiddenSingles(newBoard);
          if (useNakedPairs) newBoard = nakedPairs(newBoard);
          if (useNakedTriples) newBoard = nakedTriples(newBoard);
          if (useHiddenPairs) newBoard = hiddenPairs(newBoard);
          if (useNakedQuads) newBoard = nakedQuads(newBoard);
          setBoard(newBoard);
        }}
      >
        Take step
      </Button>
      <StepControl
        id='nakedSingles'
        checked={useNakedSingle}
        name='Naked Singles'
        onCheckedChange={setUseNakedSingle}
      />
      <StepControl
        id='crosshatch'
        checked={useCrossHatch}
        name='Crosshatch'
        onCheckedChange={setUseCrossHatch}
      />
      <StepControl
        id='hiddenSingles'
        checked={useHiddenSingles}
        name='Hidden Singles'
        onCheckedChange={setUseHiddenSingles}
      />
      <StepControl
        id='nakedPairs'
        checked={useNakedPairs}
        name='Naked Pairs'
        onCheckedChange={setUseNakedPairs}
      />
      <StepControl
        id='nakedTriples'
        checked={useNakedTriples}
        name='Naked Triples'
        onCheckedChange={setUseNakedTriples}
      />
      <StepControl // buggy
        id='hiddenPairs'
        checked={useHiddenPairs}
        name='Hidden Pairs'
        onCheckedChange={setUseHiddenPairs}
      />
      <StepControl
        id='nakedQuads'
        checked={useNakedQuads}
        name='Naked Quads'
        onCheckedChange={setUseNakedQuads}
      />
    </div>
  );
};
export { StepPanel };
