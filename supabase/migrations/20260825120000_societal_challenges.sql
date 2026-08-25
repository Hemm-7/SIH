-- Societal Innovation Collaboration Portal (SIH26043)
-- Citizens submit challenges -> AI categorizes by domain + matches to
-- universities/industry by expertise -> institutions claim + track progress.
-- Reuses the same HF zero-shot classification pattern as classify-condition,
-- and the same booking-status-style pipeline shape as public.bookings.

-- NOTE: university/industry are now created directly in the user_type enum
-- by 20260825100000_foundation_profiles_and_auth.sql (this project's fresh
-- foundation migration), not bolted on afterward like the original shared-
-- project draft did. No ALTER TYPE needed here.

CREATE TYPE public.challenge_domain AS ENUM (
    'education', 'agriculture', 'healthcare', 'water_resources', 'environment',
    'energy', 'urban_development', 'accessibility', 'public_administration',
    'rural_livelihoods'
);

CREATE TYPE public.challenge_status AS ENUM (
    'submitted', 'ai_matched', 'claimed', 'in_progress', 'resolved'
);

-- Citizen-submitted challenges
CREATE TABLE public.challenges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    submitted_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    domain challenge_domain,
    domain_confidence DECIMAL(5, 4),
    photo_urls JSONB DEFAULT '[]',
    lat DECIMAL(10, 8),
    lon DECIMAL(11, 8),
    location_text TEXT,
    status challenge_status NOT NULL DEFAULT 'submitted',
    -- Duplicate-clustering: points at the "canonical" challenge this one
    -- was merged into, so 30 reports of the same issue collapse to one
    -- card with a real citizen count instead of 30 rows.
    duplicate_of UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
    report_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seeded university/industry directory (hardcode ~15-20 rows for the demo,
-- same pattern as your existing locations.json seed approach)
CREATE TABLE public.institutions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    department TEXT,
    institution_type TEXT NOT NULL CHECK (institution_type IN ('university', 'industry')),
    expertise_tags JSONB DEFAULT '[]',
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI-generated matches between a challenge and candidate institutions.
-- match_reason stores the classifier's own top signal so the UI can show
-- citizens/judges *why* this match was suggested, not just that it was.
CREATE TABLE public.challenge_matches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    match_score DECIMAL(5, 4) NOT NULL,
    match_reason TEXT,
    is_claimed BOOLEAN NOT NULL DEFAULT false,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(challenge_id, institution_id)
);

CREATE INDEX challenges_domain_idx ON public.challenges (domain);
CREATE INDEX challenges_status_idx ON public.challenges (status);
CREATE INDEX challenges_duplicate_of_idx ON public.challenges (duplicate_of);
CREATE INDEX challenge_matches_challenge_idx ON public.challenge_matches (challenge_id);
CREATE INDEX challenge_matches_institution_idx ON public.challenge_matches (institution_id);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_matches ENABLE ROW LEVEL SECURITY;

-- Transparency by default: public dashboard needs open read access, same
-- spirit as "Anyone can view condition reports".
CREATE POLICY "Anyone can view challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit challenges" ON public.challenges
    FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins can update any challenge" ON public.challenges FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.user_type = 'admin')
);

CREATE POLICY "Anyone can view institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Admins can manage institutions" ON public.institutions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.user_type = 'admin')
);

CREATE POLICY "Anyone can view challenge matches" ON public.challenge_matches FOR SELECT USING (true);
-- Only the matched institution's own admin can claim it — prevents one
-- university from claiming a challenge routed to another.
CREATE POLICY "Institution admins can claim their own matches" ON public.challenge_matches
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.institutions
            WHERE institutions.id = challenge_matches.institution_id
            AND institutions.admin_user_id = auth.uid()
        )
    );
CREATE POLICY "Admins can insert challenge matches" ON public.challenge_matches
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.user_type = 'admin')
    );

-- Storage bucket for challenge submission photos, same pattern as condition-reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('challenge-photos', 'challenge-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view challenge photos" ON storage.objects FOR SELECT
    USING (bucket_id = 'challenge-photos');
CREATE POLICY "Authenticated users can upload challenge photos" ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'challenge-photos' AND auth.role() = 'authenticated');
