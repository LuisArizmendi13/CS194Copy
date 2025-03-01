import requests

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
        const location = new sale.location
        return {
          ...sale,
          derived: {
            time_of_day: getTimeOfDay(saleDate),
            day_of_week: getDayOfWeek(saleDate),
            month: getMonth(saleDate),
            weather_condition: getWeather(saleDate, location),
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
const API_KEY = '1773fa0734e1ab6c35a49bcc67d52198';

async function getLocation(location) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        latitude: data[0].lat,
        longitude: data[0].lon
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}

<<<<<<< Updated upstream
async function getWeather(date, location) {
  const coords = await getLocation(location);
=======

export async function getWeather(date, location) {
  const coords = await getLocation(location);
  
>>>>>>> Stashed changes
  if (!coords) {
    return "Location not found";
  }

  const { latitude, longitude } = coords;
<<<<<<< Updated upstream
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode`;

=======

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${date}&end_date=${date}&hourly=temperature_2m,weathercode`;
>>>>>>> Stashed changes
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();

    const { time, temperature_2m, weathercode } = data.hourly;
    const dateIndex = time.findIndex(t => t.startsWith(date));

    if (dateIndex === -1) {
      return "Date not found in forecast";
    }

    const condition = weathercode[dateIndex];
    return getWeatherDescription(condition);
  } catch (error) {
    console.error('Error fetching weather:', error);
    return "Failed to fetch weather data";
  }
}

<<<<<<< Updated upstream
function getWeatherDescription(condition) {
=======

export function getWeatherDescription(condition) {
>>>>>>> Stashed changes
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Drizzle",
    53: "Drizzle",
    55: "Drizzle",
    56: "Freezing Drizzle",
    57: "Freezing Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Rain",
    66: "Freezing Rain",
    67: "Freezing Rain",
    71: "Snow",
    73: "Snow",
    75: "Snow",
    77: "Snow",
    80: "Rain",
    81: "Rain",
    82: "Rain",
    85: "Snow",
    86: "Snow",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm"
  };
  return weatherCodes[condition] || "Unknown";
}

// Simulated weather based on date (can be replaced with real API)
function simulateWeather(date) {
  const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Stormy", "Windy"];
  return weatherOptions[date.getDay() % weatherOptions.length]; // Cycles through options
}
