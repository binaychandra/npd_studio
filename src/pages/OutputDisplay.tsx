import React, { useState, useEffect } from 'react';
import { ProductForm, ProductOutput, ClientData } from '../types';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { ProductSidebarCard } from '../components/ProductSidebarCard';
import { PredictionChart } from '../components/PredictionChart';
import { fetchProductData } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProductSelect = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedProductId(productId);

      const selectedForm = forms.find(f => f.id === productId);
      if (!selectedForm) {
        throw new Error('Selected product not found');
      }

      const data = await fetchProductData(productId, selectedForm.weekDate || '');
      setOutputData(prev => {
        const existing = prev.filter(p => p.productId !== productId);
        return [...existing, data];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product data');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-select first product on initial load
  useEffect(() => {
    if (forms.length > 0 && !selectedProductId) {
      handleProductSelect(forms[0].id);
    }
  }, [forms]);

  const selectedOutput = outputData.find(o => o.productId === selectedProductId);
  const selectedForm = forms.find(f => f.id === selectedProductId);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col h-screen">
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
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : selectedOutput ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {selectedForm?.scenario || 'Unnamed Scenario'}
              </h2>
              <div className="h-[400px]">
                <PredictionChart
                  data={selectedOutput.weeklyData}
                  scenarioName={selectedOutput.scenarioName}
                />
              </div>
            </div>
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
}