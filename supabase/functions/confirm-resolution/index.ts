import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ success: false, error: "POST is required." }, 405);

  try {
    const body = await req.json();
    const challengeId = body?.challengeId;
    if (typeof challengeId !== "string" || challengeId.length === 0) {
      return jsonResponse({ success: false, error: "challengeId is required." }, 400);
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
    if (!user) return jsonResponse({ success: false, error: "Authentication is required." }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data: challenge, error: challengeError } = await supabase
      .from("challenges")
      .select("id, status, submitted_by, resolved_confirmed_at")
      .eq("id", challengeId)
      .eq("submitted_by", user.id)
      .maybeSingle();

    if (challengeError) throw new Error(`Failed to load challenge: ${challengeError.message}`);
    if (!challenge) return jsonResponse({ success: false, error: "Challenge was not found or is not owned by the caller." }, 403);
    if (challenge.status !== "resolved") {
      return jsonResponse({ success: false, error: "Resolution can only be confirmed after the challenge is resolved." }, 409);
    }
    if (challenge.resolved_confirmed_at) {
      return jsonResponse({
        success: true,
        challengeId,
        resolvedConfirmedAt: challenge.resolved_confirmed_at,
        alreadyConfirmed: true,
      });
    }

    const confirmedAt = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from("challenges")
      .update({ resolved_confirmed_at: confirmedAt, resolved_confirmed_by: user.id })
      .eq("id", challengeId)
      .eq("submitted_by", user.id)
      .eq("status", "resolved")
      .is("resolved_confirmed_at", null)
      .select("id, resolved_confirmed_at, resolved_confirmed_by")
      .maybeSingle();

    if (updateError) throw new Error(`Failed to confirm resolution: ${updateError.message}`);
    if (!updated) return jsonResponse({ success: false, error: "Resolution confirmation could not be recorded." }, 409);

    const { data: verified, error: verifyError } = await supabase
      .from("challenges")
      .select("resolved_confirmed_at, resolved_confirmed_by")
      .eq("id", challengeId)
      .eq("submitted_by", user.id)
      .maybeSingle();
    if (verifyError) throw new Error(`Failed to verify resolution confirmation: ${verifyError.message}`);
    if (verified?.resolved_confirmed_by !== user.id || !verified.resolved_confirmed_at) {
      throw new Error("Resolution confirmation was not persisted.");
    }

    return jsonResponse({
      success: true,
      challengeId,
      resolvedConfirmedAt: verified.resolved_confirmed_at,
      alreadyConfirmed: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error in confirm-resolution function:", error);
    return jsonResponse({ success: false, error: message }, 500);
  }
});
