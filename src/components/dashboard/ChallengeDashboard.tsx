import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { lifecycleStages, lifecycleStateOf } from "@/components/challenges/challengeLifecycle";
import { MatchExplainer } from "@/components/challenges/MatchExplainer";
import { PipelineStrata } from "@/components/challenges/PipelineStrata";
import {
  dashboardKpis,
  domainCounts,
  duplicateClusterSummary,
  institutionParticipation,
  statusFunnel,
} from "@/components/dashboard/dashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { asInstitutionType } from "@/lib/db-narrow";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type ChallengeMatch = Database["public"]["Tables"]["challenge_matches"]["Row"];
type Institution = Database["public"]["Tables"]["institutions"]["Row"];

const MAX_ROWS = 2000;

const STATUS_COLOR_VAR: Record<string, string> = {
  submitted: "hsl(var(--status-submitted))",
  ai_matched: "hsl(var(--status-ai-matched))",
  claimed: "hsl(var(--status-claimed))",
  in_progress: "hsl(var(--status-in-progress))",
  resolved: "hsl(var(--status-resolved))",
};

function StatTile({ label, value, sublabel }: { label: string; value: string | number; sublabel?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      {/* design-brief.md: monospace for the dashboard's numbers specifically —
          "this is real, auditable data," distinct from the display face used
          for headings elsewhere on this same page. */}
      <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">{value}</p>
      {sublabel ? <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p> : null}
    </div>
  );
}

/*
 * design-brief.md pass for the government/institution audience: "provable at
 * a glance — real numbers, real matches, real reasoning, not a dashboard
 * that could be showing fake data."
 *
 * Every number on this page traces to a real column, checked before writing
 * a single line of chart code — see dashboardStats.ts and its live
 * verification in the Task 7 status entry. Two decisions follow directly
 * from "not a dashboard that could be showing fake data," not defaults:
 *
 *  1. The domain chart shows an explicit "uncategorised" bucket rather than
 *     silently excluding rows with no domain — hiding it would make
 *     categorisation coverage look better than it actually is.
 *  2. Institutional participation lists ALL institutions, including the ones
 *     with zero matches, not a "top N" of active partners only — curating
 *     down to winners is exactly the misleading polish this audience needs
 *     to NOT see when judging whether matching is actually reaching the
 *     whole partner network.
 *
 * Reuses MatchExplainer (the signature element, unchanged) for a real
 * example match, and PipelineStrata (compact, same component ChallengeCard
 * uses) for the most recently created challenge's real lifecycle position —
 * neither logic is re-derived here.
 */
