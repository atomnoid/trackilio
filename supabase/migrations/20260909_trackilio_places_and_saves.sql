-- =============================================================================
-- Trackilio MVP: Places Expansion & Saved Places Migration
-- Safe & Idempotent
-- =============================================================================

-- 1. PLACES — Add slug, city, address, description, rating, website, lat/lng columns if missing
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2);
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

CREATE INDEX IF NOT EXISTS idx_places_slug ON public.places(slug);
CREATE INDEX IF NOT EXISTS idx_places_city ON public.places(city);
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);

-- 2. SAVED_PLACES — Personal Place Bookmarking
CREATE TABLE IF NOT EXISTS public.saved_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, place_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_places_user ON public.saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_place ON public.saved_places(place_id);

ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'saved_places' AND policyname = 'Users can view their own saved places'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view their own saved places"
      ON public.saved_places FOR SELECT
      USING (auth.uid() = user_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'saved_places' AND policyname = 'Users can insert their own saved places'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert their own saved places"
      ON public.saved_places FOR INSERT
      WITH CHECK (auth.uid() = user_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'saved_places' AND policyname = 'Users can delete their own saved places'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can delete their own saved places"
      ON public.saved_places FOR DELETE
      USING (auth.uid() = user_id)';
  END IF;
END $$;
