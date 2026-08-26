-- Auto-advance challenges.status to 'resolved' when an institution admin
-- marks their claimed match resolved. Same reasoning and same SECURITY
-- DEFINER pattern as 20260825160000_advance_status_on_claim.sql: the
-- invoking institution admin has no UPDATE grant on public.challenges under
-- current RLS (only citizens INSERT their own, only admins UPDATE any) --
-- this trigger is the deliberate, narrow, server-controlled exception, not
-- an RLS relaxation. challenge_matches.marked_resolved_at is writable by the
-- institution admin under the existing "Institution admins can claim their
-- own matches" UPDATE policy (ownership-checked, column-agnostic).
--
-- Distinct from Codex's resolved_confirmed_at/resolved_confirmed_by
-- (20260826100000_add_resolution_confirmation.sql): that is the CITIZEN
-- reporter's own confirmation that the fix actually happened. This is the
-- INSTITUTION's claim that it did the work. Two different parties, two
-- different columns, never conflated.

ALTER TABLE public.challenge_matches
  ADD COLUMN IF NOT EXISTS marked_resolved_at TIMESTAMP WITH TIME ZONE;

CREATE OR REPLACE FUNCTION public.advance_challenge_on_resolve()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.marked_resolved_at IS NOT NULL AND (OLD.marked_resolved_at IS NULL) THEN
    UPDATE public.challenges
    SET status = 'resolved', updated_at = now()
    WHERE id = NEW.challenge_id
      AND status IN ('claimed', 'in_progress');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_challenge_match_resolved
  AFTER UPDATE ON public.challenge_matches
  FOR EACH ROW EXECUTE FUNCTION public.advance_challenge_on_resolve();
