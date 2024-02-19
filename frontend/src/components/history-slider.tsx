import { Slider } from 'dread-ui';
import { useBoard } from '../providers/board-context';

const HistorySlider = () => {
  const { setStep, steps, sliderValue, setSliderValue, isEditing } = useBoard();
  return (
    <Slider
      disabled={steps.length <= 1 || isEditing}
      className='w-auto'
      min={0}
      max={steps.length - 1}
      value={[sliderValue]}
      onValueChange={(e) => {
        const stepIndex = e[0]!;
        const _step = steps[stepIndex]!;
        setSliderValue(stepIndex);
        setStep(_step);
      }}
    />
  );
};

export { HistorySlider };
