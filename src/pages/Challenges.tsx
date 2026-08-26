import { List, Map as MapIcon, LayoutGrid } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { ChallengeFeed } from "@/components/challenges/ChallengeFeed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Leaflet + react-leaflet add ~165 kB to the bundle. Loading them eagerly would
// contradict the exact design decision below (don't spend a citizen's data on
// a map they never asked for) — a visitor who only ever uses the list view
// should never fetch this code at all, not just skip the tile requests.
const ChallengeMap = lazy(() =>
  import("@/components/challenges/ChallengeMap").then((m) => ({ default: m.ChallengeMap })),
);
// Separate lazy chunk, same reasoning: a visitor who never opens the cluster
// view shouldn't pay for Codex's getChallengeClusters() query or a second
// Leaflet mount either.
const ClusterMap = lazy(() =>
  import("@/components/challenges/ClusterMap").then((m) => ({ default: m.ClusterMap })),
);

type View = "list" | "map" | "clusters";

/*
 * design-brief.md pass for Task 4:
 *
 * CONSIDERED: a permanent desktop side-by-side (feed | map), toggling to a
 * single view only on mobile. REJECTED — doing that correctly means NOT
 * mounting the map component on narrow screens, and a CSS-only
 * hidden/lg:block split still mounts ChallengeMap underneath; Leaflet would
 * fetch tiles regardless of whether the panel is visually shown. Getting the
 * bandwidth-conscious behaviour right there needs a JS viewport check, real
 * complexity for a debatable payoff.
 *
 * CHOSEN: one explicit List/Map toggle at every breakpoint. Only the
 * selected view is ever mounted, so map tiles load only when a visitor
 * actually asks for the map — consistent with design-brief.md's citizen
 * audience being on phones, and simpler than the alternative. List is the
 * default; institution/government reviewers who want the "provable at a
 * glance" map view are one tap away from it, same as anyone else.
 */
export default function Challenges() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("list");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t("nav.challenges")}
        </h1>

        <div className="inline-flex rounded-none border border-border p-0.5" role="tablist" aria-label={t("challenge.viewToggle")}>
          <Button
            type="button"
            role="tab"
            aria-selected={view === "list"}
            variant="ghost"
            size="sm"
            className={cn(view === "list" && "bg-secondary text-secondary-foreground")}
            onClick={() => setView("list")}
          >
            <List /> {t("challenge.viewList")}
          </Button>
          <Button
            type="button"
            role="tab"
            aria-selected={view === "map"}
            variant="ghost"
            size="sm"
            className={cn(view === "map" && "bg-secondary text-secondary-foreground")}
            onClick={() => setView("map")}
          >
            <MapIcon /> {t("challenge.viewMap")}
          </Button>
          <Button
            type="button"
            role="tab"
            aria-selected={view === "clusters"}
            variant="ghost"
            size="sm"
            className={cn(view === "clusters" && "bg-secondary text-secondary-foreground")}
            onClick={() => setView("clusters")}
          >
            <LayoutGrid /> {t("challenge.viewClusters")}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {view === "list" ? (
          <ChallengeFeed />
        ) : (
          <Suspense fallback={<Skeleton className="h-[420px] w-full rounded-none" />}>
            {view === "map" ? <ChallengeMap /> : <ClusterMap />}
          </Suspense>
        )}
      </div>
    </div>
  );
}
