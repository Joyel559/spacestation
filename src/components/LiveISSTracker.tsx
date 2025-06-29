
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { X, Satellite, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiService, ISSPosition } from '@/services/apiService';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom ISS icon
const issIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 5.5a2 2 0 0 0 2 2c2 0 4-1 5.5-2.5"/>
      <path d="M12 12c0-2.5 1.5-5 4-6.5"/>
      <path d="M12 12c0 2.5-1.5 5-4 6.5"/>
      <path d="M12 12c2.5 0 5-1.5 6.5-4"/>
      <path d="M12 12c-2.5 0-5 1.5-6.5 4"/>
      <path d="M19.5 7.5c1.5-1.5 2.5-3.5 2.5-5.5a2 2 0 0 0-2-2c-2 0-4 1-5.5 2.5"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface LiveISSTrackerProps {
  onClose: () => void;
}

export const LiveISSTracker: React.FC<LiveISSTrackerProps> = ({ onClose }) => {
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchISSPosition = async () => {
    try {
      const position = await apiService.getCurrentISSPosition();
      if (position) {
        setIssPosition(position);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError('Unable to fetch ISS position');
      }
    } catch (err) {
      setError('Failed to connect to ISS tracking service');
      console.error('ISS tracking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchISSPosition();

    // Set up interval for updates every 5 seconds
    intervalRef.current = setInterval(fetchISSPosition, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    return lastUpdate.toLocaleTimeString();
  };

  const defaultCenter: LatLngExpression = [20, 0]; // Center of world map

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="w-full h-screen bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Live ISS Tracker</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Status bar */}
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last Update: {formatLastUpdate()}</span>
            </div>
            {issPosition && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {issPosition.latitude.toFixed(4)}°, {issPosition.longitude.toFixed(4)}°
                </span>
              </div>
            )}
            <div className={`px-2 py-1 rounded text-xs ${
              error ? 'bg-red-500/20 text-red-400' : 
              isLoading ? 'bg-yellow-500/20 text-yellow-400' : 
              'bg-green-500/20 text-green-400'
            }`}>
              {error ? 'Error' : isLoading ? 'Loading...' : 'Live'}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="h-[calc(100vh-100px)]">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <Card className="bg-red-900/20 border-red-500/30 p-6">
                <div className="text-center text-red-400">
                  <Satellite className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">Connection Error</p>
                  <p className="text-sm">{error}</p>
                  <Button 
                    onClick={fetchISSPosition} 
                    className="mt-4"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <MapContainer
              center={issPosition ? [issPosition.latitude, issPosition.longitude] : defaultCenter}
              zoom={3}
              className="w-full h-full"
              worldCopyJump={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {issPosition && (
                <Marker
                  position={[issPosition.latitude, issPosition.longitude]}
                  icon={issIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold mb-2">International Space Station</h3>
                      <p><strong>Latitude:</strong> {issPosition.latitude.toFixed(6)}°</p>
                      <p><strong>Longitude:</strong> {issPosition.longitude.toFixed(6)}°</p>
                      <p><strong>Altitude:</strong> {issPosition.altitude.toFixed(2)} km</p>
                      <p className="text-xs text-gray-600 mt-2">
                        Updated: {formatLastUpdate()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};
