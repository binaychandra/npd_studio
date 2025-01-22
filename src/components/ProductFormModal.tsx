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

  useEffect(() => {
    try {
      const config = yaml.parse(configYaml);
      const countryCode = COUNTRY_CODES[form.country as keyof typeof COUNTRY_CODES] || 'GB01';
      const categoryCode = CATEGORY_CODES[form.category as keyof typeof CATEGORY_CODES] || 'EUCO';

      // Get sugar level options from the appropriate category section
      const levelOfSugar = config[countryCode]?.[categoryCode]?.level_of_sugar;
      if (levelOfSugar) {
        const options = Object.values(levelOfSugar).flat() as string[];
        setSugarLevelOptions(options);
      } else {
        setSugarLevelOptions([]);
      }

      // Get packgroup from the appropriate category section
      const packGroup = config[countryCode]?.[categoryCode]?.pack_group;
      if (packGroup) {
        const options_pg = Object.values(packGroup).flat() as string[];
        setPackGroupOptions(options_pg);
      } else {
        setPackGroupOptions([]);
      }

      // Get product range from the appropriate category section
      const productRange = config[countryCode]?.[categoryCode]?.product_range;
      if (productRange) {
        const options_pr = Object.values(productRange).flat() as string[];
        setProductRangeOptions(options_pr);
      } else {
        setProductRangeOptions([]);
      }

      // Get segment from the appropriate category section
      const segment = config[countryCode]?.[categoryCode]?.segment;
      if (segment) {
        const options_sg = Object.values(segment).flat() as string[];
        setSegmentOptions(options_sg);
      } else {
        setSegmentOptions([]);
      }

      // Get super segment from the appropriate category section
      const superSegment = config[countryCode]?.[categoryCode]?.supersegment;
      if (superSegment) {
        const options_ssg = Object.values(superSegment).flat() as string[];
        setSuperSegmentOptions(options_ssg);
      } else {
        setSuperSegmentOptions([]);
      }

    } catch (error) {
      console.error('Error parsing config:', error);
      setSugarLevelOptions([]);
      setPackGroupOptions([]);
      setProductRangeOptions([]);
      setSegmentOptions([]);
      setSuperSegmentOptions([]);
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
      [field]: field.includes('number') || field.includes('weight') || field.includes('price')
        ? Number(value) || 0
        : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] m-4 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow scrollbar-thin">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAiQuery(!showAiQuery)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
              >
                Ask AI
              </button>
              {showAiQuery && (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask about this product..."
                    className="w-[300px] px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                  />
                  <button
                    onClick={handleAiQuery}
                    disabled={isLoading}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded-md transition-colors disabled:text-gray-400"
                  >
                    {isLoading ? '...' : <Send size={16} />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm ${!isDetailedModel ? 'text-blue-600' : 'text-gray-500'}`}>
                General
              </span>
              <Switch.Root
                className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer"
                checked={isDetailedModel}
                onCheckedChange={handleDetailedModelToggle}
              >
                <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
              <span className={`text-sm ${isDetailedModel ? 'text-blue-600' : 'text-gray-500'}`}>
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
            </FormGroup>

            <FormGroup title="Product Specifications">
              <FormField
                label="Base Number in Multipack"
                value={form.baseNumberInMultipack}
                onChange={(value) => handleChange('baseNumberInMultipack', value)}
              />
              <FormField
                label="Flavor"
                value={form.flavor}
                onChange={(value) => handleChange('flavor', value)}
              />
              <FormField
                label="Chocolate Type"
                value={form.choco}
                onChange={(value) => handleChange('choco', value)}
              />
              <FormField
                label="Salt Content"
                value={form.salty}
                onChange={(value) => handleChange('salty', value)}
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

        <div className="p-4 border-t flex justify-end gap-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};