import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HF_ZERO_SHOT_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";
const MAX_INPUT_LENGTH = 1000;

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

type ChallengeDomain = (typeof CHALLENGE_DOMAINS)[number];

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

async function classifyDomain(text: string): Promise<{ domain: ChallengeDomain; confidence: number }> {
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
      parameters: { candidate_labels: CHALLENGE_DOMAINS },
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

  const top = results.reduce((best, candidate) => (candidate.score > best.score ? candidate : best));

  return {
    domain: top.label as ChallengeDomain,
    confidence: top.score,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { challengeId, description } = await req.json();

    if (typeof description !== "string" || description.trim().length === 0) {
      return jsonResponse({ success: false, error: "description is required." }, 400);
    }

    const result = await classifyDomain(description.trim().slice(0, MAX_INPUT_LENGTH));

    if (typeof challengeId === "string" && challengeId.length > 0) {
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
        console.error(`Refused to persist domain for challenge ${challengeId}: no authenticated caller.`);
      } else {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        );
        const { error: updateError, count } = await supabase
          .from("challenges")
          .update(
            { domain: result.domain, domain_confidence: result.confidence },
            { count: "exact" },
          )
          .eq("id", challengeId)
          .eq("submitted_by", user.id);

        if (updateError) {
          console.error(`Failed to persist domain for challenge ${challengeId}:`, updateError);
        } else if (!count) {
          console.error(`Refused to persist domain for challenge ${challengeId}: not owned by caller ${user.id}.`);
        }
      }
    }

    return jsonResponse({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in categorize-challenge function:", error);

    return jsonResponse({ success: false, error: message }, 500);
  }
});
