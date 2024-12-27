import { useState } from 'react';
import { ClientData } from '../types';

export const useDistributionData = () => {
  const [clientData, setClientData] = useState<ClientData[]>([]);

  const handleDataLoaded = (data: ClientData[]) => {
    setClientData(data);
  };

  return {
    clientData,
    handleDataLoaded
  };
};