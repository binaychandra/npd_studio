import React from 'react';
import { SelectionCard } from '../components/SelectionCard';
import { categories } from '../data/categories';

interface CategorySelectionProps {
  selectedCategory: string | null;
  onSelect: (categoryId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategory,
  onSelect,
  onNext,
  onBack,
}) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Select Category</h1>
      <div className="flex justify-center">
        <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 mb-8 snap-x max-w-fit">
          {categories.map((category) => (
            <div key={category.id} className="flex-none w-64 snap-start">
              <SelectionCard
                {...category}
                isSelected={selectedCategory === category.id}
                onClick={() => onSelect(category.id)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        {selectedCategory && (
          <button
            onClick={onNext}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};