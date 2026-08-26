import { supabase } from "@/integrations/supabase/client";

export type ChallengeDomain =
  | "education"
  | "agriculture"
  | "healthcare"
  | "water_resources"
  | "environment"
  | "energy"
  | "urban_development"
  | "accessibility"
  | "public_administration"
  | "rural_livelihoods";

export interface ChallengeCluster {
  centroid: { lat: number; lng: number };
  challengeCount: number;
  category: ChallengeDomain;
}

interface ClusterableChallenge {
  id: string;
  domain: ChallengeDomain;
  lat: number;
  lon: number;
}

const ACTIVE_STATUSES = ["submitted", "ai_matched", "claimed", "in_progress"] as const;
const CLUSTER_RADIUS_METERS = 500;
const EARTH_RADIUS_METERS = 6_371_000;

function distanceMeters(left: ClusterableChallenge, right: ClusterableChallenge) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(right.lat - left.lat);
  const dLon = toRadians(right.lon - left.lon);
  const lat1 = toRadians(left.lat);
  const lat2 = toRadians(right.lat);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

/** Groups public, active challenges by domain and the same 500 m signal used
 * by detect-duplicates. Components are connected transitively, so a chain of
 * nearby reports remains one visible cluster. */
export async function getChallengeClusters(): Promise<ChallengeCluster[]> {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, domain, lat, lon")
    .in("status", [...ACTIVE_STATUSES])
    .not("domain", "is", null)
    .not("lat", "is", null)
    .not("lon", "is", null);

  if (error) throw new Error(`Failed to load active challenge clusters: ${error.message}`);

  const challenges = (data ?? []) as unknown as ClusterableChallenge[];
  const parent = challenges.map((_, index) => index);
  const find = (index: number): number => {
    if (parent[index] !== index) parent[index] = find(parent[index]);
    return parent[index];
  };
  const union = (left: number, right: number) => {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
  };

  for (let left = 0; left < challenges.length; left += 1) {
    for (let right = left + 1; right < challenges.length; right += 1) {
      if (challenges[left].domain === challenges[right].domain && distanceMeters(challenges[left], challenges[right]) <= CLUSTER_RADIUS_METERS) {
        union(left, right);
      }
    }
  }

  const grouped = new Map<number, ClusterableChallenge[]>();
  challenges.forEach((challenge, index) => {
    const root = find(index);
    const group = grouped.get(root) ?? [];
    group.push(challenge);
    grouped.set(root, group);
  });

  return [...grouped.values()]
    .map((group) => ({
      centroid: {
        lat: group.reduce((sum, challenge) => sum + challenge.lat, 0) / group.length,
        lng: group.reduce((sum, challenge) => sum + challenge.lon, 0) / group.length,
      },
      challengeCount: group.length,
      category: group[0].domain,
    }))
    .sort((left, right) => right.challengeCount - left.challengeCount);
}
