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
            height={50}
            tick={{ fill: "#6B7280", fontSize: 11 }}
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
            formatter={(value) => [`${value} orders`, "Total Sales"]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: "10px" }}
            verticalAlign="bottom"
            height={36}
          />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ r: 3, fill: "#6366F1" }}
            activeDot={{ r: 5 }}
            name="Total Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesTrendChart;
