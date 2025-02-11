import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface RawData {
  [key: string]: {
    description: string;
    distribution: number[];
    week_date: string[];
    // ... other properties
  };
}

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface StackedAreaProps {
  data: RawData;
  title?: string;
}

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium">{entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StackedDistributionArea: React.FC<StackedAreaProps> = ({ data, title }) => {
  // Transform data for the chart
  const transformData = (rawData: RawData): { chartData: ChartDataPoint[]; baseCodeKeys: string[] } => {
    const weekDates = Object.values(rawData)[0]?.week_date || [];
    const baseCodeKeys = Object.keys(rawData);
    
    const chartData = weekDates.map((date, index) => {
      const point: ChartDataPoint = { date };
      baseCodeKeys.forEach(baseCode => {
        point[baseCode] = rawData[baseCode].distribution[index] || 0;
      });
      return point;
    });

    return { chartData, baseCodeKeys };
  };

  const { chartData, baseCodeKeys } = transformData(data);

  // Color palette - using tailwind colors
  const colors = [
    '#60A5FA', // blue-400
    '#34D399', // emerald-400
    '#F472B6', // pink-400
    '#A78BFA', // violet-400
    '#FBBF24', // amber-400
    '#FB923C', // orange-400
    '#4ADE80', // green-400
    '#2DD4BF', // teal-400
  ];

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
      )}
    <ResponsiveContainer width="70%" height={300}>
      <AreaChart
        data={chartData}
        margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
        }}
      >
        <defs>
        {baseCodeKeys.map((key, index) => (
          <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop
            offset="5%"
            stopColor={colors[index % colors.length]}
            stopOpacity={0.8}
            />
            <stop
            offset="95%"
            stopColor={colors[index % colors.length]}
            stopOpacity={0.1}
            />
          </linearGradient>
        ))}
        </defs>
        <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        stroke="#E5E7EB"
        />
        <XAxis
        dataKey="date"
        tick={{ fill: '#6B7280', fontSize: 12 }}
        tickLine={false}
        axisLine={{ stroke: '#E5E7EB' }}
        tickFormatter={formatDate}
        />
        <YAxis
        tick={{ fill: '#6B7280', fontSize: 12 }}
        tickLine={false}
        axisLine={{ stroke: '#E5E7EB' }}
        tickFormatter={(value) => `${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
        wrapperStyle={{
          paddingTop: '20px'
        }}
        iconType="circle"
        />
        {baseCodeKeys.map((key, index) => (
        <Area
          key={key}
          type="monotone"
          dataKey={key}
          name={`${key}`}
          stackId="1"
          stroke={colors[index % colors.length]}
          fill={`url(#color-${key})`}
          fillOpacity={1}
          dot={{ fill: colors[index % colors.length], r: 3 }}
        />
        ))}
      </AreaChart>
    </ResponsiveContainer>
    </div>
  );
};

export default StackedDistributionArea;