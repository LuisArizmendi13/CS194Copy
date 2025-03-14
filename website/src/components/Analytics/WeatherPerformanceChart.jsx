import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label, // Import the Label component
} from "recharts";

const COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

const WeatherPerformanceChart = ({ data }) => {
  const dishes = Object.keys(data[0]).filter((key) => key !== "weather_condition");

  return (
    <div className="h-[350px]">
      <LineChart
        width={500}
        height={300}
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
          dataKey="weather_condition"
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
          formatter={(value) => [`${value} orders`, "Orders"]}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: "10px" }}
          verticalAlign="bottom"
          height={36}
        />
        {dishes.map((dish, index) => (
          <Line
            key={dish}
            type="monotone"
            dataKey={dish}
            name={dish}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default WeatherPerformanceChart;
