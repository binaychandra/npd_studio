import React, { useState, useEffect } from 'react';
import { ProductForm, ProductOutput, ClientData } from '../types';
import { RetailerCard, type RetailerKey } from '../components/RetailerCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { ProductSidebarCard } from '../components/ProductSidebarcard';
import { PredictionChart } from '../components/PredictionChart';
import { RetailerDoughnut } from '../components/DoughnutChart';

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
    console.log('Selected Form similarity data:', selectedForm.similarityData);

    // Always create an output entry, even if there's no prediction data
    const output: ProductOutput = {
      productId: selectedForm.id,
      scenarioName: selectedForm.scenario || `Scenario ${selectedForm.id}`,
      predictionData: selectedForm.predictionData || null,
      similarityData: selectedForm.similarityData || null,
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
          predictionData: form.predictionData || null,
          similarityData: form.similarityData || null,
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
      <div className="flex-1 p-6 overflow-y-auto">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : selectedOutput ? (
          <div className="space-y-6">
            {/* Scenario Title */}
            <div className="bg-white p-2 rounded-xl shadow">
              <h1 className="text-2xl font-semibold text-gray-800">
                {selectedForm?.scenario || 'Unnamed Scenario'}
              </h1>
            </div>

            {/* Retailer Cards Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Top Retailer Sales
                </h2>
                <div className="ml-4 h-px bg-gray-200 flex-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            </section>

            {/* Chart Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Total Market Sales
                </h2>
                <div className="ml-4 h-px bg-gray-200 flex-1" />
              </div>
              
                <div className="flex gap-4">
                <div className="h-[350px] w-[60%]">
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
                  <div className="h-[350px] w-[35%]">
                  {selectedOutput.predictionData ? (
                    <RetailerDoughnut
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
            </section>

            {/* Similarity Basecodes Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Similarity Basecodes
                </h2>
                <div className="ml-4 h-px bg-gray-200 flex-1" />
              </div>
              
              <div className="flex gap-4">
                <div className="h-[350px] w-[50%]">
                  {selectedOutput.similarityData ? (
                    <div className="bg-gray-50 h-full rounded-lg p-4">
                      {/* First similarity graph component would go here */}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No similarity data available
                    </div>
                  )}
                </div>
                <div className="h-[350px] w-[50%]">
                  {selectedOutput.similarityData ? (
                    <div className="bg-gray-50 h-full rounded-lg p-4">
                      {/* Second similarity graph component would go here */}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No similarity data available
                    </div>
                  )}
                </div>
              </div>
            </section>
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