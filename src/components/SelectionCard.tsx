import React from 'react';

interface SelectionCardProps {
  id: string;
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  name,
  imageUrl,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-lg shadow-md transition-all h-full ${
        isSelected
          ? 'border-2 border-blue-500 bg-blue-50'
          : 'border border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="aspect-video relative overflow-hidden rounded-md mb-3">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="text-lg font-semibold text-center">{name}</h3>
    </div>
  );
};