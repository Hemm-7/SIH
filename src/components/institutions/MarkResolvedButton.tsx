import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/*
 * Same RLS-blocked-write discipline as ClaimButton, same reasoning: an
 * institution admin has no UPDATE grant on public.challenges (only admins
 * do), so this writes challenge_matches.marked_resolved_at instead — column
 * they ARE allowed to update on their own claimed rows — and a
 * SECURITY DEFINER trigger (20260826110000_advance_status_on_resolve.sql)
 * advances challenges.status to 'resolved' server-side. Verified live
 * before this component was written: PATCHing marked_resolved_at on a real
 * claimed match flipped the challenge's status on re-read.
 *
 * Row-count check, not `!error` — RLS can silently return 200/[] the same
 * way it can on the claim write.
 */
export function MarkResolvedButton({
  matchId,
  onResolved,
}: {
  matchId: string;
  onResolved: (resolvedAt: string) => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMarkResolved() {
    setBusy(true);
    setError(null);

    const resolvedAt = new Date().toISOString();
    const { data, error: err } = await supabase
      .from("challenge_matches")
      .update({ marked_resolved_at: resolvedAt })
      .eq("id", matchId)
      .is("marked_resolved_at", null)
      .select();

    setBusy(false);

    if (err) {
      setError(t("institution.resolve.error"));
      return;
    }

    if (!data || data.length === 0) {
      setError(t("institution.resolve.notRecorded"));
      return;
    }

    onResolved(data[0].marked_resolved_at ?? resolvedAt);
  }

  return (
    <div className="space-y-2">
      <Button onClick={() => void handleMarkResolved()} disabled={busy} variant="accent" size="sm">
        {busy ? <Loader2 className="animate-spin" /> : <Check />}
        {t("institution.resolve.cta")}
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
