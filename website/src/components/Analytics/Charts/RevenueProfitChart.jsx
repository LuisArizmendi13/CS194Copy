// RevenueProfitChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

const RevenueProfitChart = ({ data }) => {
  const chartData = data.map((dish) => ({
    name:
      dish.name.split(" ").length > 2
        ? dish.name.split(" ").slice(0, 2).join(" ") + "..."
        : dish.name,
    fullName: dish.name,
    revenue: dish.totalRevenue,
    profit: dish.totalProfit,
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            height={60}
            interval={0}
            tickFormatter={(value) =>
              value.length > 15 ? `${value.substring(0, 15)}...` : value
            }
          />
          <YAxis tick={{ fill: "#6B7280", fontSize: 11 }}>
            <Label
              value="Amount ($)"
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
            formatter={(value, name) => [
              `$${value.toFixed(2)}`,
              name === "revenue" ? "Total Revenue" : "Total Profit",
            ]}
            labelFormatter={(label, payload) => {
              if (payload && payload.length) {
                return payload[0].payload.fullName;
              }
              return label;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: "10px" }}
            verticalAlign="bottom"
            height={36}
          />
          <Bar
            dataKey="revenue"
            fill="#60A5FA"
            radius={[2, 2, 0, 0]}
            name="Revenue"
          />
          <Bar
            dataKey="profit"
            fill="#34D399"
            radius={[2, 2, 0, 0]}
            name="Profit"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueProfitChart;
