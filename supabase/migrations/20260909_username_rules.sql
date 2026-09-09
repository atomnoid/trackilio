-- =============================================================================
-- Trackilio Migration: Instagram-Style Unique Username Rules & Auth Trigger
-- =============================================================================

-- 1. Ensure username column has unique constraint and index
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
END $$;

-- 2. Drop old username check if present and apply Instagram-style regex constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_check
  CHECK (
    username IS NULL OR (
      char_length(username) >= 3 AND
      char_length(username) <= 30 AND
      username ~ '^[a-z0-9](?:[a-z0-9._-]{1,28}[a-z0-9])?$' AND
      username !~ '\.\.'
    )
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_unique ON public.profiles(LOWER(username));

-- 3. Update handle_new_user() trigger to save username passed during signup
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

  -- If username is provided, verify it doesn't conflict
  IF v_username IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE LOWER(username) = v_username) THEN
      v_username := NULL; -- conflict fallback so account creation doesn't crash
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
