
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

interface LocationDisplayProps {
  location: {lat: number, lon: number, city: string} | null;
  isLoading: boolean;
  error: string | null;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ location, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card className="bg-slate-800/30 border-slate-600 mt-4 backdrop-blur-sm">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Detecting your location...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-500/30 mt-4 backdrop-blur-sm">
        <CardContent className="py-4">
          <div className="text-red-400 text-center">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (location) {
    return (
      <Card className="bg-slate-800/30 border-slate-600 mt-4 backdrop-blur-sm">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>Showing satellite passes for: </span>
            <span className="text-white font-semibold">{location.city}</span>
            <span className="text-slate-400 text-sm">
              ({location.lat.toFixed(2)}, {location.lon.toFixed(2)})
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
