-- Citizen confirmation is distinct from an institution/government marking a
-- challenge resolved. The confirming identity must be the original reporter.
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS resolved_confirmed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS resolved_confirmed_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS challenges_resolved_confirmed_idx
  ON public.challenges (resolved_confirmed_at)
  WHERE resolved_confirmed_at IS NOT NULL;
