-- Supabase Database Schema for MyWanderLists

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  username TEXT UNIQUE CHECK (
    username IS NULL OR (
      char_length(username) >= 3 AND
      char_length(username) <= 30 AND
      username ~ '^[a-z0-9](?:[a-z0-9._-]{1,28}[a-z0-9])?$' AND
      username !~ '\.\.'
    )
  ),
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. WANDER_LISTS
CREATE TABLE IF NOT EXISTS public.wander_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
  description TEXT,
  destination TEXT,
  cover_image TEXT,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wander_lists_slug ON public.wander_lists(slug);
CREATE INDEX IF NOT EXISTS idx_wander_lists_owner_id ON public.wander_lists(owner_id);
CREATE INDEX IF NOT EXISTS idx_wander_lists_is_public ON public.wander_lists(is_public);
CREATE INDEX IF NOT EXISTS idx_wander_lists_destination ON public.wander_lists(destination);

-- 3. LIST_MEMBERS
CREATE TABLE IF NOT EXISTS public.list_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.wander_lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(list_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_list_members_list_id ON public.list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_list_members_user_id ON public.list_members(user_id);

-- 4. PLACES
CREATE TABLE IF NOT EXISTS public.places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0),
  location TEXT,
  country TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  maps_url TEXT CHECK (maps_url IS NULL OR maps_url ~* '^https?://'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_places_tags ON public.places USING GIN (tags);

-- 5. LIST_PLACES
CREATE TABLE IF NOT EXISTS public.list_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.wander_lists(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  note TEXT,
  priority TEXT NOT NULL DEFAULT 'must_visit' CHECK (priority IN ('must_visit', 'want_to_visit', 'maybe')),
  status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'planned', 'visited')),
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(list_id, place_id)
);

CREATE INDEX IF NOT EXISTS idx_list_places_list_id ON public.list_places(list_id);
CREATE INDEX IF NOT EXISTS idx_list_places_place_id ON public.list_places(place_id);

