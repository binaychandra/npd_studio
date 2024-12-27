import React from 'react';
import { FormGroupProps } from '../types';

export const FormGroup: React.FC<FormGroupProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
};