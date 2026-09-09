-- =============================================================================
-- Migration: Add saved_lists table for bookmarking entire travel lists
-- =============================================================================

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
