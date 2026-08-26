import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

/*
 * Real-data source for the homepage. Every field here is a count or a row
 * read from the live database — nothing on this page is allowed to be a
 * hardcoded or illustrative number.
 *
 * Deliberately a separate file from Codex's `useAnimatedCounter.ts` rather
 * than an edit to it: that hook is Codex's and is already consumed
 * elsewhere; the homepage needs several counts it doesn't expose
 * (institutions, claimed matches, distinct locations). Kept additive so the
 * two can't drift into a merge conflict.
 *
 * `null` is used as the "not loaded yet" signal everywhere, so callers can
 * render a placeholder instead of a momentarily-wrong `0`.
 */

export interface HomepageStats {
  challengesRaised: number;
  aiMatchesMade: number;
  partnerInstitutions: number;
  universityCount: number;
  industryCount: number;
  claimedByInstitution: number;
  unclaimedMatches: number;
  markedResolved: number;
  confirmedResolutions: number;
  categorisedCount: number;
  locationsReported: number;
  /** Distinct non-null `location_text` values, in first-seen order. */
  locationNames: string[];
}

function unwrapCount(label: string, result: { count: number | null; error: { message: string } | null }): number {
  if (result.error) throw new Error(`Failed to count ${label}: ${result.error.message}`);
  return result.count ?? 0;
}

export async function loadHomepageStats(): Promise<HomepageStats> {
  const head = { count: "exact" as const, head: true };

  const [
    challengesRes,
    matchesRes,
    institutionsRes,
    universityRes,
    industryRes,
    claimedRes,
    resolvedRes,
    confirmedRes,
    categorisedRes,
    locationRows,
  ] = await Promise.all([
    supabase.from("challenges").select("id", head),
    supabase.from("challenge_matches").select("id", head),
    supabase.from("institutions").select("id", head),
    supabase.from("institutions").select("id", head).eq("institution_type", "university"),
    supabase.from("institutions").select("id", head).eq("institution_type", "industry"),
    supabase.from("challenge_matches").select("id", head).eq("is_claimed", true),
    supabase.from("challenges").select("id", head).eq("status", "resolved"),
    supabase.from("challenges").select("id", head).not("resolved_confirmed_at", "is", null),
    supabase.from("challenges").select("id", head).not("domain", "is", null),
    supabase.from("challenges").select("location_text").not("location_text", "is", null),
  ]);

  const challengesRaised = unwrapCount("challenges", challengesRes);
  const aiMatchesMade = unwrapCount("challenge_matches", matchesRes);
  const partnerInstitutions = unwrapCount("institutions", institutionsRes);
  const universityCount = unwrapCount("universities", universityRes);
  const industryCount = unwrapCount("industry partners", industryRes);
  const claimedByInstitution = unwrapCount("claimed matches", claimedRes);
  const markedResolved = unwrapCount("resolved challenges", resolvedRes);
  const confirmedResolutions = unwrapCount("confirmed resolutions", confirmedRes);
  const categorisedCount = unwrapCount("categorised challenges", categorisedRes);

  if (locationRows.error) {
    throw new Error(`Failed to load reported locations: ${locationRows.error.message}`);
  }

  const seen: string[] = [];
  for (const row of locationRows.data ?? []) {
    const value = (row.location_text ?? "").trim();
    if (value && !seen.includes(value)) seen.push(value);
  }

  return {
    challengesRaised,
    aiMatchesMade,
    partnerInstitutions,
    universityCount,
    industryCount,
    claimedByInstitution,
    unclaimedMatches: aiMatchesMade - claimedByInstitution,
    markedResolved,
    confirmedResolutions,
    categorisedCount,
    locationsReported: seen.length,
    locationNames: seen,
  };
}

export function useHomepageStats(): HomepageStats | null {
  const [stats, setStats] = useState<HomepageStats | null>(null);

  useEffect(() => {
    let active = true;
    loadHomepageStats()
      .then((next) => {
        if (active) setStats(next);
      })
      .catch(() => {
        // Leave as null: the UI renders a neutral placeholder rather than a
        // wrong number if the public read fails.
      });
    return () => {
      active = false;
    };
  }, []);

  return stats;
}

export interface FeaturedChallenge {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  status: string;
  locationText: string | null;
  reportCount: number;
  /** Real number of institutions the classifier matched to this challenge. */
  matchCount: number;
  topInstitutionName: string | null;
  topInstitutionDepartment: string | null;
  topMatchReason: string | null;
}

interface NestedMatchRow {
  match_score: number | null;
  match_reason: string | null;
  institutions: { name: string | null; department: string | null } | null;
}

/**
 * Most-recent real challenges, with their real match counts and the real
 * top-scoring matched institution. Selection is by `created_at DESC` — the
 * section presents itself as a live queue of what citizens have just
 * reported, so recency is the honest ordering for that framing.
 */
export async function loadFeaturedChallenges(limit: number): Promise<FeaturedChallenge[]> {
  const { data, error } = await supabase
    .from("challenges")
    .select(
      "id, title, description, domain, status, location_text, report_count, created_at, challenge_matches(match_score, match_reason, institutions(name, department))",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to load featured challenges: ${error.message}`);

  return (data ?? []).map((row) => {
    const matches = ((row as unknown as { challenge_matches: NestedMatchRow[] }).challenge_matches ?? []);
    const top = [...matches].sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0))[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      domain: row.domain,
      status: row.status,
      locationText: row.location_text,
      reportCount: row.report_count ?? 1,
      matchCount: matches.length,
      topInstitutionName: top?.institutions?.name ?? null,
      topInstitutionDepartment: top?.institutions?.department ?? null,
      topMatchReason: top?.match_reason ?? null,
    };
  });
}

export function useFeaturedChallenges(limit: number): FeaturedChallenge[] | null {
  const [rows, setRows] = useState<FeaturedChallenge[] | null>(null);

  useEffect(() => {
    let active = true;
    loadFeaturedChallenges(limit)
      .then((next) => {
        if (active) setRows(next);
      })
      .catch(() => {
        // Null keeps the section hidden rather than showing invented rows.
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return rows;
}
