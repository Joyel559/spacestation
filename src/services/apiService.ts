
import { supabase } from "@/integrations/supabase/client";

export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
  azimuth?: number;
  elevation?: number;
  ra?: number;
  dec?: number;
}

class ApiService {
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`API call failed, retrying in ${delay}ms... (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  private async fetchWithTimeout(url: string, timeout: number = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getCurrentISSPosition(): Promise<ISSPosition | null> {
    try {
      return await this.retryWithBackoff(async () => {
        // Use Open Notify ISS API - free public API
        const url = 'http://api.open-notify.org/iss-now.json';
        const response = await this.fetchWithTimeout(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.iss_position) {
          const issPosition: ISSPosition = {
            latitude: parseFloat(data.iss_position.latitude),
            longitude: parseFloat(data.iss_position.longitude),
            altitude: 408, // ISS average altitude in km
            timestamp: data.timestamp
          };

          // Log to Supabase
          this.logISSPosition(issPosition);
          
          return issPosition;
        }
        
        return null;
      });
    } catch (error) {
      console.error('Failed to fetch ISS position:', error);
      return null;
    }
  }

  private async logISSPosition(position: ISSPosition): Promise<void> {
    try {
      await supabase
        .from('iss_tracking')
        .insert({
          latitude: position.latitude,
          longitude: position.longitude,
          altitude: position.altitude,
          azimuth: position.azimuth,
          elevation: position.elevation,
          ra: position.ra,
          dec: position.dec
        });
    } catch (error) {
      console.error('Failed to log ISS position to Supabase:', error);
    }
  }

  async logSatelliteSearch(cityName: string, lat: number, lng: number, passesFound: number, status: string): Promise<void> {
    try {
      await supabase
        .from('satellite_searches')
        .insert({
          city_name: cityName,
          latitude: lat,
          longitude: lng,
          passes_found: passesFound,
          api_response_status: status
        });
    } catch (error) {
      console.error('Failed to log satellite search to Supabase:', error);
    }
  }
}

export const apiService = new ApiService();
