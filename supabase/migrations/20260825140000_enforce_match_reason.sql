-- Approved re-enforcement of Global Rule #9 at the database level.
-- Safe to apply as a plain ALTER: zero challenge_matches rows exist yet on
-- this project (confirmed in Claude Code's status report), so there are no
-- existing NULLs to conflict with SET NOT NULL.

ALTER TABLE public.challenge_matches
    ALTER COLUMN match_reason SET NOT NULL;

ALTER TABLE public.challenge_matches
    ADD CONSTRAINT challenge_matches_match_reason_not_blank
    CHECK (length(trim(match_reason)) > 0);
