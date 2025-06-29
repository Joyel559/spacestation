
export interface SatellitePass {
  name: string;
  startTime: string;
  duration: number; // in minutes
  maxElevation: number; // in degrees
  direction: string;
  noradId: number;
}

export interface Location {
  lat: number;
  lon: number;
  city: string;
}
