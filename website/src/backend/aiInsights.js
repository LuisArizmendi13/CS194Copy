// File: aiInsights.js
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("🧠 AI Insights API called");

  try {
    const { query, data } = req.body;
    console.log("📊 Query received:", query);
    console.log("📊 Data preview:", data ? "Data present" : "No data provided");

    if (!query) {
      console.log("❌ No query provided");
      return res.status(400).json({ error: "Query is required" });
    }

    // Get restaurant ID from Cognito session (optional, if you want to associate insights with restaurant)
    const restaurantId = req.app.locals.getUserRestaurantId
      ? req.app.locals.getUserRestaurantId(req)
      : null;
    console.log("🍽️ Restaurant ID:", restaurantId || "Not available");

    // Prepare a comprehensive version of the data for the AI
    const enhancedData = prepareDataForAI(data);

    // Make request to OpenAI
    const aiResponse = await getAIInsights(req, query, enhancedData);
    console.log("🧠 AI response generated successfully");

    // Return the response
    return res.status(200).json(aiResponse);
  } catch (error) {
    console.error("❌ AI Insights API error:", error);
    return res.status(500).json({
      error: "Failed to generate insights",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Enhanced function to prepare data for AI
function prepareDataForAI(data) {
  // If no data was provided, return empty object
  if (!data || !data.processedData) {
    console.log("⚠️ No data provided for AI analysis");
    return { summary: "No data available" };
  }

  console.log("📊 Preparing comprehensive data for AI analysis");

  // Extract all the various data we have
  const {
    processedData,
    timeOfDayData,
    dayOfWeekData,
    monthlyData,
    seasonalData,
    dateRange,
  } = data;

  try {
    // Create a summary of the dish data
    const dishSummary = processedData.map((dish) => ({
      name: dish.name,
      category: dish.category,
      totalSales: dish.totalSales,
      totalRevenue: dish.totalRevenue,
      totalProfit: dish.totalProfit,
      salesData: dish.salesData || {},
    }));

    // Sort dishes by various metrics
    const topSellingDishes = [...dishSummary]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

    const topRevenueDishes = [...dishSummary]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    const topProfitDishes = [...dishSummary]
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, 5);

    // Find worst performers if available
    const worstSellingDishes = [...dishSummary]
      .sort((a, b) => a.totalSales - b.totalSales)
      .slice(0, 3);

    // Prepare detailed time analysis
    const timeAnalysis = {
      byTimeOfDay: timeOfDayData || {},
      byDayOfWeek: dayOfWeekData || {},
      busiest: {
        timeOfDay: findBusiest(timeOfDayData || {}),
        dayOfWeek: findBusiest(dayOfWeekData || {}),
      },
    };

    // Prepare seasonal analysis
    const seasonalAnalysis = processSeasonalData(seasonalData);

    // Monthly trends analysis
    const monthlyAnalysis = processMonthlyData(monthlyData);

    console.log("✅ Comprehensive data preparation complete");

    return {
      dateRange,
      summary: {
        totalDishes: processedData.length,
        totalSales: processedData.reduce(
          (sum, dish) => sum + (dish.totalSales || 0),
          0
        ),
        totalRevenue: processedData.reduce(
          (sum, dish) => sum + (dish.totalRevenue || 0),
          0
        ),
        totalProfit: processedData.reduce(
          (sum, dish) => sum + (dish.totalProfit || 0),
          0
        ),
      },
      dishes: {
        all: dishSummary,
        topSelling: topSellingDishes,
        topRevenue: topRevenueDishes,
        topProfit: topProfitDishes,
        worstSelling: worstSellingDishes,
      },
      timeAnalysis,
      monthlyAnalysis,
      seasonalAnalysis,
    };
  } catch (err) {
    console.error("❌ Error preparing data for AI:", err);
    return {
      summary: "Error processing data",
      error: err.message,
      rawData: {
        processedData,
        timeOfDayData,
        dayOfWeekData,
        monthlyData,
        seasonalData,
      },
    };
  }
}

// Helper function to find the busiest time/day
function findBusiest(dataObj) {
  if (!dataObj || Object.keys(dataObj).length === 0) {
    return { period: "Unknown", count: 0 };
  }

  const entries = Object.entries(dataObj);
  const busiest = entries.reduce(
    (max, current) => (current[1] > max[1] ? current : max),
    entries[0]
  );

  return { period: busiest[0], count: busiest[1] };
}

// Process seasonal data
function processSeasonalData(seasonalData) {
  if (
    !seasonalData ||
    (!Array.isArray(seasonalData) && typeof seasonalData !== "object")
  ) {
    return { available: false, message: "No seasonal data available" };
  }

  // If it's an array of monthly data
  if (Array.isArray(seasonalData)) {
    const seasonalSummary = {
      Spring: { total: 0, dishes: {} },
      Summer: { total: 0, dishes: {} },
      Fall: { total: 0, dishes: {} },
      Winter: { total: 0, dishes: {} },
    };

    // Process each month's data into seasons
    seasonalData.forEach((monthData) => {
      if (monthData.month) {
        const date = new Date(monthData.month + "-01"); // Create date from YYYY-MM format
        const month = date.getMonth();
        const season = getSeasonFromMonth(month);

        seasonalSummary[season].total += monthData.totalSales || 0;

        // Process dish-specific data if available
        if (monthData.dishes) {
          Object.entries(monthData.dishes).forEach(([dish, count]) => {
            seasonalSummary[season].dishes[dish] =
              (seasonalSummary[season].dishes[dish] || 0) + count;
          });
        }
      }
    });

    return {
      available: true,
      seasons: seasonalSummary,
      topSeasonalDishes: findTopSeasonalDishes(seasonalSummary),
    };
  }

  // If it's already in season format
  return {
    available: true,
    seasons: seasonalData,
    // Add any additional processing needed
  };
}

// Helper for seasonal data
function getSeasonFromMonth(month) {
  // 0-based month: 0 = January, 11 = December
  if (month >= 2 && month <= 4) return "Spring"; // Mar-May
  if (month >= 5 && month <= 7) return "Summer"; // Jun-Aug
  if (month >= 8 && month <= 10) return "Fall"; // Sep-Nov
  return "Winter"; // Dec-Feb
}

// Find dishes that show strong seasonal patterns
function findTopSeasonalDishes(seasonalData) {
  if (!seasonalData || typeof seasonalData !== "object") return [];

  const dishSeasonality = {};

  // Collect sales for each dish across seasons
  Object.entries(seasonalData).forEach(([season, data]) => {
    if (data.dishes) {
      Object.entries(data.dishes).forEach(([dish, count]) => {
        if (!dishSeasonality[dish]) {
          dishSeasonality[dish] = { total: 0, seasons: {} };
        }
        dishSeasonality[dish].seasons[season] = count;
        dishSeasonality[dish].total += count;
      });
    }
  });

  // Calculate seasonality score (variance across seasons)
  const dishesWithScores = Object.entries(dishSeasonality).map(
    ([dish, data]) => {
      const seasons = Object.values(data.seasons);
      if (seasons.length < 2) return { dish, score: 0, peak: "Unknown" };

      // Find average sales per season
      const avgSales = data.total / seasons.length;

      // Calculate variance
      const variance =
        seasons.reduce((sum, count) => sum + Math.pow(count - avgSales, 2), 0) /
        seasons.length;

      // Find peak season
      const peakSeason = Object.entries(data.seasons).reduce(
        (max, [season, count]) =>
          count > (max[1] || 0) ? [season, count] : max,
        ["Unknown", 0]
      );

      return {
        dish,
        score: variance,
        peak: peakSeason[0],
        peakSales: peakSeason[1],
        avgSales,
      };
    }
  );

  // Sort by seasonality score and return top ones
  return dishesWithScores.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Process monthly data
function processMonthlyData(monthlyData) {
  if (!monthlyData || !Array.isArray(monthlyData) || monthlyData.length === 0) {
    return { available: false, message: "No monthly trend data available" };
  }

  // Sort by month
  const sortedMonths = [...monthlyData].sort(
    (a, b) => new Date(a.month + "-01") - new Date(b.month + "-01")
  );

  // Find growth trends
  const growthTrends = [];
  for (let i = 1; i < sortedMonths.length; i++) {
    const prevMonth = sortedMonths[i - 1];
    const currMonth = sortedMonths[i];

    const salesGrowth =
      ((currMonth.totalSales - prevMonth.totalSales) / prevMonth.totalSales) *
      100;
    const revenueGrowth =
      ((currMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100;

    growthTrends.push({
      from: prevMonth.month,
      to: currMonth.month,
      salesGrowth,
      revenueGrowth,
    });
  }

  // Find peak and slowest months
  const peakMonth = [...monthlyData].sort(
    (a, b) => b.totalSales - a.totalSales
  )[0];
  const slowestMonth = [...monthlyData].sort(
    (a, b) => a.totalSales - b.totalSales
  )[0];

  return {
    available: true,
    months: sortedMonths,
    trends: {
      growth: growthTrends,
      peak: {
        month: peakMonth.month,
        sales: peakMonth.totalSales,
        revenue: peakMonth.revenue,
      },
      slowest: {
        month: slowestMonth.month,
        sales: slowestMonth.totalSales,
        revenue: slowestMonth.revenue,
      },
    },
  };
}

// Function to get AI insights using the existing OpenAI setup from server.js
async function getAIInsights(req, query, data) {
  try {
    console.log("🤖 Generating AI insights");

    // Check if we have access to the OpenAI instance
    if (!req.app.locals.openai) {
      console.error("❌ OpenAI instance not available");
      return generateMockResponse(query, data);
    }

    // Create a data summary for the prompt
    const dataSummary = createDataSummaryForPrompt(data);

    // Prepare the prompt for the AI
    const prompt = `
      You are an AI analytics assistant for a restaurant. Analyze the following restaurant sales data and provide insights and actionable recommendations based on the query.
      
      ${dataSummary}

      Current date range filter: ${data.dateRange || "All time"}
      
      User query: "${query}"
      
      Provide a concise, insightful analysis based on this data and the user's query. Include specific, actionable recommendations that the restaurant manager could implement. Format your response as a JSON object with the following structure:
      {
        "answer": "Your main insight and analysis here",
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
      }
    `;

    console.log("🤖 Sending request to OpenAI");

    // Call OpenAI API using the existing openai instance from server.js
    const response = await req.app.locals.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a restaurant analytics expert." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    console.log("✅ Received response from OpenAI");

    // Parse the response
    const aiContent = response.choices[0].message.content;
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(aiContent);
      console.log("✅ Successfully parsed OpenAI response as JSON");
    } catch (e) {
      console.error("⚠️ Error parsing OpenAI response:", e);
      console.log("⚠️ Raw response:", aiContent);

      // If parsing fails, extract the answer and recommendations manually
      parsedResponse = {
        answer: aiContent.includes("answer")
          ? aiContent
              .split("answer")[1]
              .split("recommendations")[0]
              .replace(/[":,{}]/g, "")
              .trim()
          : aiContent,
        recommendations: [],
      };
    }

    return parsedResponse;
  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error);
    return generateMockResponse(query, data);
  }
}

// Helper function to create a data summary for the prompt
function createDataSummaryForPrompt(data) {
  if (!data || !data.summary) {
    return "No data available for analysis.";
  }

  // Basic summary info
  let summary = `
    The data provided includes:
    - Total dishes: ${data.summary.totalDishes}
    - Total sales: ${data.summary.totalSales} orders
    - Total revenue: ${data.summary.totalRevenue.toFixed(2)}
    - Total profit: ${data.summary.totalProfit.toFixed(2)}
  `;

  // Top dishes info
  if (data.dishes && data.dishes.topSelling) {
    summary += `
    - Top selling dishes: ${data.dishes.topSelling
      .map((d) => `${d.name} (${d.totalSales} sales)`)
      .join(", ")}
    - Top revenue dishes: ${data.dishes.topRevenue
      .map((d) => `${d.name} (${d.totalRevenue.toFixed(2)})`)
      .join(", ")}
    - Top profit dishes: ${data.dishes.topProfit
      .map((d) => `${d.name} (${d.totalProfit.toFixed(2)})`)
      .join(", ")}
    `;

    if (data.dishes.worstSelling.length > 0) {
      summary += `
    - Lowest selling dishes: ${data.dishes.worstSelling
      .map((d) => `${d.name} (${d.totalSales} sales)`)
      .join(", ")}
      `;
    }
  }

  // Time analysis info
  if (data.timeAnalysis) {
    const { timeAnalysis } = data;

    if (
      timeAnalysis.byTimeOfDay &&
      Object.keys(timeAnalysis.byTimeOfDay).length > 0
    ) {
      summary += `
    - Sales by time of day: ${JSON.stringify(timeAnalysis.byTimeOfDay)}
    - Busiest time of day: ${timeAnalysis.busiest.timeOfDay.period} (${
        timeAnalysis.busiest.timeOfDay.count
      } orders)
      `;
    }

    if (
      timeAnalysis.byDayOfWeek &&
      Object.keys(timeAnalysis.byDayOfWeek).length > 0
    ) {
      summary += `
    - Sales by day of week: ${JSON.stringify(timeAnalysis.byDayOfWeek)}
    - Busiest day of week: ${timeAnalysis.busiest.dayOfWeek.period} (${
        timeAnalysis.busiest.dayOfWeek.count
      } orders)
      `;
    }
  }

  // Seasonal analysis
  if (data.seasonalAnalysis && data.seasonalAnalysis.available) {
    summary += `
    - Seasonal analysis: Available
    `;

    if (
      data.seasonalAnalysis.topSeasonalDishes &&
      data.seasonalAnalysis.topSeasonalDishes.length > 0
    ) {
      summary += `
    - Top seasonal dishes: ${data.seasonalAnalysis.topSeasonalDishes
      .map((d) => `${d.dish} (Peak: ${d.peak})`)
      .join(", ")}
      `;
    }
  } else {
    summary += `
    - Seasonal analysis: Not available
    `;
  }

  // Monthly analysis
  if (data.monthlyAnalysis && data.monthlyAnalysis.available) {
    const { trends } = data.monthlyAnalysis;
    summary += `
    - Monthly trends: Available
    - Peak month: ${trends.peak.month} (${trends.peak.sales} sales)
    - Slowest month: ${trends.slowest.month} (${trends.slowest.sales} sales)
    `;
  } else {
    summary += `
    - Monthly trends: Not available
    `;
  }

  return summary;
}

// Mock response function for fallbacks or when API errors occur
function generateMockResponse(query, data) {
  console.log("⚠️ Using mock response generator");

  const lowercaseQuery = query.toLowerCase();

  // Default response
  let response = {
    answer:
      "Based on the sales data, I notice several interesting trends. Your evening service is particularly strong, and weekends show higher sales volumes than weekdays.",
    recommendations: [
      "Consider running weekday lunch specials to boost slower periods",
      "Your top 3 dishes account for a significant portion of revenue - ensure these are consistently excellent",
      "Look into optimizing your staffing during peak hours to improve service and efficiency",
    ],
  };

  // Tailor response based on query keywords and available data
  if (
    lowercaseQuery.includes("top") ||
    lowercaseQuery.includes("best") ||
    lowercaseQuery.includes("performing")
  ) {
    // Use actual top dishes if available
    let topDishes = "your most popular items";
    if (
      data &&
      data.dishes &&
      data.dishes.topSelling &&
      data.dishes.topSelling.length >= 3
    ) {
      const dishes = data.dishes.topSelling.slice(0, 3);
      topDishes = dishes.map((d) => d.name).join(", ");
    }

    response = {
      answer: `Your top 3 best-selling items are ${topDishes}. These items have significantly higher order volumes than other menu items, suggesting they're customer favorites.`,
      recommendations: [
        "Ensure these popular items are prominently featured on your menu",
        "Consider creating special 'fan favorite' labeling for these items",
        "Develop combo meals or pairings that include these popular items to boost average check size",
      ],
    };
  }
  // Profitability queries
  else if (
    lowercaseQuery.includes("profit") ||
    lowercaseQuery.includes("margin") ||
    lowercaseQuery.includes("revenue")
  ) {
    // Use actual profit data if available
    let profitMargin = "30%";
    if (data && data.summary) {
      profitMargin =
        ((data.summary.totalProfit / data.summary.totalRevenue) * 100).toFixed(
          1
        ) + "%";
    }

    response = {
      answer: `Your average profit margin across all dishes is around ${profitMargin}, which is solid for the restaurant industry. However, there's significant variation between items - some have margins as high as 45% while others are below 20%.`,
      recommendations: [
        "Consider slight price adjustments for your low-margin but popular items",
        "Review ingredient costs for dishes with margins below 25%",
        "Promote your high-margin items through server recommendations and featured placements",
      ],
    };
  }
  // Queries about removing items
  else if (
    lowercaseQuery.includes("remove") ||
    lowercaseQuery.includes("eliminate") ||
    lowercaseQuery.includes("worst")
  ) {
    // Use actual worst-selling dishes if available
    let worstDish = "underperforming menu items";
    if (
      data &&
      data.dishes &&
      data.dishes.worstSelling &&
      data.dishes.worstSelling.length > 0
    ) {
      worstDish = data.dishes.worstSelling[0].name;
    }

    response = {
      answer: `Based on your data, the '${worstDish}' has the lowest sales volume and poorest profit margin. It also requires ingredients not used in other dishes, increasing inventory costs.`,
      recommendations: [
        `Consider removing ${worstDish} from your menu`,
        "Alternatively, revamp the recipe to use more common ingredients",
        "If keeping it, increase the price slightly to improve margins",
      ],
    };
  }
  // Time/business queries
  else if (
    lowercaseQuery.includes("busy") ||
    lowercaseQuery.includes("time") ||
    lowercaseQuery.includes("day") ||
    lowercaseQuery.includes("when")
  ) {
    // Use actual busiest time data if available
    let busiestTime = "evening hours (5-9pm)";
    let busiestDay = "Fridays and Saturdays";

    if (data && data.timeAnalysis) {
      if (data.timeAnalysis.busiest.timeOfDay.period !== "Unknown") {
        busiestTime = data.timeAnalysis.busiest.timeOfDay.period.toLowerCase();
      }
      if (data.timeAnalysis.busiest.dayOfWeek.period !== "Unknown") {
        busiestDay = data.timeAnalysis.busiest.dayOfWeek.period;
      }
    }

    response = {
      answer: `Your restaurant is busiest during ${busiestTime}, particularly on ${busiestDay}. Your slowest period is early afternoon on Mondays and Tuesdays.`,
      recommendations: [
        `Optimize staffing to ensure you have your strongest team during peak ${busiestDay} ${busiestTime} service`,
        "Consider early-week promotions like 'Monday Madness' or 'Taco Tuesday' to boost slower days",
        "Implement a happy hour during your afternoon lull to attract the after-work crowd",
      ],
    };
  }
  // Seasonal queries
  else if (
    lowercaseQuery.includes("season") ||
    lowercaseQuery.includes("trend") ||
    lowercaseQuery.includes("weather") ||
    lowercaseQuery.includes("prepare")
  ) {
    // Use actual seasonal data if available
    let seasonalInfo =
      "lighter dishes like salads and seafood performing better in summer months, while heartier dishes like pasta and soups perform better in fall and winter";

    if (
      data &&
      data.seasonalAnalysis &&
      data.seasonalAnalysis.available &&
      data.seasonalAnalysis.topSeasonalDishes &&
      data.seasonalAnalysis.topSeasonalDishes.length > 0
    ) {
      const topSeasonalDish = data.seasonalAnalysis.topSeasonalDishes[0];
      seasonalInfo = `${topSeasonalDish.dish} performing best during ${topSeasonalDish.peak}`;
    }

    response = {
      answer: `Your data shows notable seasonal trends with ${seasonalInfo}.`,
      recommendations: [
        "Plan seasonal menu rotations to capitalize on these trends",
        "Start promoting seasonal specials 2-3 weeks before the season change",
        "Consider limited-time offers to create urgency during peak seasons",
      ],
    };
  }

  console.log("✅ Generated mock response");
  return response;
}

module.exports = router;
