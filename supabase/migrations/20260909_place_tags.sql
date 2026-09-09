-- Migration: Add city and tags columns to places table
ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS lat NUMERIC(10,7),
ADD COLUMN IF NOT EXISTS lng NUMERIC(10,7),
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::TEXT[];

CREATE INDEX IF NOT EXISTS idx_places_tags ON public.places USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_places_city ON public.places(city);
CREATE INDEX IF NOT EXISTS idx_places_slug ON public.places(slug);