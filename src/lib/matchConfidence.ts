/*
 * Single source for turning a raw match_score into something safe to show.
 *
 * contracts.md "Displaying match confidence": zero-shot splits probability across
 * every candidate label, so a genuinely correct top-1 routinely lands at 0.30-0.40.
 * Rendering that as "34% confidence" reads as doubt when there may be none, so the
 * raw float must never reach the DOM as a percentage. Everything downstream reads
 * ONLY the discrete tier — this function is the one place the float is looked at.
 */

export type ConfidenceTier = "strong" | "likely" | "possible";

export function confidenceTier(score: number): ConfidenceTier {
  if (score >= 0.5) return "strong";
  if (score >= 0.25) return "likely";
  return "possible";
}

/*
 * The exact string match-institutions/index.ts emits when no specialization tag
 * genuinely overlaps the description (contracts.md "Honest match_reason fallback").
 * Matched by content, not a flag column, because none exists — Codex's function is
 * the only writer of match_reason. If the wording ever drifts this degrades
 * gracefully: the text just renders in the normal (non-fallback) style instead of
 * the muted one, not a crash.
 */
export const HONEST_FALLBACK_REASON =
  "matched by domain classification only - no direct specialization overlap found";

export function isHonestFallback(reason: string): boolean {
  return reason.trim() === HONEST_FALLBACK_REASON;
}
