import React from 'react';
import * as Slider from '@radix-ui/react-slider';

interface DistributionTunerProps {
  month: string;
  value: number;
  onChange: (value: number) => void;
}

export const DistributionTuner: React.FC<DistributionTunerProps> = ({
  month,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-4 p-2">
      <span className="w-24 text-sm font-medium">{month}</span>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        max={100}
        step={1}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Distribution"
        />
      </Slider.Root>
      <span className="w-12 text-sm text-right">{value}%</span>
    </div>
  );
};