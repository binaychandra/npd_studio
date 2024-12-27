import React, { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import { ClientData } from '../types';

interface CSVUploaderProps {
  onDataLoaded: (data: ClientData[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    const clients: ClientData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].trim().split(',');
      if (values.length === 13) {
        clients.push({
          clientId: values[0],
          distribution: values.slice(1).map(Number)
        });
      }
    }
    return clients;
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = parseCSV(content);
        onDataLoaded(data);
      } catch (error) {
        console.error('Error parsing file:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:border-blue-500 transition-colors bg-white">
      <input
        type="file"
        accept=".csv,.txt"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
      />
      <label
        htmlFor="csv-upload"
        className="flex items-center gap-2 cursor-pointer"
      >
        <Upload className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Upload Distribution</span>
      </label>
    </div>
  );
};