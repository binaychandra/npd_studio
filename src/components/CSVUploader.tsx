import React, { ChangeEvent, useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import { ClientData } from '../types';

interface CSVUploaderProps {
  onDataLoaded: (data: ClientData[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);

  const parseCSV = async (content: string): Promise<ClientData[]> => {
    return new Promise((resolve) => {
      // Use a timeout to move parsing off the main thread
      setTimeout(() => {
        const lines = content.trim().split('\n');
        const clients: ClientData[] = [];
        const batchSize = 1000;
        let currentBatch: ClientData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].trim().split(',');
          if (values.length === 13) {
            // Convert values to numbers once and store in a temporary array
            const distributionValues = values.slice(1).map(Number);
            
            currentBatch.push({
              clientId: values[0],
              distribution: distributionValues
            });

            // Process in batches to avoid blocking the main thread
            if (currentBatch.length === batchSize) {
              clients.push(...currentBatch);
              currentBatch = [];
            }
          }
        }

        // Add remaining items
        if (currentBatch.length > 0) {
          clients.push(...currentBatch);
        }

        resolve(clients);
      }, 0);
    });
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      });

      const data = await parseCSV(content);
      onDataLoaded(data);
    } catch (error) {
      console.error('Error parsing file:', error);
    } finally {
      setIsLoading(false);
      // Reset the input to allow uploading the same file again
      event.target.value = '';
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:border-blue-500 transition-colors bg-white">
      <input
        type="file"
        accept=".csv,.txt"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
        disabled={isLoading}
      />
      <label
        htmlFor="csv-upload"
        className={`flex items-center gap-2 ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
      >
        {isLoading ? (
          <Loader className="w-4 h-4 text-blue-500 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 text-gray-500" />
        )}
        <span className="text-sm text-gray-600">
          {isLoading ? 'Processing...' : 'Upload Distribution'}
        </span>
      </label>
    </div>
  );
};