export function ChallengeDashboard() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [matches, setMatches] = useState<ChallengeMatch[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [c, m, i] = await Promise.all([
        supabase.from("challenges").select("*").order("created_at", { ascending: false }).limit(MAX_ROWS),
        supabase.from("challenge_matches").select("*").limit(MAX_ROWS),
        supabase.from("institutions").select("*"),
      ]);
      if (!active) return;
      const firstError = c.error ?? m.error ?? i.error;
      if (firstError) {
        setError(firstError.message);
      } else {
        setChallenges(c.data ?? []);
        setMatches(m.data ?? []);
        setInstitutions(i.data ?? []);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const kpis = useMemo(() => dashboardKpis(challenges, matches, institutions), [challenges, matches, institutions]);
  const domains = useMemo(() => domainCounts(challenges), [challenges]);
  const funnel = useMemo(() => statusFunnel(challenges), [challenges]);
  const participation = useMemo(() => institutionParticipation(matches, institutions), [matches, institutions]);
  const duplicates = useMemo(() => duplicateClusterSummary(challenges), [challenges]);

  const institutionsById = useMemo(() => Object.fromEntries(institutions.map((i) => [i.id, i])), [institutions]);
  const exampleMatch = useMemo(
    () => [...matches].sort((a, b) => b.match_score - a.match_score)[0],
    [matches],
  );
  const exampleChallenge = useMemo(
    () => (exampleMatch ? challenges.find((c) => c.id === exampleMatch.challenge_id) : undefined),
    [exampleMatch, challenges],
  );
  const latestChallenge = challenges[0]; // already ordered created_at desc

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label={t("dashboard.kpi.totalChallenges")} value={kpis.totalChallenges} />
        <StatTile
          label={t("dashboard.kpi.institutionsEngaged")}
          value={kpis.institutionsEngaged}
          sublabel={t("dashboard.kpi.ofTotal", { total: kpis.institutionsTotal })}
        />
        <StatTile
          label={t("dashboard.kpi.matchesClaimed")}
          value={kpis.matchesClaimed}
          sublabel={t("dashboard.kpi.ofTotal", { total: kpis.matchesTotal })}
        />
        <StatTile label={t("dashboard.kpi.duplicateClusters")} value={kpis.duplicateClusters} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.domain.heading")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: Math.max(160, domains.length * 40) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domains} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="domain"
                  width={140}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: string) =>
                    value === "uncategorised" ? t("dashboard.domain.uncategorised") : t(`challenge.domain.${value}`)
                  }
                />
                <Tooltip
                  formatter={(value: number) => [value, t("dashboard.domain.count")]}
                  labelFormatter={(value: string) =>
                    value === "uncategorised" ? t("dashboard.domain.uncategorised") : t(`challenge.domain.${value}`)
                  }
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.funnel.heading")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} margin={{ left: 0, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: string) => t(`challenge.status.${value}`)}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [value, t("dashboard.domain.count")]}
                  labelFormatter={(value: string) => t(`challenge.status.${value}`)}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {funnel.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLOR_VAR[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.participation.heading")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: Math.max(160, participation.length * 26) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participation} layout="vertical" stackOffset="none" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="claimedMatches"
                  stackId="matches"
                  fill="hsl(var(--accent))"
                  name={t("dashboard.participation.claimed")}
                />
                <Bar
                  dataKey="totalMatches"
                  stackId="matches"
                  fill="hsl(var(--secondary))"
                  name={t("dashboard.participation.matched")}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.duplicates.heading")}</CardTitle>
        </CardHeader>
        <CardContent>
          {duplicates.clusters.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("dashboard.duplicates.none")}</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.duplicates.summary", { count: duplicates.challengesFolded })}
              </p>
              <ul className="mt-3 space-y-2">
                {duplicates.clusters.map((c) => (
                  <li key={c.canonicalTitle} className="flex items-baseline justify-between gap-3 border-t border-border pt-2 first:border-t-0 first:pt-0">
                    <span className="text-sm">{c.canonicalTitle}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {t("dashboard.duplicates.reportCount", { count: c.memberCount })}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      {exampleMatch && exampleChallenge ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.example.heading")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("dashboard.example.intro")}</p>
          </CardHeader>
          <CardContent>
            <MatchExplainer
              domain={exampleChallenge.domain ?? "public_administration"}
              matchScore={exampleMatch.match_score}
              matchReason={exampleMatch.match_reason}
              institution={{
                name: institutionsById[exampleMatch.institution_id]?.name ?? exampleMatch.institution_id,
                department: institutionsById[exampleMatch.institution_id]?.department ?? null,
                institutionType: asInstitutionType(
                  institutionsById[exampleMatch.institution_id]?.institution_type ?? "university",
                ),
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      {latestChallenge ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.latest.heading")}</CardTitle>
            <p className="text-sm text-muted-foreground">{latestChallenge.title}</p>
          </CardHeader>
          <CardContent>
            {/* Exactly ChallengeCard's own reuse of PipelineStrata — same
                lifecycleStages()/lifecycleStateOf() helpers, not a re-derived
                copy of the stage order. */}
            <PipelineStrata compact stages={lifecycleStages(t)} stateOf={lifecycleStateOf(latestChallenge.status)} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
