import { useTranslation } from "react-i18next";

import type { ChallengeStatus } from "@/components/challenges/challengeLifecycle";
import { strataColorForStatus, strataTextOn } from "@/lib/strataStatusMap";
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

/*
 * Band colors now come from Codex's strataTokens.ts via strataStatusMap,
 * replacing the previous hand-authored --status-* CSS variables. Applied as
 * an inline style rather than a Tailwind class because the values are real
 * hex strings from a TS module, not tokens Tailwind can see at build time.
 */

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
    <ol className={cn("overflow-hidden border-2 border-border", className)} aria-live="polite">
      {stages.map((stage) => {
        const state = stateOf(stage.key);

        // The stratum itself IS the row — a full band of ore-toned colour a
        // challenge sits inside while it holds that state, not a thin accent
        // line beside otherwise-plain content. Done bands sit at full,
        // settled strength; active carries the same color but pulses, since
        // motion (not a lighter tint) is what should read as "still moving
        // through this layer" versus "settled here."
        const reached = state === "done" || state === "active";
        const onBand = state === "failed" || reached;
        const bandColor = reached ? strataColorForStatus(stage.key as ChallengeStatus) : null;
        const bandStyle = bandColor ? { backgroundColor: bandColor } : undefined;
        // Codex's palette spans light tan to near-black, so label colour is
        // chosen per band by luminance rather than assumed white.
        const onLight = bandColor ? strataTextOn(bandColor) === "dark" : false;

        return (
          <li
            key={stage.key}
            style={bandStyle}
            className={cn(
              "flex items-stretch border-b border-border/60 last:border-b-0 transition-colors",
              state === "failed" && "bg-destructive",
              !reached && state !== "failed" && "bg-muted",
              state === "pending" && "opacity-60",
              state === "active" && "animate-pulse",
            )}
          >
            <span className={cn("flex-1 px-4", compact ? "py-1.5" : "py-3")}>
              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span
                  className={cn(
                    "font-mono font-bold uppercase tracking-wide",
                    compact ? "text-sm" : "text-base",
                    onBand && (onLight ? "text-black" : "text-white"),
                  )}
                >
                  {stage.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-xs uppercase tracking-wide",
                    onBand ? (onLight ? "text-black/75" : "text-white/80") : "text-muted-foreground",
                  )}
                >
                  {stateWord[state]}
                </span>
              </span>
              {!compact && stage.detail ? (
                <span
                  className={cn(
                    "mt-1 block text-sm",
                    onBand ? (onLight ? "text-black/80" : "text-white/85") : "text-muted-foreground",
                  )}
                >
                  {stage.detail}
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
