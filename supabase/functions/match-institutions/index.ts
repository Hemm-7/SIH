import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HF_ZERO_SHOT_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";
const MAX_INPUT_LENGTH = 1000;
const MAX_MATCHES = 3;

const CHALLENGE_DOMAINS = [
  "education",
  "agriculture",
  "healthcare",
  "water_resources",
  "environment",
  "energy",
  "urban_development",
  "accessibility",
  "public_administration",
  "rural_livelihoods",
] as const;

const MATCH_STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in", "into",
  "is", "it", "of", "on", "or", "our", "that", "the", "their", "this", "to", "was", "with",
]);

type ChallengeDomain = (typeof CHALLENGE_DOMAINS)[number];

interface Institution {
  id: string;
  name: string;
  department: string | null;
  expertise_tags: unknown;
}

interface CandidateInstitution extends Institution {
  classifierLabel: string;
  specializationTags: string[];
}

interface ZeroShotClassification {
  label: string;
  score: number;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isChallengeDomain(value: string): value is ChallengeDomain {
  return CHALLENGE_DOMAINS.includes(value as ChallengeDomain);
}

function splitExpertiseTags(value: unknown): { domainTags: ChallengeDomain[]; specializationTags: string[] } {
  const tags = Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === "string") : [];
  const domainTags: ChallengeDomain[] = [];
  let specializationStart = 0;

  while (specializationStart < tags.length && isChallengeDomain(tags[specializationStart])) {
    domainTags.push(tags[specializationStart]);
    specializationStart += 1;
  }

  return { domainTags, specializationTags: tags.slice(specializationStart) };
}

function candidateLabel(institution: Institution, specializationTags: string[]) {
  return [...specializationTags, institution.name, institution.department].filter(Boolean).join(" | ");
}

function matchReason(domain: ChallengeDomain, description: string, specializationTags: string[]) {
  const terms = (text: string) =>
    new Set(
      (text.toLowerCase().match(/[a-z]{3,}/g) ?? []).filter((word) => !MATCH_STOPWORDS.has(word)),
    );
  const words = terms(description);
  const domainTerms = terms(domain.replaceAll("_", " "));
  const matchingTags = specializationTags.filter((tag) =>
    [...terms(tag)].some((word) => words.has(word) && !domainTerms.has(word)),
  );
  if (matchingTags.length === 0) {
    return "matched by domain classification only - no direct specialization overlap found";
  }

  return [domain.replaceAll("_", " "), ...matchingTags.slice(0, 2)].join(", ");
}

async function classifyInstitutions(text: string, candidates: CandidateInstitution[]) {
  const apiKey = Deno.env.get("HUGGINGFACE_API_KEY")?.trim();
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured in Supabase secrets.");
  }

  const response = await fetch(HF_ZERO_SHOT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
      parameters: { candidate_labels: candidates.map((candidate) => candidate.classifierLabel) },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Hugging Face zero-shot request failed (${response.status}): ${body}`);
  }

  const results = (await response.json()) as ZeroShotClassification[];
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("Hugging Face returned an empty classification result.");
  }

  return results;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { challengeId, description, domain } = await req.json();

    if (typeof challengeId !== "string" || challengeId.length === 0) {
      return jsonResponse({ success: false, error: "challengeId is required." }, 400);
    }
    if (typeof description !== "string" || description.trim().length === 0) {
      return jsonResponse({ success: false, error: "description is required." }, 400);
    }
    if (typeof domain !== "string" || !isChallengeDomain(domain)) {
      return jsonResponse({ success: false, error: "domain must be a valid challenge domain." }, 400);
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
    const { data: challenge, error: challengeError } = await supabase
      .from("challenges")
      .select("id")
      .eq("id", challengeId)
      .eq("submitted_by", user.id)
      .maybeSingle();

    if (challengeError) {
      throw new Error(`Failed to verify challenge ownership: ${challengeError.message}`);
    }
    if (!challenge) {
      return jsonResponse({ success: false, error: "Challenge was not found or is not owned by the caller." }, 403);
    }

    const { data: institutions, error: institutionsError } = await supabase
      .from("institutions")
      .select("id, name, department, expertise_tags");

    if (institutionsError) {
      throw new Error(`Failed to fetch institutions: ${institutionsError.message}`);
    }

    const candidates = ((institutions ?? []) as Institution[])
      .map((institution) => {
        const { domainTags, specializationTags } = splitExpertiseTags(institution.expertise_tags);
        return { ...institution, domainTags, specializationTags };
      })
      .filter((institution) => institution.domainTags.includes(domain))
      .map((institution) => ({
        id: institution.id,
        name: institution.name,
        department: institution.department,
        expertise_tags: institution.expertise_tags,
        specializationTags: institution.specializationTags,
        classifierLabel: candidateLabel(institution, institution.specializationTags),
      }));

    if (candidates.length === 0) {
      return jsonResponse({ success: true, matches: [] });
    }

    const results = await classifyInstitutions(description.trim().slice(0, MAX_INPUT_LENGTH), candidates);
    const candidatesByLabel = new Map(candidates.map((candidate) => [candidate.classifierLabel, candidate]));
    const matches = results
      .map((result) => ({ result, candidate: candidatesByLabel.get(result.label) }))
      .filter((entry): entry is { result: ZeroShotClassification; candidate: CandidateInstitution } => Boolean(entry.candidate))
      .sort((left, right) => right.result.score - left.result.score)
      .slice(0, MAX_MATCHES)
      .map(({ result, candidate }) => ({
        institutionId: candidate.id,
        score: result.score,
        reason: matchReason(domain, description, candidate.specializationTags),
      }));

    const { error: matchesError } = await supabase.from("challenge_matches").upsert(
      matches.map((match) => ({
        challenge_id: challengeId,
        institution_id: match.institutionId,
        match_score: match.score,
        match_reason: match.reason,
      })),
      { onConflict: "challenge_id,institution_id" },
    );

    if (matchesError) {
      throw new Error(`Failed to persist institution matches: ${matchesError.message}`);
    }

    const { error: statusError } = await supabase
      .from("challenges")
      .update({ status: "ai_matched" })
      .eq("id", challengeId)
      .eq("submitted_by", user.id)
      .eq("status", "submitted");

    if (statusError) {
      throw new Error(`Failed to update challenge status: ${statusError.message}`);
    }

    return jsonResponse({ success: true, matches });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in match-institutions function:", error);

    return jsonResponse({ success: false, error: message }, 500);
  }
});
