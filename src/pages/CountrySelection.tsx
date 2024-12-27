import React from 'react';
import { SelectionCard } from '../components/SelectionCard';
import { countries } from '../data/countries';

interface CountrySelectionProps {
  selectedCountry: string | null;
  onSelect: (countryId: string) => void;
  onNext: () => void;
}

export const CountrySelection: React.FC<CountrySelectionProps> = ({
  selectedCountry,
  onSelect,
  onNext,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Select Country</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {countries.map((country) => (
          <SelectionCard
            key={country.id}
            {...country}
            imageUrl={country.mapUrl}
            isSelected={selectedCountry === country.id}
            onClick={() => onSelect(country.id)}
          />
        ))}
      </div>
      {selectedCountry && (
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};