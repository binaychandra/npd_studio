import React from 'react';
import { Line } from 'react-chartjs-2';
import { PredictionResponse } from '../types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { AreaChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PredictionChartProps {
  data: PredictionResponse | null;
  scenarioName: string;
  compact?: boolean;
}

export const RETAILER_COLORS = {
  ASDA: 'rgb(0, 255, 0)',
  MORRISONS: 'rgb(0, 0, 255)',
  SAINSBURYS: 'rgb(255, 128, 0)',
  TESCO: 'rgb(255, 0, 0)',
  TOTAL_MARKET: 'rgb(128, 128, 128)'
};

const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const PredictionChart: React.FC<PredictionChartProps> = ({ data, scenarioName }) => {
  console.log('PredictionChart received data:', data);
  console.log('PredictionChart received scenarioName:', scenarioName);

  // Validate data
  // Validate data structure and numeric values
  const isValidData = data?.TOTAL_MARKET &&
    Object.values(data).every(retailer =>
      Object.values(retailer).every(val => typeof val === 'number')
    );

  if (!isValidData) {
    console.error('Invalid prediction data structure:', data);
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Invalid data format. Please check API response.
        <div className="text-xs mt-2">
          Expected format: {"{ RETAILER: { MONTH: number } }"}
        </div>
      </div>
    );
  }

  try {
    // Get all months from the data and sort them chronologically
    const months = Object.keys(data.TOTAL_MARKET).sort((a, b) => {
      try {
        const [aMonth, aYear] = a.split('-');
        const [bMonth, bYear] = b.split('-');
        if (aYear !== bYear) {
          return parseInt(aYear) - parseInt(bYear);
        }
        return monthOrder.indexOf(aMonth.substring(0, 3)) - monthOrder.indexOf(bMonth.substring(0, 3));
      } catch (error) {
        console.error('Error sorting months:', error);
        return 0; // Fallback to original order
      }
      });

    if (months.length === 0) {
      console.error('No months data available');
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          No timeline data available
        </div>
      );
    }

    const chartData = {
      labels: months,
      datasets: Object.entries(data)
        .map(([retailer, values]) => ({
          label: retailer,
          data: months.map(month => values[month]),
          borderColor: RETAILER_COLORS[retailer as keyof typeof RETAILER_COLORS],
          backgroundColor: RETAILER_COLORS[retailer as keyof typeof RETAILER_COLORS],
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }))
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          right: 10
        }
      },
      plugins: {
        title: {
          display: false,
          text: `Retailer Predictions - ${scenarioName || 'Unnamed Scenario'}`,
          font: {
            size: 16,
            weight: 'semibold' as const
          }
        },
        legend: {
          display: false,
          position: 'top' as const,
          align: 'end' as const,
          orient: 'vertical',
          labels: {
            usePointStyle: true,
            padding: 16,
            font: {
              size: 10
            }
          },
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 8
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'category' as const,
          title: {
            display: true,
            text: ''
          },
          ticks: {
            font: {
              weight: 'bold' as const
            },
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            display: false
          }
        },
        y: {
          type: 'linear' as const,
          title: {
            display: false,
            text: 'Value'
          },
          ticks: {
            font: {
              weight: 'bold' as const
            },
            callback: function(value: number) {
              return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value);
            }
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false
      }
    };

    console.log('Chart Data:', chartData);
    console.log('Chart Options:', options);
    return (
      <div className="h-full w-full border border-gray-200 rounded-lg p-4 flex-1">
        <Line data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    console.error('Error creating chart:', error);
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error creating chart. Please check the console for details.
      </div>
    );
  }
};