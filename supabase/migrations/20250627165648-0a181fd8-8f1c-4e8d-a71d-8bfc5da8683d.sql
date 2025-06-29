
-- Create a table to log satellite pass searches and API calls
CREATE TABLE public.satellite_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  search_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  api_response_status TEXT,
  passes_found INTEGER DEFAULT 0
);

-- Create a table to track ISS position logs
CREATE TABLE public.iss_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  altitude DECIMAL(10, 2),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  azimuth DECIMAL(6, 3),
  elevation DECIMAL(6, 3),
  ra DECIMAL(8, 5),
  dec DECIMAL(8, 5)
);

-- Enable Row Level Security (these are public tables, no auth required)
ALTER TABLE public.satellite_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iss_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write access since no auth is required
CREATE POLICY "Allow public read access to satellite_searches" 
  ON public.satellite_searches 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to satellite_searches" 
  ON public.satellite_searches 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access to iss_tracking" 
  ON public.iss_tracking 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to iss_tracking" 
  ON public.iss_tracking 
  FOR INSERT 
  WITH CHECK (true);
