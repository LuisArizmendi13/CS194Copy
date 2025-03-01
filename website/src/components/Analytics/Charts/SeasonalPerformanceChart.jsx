import React, { useMemo } from "react";
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
import jstat from 'jstat';

const COLORS = [
  "#4F46E5", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#06B6D4",
];

function calculateStatisticalSignificance(data) {
  const dishes = Object.keys(data[0]?.dishes || {});
  const months = data.map(d => d.month);

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
  dishes.forEach(dish => {
    const groups = months.map(month => {
      const monthData = data.find(d => d.month === month);
      return [monthData.dishes[dish]];
    });
    const { fStat, pValue } = oneWayANOVA(groups);
    results[dish] = {
      fStatistic: fStat,
      pValue: pValue,
      significant: pValue < 0.05
    };
  });
  return results;
}

const SeasonalPerformanceChart = ({ data }) => {
  const dishes = Object.keys(data[0]?.dishes || {});
  const significanceResults = useMemo(() => calculateStatisticalSignificance(data), [data]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Seasonal Performance</h3>
      <p className="text-gray-600 text-sm mb-4">
        This chart tracks how each dish performs throughout the year. Each line
        represents a different dish, showing how its sales change across months.
        This helps identify seasonal patterns in dish popularity.
      </p>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 60,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#4B5563", fontSize: 12 }}
              height={50}
            />
            <YAxis tick={{ fill: "#4B5563", fontSize: 12 }}>
              <Label
                value="Number of Orders"
                angle={-90}
                position="insideLeft"
                offset={-50}
                style={{ textAnchor: "middle", fill: "#4B5563", fontSize: 12 }}
              />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: 12,
              }}
              formatter={(value) => [`${value} orders`, "Orders"]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: "20px" }}
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
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">What This Means For You:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>- Identify which dishes show strong seasonal patterns</li>
          <li>- Plan menu changes around seasonal peaks and troughs</li>
          <li>- Optimize inventory based on expected seasonal demand</li>
          <li>- Consider seasonal pricing strategies</li>
          <li>- Plan promotions during typically slow seasons</li>
        </ul>
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Statistical Significance:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          {Object.entries(significanceResults).map(([dish, result]) => (
            <li key={dish}>
              - {dish}: {result.significant ? "Significant" : "Not significant"} seasonal variation 
              (p-value: {result.pValue.toFixed(4)})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SeasonalPerformanceChart;
