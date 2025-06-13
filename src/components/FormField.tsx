import React from 'react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
  options?: string[];
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  className = '',
  options = [],
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>      {type === 'select' ? (        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={options.length === 0}
          className={`w-full p-2 border rounded-md text-sm ${
            options.length === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          }`}
          aria-label={label}
          title={label}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Enter ${label}`}
          aria-label={label}
        />
      )}
    </div>
  );
};