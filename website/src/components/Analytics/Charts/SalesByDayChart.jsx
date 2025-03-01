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
  // Debug log
  console.log("SalesByDayChart received data:", data);

  // Defensive check for data
  if (!Array.isArray(data)) {
    console.error("SalesByDayChart: data is not an array");
    return <div>Error: Invalid data format</div>;
  }

  // Aggregate sales by day of week with debug logging
  const dayOfWeekSales = data.reduce((acc, dish) => {
    if (!dish.sales || !Array.isArray(dish.sales)) {
      console.warn("Dish missing sales array:", dish);
      return acc;
    }

    dish.sales.forEach((sale) => {
      if (!sale.derived || !sale.derived.day_of_week) {
        console.warn("Sale missing derived day_of_week:", sale);
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

  console.log("Aggregated day of week sales:", dayOfWeekSales);

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

  console.log("Formatted chart data:", formattedData);
  
  const bestSellingDay = formattedData.reduce((max, current) => 
  current.total > max.total ? current : max
, formattedData[0]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Sales by Day of Week</h3>

      <p className="text-gray-600 text-sm mb-4">
        This chart shows how your sales vary across different days of the week.
        Each bar represents the total number of orders for that day, helping you
        identify your busiest and quietest days.
      </p>
      {/* Display the best selling day */}
      <p className="text-blue-600 font-medium mb-4">
        Most sales occurred on {bestSellingDay.day} with {bestSellingDay.total} orders
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
              dataKey="day"
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
              formatter={(value, name) => {
                if (name === "total")
                  return [`${value} orders`, "Total Orders"];
                return [value, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: "20px" }}
              verticalAlign="bottom"
              height={36}
            />
            <Bar
              dataKey="total"
              fill="#4F46E5"
              radius={[4, 4, 0, 0]}
              name="Total Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {formattedData.map((dayData) => (
          <div key={dayData.day} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{dayData.day}</h4>
              <span className="text-sm text-gray-500">
                {dayData.total} orders
              </span>
            </div>
            {dayData.topDishes.length > 0 && (
              <div className="text-sm text-gray-600">
                <p>Top selling dishes:</p>
                <ul className="list-disc ml-4">
                  {dayData.topDishes.map(([dish, count]) => (
                    <li key={dish}>
                      {dish}: {count} orders
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">What This Means For You:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Schedule more staff on your busiest days (usually weekends)</li>
          <li>
            • Plan inventory orders based on which days typically need more
            stock
          </li>
          <li>• Consider running promotions on slower days to boost sales</li>
          <li>• Adjust prep work schedules based on expected daily volumes</li>
          <li>• Use top-selling dishes per day to plan daily specials</li>
        </ul>
      </div>
    </div>
  );
};

export default SalesByDayChart;
