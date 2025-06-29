
import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useGeocoding } from "@/hooks/useGeocoding";
import { toast } from "@/hooks/use-toast";

interface SearchBarProps {
  onCitySelect: (city: string, coordinates: {lat: number, lon: number}) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{name: string, lat: number, lon: number}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { searchCity, isLoading } = useGeocoding();

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      const results = await searchCity(searchQuery);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Unable to search for cities. Please try again.",
        variant: "destructive"
      });
    }
  }, [searchCity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      const timeoutId = setTimeout(() => handleSearch(value), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: {name: string, lat: number, lon: number}) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onCitySelect(suggestion.name, { lat: suggestion.lat, lon: suggestion.lon });
    toast({
      title: "Location Selected",
      description: `Now showing satellite passes for ${suggestion.name}`,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    } else {
      handleSearch(query);
    }
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onCitySelect("Your Current Location", { lat: latitude, lon: longitude });
          setQuery("Your Current Location");
          toast({
            title: "Location Detected",
            description: "Using your current location for satellite tracking",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to access your location. Please search for a city manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Location Not Available",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter city name (e.g., New York, London, Tokyo)"
            value={query}
            onChange={handleInputChange}
            className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
        <Button 
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Use Location
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 border-slate-600 backdrop-blur-sm z-50">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 hover:bg-slate-700/50 rounded-md transition-colors text-white"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {suggestion.name}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
