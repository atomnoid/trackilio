-- =============================================================================
-- Trackilio v2 Fixes Migration
-- Safe to run multiple times (idempotent)
-- =============================================================================

-- -----------------------------------------------------------------------
-- 1. VOTES — Ensure vote_type column exists (add if missing, preserve data)
-- -----------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'votes'
      AND column_name = 'vote_type'
  ) THEN
    ALTER TABLE public.votes
      ADD COLUMN vote_type TEXT NOT NULL DEFAULT 'up'
      CHECK (vote_type IN ('up', 'down'));
  END IF;
END $$;

-- Ensure index on vote_type for aggregation queries
CREATE INDEX IF NOT EXISTS idx_votes_vote_type ON public.votes(vote_type);

-- -----------------------------------------------------------------------
-- 2. PLACES — Fix over-permissive UPDATE policy
-- -----------------------------------------------------------------------

-- Drop the too-broad policy that allows any authenticated user to update places
DROP POLICY IF EXISTS "Authenticated users can update places" ON public.places;

-- New restrictive policy: only allow a place update if the user owns at
-- least one list that contains the place (i.e. they're the one who added it)
CREATE POLICY "Only list editors/owners can update their places"
  ON public.places FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.list_places lp
      JOIN public.wander_lists wl ON wl.id = lp.list_id
      WHERE lp.place_id = places.id
        AND public.can_write_list(wl.id, auth.uid())
    )
  );

-- -----------------------------------------------------------------------
-- 3. PROFILES — Add columns if v2 migration hasn't been applied yet
-- -----------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE
  CHECK (username IS NULL OR username ~ '^[a-z0-9_-]{3,30}$');
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- -----------------------------------------------------------------------
-- 4. DAILY FACTS — Create table if missing
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_facts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  fact TEXT NOT NULL,
  location TEXT,
  country TEXT,
  published_date DATE NOT NULL UNIQUE,
  related_place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_daily_facts_date ON public.daily_facts(published_date);

ALTER TABLE public.daily_facts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'daily_facts' AND policyname = 'Daily facts are publicly readable'
  ) THEN
    EXECUTE 'CREATE POLICY "Daily facts are publicly readable"
      ON public.daily_facts FOR SELECT USING (true)';
  END IF;
END $$;

-- -----------------------------------------------------------------------
-- 5. BLEND SESSIONS — Create table if missing
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blend_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  shared_places JSONB DEFAULT '[]'::jsonb,
  shared_destinations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_blend_sessions_user_a ON public.blend_sessions(user_a_id);
CREATE INDEX IF NOT EXISTS idx_blend_sessions_user_b ON public.blend_sessions(user_b_id);

ALTER TABLE public.blend_sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'blend_sessions' AND policyname = 'Blend sessions are publicly readable'
  ) THEN
    EXECUTE 'CREATE POLICY "Blend sessions are publicly readable"
      ON public.blend_sessions FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'blend_sessions' AND policyname = 'Authenticated users can create blend sessions'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated users can create blend sessions"
      ON public.blend_sessions FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL AND (user_a_id = auth.uid() OR user_b_id = auth.uid()))';
  END IF;
END $$;

-- -----------------------------------------------------------------------
-- 6. SEED DAILY FACTS (idempotent — won't fail if already seeded)
-- -----------------------------------------------------------------------
INSERT INTO public.daily_facts (title, fact, location, country, published_date)
VALUES
  (
    'The 10,000 Torii Gates of Kyoto',
    'Fushimi Inari Taisha in Kyoto boasts over 10,000 vibrant vermilion Torii gates along sacred Mount Inari paths. Every single gate was donated by individuals and businesses seeking good fortune.',
    'Kyoto', 'Japan', CURRENT_DATE
  ),
  (
    'Venice Without Roads',
    'Venice is comprised of 118 small islands separated by over 150 canals and linked by 400+ footbridges. There are zero cars; everything moves via boat, barge, or on foot.',
    'Venice', 'Italy', CURRENT_DATE - INTERVAL '1 day'
  ),
  (
    'Reykjavik Runs on Geothermal',
    'Almost 100% of Iceland''s electricity and over 90% of home heating comes directly from renewable geothermal and hydroelectric energy.',
    'Reykjavik', 'Iceland', CURRENT_DATE - INTERVAL '2 days'
  ),
  (
    'Cappadocia Underground Cities',
    'Ancient inhabitants of Cappadocia carved entire subterranean cities, like Derinkuyu, going down 18 levels and capable of shielding up to 20,000 people from invaders.',
    'Cappadocia', 'Turkey', CURRENT_DATE - INTERVAL '3 days'
  ),
  (
    'Chefchaouen Blue City',
    'Every spring, the residents of Chefchaouen in Morocco wash their town in powdery shades of blue. The tradition traces back to 15th-century Jewish refugees who regarded blue as a mirror of heaven.',
    'Chefchaouen', 'Morocco', CURRENT_DATE - INTERVAL '4 days'
  )
ON CONFLICT (published_date) DO NOTHING;

-- -----------------------------------------------------------------------
-- 7. PERFORMANCE — Additional indexes for popular sort
-- -----------------------------------------------------------------------
-- Index to support counting votes per list (used by popular sort)
CREATE INDEX IF NOT EXISTS idx_list_places_list_id_vote ON public.list_places(list_id);
CREATE INDEX IF NOT EXISTS idx_votes_list_place_id_type ON public.votes(list_place_id, vote_type);
CREATE INDEX IF NOT EXISTS idx_comments_list_place_id_idx ON public.comments(list_place_id);

-- -----------------------------------------------------------------------
-- 8. MEMBERS — Add updateListMemberRole support
-- -----------------------------------------------------------------------
-- No schema change needed, existing role column already has CHECK constraint
-- role IN ('owner', 'editor', 'viewer') — covered by schema.sql
