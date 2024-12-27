import React, { useState } from 'react';
import { CountrySelection } from './pages/CountrySelection';
import { CategorySelection } from './pages/CategorySelection';
import { ProductDetails } from './pages/ProductDetails';
import { OutputDisplay } from './pages/OutputDisplay';
import { FormState, ProductForm, ClientData } from './types';

function App() {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<FormState>({
    selectedCountry: null,
    selectedCategory: null,
    forms: [],
  });
  const [distributionData, setDistributionData] = useState<Map<string, ClientData[]>>(new Map());

  const handleCountrySelect = (countryId: string) => {
    setFormState(prev => ({ ...prev, selectedCountry: countryId }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormState(prev => ({ ...prev, selectedCategory: categoryId }));
  };

  const handleFormsUpdate = (forms: ProductForm[]) => {
    setFormState(prev => ({ ...prev, forms }));
  };

  const handleDistributionDataUpdate = (formId: string, data: ClientData[]) => {
    setDistributionData(prev => new Map(prev).set(formId, data));
  };

  const handleSubmit = () => {
    setStep(4);
  };

  const moveToStep = (newStep: number) => {
    if (newStep === 3 && formState.forms.length === 0) {
      const initialForm: ProductForm = {
        id: Date.now().toString(),
        baseCode: '',
        scenario: '',
        weekDate: '',
        levelOfSugar: '',
        packGroup: '',
        productRange: '',
        segment: '',
        superSegment: '',
        baseNumberInMultipack: 0,
        flavor: '',
        choco: '',
        salty: '',
        weightPerUnitMl: 0,
        listPricePerUnitMl: 0,
        isMinimized: false,
      };
      setFormState(prev => ({ ...prev, forms: [initialForm] }));
    }
    setStep(newStep);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 && (
        <CountrySelection
          selectedCountry={formState.selectedCountry}
          onSelect={handleCountrySelect}
          onNext={() => moveToStep(2)}
        />
      )}
      
      {step === 2 && (
        <CategorySelection
          selectedCategory={formState.selectedCategory}
          onSelect={handleCategorySelect}
          onNext={() => moveToStep(3)}
          onBack={() => moveToStep(1)}
        />
      )}
      
      {step === 3 && (
        <ProductDetails
          forms={formState.forms}
          distributionData={distributionData}
          onFormsUpdate={handleFormsUpdate}
          onDistributionDataUpdate={handleDistributionDataUpdate}
          onBack={() => moveToStep(2)}
          onSubmit={handleSubmit}
        />
      )}

      {step === 4 && (
        <OutputDisplay
          forms={formState.forms}
          distributionData={distributionData}
          onBack={() => moveToStep(3)}
        />
      )}
    </div>
  );
}

export default App;