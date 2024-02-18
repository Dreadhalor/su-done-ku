import { Button, Checkbox, Label } from 'dread-ui';
import { useBoard } from '../providers/board-context';
import { executeStep, strategies } from '../utils';
import { useState } from 'react';
import { cn } from '@repo/utils';
import { Strategy } from '../utils/algorithms';

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
  const { step, addStep } = useBoard();
  const [strategyStates, setStrategyStates] = useState({
    crosshatch: true,
    hiddenSingles: false,
    nakedPairs: false,
    nakedTriples: false,
    hiddenPairs: false,
    hiddenTriples: false,
    nakedQuads: false,
    hiddenQuads: false,
    pointingPairs: false,
    pointingTriples: false,
    boxLineReduction: false,
  });
  const handleStrategyChange = (strategy: string) => (checked: boolean) => {
    setStrategyStates((prev) => ({ ...prev, [strategy]: checked }));
  };

  const advanceStep = () => {
    const strategyOrder = Object.keys(strategyStates);
    const currentStrategyIndex = strategyOrder.indexOf(step?.type || '');
    const nextStrategy = strategyOrder.find(
      (strategy, index) =>
        index > currentStrategyIndex && strategyStates[strategy as Strategy],
    );

    if (step) {
      const newBoard = executeStep(step);
      if (nextStrategy) {
        addStep(strategies[nextStrategy as Strategy](newBoard));
      } else {
        addStep({ type: 'manual', boardSnapshot: newBoard, eliminations: [] });
      }
    }
  };

  return (
    <div className='bg-background flex flex-col gap-2 rounded-sm border'>
      <Button onClick={() => advanceStep()}>Take step</Button>
      {Object.entries(strategyStates).map(([strategy, checked]) => (
        <StepControl
          key={strategy}
          id={strategy}
          checked={checked}
          name={strategy}
          onCheckedChange={handleStrategyChange(strategy)}
        />
      ))}
    </div>
  );
};
export { StepPanel };
