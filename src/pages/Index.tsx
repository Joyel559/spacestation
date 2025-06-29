
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Satellite, Timer, Compass, Eye } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { SatellitePassCard } from "@/components/SatellitePassCard";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LocationDisplay } from "@/components/LocationDisplay";
import { LiveISSTracker } from "@/components/LiveISSTracker";
import { useSatelliteData } from "@/hooks/useSatelliteData";
import { useGeolocation } from "@/hooks/useGeolocation";
import 'leaflet/dist/leaflet.css';


const Index = () => {
  const [searchCity, setSearchCity] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lon: number, city: string} | null>(null);
  const [showLiveTracker, setShowLiveTracker] = useState(false);
  const { location, isLoading: locationLoading, error: locationError } = useGeolocation();
  const { passes, isLoading: passesLoading, error: passesError, fetchPasses } = useSatelliteData();

  useEffect(() => {
    if (location && !currentLocation) {
      setCurrentLocation({
        lat: location.lat,
        lon: location.lon,
        city: location.city || "Your Location"
      });
    }
  }, [location, currentLocation]);

  useEffect(() => {
    if (currentLocation) {
      fetchPasses(currentLocation.lat, currentLocation.lon);
    }
  }, [currentLocation, fetchPasses]);

  const handleCitySearch = (city: string, coordinates: {lat: number, lon: number}) => {
    setCurrentLocation({
      lat: coordinates.lat,
      lon: coordinates.lon,
      city: city
    });
  };

  const nextPass = passes.find(pass => new Date(pass.startTime) > new Date());

  if (showLiveTracker) {
    return <LiveISSTracker onClose={() => setShowLiveTracker(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars animate-pulse"></div>
        <div className="stars2 animate-pulse"></div>
        <div className="stars3 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My City From Space
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
            Discover when satellites will be visible from your location. Track the International Space Station, 
            Starlink, and other satellites passing overhead.
          </p>
          
          {/* Live View Button */}
          <Button
            onClick={() => setShowLiveTracker(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Eye className="w-5 h-5 mr-2" />
            Live ISS Tracker
          </Button>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar onCitySelect={handleCitySearch} />
          <LocationDisplay 
            location={currentLocation} 
            isLoading={locationLoading} 
            error={locationError} 
          />
        </div>

        {/* Next Pass Countdown */}
        {nextPass && (
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                  <Timer className="w-6 h-6 text-blue-400" />
                  Next Visible Pass
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{nextPass.name}</div>
                <CountdownTimer targetDate={nextPass.startTime} />
                <div className="text-slate-300 mt-4">
                  Duration: {nextPass.duration} minutes | 
                  Max Elevation: {nextPass.maxElevation}° | 
                  Direction: {nextPass.direction}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Satellite Passes Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Upcoming Satellite Passes
          </h2>
          
          {passesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : passesError ? (
            <Card className="bg-red-900/20 border-red-500/30 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <div className="text-red-400 text-lg mb-4">
                  Unable to fetch satellite data
                </div>
                <div className="text-slate-300">
                  {passesError}
                </div>
              </CardContent>
            </Card>
          ) : passes.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Satellite className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <div className="text-slate-300 text-lg">
                  {currentLocation ? "No visible satellite passes in the next 7 days" : "Search for a city to see satellite passes"}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {passes.map((pass, index) => (
                <SatellitePassCard key={`${pass.name}-${pass.startTime}-${index}`} pass={pass} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-slate-400">
          <p>Data provided by N2YO.com</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
