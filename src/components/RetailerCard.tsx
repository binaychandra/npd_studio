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

export const RetailerCard: React.FC<RetailerCardProps> = ({ retailer, data }) => {
  const total = Object.values(data[retailer]).reduce((sum: number, val) =>
    sum + (typeof val === 'number' ? val : Number(val) || 0), 0);
  
  // const metricType = retailer.includes('SPEND') ? 'SPEND' :
  //                    retailer.includes('IMPRESSIONS') ? 'IMPRESSIONS' :
  //                    retailer.includes('VIEWABLE') ? 'VIEWABLE' : 'SALES';
  //  hover:shadow-xl
  // transition-all
  // duration-300
  // transform
  // hover:-translate-y-1

  return (
    <div className={`
      px-3
      py-1 
      rounded-xl 
      ${colorVariants[retailer]} 
      flex-1 
      min-w-[180px]
      shadow-sm
      hover:shadow-md
      transition-all
      duration-300
      transform
      hover:-translate-y-1
      border
      border-gray-100/20
      backdrop-blur-sm
    `}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center p-2">
          <div className="bg-white/10 rounded-lg p-1 backdrop-blur-sm">
            <img
              src={`/assets/icons/${retailer.toLowerCase()}.png`}
              alt=""
              className="w-12 h-12 object-contain"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-gray-700">
            {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            <span className="text-sm bg-yellow-100 ml-1 px-1 rounded-md">kg</span>
            </span>
          <span className="text-xs text-gray-500 font-medium">
            Total Sales
          </span>
        </div>
      </div>
    </div>
  );
};