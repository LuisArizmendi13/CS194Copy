import React from "react";
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

const SalesTrendChart = ({ data }) => {
  // Format month labels to be more readable
  const formatMonth = (monthStr) => {
    const date = new Date(monthStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Sales Trends Over Time</h3>

      <p className="text-gray-600 text-sm mb-4">
        This chart tracks your total sales over time. The line shows how your
        order numbers change from month to month, helping you spot trends and
        seasonal patterns.
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
              tickFormatter={formatMonth}
              height={50}
              tick={{ fill: "#4B5563", fontSize: 12 }}
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
              labelFormatter={formatMonth}
              formatter={(value) => [`${value} orders`, "Total Sales"]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: "20px" }}
              verticalAlign="bottom"
              height={36}
            />
            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 4, fill: "#6366F1" }}
              activeDot={{ r: 6 }}
              name="Total Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">What This Means For You:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Look for patterns in your busy and slow months</li>
          <li>• Use peak periods to plan inventory and staffing</li>
          <li>• Consider special promotions during typically slower months</li>
        </ul>
      </div>
    </div>
  );
};

export default SalesTrendChart;
