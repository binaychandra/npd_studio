// import React from 'react';
// import { MiniAreaChart } from './MiniAreaChart';
// import { PredictionResponse } from '../types';
// import { RETAILER_COLORS } from './PredictionChart';

// export type RetailerKey = Exclude<keyof PredictionResponse, 'TOTAL_MARKET'>;

// interface RetailerCardProps {
//   retailer: RetailerKey;
//   data: PredictionResponse;
// }

// export const RetailerCard: React.FC<RetailerCardProps> = ({ retailer, data }) => {
//   const total = Object.values(data[retailer]).reduce((sum: number, val) =>
//     sum + (typeof val === 'number' ? val : Number(val) || 0), 0);
  
//   return (
//     <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[200px]">
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-center gap-2">
//           <img
//             src={`/assets/icons/${retailer.toLowerCase()}.svg`}
//             alt=""
//             className="w-10 h-8 object-contain"
//             aria-hidden="true"
//           />
//           <span className="sr-only">{retailer}</span>
//         </div>
//         <div className="text-lg font-bold text-blue-600">
//           £{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
//         </div>
//       </div>
//       {/* <div className="h-20">
//         <MiniAreaChart
//           data={Object.values(data[retailer]).map(Number)}
//           color={RETAILER_COLORS[retailer]}
//         />
//       </div> */}
//     </div>
//   );
// };

import React from 'react';
import { PredictionResponse } from '../types';

export type RetailerKey = Exclude<keyof PredictionResponse, 'TOTAL_MARKET'>;

interface RetailerCardProps {
  retailer: RetailerKey;
  data: PredictionResponse;
}

// const MetricIcons = {
//   SPEND: (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
//     </svg>
//   ),
//   IMPRESSIONS: (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-500">
//       <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
//     </svg>
//   ),
//   VIEWABLE: (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
//       <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
//     </svg>
//   ),
//   SALES: (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink-500">
//       <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
//     </svg>
//   )
// };

const colorVariants = {
  ASDA: 'bg-blue-50',
  MORRISONS: 'bg-purple-50',
  SAINSBURYS: 'bg-green-50',
  TESCO: 'bg-pink-50'
};

const formatValue = (value: number, type: string) => {
  if (type === 'SPEND' || type === 'SALES') {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return value.toLocaleString();
};

// const getMetricLabel = (type: string) => {
//   switch (type) {
//     case 'SPEND':
//       return 'Retailer Share';
//     case 'IMPRESSIONS':
//       return 'Total Impressions';
//     case 'VIEWABLE':
//       return 'Viewable Impressions';
//     case 'SALES':
//       return 'Total Sales';
//     default:
//       return type;
//   }
// };

export const RetailerCard: React.FC<RetailerCardProps> = ({ retailer, data }) => {
  const total = Object.values(data[retailer]).reduce((sum: number, val) =>
    sum + (typeof val === 'number' ? val : Number(val) || 0), 0);
  
  // const metricType = retailer.includes('SPEND') ? 'SPEND' :
  //                    retailer.includes('IMPRESSIONS') ? 'IMPRESSIONS' :
  //                    retailer.includes('VIEWABLE') ? 'VIEWABLE' : 'SALES';

  return (
    <div className={`p-4 rounded-xl ${colorVariants[retailer]} flex-1 min-w-[200px]`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
        <img
            src={`/assets/icons/${retailer.toLowerCase()}.svg`}
            alt=""
            className="w-12 h-12 object-contain"
            aria-hidden="true"
          />
          {/* {MetricIcons[metricType]} */}
          {/* <span className="text-sm text-gray-500">{retailer}</span> */}
        </div>
        <span className="text-s text-gray-400">
          ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </div>
      <div className="text-xl font-semibold">
       
        {/* {formatValue(total, metricType)} */}
      </div>
    </div>
  );
};