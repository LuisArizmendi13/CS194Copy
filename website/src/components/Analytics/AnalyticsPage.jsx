import React, { useState, useEffect } from "react";
import salesData from "./sales_data.json";
import { processSalesData } from "./processSalesData";

import BestSellingChart from "./Charts/BestSellingChart";
import RevenueProfitChart from "./Charts/RevenueProfitChart";
import SalesTrendChart from "./Charts/SalesTrendChart";
import SalesByTimeOfDayChart from "./Charts/SalesByTimeOfDayChart";
import SalesByDayChart from "./Charts/SalesByDayChart";
import SeasonalPerformanceChart from "./Charts/SeasonalPerformanceChart";
import WeatherPerformanceChart from "./Charts/WeatherPerformanceChart";

const AnalyticsPage = () => {
  const [processedData, setProcessedData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [seasonalData, setSeasonalData] = useState([]);
  const [weatherData, setWeatherData] = useState([]); // Add state for weather data
  const [chartData, setChartData] = useState([]); // Define chartData as a state
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const enrichedData = processSalesData(salesData);
      setProcessedData(enrichedData);

      // Prepare monthly data for SalesTrendChart
      const salesByMonth = enrichedData.reduce((acc, dish) => {
        dish.sales.forEach((sale) => {
          const date = new Date(sale.time);
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

          if (!acc[monthKey]) {
            acc[monthKey] = {
              month: monthKey,
              totalSales: 0,
              revenue: 0,
            };
          }

          acc[monthKey].totalSales += 1;
          acc[monthKey].revenue += sale.price;
        });
        return acc;
      }, {});

      // Prepare seasonal data (monthly sales per dish)
      const seasonalSales = enrichedData.reduce((acc, dish) => {
        dish.sales.forEach((sale) => {
          const date = new Date(sale.time);
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

          if (!acc[monthKey]) {
            acc[monthKey] = {
              month: monthKey,
              dishes: {},
            };
          }

          if (!acc[monthKey].dishes[dish.name]) {
            acc[monthKey].dishes[dish.name] = 0;
          }

          acc[monthKey].dishes[dish.name] += 1;
        });
        return acc;
      }, {});

      // Assuming enrichedData is the result of processSalesData(rawData)
      const weatherSales = enrichedData.reduce((acc, dish) => {
        dish.sales.forEach((sale) => {
          const weatherCategory = sale.derived.weather_condition;

          if (!acc[weatherCategory]) {
            acc[weatherCategory] = {
              weather: weatherCategory,
              dishes: {},
            };
          }

          if (!acc[weatherCategory].dishes[dish.name]) {
            acc[weatherCategory].dishes[dish.name] = {
              totalSales: 0,
              totalRevenue: 0,
              count: 0,
            };
          }

          acc[weatherCategory].dishes[dish.name].totalSales += 1;
          acc[weatherCategory].dishes[dish.name].totalRevenue += dish.price;
          acc[weatherCategory].dishes[dish.name].count += 1;
        });

        return acc;
      }, {});

      // Extract data for charting
      const chartDataToSet = Object.keys(weatherSales).map((weather) => {
        return {
          weather: weatherSales[weather].weather,
          totalSales: Object.values(weatherSales[weather].dishes).reduce((acc, dish) => acc + dish.totalSales, 0),
        };
      });

      setMonthlyData(Object.values(salesByMonth));
      setSeasonalData(Object.values(seasonalSales));
      setWeatherData(Object.values(weatherSales));
      setChartData(chartDataToSet); // Update chartData state
    } catch (error) {
      setError(error.message); // Handle the error by setting the error state
    }
  }, [salesData]);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!processedData.length) {
    return (
      <div className="p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurant Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Make data-driven decisions about your menu with these key insights
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* High-level metrics section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Menu Performance
            </h2>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <BestSellingChart data={processedData} />
              </div>
            </div>
          </section>

          {/* Financial metrics section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Financial Analysis
            </h2>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <RevenueProfitChart data={processedData} />
              </div>
            </div>
          </section>

          {/* Time-based analysis section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Temporal Analysis
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <SalesTrendChart data={monthlyData} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <SalesByTimeOfDayChart data={processedData} />
                </div>
              </div>
            </div>
          </section>

          {/* Weekly patterns section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Weekly Patterns
            </h2>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <SalesByDayChart data={processedData} />
              </div>
            </div>
          </section>

          {/* Seasonal Analysis section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Seasonal Analysis
            </h2>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <SeasonalPerformanceChart data={seasonalData} />
              </div>
            </div>
          </section>

          {/* Weather Analysis section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Weather Analysis
            </h2>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <WeatherPerformanceChart data={chartData} />
              </div>
            </div>
          </section>
        </div>
      </div>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
};

export default AnalyticsPage;
