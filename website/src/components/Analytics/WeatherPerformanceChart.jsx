import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const WeatherPerformanceChart = ({ data }) => {
  return (
    <div className="h-64">
      <BarChart
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
        <Bar dataKey="dishes_sold" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default WeatherPerformanceChart;
