-- Supabase Migration: Trackilio v2 Social Features
-- Added username, bio, location to profiles
-- Added vote_type to votes
-- Added daily_facts table
-- Added blend_sessions table

-- 1. EXTEND PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE CHECK (username IS NULL OR username ~ '^[a-z0-9_-]{3,30}$');
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. EXTEND VOTES (Upvote / Downvote)
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS vote_type TEXT NOT NULL DEFAULT 'up' CHECK (vote_type IN ('up', 'down'));

-- 3. DAILY FACTS TABLE
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

CREATE POLICY "Daily facts are publicly readable"
  ON public.daily_facts FOR SELECT
  USING (true);

-- 4. BLEND SESSIONS TABLE
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

CREATE POLICY "Blend sessions are publicly readable"
  ON public.blend_sessions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create blend sessions"
  ON public.blend_sessions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (user_a_id = auth.uid() OR user_b_id = auth.uid()));

-- 5. SEED DATA: DAILY TRAVEL FACTS
INSERT INTO public.daily_facts (title, fact, location, country, published_date)
VALUES
  (
    'The 10,000 Torii Gates of Kyoto',
    'Fushimi Inari Taisha in Kyoto boasts over 10,000 vibrant vermilion Torii gates along sacred Mount Inari paths. Every single gate was donated by individuals and businesses seeking good fortune.',
    'Kyoto',
    'Japan',
    CURRENT_DATE
  ),
  (
    'Venice Without Roads',
    'Venice is comprised of 118 small islands separated by over 150 canals and linked by 400+ footbridges. There are zero cars; everything moves via boat, barge, or on foot.',
    'Venice',
    'Italy',
    CURRENT_DATE - INTERVAL '1 day'
  ),
  (
    'Reykjavik Runs on Geothermal',
    'Almost 100% of Iceland’s electricity and over 90% of home heating comes directly from renewable geothermal and hydroelectric energy harnessed from volcanic underground springs.',
    'Reykjavik',
    'Iceland',
    CURRENT_DATE - INTERVAL '2 days'
  ),
  (
    'Cappadocia Underground Cities',
    'Ancient inhabitants of Cappadocia carved entire subterranean cities, like Derinkuyu, going down 18 levels and capable of shielding up to 20,000 people from invaders.',
    'Cappadocia',
    'Turkey',
    CURRENT_DATE - INTERVAL '3 days'
  ),
  (
    'Chefchaouen Blue City',
    'Every spring, the residents of Chefchaouen in Morocco wash their town in powdery shades of blue. The tradition traces back to 15th-century Jewish refugees who regarded blue as a mirror of heaven.',
    'Chefchaouen',
    'Morocco',
    CURRENT_DATE - INTERVAL '4 days'
  )
ON CONFLICT (published_date) DO NOTHING;

