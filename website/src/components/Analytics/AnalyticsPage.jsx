// analyticspage.jsx
import React, { useState, useEffect } from "react";
import salesData from "./sales_data.json";
import { processSalesData } from "./processSalesData";

import BestSellingChart from "./Charts/BestSellingChart";
import RevenueProfitChart from "./Charts/RevenueProfitChart";
import SalesTrendChart from "./Charts/SalesTrendChart";
import SalesByTimeOfDayChart from "./Charts/SalesByTimeOfDayChart";
import SalesByDayChart from "./Charts/SalesByDayChart";
import SeasonalPerformanceChart from "./Charts/SeasonalPerformanceChart";
import WeatherPerformanceChart from "./WeatherPerformanceChart";

// Function to prepare data for weather chart (defined locally for demonstration)
function prepareWeatherSalesData(processedData) {
  if (!processedData || !Array.isArray(processedData)) {
    console.error("processedData is not defined or not an array.");
    return [];
  }

  const weatherSalesData = {};
  processedData.forEach((dish) => {
    if (!dish.sales || !Array.isArray(dish.sales)) {
      console.error("dish.sales is not defined or not an array.");
      return; // Skip this dish if sales data is invalid
    }

    dish.sales.forEach((sale) => {
      if (!sale.derived || !sale.derived.weather_condition) {
        console.error("Missing derived or weather_condition property.");
        return; // Skip this sale if necessary properties are missing
      }

      const weatherCondition = sale.derived.weather_condition;
      if (!weatherSalesData[weatherCondition]) {
        weatherSalesData[weatherCondition] = 0;
      }
      weatherSalesData[weatherCondition]++;
    });
  });

  // Convert object to chart data format
  const chartData = Object.keys(weatherSalesData).map((condition) => ({
    weather_condition: condition,
    dishes_sold: weatherSalesData[condition],
  }));

  return chartData;
}

const AnalyticsPage = () => {
  const [processedData, setProcessedData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [seasonalData, setSeasonalData] = useState([]);
  const [weatherSalesData, setWeatherSalesData] = useState([]); // New state for weather sales data
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const location = { city: 'New York', state: 'NY' }; // Example location
      processSalesData(salesData, location).then((enrichedData) => {
        if (Array.isArray(enrichedData)) {
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

          const monthlyTrends = Object.values(salesByMonth).sort((a, b) =>
            a.month.localeCompare(b.month)
          );
          setMonthlyData(monthlyTrends);

          const seasonalTrends = Object.values(seasonalSales).sort((a, b) =>
            a.month.localeCompare(b.month)
          );
          setSeasonalData(seasonalTrends);

          // Prepare weather sales data
          if (enrichedData.length > 0) {
            const weatherData = prepareWeatherSalesData(enrichedData);
            setWeatherSalesData(weatherData);
          }
        } else {
          console.error("Processed data is not an array.");
        }
      }).catch((err) => {
        console.error("Error processing data:", err);
        setError(
          "There was an error loading your analytics. Please try refreshing the page."
        );
      });
    } catch (err) {
      console.error("Error processing data:", err);
      setError(
        "There was an error loading your analytics. Please try refreshing the page."
      );
    }
  }, []);

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

          {/* Weather Performance section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Weather Performance
            </h2>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {weatherSalesData.length > 0 && (
                  <WeatherPerformanceChart data={weatherSalesData} />
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default AnalyticsPage;
