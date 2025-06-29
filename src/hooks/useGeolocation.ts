
import { useState, useEffect } from 'react';

interface LocationData {
  lat: number;
  lon: number;
  city?: string;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lon: longitude,
            city: "Your Current Location"
          });
          setIsLoading(false);
        },
        (err) => {
          setError("Location access denied. Please search for your city manually.");
          setIsLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return {
    location,
    isLoading,
    error
  };
};
