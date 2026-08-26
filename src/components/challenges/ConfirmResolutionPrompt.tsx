import { Check, HelpCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/*
 * "Did this actually get fixed?" — the reporting citizen's own confirmation,
 * distinct from an institution marking their claim resolved
 * (MarkResolvedButton). Deliberately placed on the challenge card itself,
 * wherever the reporter already encounters their own report (the public
 * feed, the map popup) rather than a new notification system or a
 * dedicated "my reports" page — both would be real scope creep against
 * Global Rule #12's MVP freeze (no notification system) for a prompt that
 * only needs to appear on content the citizen already visits.
 *
 * Calls Codex's confirm-resolution edge function, which enforces
 * submitted_by ownership and requires status = 'resolved' server-side —
 * this component does not re-implement that check as its own authority,
 * only as the gate for whether to render at all (ChallengeCard passes
 * isOwnReport, already computed from useAuth()).
 */
export function ConfirmResolutionPrompt({
  challengeId,
  onConfirmed,
}: {
  challengeId: string;
  onConfirmed: (confirmedAt: string) => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState<"yes" | "no" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  async function handleConfirm() {
    setBusy("yes");
    setError(null);

    const { data, error: err } = await supabase.functions.invoke("confirm-resolution", {
      body: { challengeId },
    });

    setBusy(null);

    if (err || !data?.success) {
      setError(t("resolution.confirm.error"));
      return;
    }

    onConfirmed(data.resolvedConfirmedAt as string);
  }

  if (dismissed) return null;

  return (
    <div className="border-2 border-accent bg-accent/5 p-4">
      <div className="flex items-start gap-2">
        <HelpCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="flex-1">
          <p className="font-medium">{t("resolution.confirm.question")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("resolution.confirm.body")}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="accent" onClick={() => void handleConfirm()} disabled={busy !== null}>
              {busy === "yes" ? <Loader2 className="animate-spin" /> : <Check />}
              {t("resolution.confirm.yes")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy !== null}
              onClick={() => setDismissed(true)}
            >
              <X />
              {t("resolution.confirm.notYet")}
            </Button>
          </div>

          {error ? (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
