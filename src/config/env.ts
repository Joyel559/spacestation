
// Environment configuration with fallback values
export const ENV = {
  N2YO_API_KEY: import.meta.env.VITE_N2YO_API_KEY || 'demo_key',
  OPENCAGE_API_KEY: import.meta.env.VITE_OPENCAGE_API_KEY || 'demo_key',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://fnkajdtceeldthdsbsth.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZua2FqZHRjZWVsZHRoZHNic3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNDIxMzUsImV4cCI6MjA2NjYxODEzNX0.V-bE1JYUwW2ZsM3wi55LHCLxCqMtrvJZxPhOpK_h9k4'
};

// API endpoints
export const API_ENDPOINTS = {
  N2YO_BASE: 'https://api.n2yo.com/rest/v1',
  ISS_POSITIONS: (lat: number, lng: number, alt: number = 0, seconds: number = 1) => 
    `${API_ENDPOINTS.N2YO_BASE}/satellite/positions/25544/${lat}/${lng}/${alt}/${seconds}&apiKey=${ENV.N2YO_API_KEY}`,
  SATELLITE_PASSES: (lat: number, lng: number, alt: number = 0, days: number = 7) =>
    `${API_ENDPOINTS.N2YO_BASE}/satellite/visualpasses/25544/${lat}/${lng}/${alt}/${days}&apiKey=${ENV.N2YO_API_KEY}`
};
