import { supabase } from "@/integrations/supabase/client";

const DOMAIN_LABELS: Record<string, string> = {
  education: "EDUCATION",
  agriculture: "AGRICULTURE",
  healthcare: "HEALTHCARE",
  water_resources: "WATER RESOURCES",
  environment: "ENVIRONMENT",
  energy: "ENERGY",
  urban_development: "URBAN DEVELOPMENT",
  accessibility: "ACCESSIBILITY",
  public_administration: "PUBLIC ADMINISTRATION",
  rural_livelihoods: "RURAL LIVELIHOODS",
};

export type ClaimedInstitutionRow = {
  claimed_at: string | null;
  institutions: { name: string } | null;
};

function rotate<T>(items: T[], now = Date.now()): T[] {
  if (items.length < 2) return items;
  const offset = Math.floor(now / 30_000) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

/**
 * Reads only public dashboard data and returns labels compatible with
 * `<Ticker labels={labels} />`. Institution names are public directory data;
 * no challenge descriptions or citizen identity fields are selected.
 */
export async function loadTickerLabels(now = Date.now()): Promise<string[]> {
  const [{ data: challenges, error: challengesError }, { data: claimed, error: claimedError }] = await Promise.all([
    supabase.from("challenges").select("domain"),
    supabase
      .from("challenge_matches")
      .select("claimed_at, institutions(name)")
      .eq("is_claimed", true)
      .order("claimed_at", { ascending: false, nullsFirst: false })
      .limit(8),
  ]);

  if (challengesError) throw new Error(`Failed to load ticker challenge totals: ${challengesError.message}`);
  if (claimedError) throw new Error(`Failed to load ticker claimed matches: ${claimedError.message}`);

  const domainCounts = new Map<string, number>();
  for (const row of challenges ?? []) {
    if (row.domain) domainCounts.set(row.domain, (domainCounts.get(row.domain) ?? 0) + 1);
  }

  const labels = [`${challenges?.length ?? 0} CHALLENGES SUBMITTED`];
  for (const [domain, count] of domainCounts) {
    labels.push(`${count} ${DOMAIN_LABELS[domain] ?? domain.split("_").join(" ").toUpperCase()} CHALLENGES`);
  }

  for (const row of (claimed ?? []) as unknown as ClaimedInstitutionRow[]) {
    const name = row.institutions?.name?.trim();
    if (name) labels.push(`${name} CLAIMED A MATCH`);
  }

  return rotate(labels, now);
}

export { rotate as rotateTickerLabels };
