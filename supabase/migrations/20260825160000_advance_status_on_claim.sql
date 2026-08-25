-- Auto-advance challenges.status to 'claimed' when a challenge_matches row
-- is claimed. SECURITY DEFINER is required: the invoking institution admin
-- has no UPDATE grant on public.challenges under current RLS (only citizens
-- INSERT their own, only admins UPDATE any) -- this trigger is the
-- deliberate, narrow, server-controlled exception, not an RLS relaxation.

CREATE OR REPLACE FUNCTION public.advance_challenge_on_claim()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_claimed = true AND (OLD.is_claimed IS DISTINCT FROM true) THEN
    UPDATE public.challenges
    SET status = 'claimed', updated_at = now()
    WHERE id = NEW.challenge_id
      AND status = 'ai_matched';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_challenge_match_claimed
  AFTER UPDATE ON public.challenge_matches
  FOR EACH ROW EXECUTE FUNCTION public.advance_challenge_on_claim();
