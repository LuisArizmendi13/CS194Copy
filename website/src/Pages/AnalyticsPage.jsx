// analyticspage.jsx
import React, { useState, useEffect } from "react";
import salesData from "../components/Analytics/sales_data.json";
import { processSalesData } from "../components/Analytics/processSalesData";

import BestSellingChart from "../components/Analytics/Charts/BestSellingChart";
import RevenueProfitChart from "../components/Analytics/Charts/RevenueProfitChart";
import SalesTrendChart from "../components/Analytics/Charts/SalesTrendChart";
import SalesByTimeOfDayChart from "../components/Analytics/Charts/SalesByTimeOfDayChart";
import SalesByDayChart from "../components/Analytics/Charts/SalesByDayChart";
import SeasonalPerformanceChart from "../components/Analytics/Charts/SeasonalPerformanceChart";
import AiAssistantBox from "../components/AiAssistantBox"; // Adjust path as needed based on your file structure
import WeatherPerformanceChart from "../components/Analytics/WeatherPerformanceChart";

// Function to prepare data for weather chart
export function prepareWeatherSalesData(processedData) {
  if (!processedData || !Array.isArray(processedData)) {
    console.error("processedData is not defined or not an array.");
    return [];
  }

  const weatherConditions = Array.from(
    new Set(processedData.flatMap((dish) => Object.keys(dish.dishesByWeather)))
  );

  const chartData = weatherConditions.map((condition) => {
    const dataPoint = { weather_condition: condition };
    processedData.forEach((dish) => {
      if (dish.dishesByWeather[condition]) {
        dataPoint[dish.name] = dish.dishesByWeather[condition][dish.name] || 0;
      } else {
        dataPoint[dish.name] = 0;
      }
    });
    return dataPoint;
  });

  return chartData;
}

