import type { Database } from "@/integrations/supabase/types";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

export interface ChallengeCluster {
  /** The canonical challenge (duplicate_of IS NULL). Used for the marker's own position/status. */
  canonical: Challenge;
  /** Canonical first, then every row linked to it via duplicate_of, oldest first. */
  members: Challenge[];
}

/*
 * Groups a set of challenges into map clusters purely from `duplicate_of`,
 * exactly what detect-duplicates writes. A pure function (no fetching, no
 * React) so it can be checked against real data independently of rendering —
 * see the verification in the Task 4 status entry.
 *
 * Ungrouped rows (a duplicate_of pointing at a challenge NOT in the current
 * batch — e.g. it fell off a page boundary) fall back to being their own
 * single-member cluster rather than being silently dropped from the map.
 */
export function clusterChallenges(challenges: Challenge[]): ChallengeCluster[] {
  const byId = new Map(challenges.map((c) => [c.id, c]));
  const membersByCanonicalId = new Map<string, Challenge[]>();

  for (const challenge of challenges) {
    const canonicalId =
      challenge.duplicate_of && byId.has(challenge.duplicate_of) ? challenge.duplicate_of : challenge.id;
    const list = membersByCanonicalId.get(canonicalId) ?? [];
    list.push(challenge);
    membersByCanonicalId.set(canonicalId, list);
  }

  const clusters: ChallengeCluster[] = [];
  for (const [canonicalId, members] of membersByCanonicalId) {
    const canonical = byId.get(canonicalId);
    if (!canonical) continue; // defensive; canonicalId always came from byId above
    members.sort((a, b) => a.created_at.localeCompare(b.created_at));
    clusters.push({ canonical, members });
  }

  return clusters;
}