-- 6. VOTES
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_place_id UUID NOT NULL REFERENCES public.list_places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(list_place_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_list_place_id ON public.votes(list_place_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);

-- 7. COMMENTS
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_place_id UUID NOT NULL REFERENCES public.list_places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(trim(content)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_comments_list_place_id ON public.comments(list_place_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

--------------------------------------------------------------------------------
-- AUTOMATIC PROFILE CREATION TRIGGER
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username TEXT;
  v_display_name TEXT;
  v_avatar_url TEXT;
BEGIN
  v_username := NULLIF(LOWER(TRIM(NEW.raw_user_meta_data->>'username')), '');
  v_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));
  v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

  IF v_username IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE LOWER(username) = v_username) THEN
      v_username := NULL;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, display_name, username, avatar_url)
  VALUES (
    NEW.id,
    v_display_name,
    v_username,
    v_avatar_url
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    username = COALESCE(public.profiles.username, EXCLUDED.username),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

--------------------------------------------------------------------------------
-- NON-RECURSIVE SECURITY DEFINER HELPER FUNCTIONS FOR RLS
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_list_public(p_list_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.wander_lists
    WHERE id = p_list_id AND is_public = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_list_role(p_list_id UUID, p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.list_members
  WHERE list_id = p_list_id AND user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.can_read_list(p_list_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.wander_lists
    WHERE id = p_list_id AND (
      is_public = true 
      OR owner_id = p_user_id 
      OR (p_user_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.list_members 
        WHERE list_id = p_list_id AND user_id = p_user_id
      ))
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.can_write_list(p_list_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.wander_lists
    WHERE id = p_list_id AND (
      owner_id = p_user_id 
      OR (p_user_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.list_members 
        WHERE list_id = p_list_id AND user_id = p_user_id AND role IN ('owner', 'editor')
      ))
    )
  );
$$;

--------------------------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
--------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wander_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- RLS POLICIES (Idempotent: drops policy if exists before creating)
--------------------------------------------------------------------------------

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- WanderLists Policies
DROP POLICY IF EXISTS "Public lists readable by anyone, private by members" ON public.wander_lists;
CREATE POLICY "Public lists readable by anyone, private by members"
  ON public.wander_lists FOR SELECT
  USING (
    is_public = true 
    OR owner_id = auth.uid() 
    OR (auth.uid() IS NOT NULL AND public.can_read_list(id, auth.uid()))
  );

DROP POLICY IF EXISTS "Authenticated users can create lists" ON public.wander_lists;
CREATE POLICY "Authenticated users can create lists"
  ON public.wander_lists FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners and editors can update lists" ON public.wander_lists;
CREATE POLICY "Owners and editors can update lists"
  ON public.wander_lists FOR UPDATE
  USING (auth.uid() IS NOT NULL AND public.can_write_list(id, auth.uid()));

DROP POLICY IF EXISTS "Only owners can delete lists" ON public.wander_lists;
CREATE POLICY "Only owners can delete lists"
  ON public.wander_lists FOR DELETE
  USING (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- List Members Policies
DROP POLICY IF EXISTS "Members readable for public lists or by list members" ON public.list_members;
CREATE POLICY "Members readable for public lists or by list members"
  ON public.list_members FOR SELECT
  USING (
    public.is_list_public(list_id) 
    OR (auth.uid() IS NOT NULL AND public.can_read_list(list_id, auth.uid()))
  );

DROP POLICY IF EXISTS "Only list owner can manage members" ON public.list_members;
CREATE POLICY "Only list owner can manage members"
  ON public.list_members FOR ALL
  USING (
    auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.wander_lists
      WHERE id = list_id AND owner_id = auth.uid()
    )
  );

-- Places Policies
DROP POLICY IF EXISTS "Places readable if attached to a readable list" ON public.places;
CREATE POLICY "Places readable if attached to a readable list"
  ON public.places FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.list_places lp
      WHERE lp.place_id = id AND public.can_read_list(lp.list_id, auth.uid())
    )
    OR auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Authenticated users can create places" ON public.places;
CREATE POLICY "Authenticated users can create places"
  ON public.places FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update places" ON public.places;
CREATE POLICY "Authenticated users can update places"
  ON public.places FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- List Places Policies
DROP POLICY IF EXISTS "List places readable if list is readable" ON public.list_places;
CREATE POLICY "List places readable if list is readable"
  ON public.list_places FOR SELECT
  USING (public.can_read_list(list_id, auth.uid()));

DROP POLICY IF EXISTS "Editors and owners can insert list places" ON public.list_places;
CREATE POLICY "Editors and owners can insert list places"
  ON public.list_places FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND public.can_write_list(list_id, auth.uid()));

DROP POLICY IF EXISTS "Editors and owners can update list places" ON public.list_places;
CREATE POLICY "Editors and owners can update list places"
  ON public.list_places FOR UPDATE
  USING (auth.uid() IS NOT NULL AND public.can_write_list(list_id, auth.uid()));

DROP POLICY IF EXISTS "Editors and owners can delete list places" ON public.list_places;
CREATE POLICY "Editors and owners can delete list places"
  ON public.list_places FOR DELETE
  USING (auth.uid() IS NOT NULL AND public.can_write_list(list_id, auth.uid()));

-- Votes Policies
DROP POLICY IF EXISTS "Votes readable if list is readable" ON public.votes;
CREATE POLICY "Votes readable if list is readable"
  ON public.votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.list_places lp
      WHERE lp.id = list_place_id AND public.can_read_list(lp.list_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authenticated list members can vote" ON public.votes;
CREATE POLICY "Authenticated list members can vote"
  ON public.votes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.list_places lp
      WHERE lp.id = list_place_id AND public.can_read_list(lp.list_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can remove their own votes" ON public.votes;
CREATE POLICY "Users can remove their own votes"
  ON public.votes FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Comments Policies
DROP POLICY IF EXISTS "Comments readable if list is readable" ON public.comments;
CREATE POLICY "Comments readable if list is readable"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.list_places lp
      WHERE lp.id = list_place_id AND public.can_read_list(lp.list_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authenticated list members can comment" ON public.comments;
CREATE POLICY "Authenticated list members can comment"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.list_places lp
      WHERE lp.id = list_place_id AND public.can_read_list(lp.list_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 8. SAVED LISTS
CREATE TABLE IF NOT EXISTS public.saved_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES public.wander_lists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, list_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_lists_user_id ON public.saved_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_lists_list_id ON public.saved_lists(list_id);

ALTER TABLE public.saved_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own saved lists" ON public.saved_lists;
CREATE POLICY "Users can read their own saved lists"
  ON public.saved_lists FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save lists" ON public.saved_lists;
CREATE POLICY "Users can save lists"
  ON public.saved_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove saved lists" ON public.saved_lists;
CREATE POLICY "Users can remove saved lists"
  ON public.saved_lists FOR DELETE
  USING (auth.uid() = user_id);
