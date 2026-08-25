-- Foundation migration for SIH26043's fresh, isolated Supabase project.
-- Extracted from the base repo's original migration
-- (20250908161514_5e1635b9-e9ab-4ab9-97f1-2eafac0cff49.sql) — ONLY the
-- auth-pattern objects this project actually reuses: the user_type enum,
-- the profiles table, its RLS policies, and the auto-create-profile-on-
-- signup trigger. Deliberately excludes heritage_sites, travel_packages,
-- bookings, heritage_badges, community_posts, reviews, and all sample data
-- inserts — none of that belongs in this project (Global Rule #11).
--
-- Apply this FIRST, before 20260825120000_societal_challenges.sql, which
-- depends on public.profiles and public.user_type already existing.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- university/industry included from day one, unlike the shared project
-- where these were bolted on later via an irreversible ALTER TYPE.
CREATE TYPE public.user_type AS ENUM (
    'tourist', 'local_guide', 'agency', 'admin', 'university', 'industry'
);

CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    user_type user_type DEFAULT 'tourist',
    preferences JSONB DEFAULT '{}',
    location TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-creates a profiles row whenever a new auth.users row is created.
-- Without this, signups succeed at the auth layer but leave no profile row
-- for challenges.submitted_by or institutions.admin_user_id to reference.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
