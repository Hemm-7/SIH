import type { TFunction } from "i18next";

import type { Stage, StageState } from "@/components/challenges/PipelineStrata";
import type { Database } from "@/integrations/supabase/types";

export type ChallengeStatus = Database["public"]["Enums"]["challenge_status"];

/** Canonical lifecycle order — the single place this sequence is declared. */
export const CHALLENGE_STATUS_ORDER: ChallengeStatus[] = [
  "submitted",
  "ai_matched",
  "claimed",
  "in_progress",
  "resolved",
];

export function lifecycleStages(t: TFunction): Stage[] {
  return CHALLENGE_STATUS_ORDER.map((key) => ({
    key,
    label: t(`challenge.status.${key}`),
  }));
}

/** Every stage up to and including `current` is done/active; the rest are pending. */
export function lifecycleStateOf(current: ChallengeStatus) {
  const currentIndex = CHALLENGE_STATUS_ORDER.indexOf(current);
  return (key: string): StageState => {
    const idx = CHALLENGE_STATUS_ORDER.indexOf(key as ChallengeStatus);
    if (idx < currentIndex) return "done";
    if (idx === currentIndex) return "active";
    return "pending";
  };
}
