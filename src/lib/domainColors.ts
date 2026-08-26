import type { ChallengeDomain } from "@/lib/challengeClusters";

// Distinct from strataStatusMap's lifecycle-status colors: this maps the 10
// challenge_domain values (a completely different axis — subject, not
// pipeline stage) to a spread-hue categorical palette, so the two map views
// (per-report/status and per-cluster/domain) never look like the same
// colour language answering two different questions.
const DOMAIN_COLORS: Record<ChallengeDomain, string> = {
  education: "#FACC15",
  energy: "#F97316",
  agriculture: "#84CC16",
  environment: "#10B981",
  water_resources: "#06B6D4",
  public_administration: "#64748B",
  urban_development: "#6366F1",
  rural_livelihoods: "#A855F7",
  accessibility: "#EC4899",
  healthcare: "#F43F5E",
};

export function domainColor(domain: ChallengeDomain): string {
  return DOMAIN_COLORS[domain];
}
