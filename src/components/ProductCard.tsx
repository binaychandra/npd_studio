import React from 'react';
import { Edit, Trash2, Copy } from 'lucide-react';
import { ProductForm } from '../types';

interface ProductCardProps {
  product: ProductForm;
  onEdit: () => void;
  onDelete: () => void;
  onClone: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onClone }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{product.baseCode || 'No Base Code'}</h3>
          <p className="text-gray-600">{product.scenario || 'Unnamed Scenario'}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClone}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-full"
            title="Clone"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Product Range:</span>
          <span>{product.productRange || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Segment:</span>
          <span>{product.segment || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Week Date:</span>
          <span>{product.weekDate || '-'}</span>
        </div>
      </div>
    </div>
  );
};