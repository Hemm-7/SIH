import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChallengeMatches } from "@/hooks/useChallengeMatches";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

const PAGE_SIZE = 12;

/*
 * design-brief.md: same layout shape as the base repo's Community.tsx — a public,
 * single-column feed, newest first, skeleton placeholders while loading, a
 * dashed-border empty state, and a "load more" button rather than infinite
 * scroll (infinite scroll fights screen readers and is easy to lose your place
 * in on a slow connection, which this audience is more likely to be on).
 *
 * Reads only through the "Anyone can view challenges" / "...institutions" /
 * "...challenge matches" SELECT policies — no auth required, matching the
 * public-transparency intent in that migration's own comments.
 */
export function ChallengeFeed() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { matchesByChallenge, institutionsById } = useChallengeMatches(challenges.map((c) => c.id));

  const loadPage = useCallback(async (offset: number) => {
    const { data: rows, error: chErr } = await supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (chErr) throw new Error(chErr.message);
    const page = rows ?? [];
    setHasMore(page.length === PAGE_SIZE);
    setChallenges((prev) => (offset === 0 ? page : [...prev, ...page]));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadPage(0)
      .catch((e) => active && setError(e instanceof Error ? e.message : t("error.generic")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [loadPage, t]);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      await loadPage(challenges.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("error.generic"));
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label={t("common.loading")}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <p role="alert">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">{t("empty.challenges")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          matches={matchesByChallenge[challenge.id] ?? []}
          institutionsById={institutionsById}
        />
      ))}

      {hasMore ? (
        <div className="text-center">
          <Button variant="outline" onClick={() => void handleLoadMore()} disabled={loadingMore}>
            {loadingMore ? t("common.loading") : t("challenge.loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
