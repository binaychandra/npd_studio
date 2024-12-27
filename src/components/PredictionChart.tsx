import React from 'react';
import { Line } from 'react-chartjs-2';
import { WeeklyData } from '../types';

interface PredictionChartProps {
  data: WeeklyData[];
  scenarioName: string;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data, scenarioName }) => {
  const chartData = {
    labels: data.map(d => d.week),
    datasets: [
      {
        label: 'Prediction Values',
        data: data.map(d => d.value),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Prediction Trend - ${scenarioName}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}