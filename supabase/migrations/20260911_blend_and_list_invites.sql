-- =============================================================================
-- Trackilio Migration: Blend Invite Links + List Collaborator Invite Links
-- =============================================================================

-- --- BLEND INVITES -----------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.blend_invites (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  token      TEXT        UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  inviter_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blend_id   UUID        REFERENCES public.blend_sessions(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blend_invites_token     ON public.blend_invites(token);
CREATE INDEX IF NOT EXISTS idx_blend_invites_inviter   ON public.blend_invites(inviter_id);

ALTER TABLE public.blend_invites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blend_invites' AND policyname = 'Blend invites public read'
  ) THEN
    CREATE POLICY "Blend invites public read"
      ON public.blend_invites FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blend_invites' AND policyname = 'Users manage own blend invites'
  ) THEN
    CREATE POLICY "Users manage own blend invites"
      ON public.blend_invites FOR ALL USING (auth.uid() = inviter_id);
  END IF;
END $$;

-- --- LIST INVITES -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.list_invites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  token       TEXT        UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  list_id     UUID        NOT NULL REFERENCES public.wander_lists(id) ON DELETE CASCADE,
  invited_by  UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'viewer' CHECK (role IN ('editor', 'viewer')),
  max_uses    INT         NOT NULL DEFAULT 1,
  uses        INT         NOT NULL DEFAULT 0,
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_list_invites_token   ON public.list_invites(token);
CREATE INDEX IF NOT EXISTS idx_list_invites_list_id ON public.list_invites(list_id);

ALTER TABLE public.list_invites ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'list_invites' AND policyname = 'List invites public read'
  ) THEN
    CREATE POLICY "List invites public read"
      ON public.list_invites FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'list_invites' AND policyname = 'List owners manage invites'
  ) THEN
    CREATE POLICY "List owners manage invites"
      ON public.list_invites FOR ALL USING (auth.uid() = invited_by);
  END IF;
END $$;
