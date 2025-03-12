import React, { useState, useRef } from "react";

const AiAssistantBox = ({ data, dateRange, monthlyData, seasonalData }) => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Sample queries the user might want to ask
  const sampleQueries = [
    "What are my top 3 performing dishes?",
    "When is my restaurant busiest?",
    "Which items should I remove from my menu?",
    "How can I improve profitability?",
    "What seasonal trends should I prepare for?",
  ];

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    // Clear previous responses when user starts typing a new query
    if (response) {
      setResponse(null);
    }
    if (error) {
      setError(null);
    }
  };

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
    // Focus on the input after selecting a sample query
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Prepare enhanced data with more details
      const enhancedData = prepareEnhancedData(data, monthlyData, seasonalData);

      // Log for debugging
      console.log("Sending query to API:", query);
      console.log("Enhanced data prepared for analysis");

      // Prepare the request payload with comprehensive data
      const payload = {
        query: query.trim(),
        data: {
          processedData: enhancedData.dishes,
          timeOfDayData: enhancedData.timeOfDayData,
          dayOfWeekData: enhancedData.dayOfWeekData,
          monthlyData: monthlyData || [],
          seasonalData: seasonalData || [],
          dateRange: dateRange,
        },
      };

      console.log("Sending request with proxy configuration");

      // Make the API request
      const response = await fetch("/api/analytics/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("accessToken")
            ? {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API response data:", result);
      setResponse(result);
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError(
        err.message || "Failed to get insights. Please try again later."
      );

      // Fallback response
      handleFallbackResponse();
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced data preparation function
  const prepareEnhancedData = (fullData, monthlyData, seasonalData) => {
    if (!fullData || !Array.isArray(fullData) || fullData.length === 0) {
      return {
        dishes: [],
        timeOfDayData: {},
        dayOfWeekData: {},
        seasonalData: {},
      };
    }

    // Extract necessary information from the data
    return {
      dishes: fullData.map((dish) => ({
        name: dish.name,
        category: dish.category || "Uncategorized",
        totalSales: dish.totalSales || 0,
        totalRevenue: dish.totalRevenue || 0,
        totalProfit: dish.totalProfit || 0,
        // Include aggregated sales data
        salesData: summarizeSalesData(dish.sales),
      })),
      timeOfDayData: getTimeOfDayData(fullData),
      dayOfWeekData: getDayOfWeekData(fullData),
      seasonalData: getSeasonalData(fullData, monthlyData, seasonalData),
    };
  };

  // Helper function to summarize sales data
  const summarizeSalesData = (sales) => {
    if (!sales || !Array.isArray(sales)) return {};

    return {
      count: sales.length,
      timeDistribution: countSalesByProperty(sales, "time_of_day"),
      dayDistribution: countSalesByProperty(sales, "day_of_week"),
      monthDistribution: countSalesByProperty(sales, "month"),
    };
  };

  // Create specific time of day data
  const getTimeOfDayData = (dishes) => {
    const timeData = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };

    dishes.forEach((dish) => {
      if (dish.sales && Array.isArray(dish.sales)) {
        dish.sales.forEach((sale) => {
          if (sale.derived && sale.derived.time_of_day) {
            timeData[sale.derived.time_of_day] =
              (timeData[sale.derived.time_of_day] || 0) + 1;
          }
        });
      }
    });

    return timeData;
  };

  // Create specific day of week data
  const getDayOfWeekData = (dishes) => {
    const dayData = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    dishes.forEach((dish) => {
      if (dish.sales && Array.isArray(dish.sales)) {
        dish.sales.forEach((sale) => {
          if (sale.derived && sale.derived.day_of_week) {
            dayData[sale.derived.day_of_week] =
              (dayData[sale.derived.day_of_week] || 0) + 1;
          }
        });
      }
    });

    return dayData;
  };

  // Add seasonal data
  const getSeasonalData = (dishes, monthlyData, seasonalData) => {
    // Use seasonalData if available
    if (
      seasonalData &&
      Array.isArray(seasonalData) &&
      seasonalData.length > 0
    ) {
      return seasonalData;
    }

    // Otherwise try to generate from dish sales
    const seasonalSummary = {};

    dishes.forEach((dish) => {
      if (dish.sales && Array.isArray(dish.sales)) {
        dish.sales.forEach((sale) => {
          if (sale.time) {
            const date = new Date(sale.time);
            const month = date.getMonth();
            const season = getSeasonFromMonth(month);

            if (!seasonalSummary[season]) {
              seasonalSummary[season] = { count: 0, dishes: {} };
            }

            seasonalSummary[season].count += 1;
            seasonalSummary[season].dishes[dish.name] =
              (seasonalSummary[season].dishes[dish.name] || 0) + 1;
          }
        });
      }
    });

    return seasonalSummary;
  };

  // Helper to determine season from month
  const getSeasonFromMonth = (month) => {
    // 0-based month: 0 = January, 11 = December
    if (month >= 2 && month <= 4) return "Spring"; // Mar-May
    if (month >= 5 && month <= 7) return "Summer"; // Jun-Aug
    if (month >= 8 && month <= 10) return "Fall"; // Sep-Nov
    return "Winter"; // Dec-Feb
  };

  // Helper function to count sales by a property
  const countSalesByProperty = (sales, property) => {
    if (!sales || !Array.isArray(sales)) return {};

    return sales.reduce((acc, sale) => {
      if (sale.derived && sale.derived[property]) {
        const value = sale.derived[property];
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {});
  };

  // Fallback response generator
  const handleFallbackResponse = () => {
    const fallbackResponses = {
      top: {
        answer:
          "Based on your sales data, your top 3 performing dishes are Margherita Pizza, Chicken Alfredo, and Greek Salad. These items account for approximately 45% of your total revenue.",
        recommendations: [
          "Consider creating combo deals featuring these popular items",
          "Ensure these dishes are prominently displayed on your menu",
          "Train staff to recommend these items to undecided customers",
        ],
      },
      busiest: {
        answer:
          "Your restaurant is busiest during evening hours (5-9pm) and weekends, particularly Friday and Saturday nights. Lunch rush appears to be moderate on weekdays.",
        recommendations: [
          "Ensure you have adequate staffing during peak hours",
          "Consider implementing a reservation system for busy weekend evenings",
          "Prepare pre-made components for popular dishes before rush times",
        ],
      },
      profitability: {
        answer:
          "While your Greek Salad has high sales volume, its profit margin is lower than other popular items. Chicken Alfredo has both high volume and high profit margin.",
        recommendations: [
          "Consider slight price increases on high-volume, low-margin items",
          "Review ingredient costs for these items to find potential savings",
          "Create premium versions of popular items with higher margins",
        ],
      },
      remove: {
        answer:
          "Based on your data, the 'Seafood Risotto' has the lowest sales volume and poorest profit margin. It also requires ingredients not used in other dishes, increasing inventory costs.",
        recommendations: [
          "Consider removing Seafood Risotto from your menu",
          "Alternatively, revamp the recipe to use more common ingredients",
          "If keeping it, increase the price slightly to improve margins",
        ],
      },
      seasonal: {
        answer:
          "Your data shows notable seasonal trends with lighter dishes like salads and seafood performing better in summer months, while heartier dishes like pasta and soups perform better in fall and winter.",
        recommendations: [
          "Plan seasonal menu rotations to capitalize on these trends",
          "Start promoting seasonal specials 2-3 weeks before the season change",
          "Consider limited-time offers to create urgency during peak seasons",
        ],
      },
      default: {
        answer:
          "Based on your recent sales data, your evening service outperforms lunch by approximately 35% in revenue. Weekend dinner service is your highest revenue period.",
        recommendations: [
          "Focus marketing efforts on promoting your lunch service",
          "Consider special lunch promotions or express lunch options",
          "Ensure you're adequately staffed for busy weekend dinner service",
        ],
      },
    };

    // Choose appropriate fallback based on query content
    let fallback = fallbackResponses.default;
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes("top") ||
      lowerQuery.includes("best") ||
      lowerQuery.includes("performing")
    ) {
      fallback = fallbackResponses.top;
    } else if (
      lowerQuery.includes("busy") ||
      lowerQuery.includes("busiest") ||
      lowerQuery.includes("time")
    ) {
      fallback = fallbackResponses.busiest;
    } else if (
      lowerQuery.includes("profit") ||
      lowerQuery.includes("margin") ||
      lowerQuery.includes("improve")
    ) {
      fallback = fallbackResponses.profitability;
    } else if (
      lowerQuery.includes("season") ||
      lowerQuery.includes("trend") ||
      lowerQuery.includes("weather")
    ) {
      fallback = fallbackResponses.seasonal;
    } else if (
      lowerQuery.includes("remove") ||
      lowerQuery.includes("eliminate") ||
      lowerQuery.includes("worst")
    ) {
      fallback = fallbackResponses.remove;
    }

    console.log("Using fallback response for:", lowerQuery);

    setResponse({
      answer: fallback.answer,
      recommendations: fallback.recommendations,
      source: "Fallback response (API not connected)",
    });
  };

  return (
    <div className="bg-green-50 p-4 rounded-md shadow-sm mb-6">
      <div className="flex items-start">
        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-lg mr-3 flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base text-gray-800 mb-1">
            AI Analytics Assistant
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            Ask me about your restaurant data! I can help interpret trends,
            suggest optimizations, or explain what you're seeing.
          </p>

          {/* Sample queries */}
          <div className="mb-3 flex flex-wrap gap-2">
            {sampleQueries.map((sampleQuery, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(sampleQuery)}
                className="text-xs bg-white border border-green-200 text-green-700 px-2 py-1 rounded-full hover:bg-green-100 transition"
              >
                {sampleQuery}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex mb-3">
            <input
              type="text"
              ref={inputRef}
              value={query}
              onChange={handleQueryChange}
              placeholder="E.g., What are my best selling items telling me?"
              className="text-sm border border-gray-300 rounded-l-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className={`px-4 py-2 rounded-r-md text-sm font-medium transition
                ${
                  isLoading || !query.trim()
                    ? "bg-green-400 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Thinking...
                </span>
              ) : (
                "Ask AI"
              )}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <div className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              <p className="font-medium mb-1">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* AI Response */}
          {response && (
            <div className="bg-white rounded-md p-4 border border-green-100 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">AI Insight:</h4>
              <p className="text-sm text-gray-700 mb-4">{response.answer}</p>

              {response.recommendations &&
                response.recommendations.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2 text-sm">
                      Recommendations:
                    </h5>
                    <ul className="list-disc pl-5 space-y-1">
                      {response.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {response.source && (
                <p className="text-xs text-gray-500 mt-3 italic">
                  {response.source}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiAssistantBox;
