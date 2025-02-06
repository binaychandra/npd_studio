import React from 'react';
import { Line } from 'react-chartjs-2';
import { PredictionResponse } from '../types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { AreaChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

  // Calculate total market sum
  const calculateTotalMarketSum = (data: PredictionResponse | null) => {
    if (!data?.TOTAL_MARKET) return 0;
    return Object.values(data.TOTAL_MARKET).reduce((sum, val) => 
      sum + (typeof val === 'number' ? val : 0), 0
    );
  };

  // Format large numbers
  const formatTotal = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  // Validate data
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
        return 0;
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
        .filter(([retailer]) => retailer === 'TOTAL_MARKET')
        .map(([retailer, values]) => ({
          label: retailer,
          data: months.map(month => values[month]),
          borderColor: 'rgba(255, 120, 36, 0.8)',
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const chartArea = context.chart.chartArea;
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            
            gradient.addColorStop(0, 'rgba(255, 120, 36, 0.2)');
            gradient.addColorStop(0.2, 'rgba(255, 150, 80, 0.15)');
            gradient.addColorStop(0.5, 'rgba(255, 180, 120, 0.08)');
            gradient.addColorStop(0.8, 'rgba(255, 200, 150, 0.03)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            return gradient;
          },
          fill: true,
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(255, 120, 36, 1)',
          pointBorderColor: 'rgba(255, 255, 255, 1)',
          pointBorderWidth: 2,
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
          text: `Market Prediction - ${scenarioName || 'Unnamed Scenario'}`,
          font: {
            size: 16,
            weight: 'bold' as const
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
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0
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
          position: 'left' as const,
          ticks: {
            font: {
              weight: 'bold' as const
            },
            callback: function(value: number | string) {
              const numericValue = typeof value === 'string' ? parseFloat(value) : value;
              return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(numericValue);
            }
          },
        beginAtZero: false,
        suggestedMin: 5000,
        suggestedMax: Math.ceil(Math.max(...Object.values(data.TOTAL_MARKET)) / 5000) * 5000 + 5000,
          grid: {
            drawTicks: false,
            display: true,
            drawBorder: false,
            color: 'rgba(0, 0, 0, 0.1)',
            borderDash: [5, 5],
            drawOnChartArea: true
          },
          border: {
            display: false
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
      <div className="relative h-full w-full border border-gray-200 rounded-lg p-4 flex-1">
        <div className="absolute top-4 right-8 bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg shadow-sm border border-orange-200">
            <div className="text-xs text-gray-400 mb-1 font-semibold">Total Market Sum: <span className="text-xs font-bold text-orange-600">{formatTotal(calculateTotalMarketSum(data))}</span></div>
        </div>
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