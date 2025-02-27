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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        Sales Distribution by Time of Day
      </h3>

      <p className="text-gray-600 text-sm mb-4">
        This chart shows how your sales are spread throughout the day. Each bar
        represents the total number of orders during different times of day. The
        percentage cards below show how your sales are distributed.
      </p>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 20,
              right: 30,
              left: 60,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
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
              formatter={(value) => [`${value} orders`, "Total Orders"]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: "20px" }}
              verticalAlign="bottom"
              height={36}
            />
            <Bar
              dataKey="total"
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
              name="Total Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Summary */}
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Sales Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {percentages.map((item) => (
            <div
              key={item.time}
              className="bg-gray-50 p-4 rounded-lg shadow-sm"
            >
              <div className="text-sm text-gray-600">{item.time}</div>
              <div className="text-lg font-semibold">{item.percentage}%</div>
              <div className="text-sm text-gray-500">{item.total} orders</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">What This Means For You:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Use peak times to ensure you have enough staff scheduled</li>
          <li>• Consider special promotions during slower periods</li>
          <li>• Plan prep work during less busy times</li>
        </ul>
      </div>
    </div>
  );
};

export default SalesByTimeOfDayChart;
