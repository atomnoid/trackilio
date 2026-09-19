-- Migration: Add google_place_id to public.places table
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS google_place_id TEXT;
CREATE INDEX IF NOT EXISTS idx_places_google_place_id ON public.places(google_place_id);
