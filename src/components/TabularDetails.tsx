import React from 'react';
import { AreaChart, Area, Tooltip } from 'recharts';

interface WeeklyDistribution {
  week_date: string;
  value: number;
}

interface ProductData {
  description: string;
  similarity: number;
  sell_in_volume: number;
  distribution: WeeklyDistribution[];
}

interface DashboardTableProps {
  data: Record<string, ProductData>;
  scenarioName?: string;
}


const MiniChart: React.FC<{ data: WeeklyDistribution[] }> = ({ data }) => (
    <div className="w-32 h-10">
      <AreaChart
        width={120}
        height={40}
        data={data}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
          </linearGradient>
        </defs>
  
        {/* Add Tooltip */}
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "12px",
            padding: "5px",
            lineHeight: "1",
          }}
          labelStyle={{ fontWeight: "bold", color: "#3b82f6" }}
          formatter={(value: number) => [`${value}`, "Distribution"]}
          labelFormatter={(label) => `Week: ${label}`}
        />
  
        <Area
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          fill="url(#colorFill)"
          strokeWidth={1.5}
          isAnimationActive={true}
        />
      </AreaChart>
    </div>
  );
  

export const DashboardTable: React.FC<DashboardTableProps> = ({ data, scenarioName }) => {
  // Ensure each item in data has distribution, if not use sample data
  const enrichedData = Object.entries(data).reduce((acc, [key, item]) => {
    const transformedDistribution = item.week_date.map((date, index) => ({
      week_date: date,
      value: item.distribution[index] || 0, // Ensure no undefined values
    }));
  
    return {
      ...acc,
      [key]: {
        ...item,
        distribution: transformedDistribution, // Attach transformed distribution data
      },
    };
  }, {} as Record<string, ProductData>);
  

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Base Code</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Similarity %</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 border-b">Sell in Volume</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 border-b">Distribution Trend</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(enrichedData).map(([baseCode, item]) => (
              <tr key={baseCode} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-3 font-medium">{baseCode}</td>
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${item.similarity}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{item.similarity}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {item.sell_in_volume.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td className="px-4 py-4">
                    <MiniChart data={item.distribution} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;