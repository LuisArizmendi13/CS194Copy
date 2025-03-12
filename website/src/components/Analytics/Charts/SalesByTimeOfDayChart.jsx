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

const SalesByTimeOfDayChart = ({ data }) => {
  // Aggregate sales by time of day and dish
  const timeOfDaySales = data.reduce((acc, dish) => {
    dish.sales.forEach((sale) => {
      if (sale.derived) {
        const timeOfDay = sale.derived.time_of_day;
        if (!acc[timeOfDay]) {
          acc[timeOfDay] = {
            time: timeOfDay,
            total: 0,
            byDish: {},
          };
        }
        acc[timeOfDay].total += 1;
        acc[timeOfDay].byDish[dish.name] =
          (acc[timeOfDay].byDish[dish.name] || 0) + 1;
      }
    });
    return acc;
  }, {});

  // Convert to array and sort by time of day
  const timeOrder = ["Morning", "Afternoon", "Evening", "Night"];
  const formattedData = Object.values(timeOfDaySales).sort(
    (a, b) => timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time)
  );

  // Calculate percentages
  const totalSales = formattedData.reduce((sum, item) => sum + item.total, 0);
  const percentages = formattedData.map((item) => ({
    ...item,
    percentage: ((item.total / totalSales) * 100).toFixed(1),
  }));

  // Distribution component
  const TimeDistributionCard = ({ item }) => (
    <div className="bg-white rounded-md border border-gray-100 p-3 shadow-sm">
      <div className="text-xs font-medium text-gray-500 mb-1">{item.time}</div>
      <div className="flex items-end justify-between">
        <div className="text-base font-semibold text-gray-800">
          {item.percentage}%
        </div>
        <div className="text-xs text-gray-500">{item.total} orders</div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
        <div
          className="h-full bg-amber-500 rounded-full"
          style={{ width: `${item.percentage}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 10,
              right: 10,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="time"
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
              formatter={(value) => [`${value} orders`, "Total Orders"]}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: "10px" }}
              verticalAlign="bottom"
              height={36}
            />
            <Bar
              dataKey="total"
              fill="#F59E0B"
              radius={[2, 2, 0, 0]}
              name="Total Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Summary */}
      <div className="mt-4">
        <h4 className="text-xs font-medium text-gray-700 mb-2">
          Sales Distribution
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {percentages.map((item) => (
            <TimeDistributionCard key={item.time} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesByTimeOfDayChart;
