// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
// import { RETAILER_COLORS } from './PredictionChart';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

// interface MiniAreaChartProps {
//   data: number[];
//   color: string;
// }

// export const MiniAreaChart: React.FC<MiniAreaChartProps> = ({ data, color = '#2F4B7C' }) => {
//   React.useEffect(() => {
//     if (!Array.isArray(data) || data.length === 0 || data.some(isNaN)) {
//       console.error('Invalid data passed to MiniAreaChart');
//       return;
//     }
//   }, [data]);

//   const chartData = {
//     labels: data.map((_, i) => `M${i+1}`),
//     datasets: [{
//       data: data,
//       borderColor: color,
//       borderWidth: 2,
//       tension: 0.35,
//       fill: true,
//       backgroundColor: 'rgba(47, 75, 124, 0.5)',
//       pointRadius: 0,
//       pointHoverRadius: 3,
//     }]
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: { enabled: true }
//     },
//     scales: {
//       x: { display: false },
//       y: {
//         display: false,
//         beginAtZero: true
//       }
//     }
    
//   };

//   return <Line data={chartData} options={options} />;
// };

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

interface MiniAreaChartProps {
  data: number[];
  color: string;
}

export const MiniAreaChart: React.FC<MiniAreaChartProps> = ({ data, color }) => {
  React.useEffect(() => {
    return () => {
      Object.values(ChartJS.instances).forEach((instance: any) => {
          instance.destroy();
        });
      };
    }, []);


  const gradientBackground = (context: any) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
  
    if (!chartArea) return null;
  
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    
    // Convert color (hex or named) to RGB manually
    const colorRGB = hexToRgb(color) || '47, 75, 124'; // Default fallback
    
    gradient.addColorStop(0, `rgba(${colorRGB}, 0.2)`); // 50% opacity at top
    gradient.addColorStop(1, `rgba(${colorRGB}, 0.0)`); // Fully transparent at bottom
  
    return gradient;
  };
  
  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    if (hex.startsWith('#')) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    }
    return null;
  };  

  const chartData = {
    labels: data.map((_, i) => `M${i + 1}`),
    datasets: [
      {
        data: data,
        borderColor: "blue",
        borderWidth: 2,
        tension: 0.4, // Slightly smoother line
        fill: true,
        backgroundColor: gradientBackground,
        pointRadius: 0,
        pointHoverRadius: 0, // Disable hover effect on points
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: false },
      y: { display: false, beginAtZero: true },
    },
    animation: false, // Prevent animation reinitialization
    interaction: {
      mode: 'nearest',
      intersect: false,
    }
  };  

  return <Line data={chartData} options={options} />;
};
