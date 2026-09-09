-- Migration: Add tags column to places table
ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::TEXT[];

CREATE INDEX IF NOT EXISTS idx_places_tags ON public.places USING GIN (tags);
 told you remove this fire +5