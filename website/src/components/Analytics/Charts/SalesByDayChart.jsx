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

const SalesByDayChart = ({ data }) => {
  // Aggregate sales by day of week
  const dayOfWeekSales = data.reduce((acc, dish) => {
    if (!dish.sales || !Array.isArray(dish.sales)) {
      return acc;
    }

    dish.sales.forEach((sale) => {
      if (!sale.derived || !sale.derived.day_of_week) {
        return;
      }

      const dayOfWeek = sale.derived.day_of_week;
      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = {
          day: dayOfWeek,
          total: 0,
          byDish: {},
        };
      }
      acc[dayOfWeek].total += 1;
      acc[dayOfWeek].byDish[dish.name] =
        (acc[dayOfWeek].byDish[dish.name] || 0) + 1;
    });
    return acc;
  }, {});

  // Order days correctly
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Format data for the chart
  const formattedData = daysOrder.map((day) => ({
    day: day,
    total: dayOfWeekSales[day]?.total || 0,
    topDishes: Object.entries(dayOfWeekSales[day]?.byDish || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3),
  }));

  // Small insight component for mobile view
  const DayInsight = ({ dayData }) => (
    <div className="bg-white rounded-md border border-gray-100 p-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm text-gray-800">{dayData.day}</h4>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
          {dayData.total} orders
        </span>
      </div>
      {dayData.topDishes.length > 0 && (
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-1">Top selling:</p>
          <ul className="space-y-1">
            {dayData.topDishes.map(([dish, count]) => (
              <li key={dish} className="flex justify-between">
                <span className="truncate">{dish}</span>
                <span className="text-gray-500 ml-1">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
              dataKey="day"
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
              formatter={(value, name) => {
                if (name === "total")
                  return [`${value} orders`, "Total Orders"];
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: "10px" }}
              verticalAlign="bottom"
              height={36}
            />
            <Bar
              dataKey="total"
              fill="#4F46E5"
              radius={[2, 2, 0, 0]}
              name="Total Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Insights - Grid for mobile and desktop */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {formattedData.slice(0, 4).map((dayData) => (
          <DayInsight key={dayData.day} dayData={dayData} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {formattedData.slice(4).map((dayData) => (
          <DayInsight key={dayData.day} dayData={dayData} />
        ))}
      </div>
    </div>
  );
};

export default SalesByDayChart;
