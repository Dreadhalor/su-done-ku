import {
  Badge,
  BadgeVariants,
  Button,
  Card,
  CardContent,
  Checkbox,
  Label,
} from 'dread-ui';
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
  const failed = step?.failedStrategies?.includes(id as Strategy);
  const skipped = step?.skippedStrategies?.includes(id as Strategy);
  const variant: BadgeVariants = failed
    ? 'destructive'
    : skipped
      ? 'caution'
      : 'default';

  return (
    <div
      className={cn(
        'flex h-8 flex-nowrap items-center gap-2 px-2',
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
      <div className='ml-auto'>
        {(skipped || failed) && (
          <Badge variant={variant}>
            {failed && 'failed'}
            {skipped && 'skipped'}
          </Badge>
        )}
      </div>
    </div>
  );
};

const StepPanel = () => {
  const { step, addStep, isSolved } = useBoard();
  const [strategyStates, setStrategyStates] = useState({
    crosshatch: true,
    hiddenSingles: true,
    nakedPairs: true,
    nakedTriples: true,
    hiddenPairs: true,
    hiddenTriples: true,
    nakedQuads: true,
    hiddenQuads: true,
    pointingPairs: true,
    pointingTriples: true,
    boxLineReduction: true,
  });
  const handleStrategyChange = (strategy: string) => (checked: boolean) => {
    setStrategyStates((prev) => ({ ...prev, [strategy]: checked }));
  };

  const advanceStep = () => {
    // iterate through strategies & execute all checked strategies until one makes an elimination
    const board = executeStep(step!);
    const failedStrategies: Strategy[] = [];
    const skippedStrategies: Strategy[] = [];
    for (const [strategy, checked] of Object.entries(strategyStates)) {
      if (checked) {
        const newStep = strategies[strategy as Strategy](board);
        if (newStep.eliminations.length > 0) {
          addStep({
            ...newStep,
            failedStrategies,
            skippedStrategies,
          });
          return;
        } else failedStrategies.push(strategy as Strategy);
      } else skippedStrategies.push(strategy as Strategy);
    }
    // if no eliminations are made, execute a step with no eliminations
    addStep({
      type: 'none',
      boardSnapshot: board,
      eliminations: [],
      failedStrategies,
      skippedStrategies,
    });
  };

  return (
    <Card className='w-[250px]'>
      <CardContent noHeader className='flex flex-col justify-center p-1'>
        <Button
          className='mb-2 rounded-lg'
          onClick={() => advanceStep()}
          disabled={isSolved}
        >
          {isSolved ? 'Solved!' : 'Take Step'}
        </Button>
        {Object.entries(strategyStates).map(([strategy, checked]) => (
          <StepControl
            key={strategy}
            id={strategy}
            checked={checked}
            name={strategy}
            onCheckedChange={handleStrategyChange(strategy)}
          />
        ))}
      </CardContent>
    </Card>
  );
};
export { StepPanel };
