export const STRATA_STATES = [
  "submitted",
  "reviewing",
  "matched",
  "in_progress",
  "resolved",
] as const;

export type StrataState = (typeof STRATA_STATES)[number];

export const STRATA_COLORS: Record<StrataState, string> = {
  submitted: "#c28a3d",
  reviewing: "#a94b2c",
  matched: "#66717f",
  in_progress: "#252b35",
  resolved: "#0044ff",
};

export const STRATA_GRADIENT = [
  STRATA_COLORS.submitted,
  STRATA_COLORS.reviewing,
  STRATA_COLORS.matched,
  STRATA_COLORS.in_progress,
  STRATA_COLORS.resolved,
].join(", ");

export const STRATA_LAYER_THICKNESS = [0.28, 0.23, 0.2, 0.17, 0.12] as const;

export const STRATA_CSS_CUSTOM_PROPERTIES = `:root {
  --strata-submitted: ${STRATA_COLORS.submitted};
  --strata-reviewing: ${STRATA_COLORS.reviewing};
  --strata-matched: ${STRATA_COLORS.matched};
  --strata-in-progress: ${STRATA_COLORS.in_progress};
  --strata-resolved: ${STRATA_COLORS.resolved};
  --strata-gradient: linear-gradient(180deg, ${STRATA_GRADIENT});
  --strata-thickness-submitted: ${STRATA_LAYER_THICKNESS[0]};
  --strata-thickness-reviewing: ${STRATA_LAYER_THICKNESS[1]};
  --strata-thickness-matched: ${STRATA_LAYER_THICKNESS[2]};
  --strata-thickness-in-progress: ${STRATA_LAYER_THICKNESS[3]};
  --strata-thickness-resolved: ${STRATA_LAYER_THICKNESS[4]};
}`;
