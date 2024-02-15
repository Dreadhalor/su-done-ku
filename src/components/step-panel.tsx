import { Button, Checkbox, Label } from 'dread-ui';
import { useBoard } from '../providers/board-context';
import { executeStep, strategies } from '../utils';
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
  const {
    crosshatch,
    hiddenSingles,
    nakedPairs,
    nakedTriples,
    hiddenPairs,
    hiddenTriples,
    nakedQuads,
    hiddenQuads,
    pointingPairs,
  } = strategies;
  const [useCrossHatch, setUseCrossHatch] = useState(true);
  const [useHiddenSingles, setUseHiddenSingles] = useState(false);
  const [useNakedPairs, setUseNakedPairs] = useState(false);
  const [useNakedTriples, setUseNakedTriples] = useState(false);
  const [useHiddenPairs, setUseHiddenPairs] = useState(false);
  const [useHiddenTriples, setUseHiddenTriples] = useState(false);
  const [useNakedQuads, setUseNakedQuads] = useState(false);
  const [useHiddenQuads, setUseHiddenQuads] = useState(false);
  const [usePointingPairs, setUsePointingPairs] = useState(false);
  const advanceStep = () => {
    if (step) {
      setBoard((prevBoard) => executeStep(prevBoard, step));
      if (step.type === 'crosshatch' && useHiddenSingles) {
        setStep(hiddenSingles(board));
      } else if (step.type === 'hiddenSingles' && useNakedPairs) {
        setStep(nakedPairs(board));
      } else if (step.type === 'nakedPairs' && useNakedTriples) {
        setStep(nakedTriples(board));
      } else if (step.type === 'nakedTriples' && useHiddenPairs) {
        setStep(hiddenPairs(board));
      } else if (step.type === 'hiddenPairs' && useHiddenTriples) {
        setStep(hiddenTriples(board));
      } else if (step.type === 'hiddenTriples' && useNakedQuads) {
        setStep(nakedQuads(board));
      } else if (step.type === 'nakedQuads' && useHiddenQuads) {
        setStep(hiddenQuads(board));
      } else if (step.type === 'hiddenQuads' && usePointingPairs) {
        setStep(pointingPairs(board));
      } else setStep(null);
    } else if (useCrossHatch) setStep(crosshatch(board));
    else if (useHiddenSingles) setStep(hiddenSingles(board));
    else if (useNakedPairs) setStep(nakedPairs(board));
    else if (useNakedTriples) setStep(nakedTriples(board));
    else if (useHiddenPairs) setStep(hiddenPairs(board));
    else if (useHiddenTriples) setStep(hiddenTriples(board));
    else if (useNakedQuads) setStep(nakedQuads(board));
    else if (useHiddenQuads) setStep(hiddenQuads(board));
    else if (usePointingPairs) setStep(pointingPairs(board));
  };
  return (
    <div className='bg-background flex flex-col gap-2 rounded-sm border'>
      <Button onClick={() => advanceStep()}>Take step</Button>
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
      <StepControl
        id='hiddenPairs'
        checked={useHiddenPairs}
        name='Hidden Pairs'
        onCheckedChange={setUseHiddenPairs}
      />
      <StepControl
        id='hiddenTriples'
        checked={useHiddenTriples}
        name='Hidden Triples'
        onCheckedChange={setUseHiddenTriples}
      />
      <StepControl
        id='nakedQuads'
        checked={useNakedQuads}
        name='Naked Quads'
        onCheckedChange={setUseNakedQuads}
      />
      <StepControl
        id='hiddenQuads'
        checked={useHiddenQuads}
        name='Hidden Quads'
        onCheckedChange={setUseHiddenQuads}
      />
      <StepControl
        id='pointingPairs'
        checked={usePointingPairs}
        name='Pointing Pairs'
        onCheckedChange={setUsePointingPairs}
      />
    </div>
  );
};
export { StepPanel };
