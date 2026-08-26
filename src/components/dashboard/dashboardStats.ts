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

/* ── Tier 3: department aggregates ──────────────────────────────────────
 *
 * Built for the Department of Higher & Technical Education persona: where
 * problems are coming from, what subjects they fall under, how much is still
 * open, and how quickly the matcher actually responds.
 *
 * Same rule as everything above — nothing here reads a column that does not
 * exist. In particular there is NO district table: `challenges.location_text`
 * is free text a citizen typed, so `districtCounts` groups by that string
 * and says so in the UI rather than implying a validated district list.
 */

export interface DistrictCount {
  /** The raw `location_text`, or null when the reporter gave no location. */
  district: string | null;
  count: number;
  unresolved: number;
}

export function districtCounts(challenges: Challenge[]): DistrictCount[] {
  const map = new Map<string, { count: number; unresolved: number }>();
  for (const c of challenges) {
    const key = (c.location_text ?? "").trim();
    const entry = map.get(key) ?? { count: 0, unresolved: 0 };
    entry.count += 1;
    if (c.status !== "resolved") entry.unresolved += 1;
    map.set(key, entry);
  }
  return [...map.entries()]
    .map(([district, v]) => ({ district: district === "" ? null : district, ...v }))
    .sort((a, b) => b.count - a.count || (a.district ?? "").localeCompare(b.district ?? ""));
}

export interface ResolutionProgress {
  total: number;
  resolved: number;
  confirmed: number;
  unresolved: number;
  /** 0-100. Zero when there are no challenges at all, not NaN. */
  unresolvedPercent: number;
}

export function resolutionProgress(challenges: Challenge[]): ResolutionProgress {
  const total = challenges.length;
  const resolved = challenges.filter((c) => c.status === "resolved").length;
  const confirmed = challenges.filter((c) => c.resolved_confirmed_at != null).length;
  const unresolved = total - resolved;
  return {
    total,
    resolved,
    confirmed,
    unresolved,
    unresolvedPercent: total === 0 ? 0 : (unresolved / total) * 100,
  };
}

export interface TimeToMatch {
  /** Challenges that actually have at least one match row. */
  matchedCount: number;
  totalCount: number;
  averageMs: number | null;
  medianMs: number | null;
  fastestMs: number | null;
  slowestMs: number | null;
}

/*
 * Time from a challenge being created to its FIRST match row appearing.
 *
 * Median is reported alongside the average deliberately: on real data the two
 * diverge by orders of magnitude (a handful of challenges were matched long
 * after submission during testing, dragging the mean up), and quoting only
 * the mean would misrepresent the typical case. Rows whose first match
 * predates the challenge are impossible and are excluded rather than allowed
 * to produce a negative duration.
 */
export function timeToMatch(challenges: Challenge[], matches: ChallengeMatch[]): TimeToMatch {
  const firstMatchAt = new Map<string, number>();
  for (const m of matches) {
    const t = new Date(m.created_at).getTime();
    if (!Number.isFinite(t)) continue;
    const prev = firstMatchAt.get(m.challenge_id);
    if (prev === undefined || t < prev) firstMatchAt.set(m.challenge_id, t);
  }

  const deltas: number[] = [];
  for (const c of challenges) {
    const matchedAt = firstMatchAt.get(c.id);
    if (matchedAt === undefined) continue;
    const createdAt = new Date(c.created_at).getTime();
    if (!Number.isFinite(createdAt)) continue;
    const delta = matchedAt - createdAt;
    if (delta >= 0) deltas.push(delta);
  }

  if (deltas.length === 0) {
    return {
      matchedCount: 0,
      totalCount: challenges.length,
      averageMs: null,
      medianMs: null,
      fastestMs: null,
      slowestMs: null,
    };
  }

  const sorted = [...deltas].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return {
    matchedCount: deltas.length,
    totalCount: challenges.length,
    averageMs: deltas.reduce((sum, d) => sum + d, 0) / deltas.length,
    medianMs: sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid],
    fastestMs: sorted[0],
    slowestMs: sorted[sorted.length - 1],
  };
}

/** Compact human duration: "2.4s", "6m", "1.3h", "2.1d". */
export function formatDuration(ms: number): string {
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds < 10 ? seconds.toFixed(1) : Math.round(seconds)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes < 10 ? minutes.toFixed(1) : Math.round(minutes)}m`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours < 10 ? hours.toFixed(1) : Math.round(hours)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}
