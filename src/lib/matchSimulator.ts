import { supabase } from "@/integrations/supabase/client";

export interface StagedMatchTag {
  label: string;
  revealDelayMs: number;
}

export interface SimulatedMatch {
  category: string;
  matchedInstitution: string | null;
  matchStrength: number;
  tags: StagedMatchTag[];
}

interface CategoryResponse {
  success: boolean;
  result?: { domain: string; confidence: number };
  error?: string;
}

interface MatchResponse {
  success: boolean;
  matches?: Array<{ institutionId: string; score: number; reason: string }>;
  error?: string;
}

/**
 * Runs the production categorization and matching functions for a hero
 * preview. Set VITE_SIMULATOR_CHALLENGE_ID to an owned submitted challenge;
 * both edge functions intentionally enforce challenge ownership and cannot
 * classify an arbitrary synthetic id.
 */
export async function simulateMatch(problemText: string): Promise<SimulatedMatch> {
  const description = problemText.trim();
  if (!description) throw new Error("problemText is required.");

  const challengeId = import.meta.env.VITE_SIMULATOR_CHALLENGE_ID;
  if (!challengeId) {
    throw new Error("Set VITE_SIMULATOR_CHALLENGE_ID to an owned challenge for the match preview.");
  }

  const { data: categoryData, error: categoryError } = await supabase.functions.invoke<CategoryResponse>(
    "categorize-challenge",
    { body: { challengeId, description } },
  );
  if (categoryError || !categoryData?.success || !categoryData.result) {
    throw new Error(categoryError?.message ?? categoryData?.error ?? "Challenge categorization failed.");
  }

  const { domain, confidence } = categoryData.result;
  const { data: matchData, error: matchError } = await supabase.functions.invoke<MatchResponse>(
    "match-institutions",
    { body: { challengeId, description, domain } },
  );
  if (matchError || !matchData?.success) {
    throw new Error(matchError?.message ?? matchData?.error ?? "Institution matching failed.");
  }

  const topMatch = matchData.matches?.[0];
  let matchedInstitution: string | null = null;
  if (topMatch) {
    const { data: institution, error: institutionError } = await supabase
      .from("institutions")
      .select("name")
      .eq("id", topMatch.institutionId)
      .maybeSingle();
    if (institutionError) throw new Error(`Failed to load matched institution: ${institutionError.message}`);
    matchedInstitution = institution?.name ?? null;
  }

  const tags = [domain.split("_").join(" "), ...(topMatch?.reason ?? "").split(",")]
    .map((label) => label.trim())
    .filter(Boolean)
    .filter((label, index, all) => all.indexOf(label) === index)
    .slice(0, 4)
    .map((label, index) => ({ label, revealDelayMs: index * 200 }));

  return {
    category: domain,
    matchedInstitution,
    matchStrength: topMatch?.score ?? confidence,
    tags,
  };
}
