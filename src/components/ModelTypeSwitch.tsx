import React from 'react';
import * as Switch from '@radix-ui/react-switch';

interface ModelTypeSwitchProps {
  isDetailed: boolean;
  onToggle: (isDetailed: boolean) => void;
}

export const ModelTypeSwitch: React.FC<ModelTypeSwitchProps> = ({ isDetailed, onToggle }) => {
  return (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-medium ${!isDetailed ? 'text-blue-600' : 'text-gray-500'}`}>
        General
      </span>
      <Switch.Root
        className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer"
        checked={isDetailed}
        onCheckedChange={onToggle}
      >
        <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
      <span className={`text-sm font-medium ${isDetailed ? 'text-blue-600' : 'text-gray-500'}`}>
        Detailed
      </span>
    </div>
  );
};