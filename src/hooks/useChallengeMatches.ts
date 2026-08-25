import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ChallengeMatch = Database["public"]["Tables"]["challenge_matches"]["Row"];
export type InstitutionSummary = { name: string; department: string | null; institution_type: string };

/*
 * Batches the challenge_matches + institutions lookups for a set of challenge
 * ids into two IN queries total, however many challenges are passed — not one
 * pair of queries per card. Extracted here because ChallengeFeed (Task 3) and
 * ChallengeMap (Task 4) both need exactly this grouping; keeping one audited
 * version instead of two copies that could quietly drift apart.
 */
export function useChallengeMatches(challengeIds: string[]) {
  const [matchesByChallenge, setMatchesByChallenge] = useState<Record<string, ChallengeMatch[]>>({});
  const [institutionsById, setInstitutionsById] = useState<Record<string, InstitutionSummary>>({});
  const [loading, setLoading] = useState(false);

  // Stable key so the effect only re-runs when the SET of ids actually
  // changes, not on every render where the caller passes a new array literal.
  const key = challengeIds.slice().sort().join(",");

  useEffect(() => {
    if (challengeIds.length === 0) {
      setMatchesByChallenge({});
      setInstitutionsById({});
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      const { data: matchRows, error: mErr } = await supabase
        .from("challenge_matches")
        .select("*")
        .in("challenge_id", challengeIds)
        .order("match_score", { ascending: false });
      if (mErr || !active) return;

      const grouped: Record<string, ChallengeMatch[]> = {};
      for (const m of matchRows ?? []) {
        (grouped[m.challenge_id] ??= []).push(m);
      }
      setMatchesByChallenge(grouped);

      const instIds = [...new Set((matchRows ?? []).map((m) => m.institution_id))];
      if (instIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data: insts } = await supabase
        .from("institutions")
        .select("id, name, department, institution_type")
        .in("id", instIds);
      if (!active) return;

      setInstitutionsById(Object.fromEntries((insts ?? []).map((i) => [i.id, i])));
      setLoading(false);
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` IS the dependency; challengeIds itself is intentionally excluded to avoid re-fetching on every new array identity.
  }, [key]);

  return { matchesByChallenge, institutionsById, loading };
}
