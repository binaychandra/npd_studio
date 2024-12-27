import React from 'react';
import { Eye } from 'lucide-react';
import { ProductForm } from '../types';

interface ProductSidebarCardProps {
  product: ProductForm;
  isActive: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

export const ProductSidebarCard: React.FC<ProductSidebarCardProps> = ({
  product,
  isActive,
  onSelect,
  onViewDetails,
}) => {
  return (
    <div
      className={`p-4 border-b cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{product.baseCode || 'No Base Code'}</h3>
          <p className="text-sm text-gray-600 mt-1">{product.scenario || 'Unnamed Scenario'}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
}