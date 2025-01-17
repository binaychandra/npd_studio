import React from 'react';
import { ClientData } from '../types';
import { CSVUploader } from './CSVUploader';
import { DistributionChart } from './DistributionChart';

interface DistributionSectionProps {
  distributionData: ClientData[];
  onDistributionDataUpdate: (data: ClientData[]) => void;
}

export const DistributionSection = React.memo(({ 
  distributionData, 
  onDistributionDataUpdate 
}: DistributionSectionProps) => {
  return (
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
  );
});