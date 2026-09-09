-- Ensure places are publicly readable for all visitors (unauthenticated & authenticated)
-- Places represent public geographical locations, restaurants, viewpoints, etc.
-- This ensures unauthenticated visitors can view /place/[slug] and /discover without 404s.

DROP POLICY IF EXISTS "Places readable if attached to a readable list" ON public.places;
DROP POLICY IF EXISTS "Places are publicly readable" ON public.places;

CREATE POLICY "Places are publicly readable"
  ON public.places FOR SELECT
  USING (true);

-- Ensure list_places for public lists are readable by all
DROP POLICY IF EXISTS "List places readable if list is readable" ON public.list_places;
DROP POLICY IF EXISTS "List places are publicly readable for public lists" ON public.list_places;

CREATE POLICY "List places are publicly readable for public lists"
  ON public.list_places FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.wander_lists wl
      WHERE wl.id = list_places.list_id AND wl.is_public = true
    )
    OR (auth.uid() IS NOT NULL AND public.can_read_list(list_id, auth.uid()))
  );
