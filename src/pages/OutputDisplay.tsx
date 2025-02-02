import React, { useState, useEffect } from 'react';
import { ProductForm, ProductOutput, ClientData } from '../types';
import { RetailerCard, type RetailerKey } from '../components/RetailerCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { ProductSidebarCard } from '../components/ProductSidebarcard';
import { PredictionChart } from '../components/PredictionChart';

interface OutputDisplayProps {
  forms: ProductForm[];
  distributionData: Map<string, ClientData[]>;
  onBack: () => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  forms,
  distributionData,
  onBack,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [outputData, setOutputData] = useState<ProductOutput[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProductSelect = (productId: string) => {
    console.log('Selecting product:', productId);
    setSelectedProductId(productId);
    const selectedForm = forms.find(f => f.id === productId);
    if (!selectedForm) {
      setError('Selected product not found');
      return;
    }
    console.log('Selected Form:', selectedForm);
    console.log('Selected Form prediction data:', selectedForm.predictionData);

    // Always create an output entry, even if there's no prediction data
    const output: ProductOutput = {
      productId: selectedForm.id,
      scenarioName: selectedForm.scenario || `Scenario ${selectedForm.id}`,
      predictionData: selectedForm.predictionData || null
    };
    setOutputData(prev => {
      const existing = prev.filter(p => p.productId !== productId);
      return [...existing, output];
    });

    // Clear any previous errors
    setError(null);
  };

  const selectedOutput = outputData.find(o => o.productId === selectedProductId);
  const selectedForm = forms.find(f => f.id === selectedProductId);

  // Initialize output data from forms and select first product
  useEffect(() => {
    console.log('Forms received in OutputDisplay:', forms);
    if (forms.length > 0) {
      // Set the first product as selected if none is selected
      if (!selectedProductId) {
        handleProductSelect(forms[0].id);
      }
      
      // Update output data for all forms, including those without prediction data
      const outputs = forms.map(form => {
        console.log(`Processing form ${form.id}:`, form);
        console.log(`Form ${form.id} prediction data:`, form.predictionData);
        
        return {
          productId: form.id,
          scenarioName: form.scenario || `Scenario ${form.id}`,
          predictionData: form.predictionData || null
        };
      });
      
      console.log('Setting output data for all forms:', outputs);
      setOutputData(outputs);
    }
  }, [forms]);

  // Log when output data changes
  useEffect(() => {
    console.log('Output data updated:', outputData);
  }, [outputData]);

  // Log when selected output changes
  useEffect(() => {
    console.log('Selected output:', selectedOutput);
  }, [selectedOutput]);

  return (
    <div className="min-h-screen bg-gray-50 flex fixed inset-0">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">Products</h2>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          {forms.map((form) => (
            <ProductSidebarCard
              key={form.id}
              product={form}
              isActive={selectedProductId === form.id}
              onSelect={() => handleProductSelect(form.id)}
              onViewDetails={() => {
                setSelectedProductId(form.id);
                setShowDetailsModal(true);
              }}
            />
          ))}
        </div>
        <div className="p-4 border-t mt-auto flex-shrink-0">
          <button
            onClick={onBack}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Back to Forms
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : selectedOutput ? (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow flex-1 min-h-0">
              <h2 className="text-xl font-semibold mb-4">
                {selectedForm?.scenario || 'Unnamed Scenario'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {selectedForm?.predictionData && Object.keys(selectedForm.predictionData)
                  .filter((retailer): retailer is RetailerKey => retailer !== 'TOTAL_MARKET')
                  .map((retailer) => (
                    <RetailerCard
                      key={retailer}
                      retailer={retailer}
                      data={selectedForm.predictionData!}
                    />
                  ))}
              </div>
              <div className="h-[350px] overflow-hidden flex">
                <div className="w-[60%]">
                {selectedOutput.predictionData ? (
                  <PredictionChart
                    data={selectedOutput.predictionData}
                    scenarioName={selectedOutput.scenarioName}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No prediction data available for this product
                  </div>
                )}
              </div>
                </div>
              {/* <div className="text-sm text-gray-500 mt-2">
                <h3 className="font-semibold mb-2">Raw Data:</h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(selectedOutput.predictionData || {}, null, 2)}
                </pre>
              </div> */}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Select a product to view predictions
          </div>
        )}
      </div>

      {showDetailsModal && selectedForm && (
        <ProductDetailsModal
          form={selectedForm}
          distributionData={distributionData.get(selectedForm.id) || []}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );

  useEffect(() => {
    console.log('selectedOutput:', selectedOutput);
    console.log('selectedOutput.predictionData:', selectedOutput?.predictionData);
  }, [selectedOutput]);
};