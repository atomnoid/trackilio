-- Migration: Remove Google Place ID & Add OpenStreetMap + Community Photo Infrastructure

-- 1. Update public.places for OpenStreetMap fields
ALTER TABLE public.places 
  ADD COLUMN IF NOT EXISTS osm_id TEXT,
  ADD COLUMN IF NOT EXISTS osm_type TEXT;

CREATE INDEX IF NOT EXISTS idx_places_osm ON public.places(osm_id, osm_type);
CREATE INDEX IF NOT EXISTS idx_places_city_category ON public.places(city, category);

-- Safely drop Google Place ID index and column
DROP INDEX IF EXISTS public.idx_places_google_place_id;
ALTER TABLE public.places DROP COLUMN IF EXISTS google_place_id;

-- 2. Create public.place_photos for user/community uploaded place photos
CREATE TABLE IF NOT EXISTS public.place_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  url_thumb TEXT NOT NULL,
  url_card TEXT NOT NULL,
  url_medium TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  aspect_ratio NUMERIC(5,2),
  caption TEXT,
  attribution_name TEXT,
  rights_confirmed BOOLEAN NOT NULL DEFAULT true,
  flagged_for_review BOOLEAN NOT NULL DEFAULT false,
  flag_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_place_photos_place_id ON public.place_photos(place_id);
CREATE INDEX IF NOT EXISTS idx_place_photos_created_at ON public.place_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_place_photos_place_created ON public.place_photos(place_id, created_at DESC);

-- Enable RLS on place_photos
ALTER TABLE public.place_photos ENABLE ROW LEVEL SECURITY;

-- Public readable photos policy
DROP POLICY IF EXISTS "Public place photos are readable by anyone" ON public.place_photos;
CREATE POLICY "Public place photos are readable by anyone"
  ON public.place_photos FOR SELECT
  USING (flagged_for_review = false OR auth.uid() IS NOT NULL);

-- Authenticated upload policy
DROP POLICY IF EXISTS "Authenticated users can upload place photos" ON public.place_photos;
CREATE POLICY "Authenticated users can upload place photos"
  ON public.place_photos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Owners can delete their own uploaded photos policy
DROP POLICY IF EXISTS "Users can delete their uploaded photos" ON public.place_photos;
CREATE POLICY "Users can delete their uploaded photos"
  ON public.place_photos FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
