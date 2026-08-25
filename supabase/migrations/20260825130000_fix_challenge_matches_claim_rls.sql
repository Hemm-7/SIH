-- HOTFIX: challenge_matches UPDATE policy had USING without WITH CHECK,
-- meaning an institution admin could claim their own match row and then
-- reassign institution_id to point at a DIFFERENT institution's match --
-- effectively stealing another institution's claimed challenge. This closes
-- that hole by re-checking ownership against the NEW row, not just the old one.
--
-- This is a live fix against data that may already exist -- review any
-- existing challenge_matches rows for institution_id values that don't match
-- their original AI-assigned institution before assuming no exploitation
-- has occurred.

DROP POLICY IF EXISTS "Institution admins can claim their own matches" ON public.challenge_matches;

CREATE POLICY "Institution admins can claim their own matches" ON public.challenge_matches
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.institutions
            WHERE institutions.id = challenge_matches.institution_id
            AND institutions.admin_user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.institutions
            WHERE institutions.id = challenge_matches.institution_id
            AND institutions.admin_user_id = auth.uid()
        )
    );
