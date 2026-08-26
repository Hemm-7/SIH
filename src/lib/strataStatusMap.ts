import { CHALLENGE_STATUS_ORDER, type ChallengeStatus } from "@/components/challenges/challengeLifecycle";
import { STRATA_COLORS, STRATA_LAYER_THICKNESS, STRATA_STATES } from "@/lib/strataTokens";

/*
 * Bridges Codex's strataTokens.ts (STRATA_STATES: submitted, reviewing,
 * matched, in_progress, resolved) onto the REAL public.challenge_status
 * enum from contracts.md, which is law per Global Rule #1.
 *
 * DATA-SHAPE FLAG (full note in .agent/status/claude-code-status.md):
 * Codex's state NAMES don't match the real lifecycle — "reviewing" isn't a
 * real stage, and "matched" sits at index 2 in Codex's array where the real
 * ai_matched is index 1. There is no correct name-for-name mapping, so this
 * maps POSITIONALLY: real status at index i takes Codex's color/thickness at
 * index i. Color VALUES are imported, never redefined here.
 *
 * Lifecycle order is reused from challengeLifecycle.ts rather than
 * re-declared — that file is the single place the sequence is defined.
 */

export function strataColorForStatus(status: ChallengeStatus): string {
  const index = CHALLENGE_STATUS_ORDER.indexOf(status);
  const key = STRATA_STATES[index] ?? STRATA_STATES[0];
  return STRATA_COLORS[key];
}

export function strataThicknessForStatus(status: ChallengeStatus): number {
  const index = CHALLENGE_STATUS_ORDER.indexOf(status);
  return STRATA_LAYER_THICKNESS[index] ?? STRATA_LAYER_THICKNESS[0];
}

/*
 * Codex's five strata colours span a wide lightness range — the tan
 * (#c28a3d) and grey (#66717f) bands are light enough that hardcoded white
 * label text lands around 2.6:1, under the accessible floor, while the near
 * black (#252b35) and blue (#0044ff) bands need white. Pick per band from
 * relative luminance instead of assuming one or the other.
 */
export function strataTextOn(hex: string): "light" | "dark" {
  const value = hex.replace("#", "");
  const channel = (start: number) => {
    const srgb = parseInt(value.slice(start, start + 2), 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  // Contrast against white vs. against near-black; whichever is higher wins.
  return (1.05 / (luminance + 0.05)) >= ((luminance + 0.05) / 0.05) ? "light" : "dark";
}
