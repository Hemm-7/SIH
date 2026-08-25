import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SEARCH_RADIUS_METERS = 500;
const MAX_DESCRIPTION_LENGTH = 2_000;
const STOPWORDS = new Set([
  "a", "about", "after", "again", "all", "also", "an", "and", "any", "are", "as", "at", "be",
  "been", "before", "but", "by", "for", "from", "has", "have", "in", "into", "is", "it", "its",
  "more", "no", "not", "of", "on", "or", "our", "that", "the", "their", "this", "to", "was",
  "we", "were", "with", "without", "week", "month", "day", "year", "time", "again", "still", "always",
  "area", "place", "near", "since", "ago", "recently", "several", "many", "much", "need", "needed",
  "please", "help", "problem", "issue",
]);

interface ChallengeCandidate {
  id: string;
  lat: number | string | null;
  lon: number | string | null;
  description: string;
  duplicate_of: string | null;
  report_count: number;
  created_at: string;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function terms(text: string) {
  return new Set(
    (text.toLowerCase().match(/[a-z]{3,}/g) ?? []).filter((word) => !STOPWORDS.has(word)),
  );
}

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadius = 6_371_000;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}

function sharedTerms(left: Set<string>, right: Set<string>) {
  return [...left].filter((term) => right.has(term));
}

function dynamicStopwords(descriptions: string[], candidateTerms: Set<string>) {
  if (descriptions.length === 0) return new Set<string>();

  const frequent = new Set<string>();
  for (const term of candidateTerms) {
    const wholeWord = new RegExp(`\\b${term}\\b`, "i");
    const occurrences = descriptions.filter((description) => wholeWord.test(description)).length;
    if (occurrences / descriptions.length > 0.25) frequent.add(term);
  }

  return frequent;
}

function canonicalId(candidate: ChallengeCandidate) {
  return candidate.duplicate_of ?? candidate.id;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { challengeId, lat, lon, description } = await req.json();

    if (typeof challengeId !== "string" || challengeId.length === 0) {
      return jsonResponse({ success: false, error: "challengeId is required." }, 400);
    }
    if (typeof lat !== "number" || !Number.isFinite(lat) || lat < -90 || lat > 90) {
      return jsonResponse({ success: false, error: "lat must be a valid latitude." }, 400);
    }
    if (typeof lon !== "number" || !Number.isFinite(lon) || lon < -180 || lon > 180) {
      return jsonResponse({ success: false, error: "lon must be a valid longitude." }, 400);
    }
    if (typeof description !== "string" || description.trim().length === 0) {
      return jsonResponse({ success: false, error: "description is required." }, 400);
    }

    const authHeader = req.headers.get("Authorization");
    const callerClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader ?? "" } } },
    );
    const {
      data: { user },
    } = await callerClient.auth.getUser();

    if (!user) {
      return jsonResponse({ success: false, error: "Authentication is required." }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data: current, error: currentError } = await supabase
      .from("challenges")
      .select("id, duplicate_of, submitted_by")
      .eq("id", challengeId)
      .maybeSingle();

    if (currentError) throw new Error(`Failed to verify challenge: ${currentError.message}`);
    if (!current || current.submitted_by !== user.id) {
      return jsonResponse({ success: false, error: "Challenge was not found or is not owned by the caller." }, 403);
    }

    if (current.duplicate_of) {
      const { data: existingCluster, error: clusterError } = await supabase
        .from("challenges")
        .select("id")
        .or(`id.eq.${current.duplicate_of},duplicate_of.eq.${current.duplicate_of}`);
      if (clusterError) throw new Error(`Failed to read existing cluster: ${clusterError.message}`);

      return jsonResponse({
        duplicateOf: current.duplicate_of,
        clusterSize: existingCluster?.length ?? 1,
        matchedChallengeId: null,
        matchedTerms: [],
      });
    }

    const { data: candidates, error: candidatesError } = await supabase
      .from("challenges")
      .select("id, lat, lon, description, duplicate_of, report_count, created_at")
      .neq("id", challengeId)
      .not("lat", "is", null)
      .not("lon", "is", null);

    if (candidatesError) throw new Error(`Failed to find nearby challenges: ${candidatesError.message}`);

    const existingDescriptions = ((candidates ?? []) as ChallengeCandidate[]).map((candidate) => candidate.description);
    const descriptionTerms = terms(description.slice(0, MAX_DESCRIPTION_LENGTH));
    const requestDynamicStopwords = dynamicStopwords(existingDescriptions, descriptionTerms);
    const qualifyingDescriptionTerms = new Set(
      [...descriptionTerms].filter((term) => !requestDynamicStopwords.has(term)),
    );
    const duplicateCandidates = ((candidates ?? []) as ChallengeCandidate[])
      .map((candidate) => {
        const candidateLat = Number(candidate.lat);
        const candidateLon = Number(candidate.lon);
        const distance = distanceMeters(lat, lon, candidateLat, candidateLon);
          const overlap = sharedTerms(
            qualifyingDescriptionTerms,
            new Set([...terms(candidate.description)].filter((term) => !requestDynamicStopwords.has(term))),
          );
        return { candidate, distance, overlap };
      })
      .filter(({ distance, overlap }) => distance <= SEARCH_RADIUS_METERS && overlap.length >= 2)
      .sort((left, right) => {
        const leftCanonical = canonicalId(left.candidate) === left.candidate.id ? 0 : 1;
        const rightCanonical = canonicalId(right.candidate) === right.candidate.id ? 0 : 1;
        return leftCanonical - rightCanonical || left.candidate.created_at.localeCompare(right.candidate.created_at);
      });

    if (duplicateCandidates.length === 0) {
      return jsonResponse({ duplicateOf: null, clusterSize: 1, matchedChallengeId: null, matchedTerms: [] });
    }

    const canonical = duplicateCandidates[0].candidate;
    const duplicateOf = canonicalId(canonical);
    const clusterSize = 1 + duplicateCandidates.filter(({ candidate }) => canonicalId(candidate) === duplicateOf).length;

    const { error: linkError } = await supabase
      .from("challenges")
      .update({ duplicate_of: duplicateOf })
      .eq("id", challengeId)
      .eq("submitted_by", user.id)
      .is("duplicate_of", null);
    if (linkError) throw new Error(`Failed to link duplicate challenge: ${linkError.message}`);

    if (duplicateOf === canonical.id) {
      const { error: countError } = await supabase
        .from("challenges")
        .update({ report_count: (canonical.report_count ?? 1) + 1 })
        .eq("id", duplicateOf);
      if (countError) throw new Error(`Failed to update duplicate cluster count: ${countError.message}`);
    }

    return jsonResponse({
      duplicateOf,
      clusterSize,
      matchedChallengeId: canonical.id,
      matchedTerms: duplicateCandidates[0].overlap,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in detect-duplicates function:", error);

    return jsonResponse({ success: false, error: message }, 500);
  }
});
