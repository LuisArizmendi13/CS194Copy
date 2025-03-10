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

const API_KEY = '1773fa0734e1ab6c35a49bcc67d52198';

export async function getLocation(location) {
  const city = location.city
  const state = location.state
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
      latitude : data[0].lat,
      longitude : data[0].lon
    };
    }
    return null;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;  
  }
}

const WEATHER_KEY = 'd73de1b5e4944cd295933005250303';

export async function getWeather(date, location) {
  const url = 'https://api.weatherapi.com/v1/current.json?key=d73de1b5e4944cd295933005250303&q=${location.city}&aqi=no'
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return getWeatherDescription(data.current.condition.code);
  } catch (error) {
    console.error('Error fetching weather:', error);
    return "Failed to fetch weather data";
  }
}

export function getWeatherDescription(condition) {
  const weatherCodes = {
    1000: "Sunny",
    1003: "Partly cloudy",
    1006: "Cloudy",
    1009: "Overcast",
    1030: "Mist",
    1063: "Patchy rain possible",
    1066: "Patchy snow possible",
    1069: "Patchy sleet possible",
    1072: "Patchy freezing drizzle possible",
    1087: "Thundery outbreaks possible",
    1114: "Blowing snow",
    1117: "Blizzard",
    1135: "Fog",
    1147: "Freezing fog",
    1150: "Patchy light drizzle",
    1153: "Light drizzle",
    1168: "Freezing drizzle",
    1171: "Heavy freezing drizzle",
    1180: "Patchy light rain",
    1183: "Light rain",
    1186: "Moderate rain at times",
    1189: "Moderate rain",
    1192: "Heavy rain at times",
    1195: "Heavy rain",
    1198: "Light freezing rain",
    1201: "Moderate or heavy freezing rain",
    1204: "Light sleet",
    1207: "Moderate or heavy sleet",
    1210: "Patchy light snow",
    1213: "Light snow",
    1216: "Patchy moderate snow",
    1219: "Moderate snow",
    1222: "Patchy heavy snow",
    1225: "Heavy snow",
    1237: "Ice pellets",
    1240: "Light rain shower",
    1243: "Moderate or heavy rain shower",
    1246: "Torrential rain shower",
    1249: "Light sleet showers",
    1252: "Moderate or heavy sleet showers",
    1255: "Light snow showers",
    1258: "Moderate or heavy snow showers",
    1261: "Light showers of ice pellets",
    1264: "Moderate or heavy showers of ice pellets",
    1273: "Patchy light rain with thunder",
    1276: "Moderate or heavy rain with thunder",
    1279: "Patchy light snow with thunder",
    1282: "Moderate or heavy snow with thunder"
  };
  return weatherCodes[condition] || "Unknown";
}

// Simulated weather based on date (can be replaced with real API)
function simulateWeather(date) {
  const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Stormy", "Windy"];
  return weatherOptions[date.getDay() % weatherOptions.length]; // Cycles through options
}
