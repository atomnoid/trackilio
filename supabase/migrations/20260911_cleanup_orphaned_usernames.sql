-- =============================================================================
-- Trackilio Migration: Clean Up Orphaned Usernames from Abandoned Signups
-- =============================================================================
-- Problem: When a user checks username availability and starts (but abandons)
-- signup, Supabase fires the handle_new_user trigger immediately, inserting a
-- profile row with the username -- even before email confirmation.
-- This makes the username appear 'taken' to future users.
-- =============================================================================

-- 1. Clean up existing orphaned profiles:
--    Clear username for profiles whose auth user never confirmed email
--    AND was created more than 2 hours ago.
UPDATE public.profiles p
SET username = NULL
FROM auth.users u
WHERE p.id = u.id
  AND u.email_confirmed_at IS NULL
  AND u.created_at < NOW() - INTERVAL '2 hours';

-- 2. Create SQL function for accurate username availability (confirmed users only).
CREATE OR REPLACE FUNCTION public.is_username_available(
  p_username TEXT,
  p_exclude_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_clean TEXT;
  v_exists BOOLEAN;
BEGIN
  v_clean := LOWER(TRIM(p_username));

  SELECT EXISTS (
    SELECT 1
    FROM public.profiles pr
    INNER JOIN auth.users au ON au.id = pr.id
    WHERE LOWER(pr.username) = v_clean
      AND au.email_confirmed_at IS NOT NULL
      AND (p_exclude_user_id IS NULL OR pr.id != p_exclude_user_id)
  ) INTO v_exists;

  RETURN NOT v_exists;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_username_available(TEXT, UUID) TO authenticated, anon;

-- 3. Update handle_new_user trigger to only block on confirmed-user conflicts.
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

  -- Only block on usernames held by confirmed users (not abandoned signups).
  IF v_username IS NOT NULL THEN
    IF EXISTS (
      SELECT 1
      FROM public.profiles pr
      INNER JOIN auth.users au ON au.id = pr.id
      WHERE LOWER(pr.username) = v_username
        AND au.email_confirmed_at IS NOT NULL
        AND pr.id != NEW.id
    ) THEN
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
