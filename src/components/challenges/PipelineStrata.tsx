import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

/*
 * design-brief.md: "Status pipeline as strata, not step badges" — Jharkhand's
 * identity is mineral strata, so the lifecycle is rendered as stacked bands a
 * challenge visibly moves down through, rather than the 01/02/03 numbered circles
 * the brief specifically flags as a default to avoid.
 *
 * Two consumers: ChallengeSubmissionForm (Task 2) uses it full-size as live
 * submission feedback so the wait for two model calls reads as movement, not a
 * hang. ChallengeCard (Task 3) uses `compact` to show a challenge's CURRENT
 * lifecycle position inside a dense feed without a 5-row list per card.
 */

export type Stage = {
  key: string;
  label: string;
  detail?: string;
};

export type StageState = "pending" | "active" | "done" | "failed";

const BAND_COLOR: Record<string, string> = {
  submitted: "bg-status-submitted",
  ai_matched: "bg-status-ai-matched",
  claimed: "bg-status-claimed",
  in_progress: "bg-status-in-progress",
  resolved: "bg-status-resolved",
};

export function PipelineStrata({
  stages,
  stateOf,
  className,
  compact = false,
}: {
  stages: Stage[];
  stateOf: (key: string) => StageState;
  className?: string;
  /** Slim bands, no detail text — for a status indicator inside a feed card. */
  compact?: boolean;
}) {
  const { t } = useTranslation();

  const stateWord: Record<StageState, string> = {
    active: t("pipeline.working"),
    done: t("pipeline.done"),
    failed: t("pipeline.failed"),
    pending: t("pipeline.waiting"),
  };

  return (
    // aria-live so screen-reader users hear progress instead of silence.
    <ol className={cn("overflow-hidden rounded-lg border border-border", className)} aria-live="polite">
      {stages.map((stage) => {
        const state = stateOf(stage.key);
        const band = BAND_COLOR[stage.key] ?? "bg-muted-foreground";

        return (
          <li
            key={stage.key}
            className={cn(
              "flex items-stretch gap-3 border-b border-border last:border-b-0 transition-colors",
              state === "pending" && "opacity-45",
              state === "active" && "bg-secondary",
              state === "failed" && "bg-destructive/10",
            )}
          >
            {/* The stratum itself — a solid band of ore-toned colour. */}
            <span
              aria-hidden
              className={cn(
                "shrink-0",
                compact ? "w-1.5" : "w-2",
                state === "pending" ? "bg-border" : state === "failed" ? "bg-destructive" : band,
              )}
            />
            <span className={cn("flex-1 pr-4", compact ? "py-1.5" : "py-3")}>
              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className={cn("font-display font-semibold", compact ? "text-sm" : "text-base")}>
                  {stage.label}
                </span>
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                  {stateWord[state]}
                </span>
              </span>
              {!compact && stage.detail ? (
                <span className="mt-1 block text-sm text-muted-foreground">{stage.detail}</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
