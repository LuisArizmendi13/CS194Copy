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
    <div>
      <h3 className="text-lg font-semibold mb-2">
        Revenue vs. Profit per Dish
      </h3>

      <p className="text-gray-600 text-sm mb-4">
        This chart compares the total money each dish brings in (blue bars) with
        the actual profit after costs (green bars). The difference between the
        bars shows your costs.
      </p>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 60,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#4B5563", fontSize: 12 }}
              height={60}
              interval={0}
              tickFormatter={(value) =>
                value.length > 15 ? `${value.substring(0, 15)}...` : value
              }
            />
            <YAxis tick={{ fill: "#4B5563", fontSize: 12 }}>
              <Label
                value="Amount ($)"
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
              wrapperStyle={{ fontSize: 12, paddingTop: "20px" }}
              verticalAlign="bottom"
              height={36}
            />
            <Bar
              dataKey="revenue"
              fill="#60A5FA"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            <Bar
              dataKey="profit"
              fill="#34D399"
              radius={[4, 4, 0, 0]}
              name="Profit"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">What This Means For You:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>
            • Look for dishes where the green bar (profit) is close to the blue
            bar (revenue) - these are your most efficient menu items
          </li>
          <li>
            • If there's a big gap between the bars, consider ways to reduce
            costs for that dish
          </li>
          <li>
            • Use this information when setting prices or updating your menu
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RevenueProfitChart;
