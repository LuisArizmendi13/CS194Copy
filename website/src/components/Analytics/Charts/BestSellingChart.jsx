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

const BestSellingChart = ({ data }) => {
  const chartData = data.map((dish) => ({
    name:
      dish.name.split(" ").length > 2
        ? dish.name.split(" ").slice(0, 2).join(" ") + "..."
        : dish.name,
    fullName: dish.name,
    totalSales: dish.totalSales,
    revenue: dish.totalRevenue,
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Best-Selling Dishes</h3>

      <p className="text-gray-600 text-sm mb-4">
        This chart shows how many times each dish was ordered (purple bars) and
        how much money each dish brought in (green bars). Taller bars mean more
        sales or more revenue. This helps you see which dishes are most popular
        and which ones earn the most.
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
                value="Number of Orders / Revenue ($)"
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
              formatter={(value, name, props) => {
                if (name === "totalSales")
                  return [`${value} orders`, "Number of Orders"];
                if (name === "revenue") return [`$${value}`, "Revenue"];
                return [value, name];
              }}
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
              dataKey="totalSales"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              name="Number of Orders"
            />
            <Bar
              dataKey="revenue"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">What This Means For You:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>
            • Look at your highest-selling dishes (purple bars) to ensure you
            always have enough ingredients stocked
          </li>
          <li>
            • Compare the number of orders with revenue (green bars) to see
            which dishes are your biggest earners
          </li>
          <li>
            • Use this information when planning specials or considering menu
            changes
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BestSellingChart;
