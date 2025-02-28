import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

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

const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const PredictionChart: React.FC<PredictionChartProps> = ({ data, scenarioName }) => {
  const [selectedColumn, setSelectedColumn] = useState('TOTAL_MARKET');

  // Get all available columns (retailers) from data
  const getAvailableColumns = () => {
    if (!data) return [];
    return Object.keys(data);
  };

  // Calculate total sum based on selected column
  const calculateTotalSum = (data: PredictionResponse | null, column: string) => {
    if (!data?.[column]) return 0;
    return Object.values(data[column]).reduce((sum, val) => 
      sum + (typeof val === 'number' ? val : 0), 0
    );
  };

  // Format large numbers
  const formatTotal = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    }
    return value.toFixed(1);
  };

  // Validate data
  const isValidData = data?.[selectedColumn] &&
    Object.values(data).every(retailer =>
      Object.values(retailer).every(val => typeof val === 'number')
    );

  if (!isValidData) {
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
    const months = Object.keys(data[selectedColumn]).sort((a, b) => {
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
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          No timeline data available
        </div>
      );
    }

    const chartData = {
      labels: months,
      datasets: [{
        label: selectedColumn,
        data: months.map(month => data[selectedColumn][month]),
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
      }]
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
          suggestedMax: Math.ceil(Math.max(...Object.values(data[selectedColumn])) / 5000) * 5000 + 5000,
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
    
    return (
      <div className="relative h-full w-full border border-gray-200 rounded-lg p-4 flex-1">
        {/* Column Selector Dropdown */}
        <div className="absolute top-4 right-9 bg-gradient-to-r font-bold from-orange-50 to-orange-100 p-3 rounded-lg shadow-md drop-shadow-md border border-orange-200">
        <div className="flex items-center gap-2">
            <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="bg-transparent border border-gray-300 text-gray-500 text-xs font-bold rounded focus:ring-orange-500 focus:border-orange-500 py-0 px-2 h-6 max-w-[140px] font-semibold"
            >
            {getAvailableColumns().map(column => (
              <option key={column} value={column} className="text-gray-500 font-semibold">
              {column}
              </option>
            ))}
            </select>
          <div className="text-xs text-gray-400 font-semibold whitespace-nowrap">
            Sum:
            <span className="ml-1 font-bold text-orange-600">
              {formatTotal(calculateTotalSum(data, selectedColumn))}
            </span>
            <span className="text-xs text-orange-500 ml-1 px-1 rounded bg-yellow-50">kg</span>
          </div>
        </div>
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