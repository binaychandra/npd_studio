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
  <div className="w-32 h-12">
    <AreaChart
      width={120}
      height={48}
      data={data}
      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
    >
      <defs>
        <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#FF8B64" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#FFE0D6" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <Tooltip
        contentStyle={{
          backgroundColor: "white",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          fontSize: "12px",
          padding: "8px",
          lineHeight: "1.3",
        }}
        labelStyle={{ fontWeight: "600", color: "#333" }}
        formatter={(value: number) => [`${value}`, "Distribution"]}
        labelFormatter={(label) => `Week: ${label}`}
      />
      <Area
        type="monotone"
        dataKey="value"
        stroke="#FF8B64"
        fill="url(#colorFill)"
        strokeWidth={2}
        isAnimationActive={true}
      />
    </AreaChart>
  </div>
);

export const DashboardTable: React.FC<DashboardTableProps> = ({ data, scenarioName }) => {
  const enrichedData = Object.entries(data).reduce((acc, [key, item]) => {
    const transformedDistribution = item.week_date.map((date, index) => ({
      week_date: date,
      value: item.distribution[index] || 0,
    }));

    return {
      ...acc,
      [key]: {
        ...item,
        distribution: transformedDistribution,
      },
    };
  }, {} as Record<string, ProductData>);

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* <h2 className="text-xl font-semibold text-gray-800 mb-6">Product Distribution Analysis</h2> */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
                Base Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
                Similarity
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 tracking-wider">
                Sell in Volume
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider">
                Distribution Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.entries(enrichedData).map(([baseCode, item]) => (
              <tr key={baseCode} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {baseCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.description}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all duration-300"
                        style={{ width: `${item.similarity}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.similarity}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                  {item.sell_in_volume.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td className="px-6 py-4">
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