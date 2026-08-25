import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/*
 * Flagged explicitly ahead of this task (Task 1c's verification): PostgREST
 * reports an RLS-blocked UPDATE as HTTP 200 with an EMPTY result array, not
 * an error. Verified live back then — claiming another institution's match
 * returns 200/[] indistinguishable by status code alone from claiming your
 * own. `!error` is therefore not a valid success check here.
 *
 * Two things this component does about that, both required, not optional:
 *   1. `.eq("is_claimed", false).select()` — the WHERE guard also closes a
 *      real race (two admins of the same institution, or a stale tab,
 *      claiming twice), and .select() is what makes a returned row possible
 *      to check at all.
 *   2. The row count of the response IS the success signal. Zero rows back
 *      means "did not claim," full stop, regardless of `error` being null —
 *      and the parent is only told a claim happened via `onClaimed`, which
 *      only fires after a non-empty array comes back.
 */
export function ClaimButton({
  matchId,
  onClaimed,
}: {
  matchId: string;
  onClaimed: (claimedAt: string) => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setBusy(true);
    setError(null);

    const claimedAt = new Date().toISOString();
    const { data, error: err } = await supabase
      .from("challenge_matches")
      .update({ is_claimed: true, claimed_at: claimedAt })
      .eq("id", matchId)
      .eq("is_claimed", false)
      .select();

    setBusy(false);

    if (err) {
      setError(t("institution.claim.error"));
      return;
    }

    if (!data || data.length === 0) {
      // Genuinely ambiguous from here which of the two happened — RLS
      // silently blocked it, or someone else claimed it a moment earlier —
      // and pretending to know would be worse than saying so plainly.
      setError(t("institution.claim.notClaimed"));
      return;
    }

    onClaimed(data[0].claimed_at ?? claimedAt);
  }

  return (
    <div className="space-y-2">
      <Button onClick={() => void handleClaim()} disabled={busy} variant="accent" size="sm">
        {busy ? <Loader2 className="animate-spin" /> : <Check />}
        {t("institution.claim.cta")}
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
