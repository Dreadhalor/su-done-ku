import { useBoard } from '../providers/board-context';
// import { formatCrosshatch, formatHiddenSingles } from '../utils';

const StepDescriptionPanel = () => {
  const { step } = useBoard();
  return (
    <div className='shrink-1 h-24 min-w-0 rounded-md bg-white'>
      {step?.type}
      {/* <br></br>
      {step?.type === 'crosshatch' && formatCrosshatch(step)}
      {step?.type === 'hiddenSingles' && formatHiddenSingles(step)} */}
    </div>
  );
};

export { StepDescriptionPanel };