const AnalyticsPage = () => {
  const [processedData, setProcessedData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [seasonalData, setSeasonalData] = useState([]);
  const [weatherSalesData, setWeatherSalesData] = useState([]); // New state for weather sales data
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("last30days");
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(true);

  // State for visible charts
  const [visibleCharts, setVisibleCharts] = useState({
    bestSelling: true,
    revenueProfit: true,
    salesTrend: true,
    timeOfDay: true,
    dayOfWeek: true,
    seasonal: false,
    weather: false,
  });

  // Toggle chart visibility
  const toggleChart = (chartName) => {
    setVisibleCharts((prev) => ({
      ...prev,
      [chartName]: !prev[chartName],
    }));
  };

  // Toggle AI Assistant visibility
  const toggleAiAssistant = () => {
    setIsAiAssistantOpen((prev) => !prev);
  };

  useEffect(() => {
    try {
      const location = { city: "San Francisco", state: "CA" }; // Example location
      processSalesData(salesData, location)
        .then((enrichedData) => {
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
        })
        .catch((err) => {
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
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!processedData.length) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Date range options
  const dateRangeOptions = [
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "last90days", label: "Last 90 Days" },
    { value: "ytd", label: "Year to Date" },
    { value: "custom", label: "Custom Range" },
  ];

  // Chart options for toggle
  const chartOptions = [
    { id: "bestSelling", label: "Best Selling Items" },
    { id: "revenueProfit", label: "Revenue vs Profit" },
    { id: "salesTrend", label: "Sales Trend" },
    { id: "timeOfDay", label: "Time of Day Analysis" },
    { id: "dayOfWeek", label: "Day of Week Analysis" },
    { id: "seasonal", label: "Seasonal Performance" },
    { id: "weatherPerformance", label: "Weather Performance" },
  ];

  // Simple guidance component
  const ChartGuidance = ({ children }) => (
    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
      <h4 className="text-sm font-medium text-blue-800 mb-2">
        How to interpret this chart:
      </h4>
      <div className="text-sm text-blue-700">{children}</div>
    </div>
  );

  // Reusable Chart Card component
  const ChartCard = ({ title, children, guidance }) => (
    <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
      <div className="border-b border-gray-100 p-4">
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
      {guidance && <ChartGuidance>{guidance}</ChartGuidance>}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Make data-driven decisions to optimize your restaurant's
                performance
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex items-center">
              <div className="mr-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  {dateRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </header>

        {/* AI Assistant - Can be toggled on/off */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">
            AI Analytics Assistant
          </h2>
          <button
            onClick={toggleAiAssistant}
            className="text-sm text-green-600 hover:text-green-800 transition"
          >
            {isAiAssistantOpen ? "Hide Assistant" : "Show Assistant"}
          </button>
        </div>

        {isAiAssistantOpen && (
          <AiAssistantBox
            data={processedData}
            dateRange={dateRange}
            monthlyData={monthlyData}
            seasonalData={seasonalData}
          />
        )}

        {/* Chart Selection */}
        <div className="bg-white rounded-md shadow-sm mb-6 p-4">
          <h3 className="text-base font-bold text-gray-800 mb-3">
            Customize Your Dashboard
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Select which charts you want to see:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
  {chartOptions.map((option) => (
    <div key={option.id} className="flex items-center">
      <input
        type="checkbox"
        id={option.id}
        checked={visibleCharts[option.id]}
        onChange={() => toggleChart(option.id)}
        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      />
      <label
        htmlFor={option.id}
        className="ml-2 text-sm text-gray-700"
      >
        {option.label}
      </label>
    </div>
  ))}
</div>
        </div>

        {/* Charts - Only show if toggled on */}
        {visibleCharts.bestSelling && (
          <ChartCard
            title="Best Selling Items"
            guidance={
              <>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    The purple bars show how many times each dish was ordered.
                    Taller bars = more popular dishes.
                  </li>
                  <li>
                    The green bars show how much money each dish brought in.
                    Look for dishes with short purple bars but tall green bars -
                    these make a lot of money despite fewer orders.
                  </li>
                  <li>
                    Focus on keeping your top 5 dishes consistently available
                    and well-promoted.
                  </li>
                  <li>
                    Consider removing or revamping items at the bottom that
                    aren't selling well.
                  </li>
                </ul>
              </>
            }
          >
            <BestSellingChart data={processedData} />
          </ChartCard>
        )}

        {visibleCharts.revenueProfit && (
          <ChartCard
            title="Revenue vs Profit Analysis"
            guidance={
              <>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Blue bars show total revenue (money coming in), while green
                    bars show actual profit after costs.
                  </li>
                  <li>
                    A big gap between blue and green bars means high costs -
                    consider adjusting ingredients or pricing.
                  </li>
                  <li>
                    Items with tall green bars are your money-makers - feature
                    these prominently on your menu.
                  </li>
                  <li>
                    Look for dishes where the green bar is very small compared
                    to the blue - these aren't profitable and may need price
                    increases or recipe changes.
                  </li>
                </ul>
              </>
            }
          >
            <RevenueProfitChart data={processedData} />
          </ChartCard>
        )}

        {visibleCharts.salesTrend && (
          <ChartCard
            title="Monthly Sales Trend"
            guidance={
              <>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    This line shows how your total sales change month to month.
                  </li>
                  <li>
                    Look for patterns like summer peaks or winter dips - these
                    help you prepare for seasonal changes.
                  </li>
                  <li>
                    Sudden drops might indicate a problem to address, while
                    spikes might be promotions that worked well.
                  </li>
                  <li>
                    Use this to forecast future months and plan staffing and
                    inventory accordingly.
                  </li>
                </ul>
              </>
            }
          >
            <SalesTrendChart data={monthlyData} />
          </ChartCard>
        )}

        {visibleCharts.timeOfDay && (
          <ChartCard
            title="Sales by Time of Day"
            guidance={
              <>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    This shows when your restaurant is busiest throughout the
                    day.
                  </li>
                  <li>Taller bars mean more orders during that time period.</li>
                  <li>
                    Schedule more staff during your peak hours shown by the
                    tallest bars.
                  </li>
                  <li>
                    For times with shorter bars, consider special promotions
                    (like happy hour) to boost slow periods.
                  </li>
                  <li>
                    Preparation should be done before your busiest periods.
                  </li>
                </ul>
              </>
            }
          >
            <SalesByTimeOfDayChart data={processedData} />
          </ChartCard>
        )}

        {visibleCharts.dayOfWeek && (
          <ChartCard
            title="Sales by Day of Week"
            guidance={
              <>
                <ul className="list-disc pl-4 space-y-1">
                  <li>This shows which days of the week are your busiest.</li>
                  <li>Taller bars indicate days with more orders.</li>
                  <li>
                    Schedule your most experienced staff on your busiest days.
                  </li>
                  <li>
                    For slower days (shorter bars), consider running specials to
                    boost traffic.
                  </li>
                  <li>Order more ingredients before your busiest days.</li>
                  <li>
                    Look at which specific dishes are popular on different days
                    to plan daily specials.
                  </li>
                </ul>
              </>
            }
          >
            <SalesByDayChart data={processedData} />
          </ChartCard>
        )}
{visibleCharts.weatherPerformance && (
  <ChartCard
    title="Weather Performance"
    guidance={
      <>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            This chart shows how different dishes perform under various weather conditions.
          </li>
          <li>
            Look for dishes that consistently perform well across different weather conditions.
          </li>
          <li>
            Consider adjusting menu offerings or promotions based on weather forecasts.
          </li>
        </ul>
      </>
    }
  >
    <WeatherPerformanceChart data={weatherSalesData} />
  </ChartCard>
)}

        {visibleCharts.seasonal && (
          <ChartCard
            title="Seasonal Performance"
            guidance={
              <>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Each colored line represents a different dish's sales
                    throughout the year.
                  </li>
                  <li>
                    Rising lines show increasing popularity; falling lines show
                    decreasing popularity.
                  </li>
                  <li>
                    Look for dishes that peak during certain seasons - these
                    should be highlighted during their peak times.
                  </li>
                  <li>
                    Dishes with significant seasonal patterns should guide your
                    menu planning.
                  </li>
                  <li>
                    Use this to predict which dishes will sell well in upcoming
                    seasons and prepare accordingly.
                  </li>
                </ul>
              </>
            }
          >
            <SeasonalPerformanceChart data={seasonalData} />
          </ChartCard>
        )}

        <footer className="text-center text-gray-500 text-xs mt-6 mb-2">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default AnalyticsPage;
