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

/* ── Real geo-located challenges (drives the homepage need map) ────── */

/*
 * Jharkhand's approximate bounding box. Used to project real lat/lon onto the
 * homepage panel's percentage coordinate space. The panel has no geographic
 * outline behind it — it is a plain textured surface — so this projection is
 * strictly more faithful than the hand-placed marker coordinates it replaces.
 */
const JH_BOUNDS = { minLon: 83.32, maxLon: 87.95, minLat: 21.95, maxLat: 25.35 };

export interface MappedChallenge {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  status: string;
  locationText: string | null;
  reportCount: number;
  matchCount: number;
  topInstitutionName: string | null;
  /** Percentage position within the panel, projected from real coordinates. */
  x: number;
  y: number;
}

function clampPercent(value: number): number {
  return Math.max(4, Math.min(96, value));
}

export async function loadMappedChallenges(limit: number): Promise<MappedChallenge[]> {
  const { data, error } = await supabase
    .from("challenges")
    .select(
      "id, title, description, domain, status, location_text, report_count, lat, lon, created_at, challenge_matches(match_score, match_reason, institutions(name, department))",
    )
    .not("lat", "is", null)
    .not("lon", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to load mapped challenges: ${error.message}`);

  return (data ?? []).map((row) => {
    const matches = ((row as unknown as { challenge_matches: NestedMatchRow[] }).challenge_matches ?? []);
    const top = [...matches].sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0))[0];
    const lat = Number(row.lat);
    const lon = Number(row.lon);
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
      x: clampPercent(((lon - JH_BOUNDS.minLon) / (JH_BOUNDS.maxLon - JH_BOUNDS.minLon)) * 100),
      y: clampPercent(((JH_BOUNDS.maxLat - lat) / (JH_BOUNDS.maxLat - JH_BOUNDS.minLat)) * 100),
    };
  });
}

export function useMappedChallenges(limit: number): MappedChallenge[] | null {
  const [rows, setRows] = useState<MappedChallenge[] | null>(null);

  useEffect(() => {
    let active = true;
    loadMappedChallenges(limit)
      .then((next) => {
        if (active) setRows(next);
      })
      .catch(() => {
        // Null hides the map rather than plotting invented districts.
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return rows;
}

/* ── Real resolved stories (drives the impact section) ─────────────── */

export interface ImpactStory {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  locationText: string | null;
  reportCount: number;
  /** Set only when the ORIGINAL citizen reporter confirmed the fix. */
  confirmedAt: string | null;
  createdAt: string;
  /** The institution that actually claimed this challenge, if any. */
  claimedInstitutionName: string | null;
  claimedInstitutionDepartment: string | null;
}

/**
 * Real challenges that reached `resolved`, citizen-confirmed ones first.
 * This is the only honest basis for an "impact" section — there is no
 * case-study, measurement, or audit table anywhere in the schema.
 */
export async function loadImpactStories(limit: number): Promise<ImpactStory[]> {
  const { data, error } = await supabase
    .from("challenges")
    .select(
      "id, title, description, domain, location_text, report_count, created_at, resolved_confirmed_at, challenge_matches(is_claimed, institutions(name, department))",
    )
    .eq("status", "resolved")
    .order("resolved_confirmed_at", { ascending: false, nullsFirst: false });

  if (error) throw new Error(`Failed to load impact stories: ${error.message}`);

  return (data ?? [])
    .map((row) => {
      const matches =
        ((row as unknown as { challenge_matches: (NestedMatchRow & { is_claimed: boolean })[] }).challenge_matches ?? []);
      const claimed = matches.find((m) => m.is_claimed);
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        domain: row.domain,
        locationText: row.location_text,
        reportCount: row.report_count ?? 1,
        confirmedAt: row.resolved_confirmed_at,
        createdAt: row.created_at,
        claimedInstitutionName: claimed?.institutions?.name ?? null,
        claimedInstitutionDepartment: claimed?.institutions?.department ?? null,
      };
    })
    .sort((a, b) => Number(Boolean(b.confirmedAt)) - Number(Boolean(a.confirmedAt)))
    .slice(0, limit);
}

export function useImpactStories(limit: number): ImpactStory[] | null {
  const [rows, setRows] = useState<ImpactStory[] | null>(null);

  useEffect(() => {
    let active = true;
    loadImpactStories(limit)
      .then((next) => {
        if (active) setRows(next);
      })
      .catch(() => {
        // Null hides the section rather than showing an invented case study.
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return rows;
}

/* ── Real match showcase (drives the AI-matching section) ───────────── */

export type MatchTier = "strong" | "likely" | "possible";

export interface ShowcaseMatch {
  institutionName: string;
  department: string | null;
  score: number;
  reason: string;
  tier: MatchTier;
}

export interface MatchShowcase {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  /** Distinct terms taken from the real match_reason strings on this challenge. */
  reasonTerms: string[];
  matches: ShowcaseMatch[];
}

/*
 * Bucketing, not raw percentages. contracts.md is explicit that a zero-shot
 * score must never be rendered as "N% confidence": the model splits
 * probability mass across every candidate label, so a genuinely correct top
 * match commonly scores ~0.30-0.40 and a raw "34%" reads as "the AI is
 * unsure" when it is not. Thresholds are contracts.md's.
 */
export function matchTier(score: number): MatchTier {
  if (score >= 0.5) return "strong";
  if (score >= 0.25) return "likely";
  return "possible";
}

/**
 * Real challenges that actually have matches, ordered by their strongest
 * match. Used to demonstrate explainable matching with real rows instead of
 * a scripted demo.
 */
export async function loadMatchShowcase(limit: number): Promise<MatchShowcase[]> {
  const { data, error } = await supabase
    .from("challenges")
    .select(
      "id, title, description, domain, challenge_matches(match_score, match_reason, institutions(name, department))",
    )
    .not("domain", "is", null);

  if (error) throw new Error(`Failed to load match showcase: ${error.message}`);

  const rows = (data ?? [])
    .map((row) => {
      const raw = ((row as unknown as { challenge_matches: NestedMatchRow[] }).challenge_matches ?? [])
        .filter((m) => m.institutions?.name)
        .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0));

      const matches: ShowcaseMatch[] = raw.map((m) => ({
        institutionName: m.institutions?.name ?? "",
        department: m.institutions?.department ?? null,
        score: m.match_score ?? 0,
        reason: m.match_reason ?? "",
        tier: matchTier(m.match_score ?? 0),
      }));

      // Real terms lifted from the real match_reason strings. The function
      // writes reasons as comma-separated expertise phrases, with an explicit
      // honest fallback sentence when no overlap was found — that fallback is
      // a sentence, not a term list, so it is filtered out here rather than
      // chopped into meaningless fragments.
      const reasonTerms: string[] = [];
      for (const m of matches) {
        if (!m.reason || m.reason.toLowerCase().includes("matched by domain classification only")) continue;
        for (const part of m.reason.split(",")) {
          const term = part.trim();
          if (term && term.length < 60 && !reasonTerms.includes(term)) reasonTerms.push(term);
        }
      }

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        domain: row.domain,
        reasonTerms,
        matches,
      };
    })
    .filter((row) => row.matches.length > 0)
    .sort((a, b) => (b.matches[0]?.score ?? 0) - (a.matches[0]?.score ?? 0));

  return rows.slice(0, limit);
}

export function useMatchShowcase(limit: number): MatchShowcase[] | null {
  const [rows, setRows] = useState<MatchShowcase[] | null>(null);

  useEffect(() => {
    let active = true;
    loadMatchShowcase(limit)
      .then((next) => {
        if (active) setRows(next);
      })
      .catch(() => {
        // Null hides the section rather than falling back to a scripted demo.
      });
    return () => {
      active = false;
    };
  }, [limit]);

  return rows;
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
