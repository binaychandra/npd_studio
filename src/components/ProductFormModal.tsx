import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ProductForm, ClientData } from '../types';
import { FormGroup } from './FormGroup';
import { FormField } from './FormField';
import { CSVUploader } from './CSVUploader';
import { DistributionChart } from './DistributionChart';
import * as Switch from '@radix-ui/react-switch';

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
  const [isDetailedModel, setIsDetailedModel] = useState(form.isDetailedModel || false);

  const handleChange = (field: keyof ProductForm, value: string) => {
    onUpdate({
      ...form,
      [field]: field.includes('number') || field.includes('weight') || field.includes('price')
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
                  <CSVUploader onDataLoaded={onDistributionDataUpdate} />
                </div>
                {distributionData.length > 0 && (
                  <div className="h-64">
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
                type="number"
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