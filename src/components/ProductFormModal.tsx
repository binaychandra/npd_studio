import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { ProductForm, ClientData } from '../types';
import { FormGroup } from './FormGroup';
import { FormField } from './FormField';
import configYaml from '../config.yaml?raw';
import yaml from 'yaml';
import { CATEGORY_CODES, COUNTRY_CODES } from '../utils/mappings';
import { DistributionSection } from './DistributionSection';
import * as Switch from '@radix-ui/react-switch';
import { queryAI } from '../services/api';

interface ProductFormModalProps {
  form: ProductForm;
  distributionData: ClientData[];
  onUpdate: (form: ProductForm) => void;
  onClose: () => void;
  onSave: () => void;
  onDistributionDataUpdate: (data: ClientData[]) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  form,
  distributionData,
  onUpdate,
  onClose,
  onSave,
  onDistributionDataUpdate,
}) => {
  const [isDetailedModel, setIsDetailedModel] = useState(false);
  const [showAiQuery, setShowAiQuery] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sugarLevelOptions, setSugarLevelOptions] = useState<string[]>([]);
  const [packGroupOptions, setPackGroupOptions] = useState<string[]>([]);
  const [productRangeOptions, setProductRangeOptions] = useState<string[]>([]);
  const [segmentOptions, setSegmentOptions] = useState<string[]>([]);
  const [superSegmentOptions, setSuperSegmentOptions] = useState<string[]>([]);
  const [baseNumberInMultipackOptions, setBaseNumberInMultipackOptions] = useState<string[]>([]);
  const [flavorOptions, setFlavorOptions] = useState<string[]>([]);
  const [chocoOptions, setChocoOptions] = useState<string[]>([]);
  const [saltyOptions, setSaltyOptions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const config = yaml.parse(configYaml);
      const countryCode = COUNTRY_CODES[form.country as keyof typeof COUNTRY_CODES] || 'GB01';
      const categoryCode = CATEGORY_CODES[form.category as keyof typeof CATEGORY_CODES] || 'EUCO';

      // Helper function to get sorted options from config
      const getSortedOptions = (key: string): string[] => {
        const options = config[countryCode]?.[categoryCode]?.[key];
        if (options && Array.isArray(options) && options.length > 0) {
          return [...options].sort() as string[];
        }
        return [];
      };

      // Get all options from the appropriate category section
      setSugarLevelOptions(getSortedOptions('level_of_sugar'));
      setPackGroupOptions(getSortedOptions('pack_group'));
      setProductRangeOptions(getSortedOptions('product_range'));
      setSegmentOptions(getSortedOptions('segment'));
      setSuperSegmentOptions(getSortedOptions('supersegment'));
      setBaseNumberInMultipackOptions(getSortedOptions('base_number_in_multipack'));
      setFlavorOptions(getSortedOptions('flavour')); // Note the different spelling in config
      setChocoOptions(getSortedOptions('choco'));
      setSaltyOptions(getSortedOptions('salty'));
      
    } catch (error) {
      console.error('Error parsing config:', error);
      setSugarLevelOptions([]);
      setPackGroupOptions([]);
      setProductRangeOptions([]);
      setSegmentOptions([]);
      setSuperSegmentOptions([]);
      setBaseNumberInMultipackOptions([]);
      setFlavorOptions([]);
      setChocoOptions([]);
      setSaltyOptions([]);
    }
  }, [form.country, form.category]);

  const handleDetailedModelToggle = (checked: boolean) => {
    setIsDetailedModel(checked);
    onUpdate({
      ...form,
      isDetailedModel: checked,
    });
  };

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await queryAI(aiQuery);
      if (response.status === 'success' && response.data) {
        onUpdate({
          ...form,
          ...response.data
        });
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
      setShowAiQuery(false);
    }
  };

  const handleChange = (field: keyof ProductForm, value: string) => {
    onUpdate({
      ...form,
      [field]: (field.includes('weight') || field.includes('price'))
        ? Number(value) || 0
        : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] m-4 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold">Product Details</h2>          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow scrollbar-thin">
            <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex items-center gap-4">
              {!showAiQuery ? (              <button
                onClick={() => setShowAiQuery(true)}
                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 text-sm font-medium group"
                aria-label="Open AI Assistant"
                title="Open AI Assistant"
              >
                <span className="opacity-90">AI Assistant</span>
                <div className="w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Send size={12} className="text-blue-600" />
                </div>
              </button>
              ) : (
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 w-[440px] transition-all">
                <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="How can I help you with this product?"
                className="flex-1 px-4 py-2.5 rounded-l-lg focus:outline-none text-sm text-gray-600"
                onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                />
                <div className="border-l border-gray-200">                <button
                  onClick={handleAiQuery}
                  disabled={isLoading}
                  className="px-4 py-2.5 text-blue-600 hover:bg-gray-50 rounded-r-lg transition-all disabled:text-gray-300 h-full"
                  aria-label="Submit AI query"
                  title="Submit AI query"
                >
                  {isLoading ? 
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true"/> : 
                  <Send size={16} className="transform hover:translate-x-1 transition-transform" aria-hidden="true"/>
                  }
                </button>
                </div>
              </div>
              )}
            </div>

            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
              <span className="text-gray-500 text-sm font-medium">Model Type:</span>
              <span className={`text-sm ${!isDetailedModel ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              General
              </span>
              <Switch.Root
              className="w-[44px] h-[26px] bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-500 outline-none cursor-pointer transition-colors duration-200"
              checked={isDetailedModel}
              onCheckedChange={handleDetailedModelToggle}
              >
              <Switch.Thumb className="block w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[20px]" />
              </Switch.Root>
              <span className={`text-sm ${isDetailedModel ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              Detailed
              </span>
            </div>
            </div>

          <div className="space-y-6">
            <FormGroup title="Basic Information">
              <FormField
                label="Base Code"
                value={form.baseCode}
                onChange={(value) => handleChange('baseCode', value)}
              />
              <FormField
                label="Scenario"
                value={form.scenario}
                onChange={(value) => handleChange('scenario', value)}
              />
              <FormField
                label="Week Date"
                type="date"
                value={form.weekDate}
                onChange={(value) => handleChange('weekDate', value)}
              />
              <FormField
                label="Level of Sugar"
                type="select"
                value={form.levelOfSugar}
                onChange={(value) => handleChange('levelOfSugar', value)}
                options={sugarLevelOptions}
              />
            </FormGroup>

            {isDetailedModel && (
              <DistributionSection 
                distributionData={distributionData}
                onDistributionDataUpdate={onDistributionDataUpdate}
              />
            )}

            <FormGroup title="Product Classification">
              <FormField
                label="Pack Group"
                type="select"
                value={form.packGroup}
                onChange={(value) => handleChange('packGroup', value)}
                options={packGroupOptions}
              />
              <FormField
                label="Product Range"
                type="select"
                value={form.productRange}
                onChange={(value) => handleChange('productRange', value)}
                options={productRangeOptions}
              />
              <FormField
                label="Segment"
                type="select"
                value={form.segment}
                onChange={(value) => handleChange('segment', value)}
                options={segmentOptions}
              />
              <FormField
                label="Super Segment"
                type="select"
                value={form.superSegment}
                onChange={(value) => handleChange('superSegment', value)}
                options={superSegmentOptions}
              />
            </FormGroup>            <FormGroup title="Product Specifications">
              <FormField
                label="Base Number in Multipack"
                type="select"
                value={form.baseNumberInMultipack}
                onChange={(value) => handleChange('baseNumberInMultipack', value)}
                options={baseNumberInMultipackOptions}
              />
              <FormField
                label="Flavor"
                type="select"
                value={form.flavor}
                onChange={(value) => handleChange('flavor', value)}
                options={flavorOptions}
              />
              <FormField
                label="Chocolate Type"
                type="select"
                value={form.choco}
                onChange={(value) => handleChange('choco', value)}
                options={chocoOptions}
              />
              <FormField
                label="Salt Content"
                type="select"
                value={form.salty}
                onChange={(value) => handleChange('salty', value)}
                options={saltyOptions}
              />
            </FormGroup>

            <FormGroup title="Pricing and Weight">
              <FormField
                label="Weight per Unit (ml)"
                type="number"
                value={form.weightPerUnitMl}
                onChange={(value) => handleChange('weightPerUnitMl', value)}
              />
              <FormField
                label="List Price per Unit (ml)"
                type="number"
                value={form.listPricePerUnitMl}
                onChange={(value) => handleChange('listPricePerUnitMl', value)}
              />
            </FormGroup>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-4 flex-shrink-0">          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Cancel"
            title="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            aria-label="Save"
            title="Save"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};