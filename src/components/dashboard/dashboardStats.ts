import { CHALLENGE_STATUS_ORDER } from "@/components/challenges/challengeLifecycle";
import { clusterChallenges } from "@/components/challenges/clusterChallenges";
import type { Database } from "@/integrations/supabase/types";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type ChallengeMatch = Database["public"]["Tables"]["challenge_matches"]["Row"];
type ChallengeDomain = Database["public"]["Enums"]["challenge_domain"];
type ChallengeStatus = Database["public"]["Enums"]["challenge_status"];
type Institution = { id: string; name: string };

/*
 * Every function here is pure (no fetching, no React) so each can be checked
 * against a real data snapshot independently of rendering — same discipline
 * as clusterChallenges.ts, and exactly how the numbers below were verified
 * before ChallengeDashboard.tsx was written at all.
 *
 * Deliberately does NOT invent anything the schema can't back: no metric here
 * reads a column that doesn't exist. "uncategorised" is a real, honest bucket
 * (domain IS NULL), not a placeholder — hiding it would make the domain chart
 * look more complete than the data actually is.
 */

export interface DomainCount {
  domain: ChallengeDomain | "uncategorised";
  count: number;
}

export function domainCounts(challenges: Challenge[]): DomainCount[] {
  const counts = new Map<string, number>();
  for (const c of challenges) {
    const key = c.domain ?? "uncategorised";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([domain, count]) => ({ domain: domain as DomainCount["domain"], count }))
    .sort((a, b) => b.count - a.count);
}

export interface StatusCount {
  status: ChallengeStatus;
  count: number;
}

/** Always returns all 5 lifecycle stages, zero-filled — a missing stage is real signal, not something to omit. */
export function statusFunnel(challenges: Challenge[]): StatusCount[] {
  const counts = new Map<ChallengeStatus, number>();
  for (const status of CHALLENGE_STATUS_ORDER) counts.set(status, 0);
  for (const c of challenges) counts.set(c.status, (counts.get(c.status) ?? 0) + 1);
  return CHALLENGE_STATUS_ORDER.map((status) => ({ status, count: counts.get(status) ?? 0 }));
}

export interface InstitutionParticipation {
  institutionId: string;
  name: string;
  totalMatches: number;
  claimedMatches: number;
}

/** Includes every institution, even ones with zero matches — a partner list curated down to only "winners" is exactly the misleading polish this dashboard's audience needs to NOT see. */
export function institutionParticipation(
  matches: ChallengeMatch[],
  institutions: Institution[],
): InstitutionParticipation[] {
  const byInst = new Map<string, { total: number; claimed: number }>();
  for (const inst of institutions) byInst.set(inst.id, { total: 0, claimed: 0 });
  for (const m of matches) {
    const entry = byInst.get(m.institution_id) ?? { total: 0, claimed: 0 };
    entry.total += 1;
    if (m.is_claimed) entry.claimed += 1;
    byInst.set(m.institution_id, entry);
  }
  return institutions
    .map((inst) => {
      const entry = byInst.get(inst.id) ?? { total: 0, claimed: 0 };
      return { institutionId: inst.id, name: inst.name, totalMatches: entry.total, claimedMatches: entry.claimed };
    })
    .sort((a, b) => b.totalMatches - a.totalMatches);
}

export interface DuplicateClusterSummary {
  totalClusters: number;
  challengesFolded: number; // non-canonical rows folded into a canonical one
  clusters: { canonicalTitle: string; memberCount: number }[];
}

/** Reuses clusterChallenges.ts directly rather than re-deriving the grouping logic. */
export function duplicateClusterSummary(challenges: Challenge[]): DuplicateClusterSummary {
  const clusters = clusterChallenges(challenges);
  const multi = clusters.filter((c) => c.members.length > 1);
  return {
    totalClusters: clusters.length,
    challengesFolded: multi.reduce((sum, c) => sum + c.members.length - 1, 0),
    clusters: multi
      .map((c) => ({ canonicalTitle: c.canonical.title, memberCount: c.members.length }))
      .sort((a, b) => b.memberCount - a.memberCount),
  };
}

export interface DashboardKpis {
  totalChallenges: number;
  institutionsEngaged: number;
  institutionsTotal: number;
  matchesClaimed: number;
  matchesTotal: number;
  duplicateClusters: number;
}

export function dashboardKpis(
  challenges: Challenge[],
  matches: ChallengeMatch[],
  institutions: Institution[],
): DashboardKpis {
  const engagedIds = new Set(matches.map((m) => m.institution_id));
  return {
    totalChallenges: challenges.length,
    institutionsEngaged: engagedIds.size,
    institutionsTotal: institutions.length,
    matchesClaimed: matches.filter((m) => m.is_claimed).length,
    matchesTotal: matches.length,
    duplicateClusters: duplicateClusterSummary(challenges).totalClusters,
  };
}
