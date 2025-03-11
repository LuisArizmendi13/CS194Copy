// WeatherPerformanceChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const WeatherPerformanceChart = ({ data }) => {
  const dishes = Object.keys(data[0]).filter((key) => key !== "weather_condition");

  return (
    <div className="h-64">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="weather_condition" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dishes.map((dish) => (
          <Line
            key={dish}
            type="monotone"
            dataKey={dish}
            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default WeatherPerformanceChart;
