import React from 'react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'number' | 'date';
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};