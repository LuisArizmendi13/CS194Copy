import React, { useMemo } from "react";
import jstat from "jstat";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

const COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

function calculateStatisticalSignificance(data) {
  const dishes = Object.keys(data[0]?.dishes || {});
  const months = data.map((d) => d.month);

  function oneWayANOVA(groups) {
    const allValues = groups.flat();
    const grandMean = jstat.mean(allValues);
    const ssb = groups.reduce((sum, group) => {
      return sum + group.length * Math.pow(jstat.mean(group) - grandMean, 2);
    }, 0);
    const ssw = groups.reduce((sum, group) => {
      return sum + (group.length - 1) * jstat.variance(group);
    }, 0);
    const dfb = groups.length - 1;
    const dfw = allValues.length - groups.length;
    const msb = ssb / dfb;
    const msw = ssw / dfw;
    const fStat = msb / msw;
    const pValue = 1 - jstat.centralF.cdf(fStat, dfb, dfw);
    return { fStat, pValue };
  }

  const results = {};
  dishes.forEach((dish) => {
    const groups = months.map((month) => {
      const monthData = data.find((d) => d.month === month);
      return [monthData.dishes[dish]];
    });
    const { fStat, pValue } = oneWayANOVA(groups);
    results[dish] = {
      fStatistic: fStat,
      pValue: pValue,
      significant: pValue < 0.05,
    };
  });
  return results;
}

const SeasonalPerformanceChart = ({ data }) => {
  const dishes = Object.keys(data[0]?.dishes || {});
  const significanceResults = useMemo(
    () => calculateStatisticalSignificance(data),
    [data]
  );

  // Format month labels to be more readable
  const formatMonth = (monthStr) => {
    const date = new Date(monthStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Get top 3 dishes with significant seasonality
  const topSeasonalDishes = Object.entries(significanceResults)
    .filter(([, result]) => result.significant)
    .sort(([, a], [, b]) => a.pValue - b.pValue)
    .slice(0, 3)
    .map(([dish]) => dish);

  // Status badge component
  const SignificanceBadge = ({ isSignificant }) => (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        isSignificant
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {isSignificant ? "Significant" : "Not significant"}
    </span>
  );

  return (
    <div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              height={50}
            />
            <YAxis tick={{ fill: "#6B7280", fontSize: 11 }}>
              <Label
                value="Number of Orders"
                angle={-90}
                position="insideLeft"
                offset={-10}
                style={{ textAnchor: "middle", fill: "#6B7280", fontSize: 11 }}
              />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                fontSize: 11,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              labelFormatter={formatMonth}
              formatter={(value) => [`${value} orders`, "Orders"]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: "10px" }}
              verticalAlign="bottom"
              height={36}
            />
            {dishes.map((dish, index) => (
              <Line
                key={dish}
                type="monotone"
                dataKey={`dishes.${dish}`}
                name={dish}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistical Significance Table */}
      <div className="mt-4">
        <h4 className="text-xs font-medium text-gray-700 mb-2">
          Seasonal Significance Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {topSeasonalDishes.length > 0 ? (
            topSeasonalDishes.map((dish) => (
              <div
                key={dish}
                className="bg-white rounded-md border border-gray-100 p-3 shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium text-sm text-gray-800">
                    {dish}
                  </div>
                  <SignificanceBadge
                    isSignificant={significanceResults[dish].significant}
                  />
                </div>
                <div className="text-xs text-gray-600">
                  p-value: {significanceResults[dish].pValue.toFixed(4)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  This dish shows statistically significant seasonal variation
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-gray-50 p-3 rounded-md text-xs text-gray-700">
              No dishes show statistically significant seasonal patterns.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonalPerformanceChart;
