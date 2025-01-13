import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { ProductForm, ClientData, AIQueryResponse } from '../types';
import { DistributionChart } from './DistributionChart';
import { queryAI } from '../services/api';

interface ProductDetailsModalProps {
  form: ProductForm;
  distributionData: ClientData[];
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  form,
  distributionData,
  onClose,
}) => {
  const [showAiQuery, setShowAiQuery] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await queryAI(aiQuery);
      if (response.status === 'success') {
        setAiResponse(response.answer);
      } else {
        setAiResponse(response.error || 'Failed to get response');
      }
    } catch (error) {
      setAiResponse('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const formGroups = [
    {
      title: 'Basic Information',
      fields: [
        { label: 'Base Code', value: form.baseCode },
        { label: 'Scenario', value: form.scenario },
        { label: 'Week Date', value: form.weekDate },
        { label: 'Level of Sugar', value: form.levelOfSugar },
      ],
    },
    {
      title: 'Product Classification',
      fields: [
        { label: 'Pack Group', value: form.packGroup },
        { label: 'Product Range', value: form.productRange },
        { label: 'Segment', value: form.segment },
        { label: 'Super Segment', value: form.superSegment },
      ],
    },
    {
      title: 'Product Specifications',
      fields: [
        { label: 'Base Number in Multipack', value: form.baseNumberInMultipack },
        { label: 'Flavor', value: form.flavor },
        { label: 'Chocolate Type', value: form.choco },
        { label: 'Salt Content', value: form.salty },
      ],
    },
    {
      title: 'Pricing and Weight',
      fields: [
        { label: 'Weight per Unit (ml)', value: form.weightPerUnitMl },
        { label: 'List Price per Unit (ml)', value: form.listPricePerUnitMl },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin m-4">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {formGroups.map((group) => (
            <div key={group.title} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">{group.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {group.fields.map((field) => (
                  <div key={field.label}>
                    <span className="text-sm text-gray-600">{field.label}</span>
                    <p className="font-medium">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">AI Assistant</h3>
              <button
                onClick={() => setShowAiQuery(!showAiQuery)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Ask AI for help
              </button>
            </div>
            
            {showAiQuery && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask about this product..."
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
                  />
                  <button
                    onClick={handleAiQuery}
                    disabled={isLoading}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                  >
                    {isLoading ? 'Sending...' : <Send size={16} />}
                  </button>
                </div>
                {aiResponse && (
                  <div className="p-3 bg-white rounded-md">
                    <p className="text-gray-700">{aiResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div> */}

          {distributionData.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Distribution Data</h3>
              <div className="h-64">
                <DistributionChart data={distributionData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};