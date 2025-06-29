
import { useState, useCallback } from 'react';

interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
}

export const useGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCity = useCallback(async (query: string): Promise<GeocodingResult[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock geocoding data for demonstration
      const mockResults: GeocodingResult[] = [
        { name: "New York, NY, USA", lat: 40.7128, lon: -74.0060 },
        { name: "London, England, UK", lat: 51.5074, lon: -0.1278 },
        { name: "Tokyo, Japan", lat: 35.6762, lon: 139.6503 },
        { name: "Paris, France", lat: 48.8566, lon: 2.3522 },
        { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
        { name: "Los Angeles, CA, USA", lat: 34.0522, lon: -118.2437 },
        { name: "Berlin, Germany", lat: 52.5200, lon: 13.4050 },
        { name: "Moscow, Russia", lat: 55.7558, lon: 37.6176 },
        { name: "Beijing, China", lat: 39.9042, lon: 116.4074 },
        { name: "Mumbai, India", lat: 19.0760, lon: 72.8777 }
      ];

      // Filter results based on query
      const filteredResults = mockResults.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return filteredResults.slice(0, 5); // Return top 5 results
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search cities');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchCity,
    isLoading,
    error
  };
};
