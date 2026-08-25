import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ClaimButton } from "@/components/institutions/ClaimButton";
import { MatchExplainer } from "@/components/challenges/MatchExplainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { asInstitutionType } from "@/lib/db-narrow";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ChallengeDomain = Database["public"]["Enums"]["challenge_domain"];
type ChallengeStatus = Database["public"]["Enums"]["challenge_status"];

interface MatchRow {
  id: string;
  match_score: number;
  match_reason: string;
  is_claimed: boolean;
  claimed_at: string | null;
  created_at: string;
  challenges: {
    id: string;
    title: string;
    description: string;
    domain: ChallengeDomain | null;
    status: ChallengeStatus;
    location_text: string | null;
    created_at: string;
  } | null;
}

interface InstitutionRow {
  id: string;
  name: string;
  department: string | null;
  institution_type: string;
}

/*
 * design-brief.md pass: the institution/government audience's page has a
 * different job than the citizen feed — "provable at a glance" credibility,
 * not warmth. Two real decisions follow from that, not a default list:
 *
 *  1. Split into "waiting for a decision" (unclaimed, ranked by match score
 *     — the most confident match first, since that's the one worth acting on
 *     first) and "already claimed" (a running record, newest first) — an
 *     institution admin's actual question is "what do I need to act on
 *     right now" vs "what have I already committed to," and a single flat
 *     list answers neither well.
 *  2. Every row shows the SAME MatchExplainer bridge a citizen sees on the
 *     public feed, not a stripped-down internal summary — the explainability
 *     is exactly what makes a claim decision credible to defend later, and
 *     showing institutions a lesser version of the citizen-facing evidence
 *     would undercut the "not a black box" premise of the whole project.
 */
export function InstitutionQueue() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [institution, setInstitution] = useState<InstitutionRow | null | undefined>(undefined);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);

      const { data: inst, error: instErr } = await supabase
        .from("institutions")
        .select("id, name, department, institution_type")
        .eq("admin_user_id", user.id)
        .maybeSingle();

      if (!active) return;
      if (instErr) {
        setError(instErr.message);
        setLoading(false);
        return;
      }
      setInstitution(inst);

      if (!inst) {
        setLoading(false);
        return;
      }

      const { data: matchRows, error: matchErr } = await supabase
        .from("challenge_matches")
        .select("id, match_score, match_reason, is_claimed, claimed_at, created_at, challenges(id, title, description, domain, status, location_text, created_at)")
        .eq("institution_id", inst.id)
        .order("match_score", { ascending: false });

      if (!active) return;
      if (matchErr) {
        setError(matchErr.message);
      } else {
        setMatches((matchRows ?? []) as unknown as MatchRow[]);
      }
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [user]);

  function markClaimed(matchId: string, claimedAt: string) {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, is_claimed: true, claimed_at: claimedAt } : m)),
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm">
        {error}
      </p>
    );
  }

  if (institution === null) {
    // A real, distinct state, not a generic empty queue: the account has an
    // institution role but was never linked to an institution row. Silently
    // showing "nothing here" would look identical to "no matches yet" and
    // hide a setup problem the admin can't fix themselves.
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">{t("institution.notLinked")}</p>
      </div>
    );
  }

  if (!institution) {
    // Unreachable in practice — loading is false and the null case returned
    // above — but `institution`'s static type still carries the initial
    // `undefined` sentinel, so this satisfies the compiler without
    // pretending the runtime invariant is something TS can see on its own.
    return null;
  }

  const waiting = matches.filter((m) => !m.is_claimed);
  const claimed = matches
    .filter((m) => m.is_claimed)
    .sort((a, b) => (b.claimed_at ?? "").localeCompare(a.claimed_at ?? ""));

  return (
    <div className="space-y-10">
      <div className="rounded-lg border border-border bg-secondary/40 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {t(`institution.type.${asInstitutionType(institution.institution_type)}`)}
        </p>
        <p className="font-display text-lg font-semibold">{institution.name}</p>
        {institution.department ? (
          <p className="text-sm text-muted-foreground">{institution.department}</p>
        ) : null}
      </div>

      <section>
        <h2 className="font-display text-xl font-semibold">
          {t("institution.queue.waiting", { count: waiting.length })}
        </h2>
        {waiting.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{t("institution.queue.waitingEmpty")}</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {waiting.map((m) =>
              m.challenges ? (
                <li key={m.id}>
                  <Card>
                    <CardHeader className="space-y-1">
                      <h3 className="font-display text-lg font-semibold">{m.challenges.title}</h3>
                      <p className="text-sm text-muted-foreground">{m.challenges.description}</p>
                      {m.challenges.location_text ? (
                        <p className="text-xs text-muted-foreground">{m.challenges.location_text}</p>
                      ) : null}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <MatchExplainer
                        domain={m.challenges.domain ?? "public_administration"}
                        matchScore={m.match_score}
                        matchReason={m.match_reason}
                        institution={{
                          name: institution.name,
                          department: institution.department,
                          institutionType: asInstitutionType(institution.institution_type),
                        }}
                      />
                      <ClaimButton matchId={m.id} onClaimed={(claimedAt) => markClaimed(m.id, claimedAt)} />
                    </CardContent>
                  </Card>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </section>

      {claimed.length > 0 ? (
        <section>
          <h2 className="font-display text-xl font-semibold">
            {t("institution.queue.claimed", { count: claimed.length })}
          </h2>
          <ul className="mt-4 space-y-2">
            {claimed.map((m) =>
              m.challenges ? (
                <li key={m.id} className="flex flex-wrap items-baseline justify-between gap-2 rounded-md border border-border p-3">
                  <span className="font-medium">{m.challenges.title}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {t("institution.queue.claimedOn", {
                      date: m.claimed_at ? new Date(m.claimed_at).toLocaleDateString(i18n.language) : "",
                    })}
                  </span>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
