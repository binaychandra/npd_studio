import React from 'react';
import { Line } from 'react-chartjs-2';
import { PredictionResponse } from '../types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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
}

const RETAILER_COLORS = {
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
  if (!data || !data.TOTAL_MARKET) {
    console.error('Invalid prediction data:', data);
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        No valid prediction data available
      </div>
    );
  }

  try {
    // Get all months from the data and sort them chronologically
    const months = Object.keys(data.TOTAL_MARKET).sort((a, b) => {
      const [aMonth, aYear] = a.split('-');
      const [bMonth, bYear] = b.split('-');
      if (aYear !== bYear) {
        return parseInt(aYear) - parseInt(bYear);
      }
      return monthOrder.indexOf(aMonth.substring(0, 3)) - monthOrder.indexOf(bMonth.substring(0, 3));
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
      plugins: {
        title: {
          display: true,
          text: `Retailer Predictions - ${scenarioName || 'Unnamed Scenario'}`,
          font: {
            size: 16,
            weight: 'bold' as const
          }
        },
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 20,
            usePointStyle: true
          }
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
            text: 'Month'
          },
          ticks: {
            font: {
              weight: 'bold' as const
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          type: 'linear' as const,
          title: {
            display: true,
            text: 'Value'
          },
          ticks: {
            font: {
              weight: 'bold' as const
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
    return <Line data={chartData} options={options} />;
  } catch (error) {
    console.error('Error creating chart:', error);
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error creating chart. Please check the console for details.
      </div>
    );
  }
};