
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, Timer, Compass } from "lucide-react";
import { SatellitePass } from "@/types/satellite";

interface SatellitePassCardProps {
  pass: SatellitePass;
}

export const SatellitePassCard: React.FC<SatellitePassCardProps> = ({ pass }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVisibilityColor = () => {
    if (pass.maxElevation >= 50) return "bg-green-500";
    if (pass.maxElevation >= 30) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getVisibilityText = () => {
    if (pass.maxElevation >= 50) return "Excellent";
    if (pass.maxElevation >= 30) return "Good";
    return "Fair";
  };

  const isUpcoming = new Date(pass.startTime) > new Date();

  return (
    <Card className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-600 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 ${isUpcoming ? 'ring-2 ring-blue-500/20' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Satellite className="w-5 h-5 text-blue-400" />
            {pass.name}
          </CardTitle>
          <Badge variant="outline" className={`${getVisibilityColor()} text-white border-none`}>
            {getVisibilityText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-400">Date</div>
            <div className="text-white font-semibold">{formatDate(pass.startTime)}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Start Time</div>
            <div className="text-white font-semibold">{formatTime(pass.startTime)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-400 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              Duration
            </div>
            <div className="text-white font-semibold">{pass.duration} min</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Max Elevation</div>
            <div className="text-white font-semibold">{pass.maxElevation}°</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-400 flex items-center gap-1">
            <Compass className="w-3 h-3" />
            Direction
          </div>
          <div className="text-white font-semibold">{pass.direction}</div>
        </div>

        {isUpcoming && (
          <div className="pt-2 border-t border-slate-700">
            <div className="text-xs text-blue-400 font-semibold">UPCOMING PASS</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
