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
      global.fetch = jest.fn();
    });
  
    test('returns weather description for valid location', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          current: {
            condition: {
              code: 1000
            }
          }
        })
      };
      global.fetch.mockResolvedValue(mockResponse);
  
      const result = await getWeather('2025-03-02', { city: 'New York' });
      expect(result).toBe('Sunny');
    });
  
    test('handles API error', async () => {
      global.fetch.mockRejectedValue(new Error('API Error'));
  
      const result = await getWeather('2025-03-02', { city: 'New York' });
      expect(result).toBe('Failed to fetch weather data');
    });
  
    test('handles non-OK response', async () => {
      const mockResponse = {
        ok: false
      };
      global.fetch.mockResolvedValue(mockResponse);
  
      const result = await getWeather('2025-03-02', { city: 'New York' });
      expect(result).toBe('Failed to fetch weather data');
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
    expect(getWeatherDescription(1000)).toBe('Sunny');
    expect(getWeatherDescription(1135)).toBe('Fog');
    expect(getWeatherDescription(1282)).toBe('Moderate or heavy snow with thunder');
  });

  test('returns "Unknown" for unknown weather codes', () => {
    expect(getWeatherDescription(9999)).toBe('Unknown');
  });
});