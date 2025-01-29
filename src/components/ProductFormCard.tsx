import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { ProductForm, ClientData } from '../types';
import { FormGroup } from './FormGroup';
import { FormField } from './FormField';
import { CSVUploader } from './CSVUploader';
import { DistributionChart } from './DistributionChart';

interface ProductFormCardProps {
  form: ProductForm;
  distributionData: ClientData[];
  onUpdate: (updatedForm: ProductForm) => void;
  onDelete: () => void;
  onToggleMinimize: () => void;
  onDistributionDataUpdate: (data: ClientData[]) => void;
}

export const ProductFormCard: React.FC<ProductFormCardProps> = ({
  form,
  distributionData,
  onUpdate,
  onDelete,
  onToggleMinimize,
  onDistributionDataUpdate,
}) => {
  const [isDetailedModel, setIsDetailedModel] = useState(form.isDetailedModel || false);

  const handleChange = (field: keyof ProductForm, value: string) => {
    onUpdate({
      ...form,
      [field]: (field.includes('weight') || field.includes('price'))
        ? Number(value) || 0
        : value,
    });
  };

  const handleDetailedModelToggle = (checked: boolean) => {
    setIsDetailedModel(checked);
    onUpdate({
      ...form,
      isDetailedModel: checked,
    });
  };

  if (form.isMinimized) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="font-medium">{form.baseCode || 'New Product'}</span>
          <span className="text-gray-500">{form.productRange}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleMinimize}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronDown size={20} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-100 rounded text-red-500"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <div className="flex gap-2">
          <button
            onClick={onToggleMinimize}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-100 rounded text-red-500"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-end items-center mb-6">
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
            value={form.levelOfSugar}
            onChange={(value) => handleChange('levelOfSugar', value)}
          />
        </FormGroup>

        {isDetailedModel && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Distribution Data</h4>
              <div className="w-64">
                <CSVUploader onDataLoaded={onDistributionDataUpdate} />
              </div>
            </div>
            {distributionData.length > 0 && (
              <div className="h-64 mt-4">
                <DistributionChart data={distributionData} />
              </div>
            )}
          </div>
        )}

        <FormGroup title="Product Classification">
          <FormField
            label="Pack Group"
            value={form.packGroup}
            onChange={(value) => handleChange('packGroup', value)}
          />
          <FormField
            label="Product Range"
            value={form.productRange}
            onChange={(value) => handleChange('productRange', value)}
          />
          <FormField
            label="Segment"
            value={form.segment}
            onChange={(value) => handleChange('segment', value)}
          />
          <FormField
            label="Super Segment"
            value={form.superSegment}
            onChange={(value) => handleChange('superSegment', value)}
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
  );
};