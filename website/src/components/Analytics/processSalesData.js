// utils/processSalesData.js
export function processSalesData(rawData) {
  return rawData.map((dish) => {
    const totalSales = dish.sales.length;
    const totalRevenue = totalSales * dish.price;

    // Assume cost estimation (later replace with real cost data)
    const estimatedCost = dish.price * 0.6; // Assume cost is ~60% of price
    const totalProfit = totalSales * (dish.price - estimatedCost);

    return {
      ...dish,
      totalSales,
      totalRevenue,
      totalProfit,
      sales: dish.sales.map((sale) => {
        const saleDate = new Date(sale.time);
        return {
          ...sale,
          derived: {
            time_of_day: getTimeOfDay(saleDate),
            day_of_week: getDayOfWeek(saleDate),
            month: getMonth(saleDate),
            weather_condition: simulateWeather(saleDate),
          },
        };
      }),
    };
  });
}

// Function to categorize time of day
function getTimeOfDay(date) {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) return "Morning";
  if (hours >= 12 && hours < 17) return "Afternoon";
  if (hours >= 17 && hours < 21) return "Evening";
  return "Night";
}

// Function to get day of the week
function getDayOfWeek(date) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][date.getDay()];
}

// Function to get month name
function getMonth(date) {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][date.getMonth()];
}

// Simulated weather based on date (can be replaced with real API)
function simulateWeather(date) {
  const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Stormy", "Windy"];
  return weatherOptions[date.getDay() % weatherOptions.length]; // Cycles through options
}
