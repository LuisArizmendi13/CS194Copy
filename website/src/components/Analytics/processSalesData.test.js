// processSalesData.test.js

import { processSalesData, getTimeOfDay, getDayOfWeek, getMonth, simulateWeather, getLocation, getWeather, getWeatherDescription} from './processSalesData';
import * as processSalesDataModule from './processSalesData';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Sales Data Processing Functions', () => {
  describe('getTimeOfDay', () => {
    test('returns correct time category', () => {
      expect(getTimeOfDay(new Date('2025-03-01T08:00:00'))).toBe('Morning');
      expect(getTimeOfDay(new Date('2025-03-01T14:00:00'))).toBe('Afternoon');
      expect(getTimeOfDay(new Date('2025-03-01T19:00:00'))).toBe('Evening');
      expect(getTimeOfDay(new Date('2025-03-01T23:00:00'))).toBe('Night');
    });
  });

  describe('getDayOfWeek', () => {
    test('returns correct day', () => {
        expect(getDayOfWeek(new Date('2025-03-01T00:00:00Z'))).toBe('Saturday');
        expect(getDayOfWeek(new Date('2025-03-02T00:00:00Z'))).toBe('Sunday');
    });
  });

  describe('getMonth', () => {
    test('returns correct month', () => {
        expect(getMonth(new Date('2025-03-01T00:00:00Z'))).toBe('March');
        expect(getMonth(new Date('2025-12-01T00:00:00Z'))).toBe('December');
    });
  });

  describe('simulateWeather', () => {
    test('returns a valid weather option', () => {
      const validOptions = ["Sunny", "Cloudy", "Rainy", "Stormy", "Windy"];
      const result = simulateWeather(new Date());
      expect(validOptions).toContain(result);
    });
  });
});
describe('getLocation', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });
  
    test('returns coordinates for a valid location', async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue([{ lat: 40.7128, lon: -74.0060 }])
      };
      global.fetch.mockResolvedValue(mockResponse);
      const result = await getLocation({ city: 'New York', state: 'NY' });
  
      expect(result).toEqual({ latitude: 40.7128, longitude: -74.0060 });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('New York,NY,US'));
    });
  
    test('returns null for an invalid location', async () => {
      const mockResponse = {
        json: jest.fn().mockResolvedValue([])
      };
      global.fetch.mockResolvedValue(mockResponse);
  
      const result = await getLocation({ city: 'InvalidCity', state: 'XX' });
      expect(result).toBeNull();
    });
  
    test('handles fetch error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
  
      const result = await getLocation({ city: 'New York', state: 'NY' });
      expect(result).toBeNull();
    });
  });
  
  describe('getWeather', () => {
    beforeEach(() => {
      jest.spyOn(processSalesDataModule, 'getLocation').mockResolvedValue({ latitude: 40.7128, longitude: -74.0060 });
      global.fetch = jest.fn();
    });
  
    test('returns weather description for valid date and location', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          hourly: {
            time: ['2025-03-01T12:00'],
            temperature_2m: [20],
            weathercode: [0]
          }
        })
      });
  
      const result = await getWeather('2025-03-01', { city: 'New York', state: 'NY' });
      expect(result).toBe('Clear sky');
    });
  
    test('returns "Failed to fetch weather data" on API error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API Error'));
  
      const result = await getWeather('2025-03-01', { city: 'New York', state: 'NY' });
      expect(result).toBe('Failed to fetch weather data');
    });
  
    test('returns "Date not found in forecast" when date is not in the API response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          hourly: {
            time: ['2025-03-02T12:00'],
            temperature_2m: [20],
            weathercode: [0]
          }
        })
      });
  
      const result = await getWeather('2025-03-01', { city: 'New York', state: 'NY' });
      expect(result).toBe('Date not found in forecast');
    });
  
    test('returns "Location not found" when coordinates are not available', async () => {
      jest.spyOn(processSalesDataModule, 'getLocation').mockResolvedValue(null);
      const result = await getWeather('2025-03-01', { city: 'InvalidCity', state: 'XX' });
      expect(result).toBe('Location not found');
    });
  });
  

describe('processSalesData', () => {
  test('processes data correctly', () => {
    const mockData = [
      {
        id: 1,
        name: 'Dish 1',
        price: 10,
        sales: [
          { time: '2025-03-01T12:00:00' },
          { time: '2025-03-01T14:00:00' }
        ]
      }
    ];

    const result = processSalesData(mockData);

    expect(result[0].totalSales).toBe(2);
    expect(result[0].totalRevenue).toBe(20);
    expect(result[0].totalProfit).toBe(8); // (10 - 6) * 2
    expect(result[0].sales[0].derived.time_of_day).toBe('Afternoon');
    expect(result[0].sales[0].derived.day_of_week).toBe('Saturday');
    expect(result[0].sales[0].derived.month).toBe('March');
    expect(typeof result[0].sales[0].derived.weather_condition).toBe('string');
  });

  test('handles empty input', () => {
    const result = processSalesData([]);
    expect(result).toEqual([]);
  });
});

describe('getWeatherDescription', () => {
    test('returns correct description for known weather codes', () => {
      expect(getWeatherDescription(0)).toBe('Clear sky');
      expect(getWeatherDescription(61)).toBe('Rain');
      expect(getWeatherDescription(95)).toBe('Thunderstorm');
      expect(getWeatherDescription(71)).toBe('Snow');
    });
  
    test('returns "Unknown" for unknown weather codes', () => {
      expect(getWeatherDescription(100)).toBe('Unknown');
      expect(getWeatherDescription(-1)).toBe('Unknown');
      expect(getWeatherDescription(999)).toBe('Unknown');
    });
  });
  