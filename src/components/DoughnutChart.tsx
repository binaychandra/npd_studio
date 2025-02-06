import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PredictionResponse } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RetailerDoughnutProps {
  data: PredictionResponse | null;
}

export const RetailerDoughnut: React.FC<RetailerDoughnutProps> = ({ data }) => {
  // Validate data
  if (!data?.TOTAL_MARKET) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        No data available
      </div>
    );
  }

  // Calculate sums for each retailer
  const calculateRetailerSum = (retailerData: Record<string, number>) => {
    return Object.values(retailerData).reduce((sum, val) => 
      sum + (typeof val === 'number' ? val : 0), 0
    );
  };

  // Calculate all sums
  const retailerSums = {
    ASDA: calculateRetailerSum(data.ASDA || {}),
    MORRISONS: calculateRetailerSum(data.MORRISONS || {}),
    TESCO: calculateRetailerSum(data.TESCO || {}),
    SAINSBURYS: calculateRetailerSum(data.SAINSBURYS || {}),
    TOTAL_MARKET: calculateRetailerSum(data.TOTAL_MARKET)
  };

  // Calculate OTHERS
  const mainRetailersSum = retailerSums.ASDA + retailerSums.MORRISONS + 
                          retailerSums.TESCO + retailerSums.SAINSBURYS;
  const othersSum = retailerSums.TOTAL_MARKET - mainRetailersSum;

  // Calculate percentages
  const totalSum = mainRetailersSum + othersSum;
  const percentages = {
    ASDA: (retailerSums.ASDA / totalSum) * 100,
    MORRISONS: (retailerSums.MORRISONS / totalSum) * 100,
    TESCO: (retailerSums.TESCO / totalSum) * 100,
    SAINSBURYS: (retailerSums.SAINSBURYS / totalSum) * 100,
    OTHERS: (othersSum / totalSum) * 100
  };

  // Log calculations for verification
  console.log('Retailer Sums:', retailerSums);
  console.log('Others Sum:', othersSum);
  console.log('Total Sum:', totalSum);
  console.log('Percentages:', percentages);

  const chartData = {
    labels: ['ASDA', 'MORRISONS', 'TESCO', 'SAINSBURYS', 'OTHERS'],
    datasets: [
      {
        data: [
          percentages.ASDA,
          percentages.MORRISONS,
          percentages.TESCO,
          percentages.SAINSBURYS,
          percentages.OTHERS
        ],
        backgroundColor: [
            'rgba(78, 121, 167, 0.6)',   // ASDA (Soft Blue)
            'rgba(242, 142, 44, 0.6)',   // MORRISONS (Warm Orange)
            'rgba(225, 87, 89, 0.6)',    // TESCO (Strong Red)
            'rgba(118, 183, 178, 0.6)',  // SAINSBURYS (Teal Green)
            'rgba(89, 89, 89, 0.6)'      // OTHERS (Neutral Gray)
        ],
        
        borderColor: [
            'rgba(58, 91, 137, 1)',   // ASDA - Darker Blue
            'rgba(192, 102, 24, 1)',  // MORRISONS - Deep Orange
            'rgba(175, 47, 49, 1)',   // TESCO - Deep Red
            'rgba(78, 143, 138, 1)',  // SAINSBURYS - Dark Teal
            'rgba(69, 69, 69, 1)'     // OTHERS - Dark Gray
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      // Add datalabels plugin for showing percentages on the chart
      datalabels: {
        display: true,
        color: '#4B5563', // gray-600
        font: {
          weight: 'bold' as const,
          size: 11
        },
        formatter: (value: number) => `${value.toFixed(1)}%`,
        anchor: 'end',
        align: 'top',
        offset: 5
      },
      legend: {
        position: 'bottom' as const,
        align: 'start' as const,
        padding: 20,
        labels: {
          usePointStyle: true, // This makes the color indicators circular
          pointStyle: 'circle',
          boxWidth: 6, // Smaller circle size
          boxHeight: 6, // Smaller circle size
          padding: 15, // Space between items
          font: {
            size: 11,
            weight: '500' as const
          },
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label: string, index: number) => ({
              text: `${label}: ${datasets[0].data[index].toFixed(1)}%`, // Only show the label without percentage
              fillStyle: datasets[0].backgroundColor[index],
              hidden: false,
              lineCap: 'round',
              lineDash: [],
              lineDashOffset: 0,
              lineJoin: 'round',
              lineWidth: 0,
              strokeStyle: 'transparent',
              pointStyle: 'circle',
              datasetIndex: 0,
              align: 'center',
              index: index
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937', // gray-800
        bodyColor: '#4B5563', // gray-600
        borderColor: 'rgba(229, 231, 235, 0.8)', // gray-200
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    },
    // Improve overall chart layout
    layout: {
      padding: {
        top: 20,    // Add space for percentage labels
        bottom: 10,
        left: 10,
        right: 10
      }
    }
  };

  return (
        <div className="h-[350px] w-[320px] border border-gray-200 rounded-lg p-4">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};