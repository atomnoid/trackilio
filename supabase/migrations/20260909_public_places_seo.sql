-- Fix Public Discoverability for Places & List Places without authentication
-- Allows unauthenticated visitors to view places attached to public wander lists
-- Allows search engines & logged-out users to browse /discover and place pages

DROP POLICY IF EXISTS "Places readable if attached to a readable list" ON public.places;
CREATE POLICY "Places readable if attached to a readable list"
  ON public.places FOR SELECT
  USING (
    -- Public list check
    EXISTS (
      SELECT 1 FROM public.list_places lp
      JOIN public.wander_lists wl ON wl.id = lp.list_id
      WHERE lp.place_id = places.id AND wl.is_public = true
    )
    -- Or user has read access to the list containing it
    OR (
      auth.uid() IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.list_places lp
        WHERE lp.place_id = places.id AND public.can_read_list(lp.list_id, auth.uid())
      )
    )
    -- Or any authenticated user
    OR auth.uid() IS NOT NULL
  );

-- List Places: Ensure unauthenticated users can read list_places for public lists
DROP POLICY IF EXISTS "List places readable if list is readable" ON public.list_places;
CREATE POLICY "List places readable if list is readable"
  ON public.list_places FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.wander_lists wl
      WHERE wl.id = list_places.list_id AND wl.is_public = true
    )
    OR public.can_read_list(list_id, auth.uid())
  );
