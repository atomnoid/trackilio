-- =============================================================================
-- Trackilio: Follows Table + Search Indexes
-- =============================================================================

-- Enable pg_trgm extension for future trigram-based search optimization
-- (Non-fatal if already exists; ignored if Supabase plan doesn't support it)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================================================
-- FOLLOWS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id <> following_id)
);

-- Indexes for follower/following list lookups
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

-- =============================================================================
-- RLS FOR FOLLOWS
-- =============================================================================
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Anyone can see public follow relationships (needed for follower/following counts)
DROP POLICY IF EXISTS "Follows are publicly readable" ON public.follows;
CREATE POLICY "Follows are publicly readable"
  ON public.follows FOR SELECT
  USING (true);

-- Users can only create follow relationships where they are the follower
DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
CREATE POLICY "Users can follow others"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = follower_id);

-- Users can only delete their own follow relationships
DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = follower_id);

-- =============================================================================
-- ADDITIONAL SEARCH INDEXES (supplement existing schema indexes)
-- =============================================================================

-- Places: add name + category indexes for faster ILIKE search
CREATE INDEX IF NOT EXISTS idx_places_name ON public.places(name);
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);
CREATE INDEX IF NOT EXISTS idx_places_country ON public.places(country);

-- WanderLists: title index for search
CREATE INDEX IF NOT EXISTS idx_wander_lists_title ON public.wander_lists(title);

-- Profiles: display_name index for user search
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);

-- =============================================================================
-- OPTIONAL: pg_trgm indexes for fuzzy search (only if pg_trgm is available)
-- Run these manually if pg_trgm was successfully enabled above:
-- =============================================================================
-- CREATE INDEX IF NOT EXISTS idx_places_name_trgm ON public.places USING GIN (name gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm ON public.profiles USING GIN (username gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_profiles_display_name_trgm ON public.profiles USING GIN (display_name gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_wander_lists_title_trgm ON public.wander_lists USING GIN (title gin_trgm_ops);
