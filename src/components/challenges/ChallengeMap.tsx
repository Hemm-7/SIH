import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { clusterChallenges, type ChallengeCluster } from "@/components/challenges/clusterChallenges";
import { MatchExplainer } from "@/components/challenges/MatchExplainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useChallengeMatches } from "@/hooks/useChallengeMatches";
import { asInstitutionType } from "@/lib/db-narrow";
import { strataColorForStatus } from "@/lib/strataStatusMap";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];

const JHARKHAND_CENTER: [number, number] = [23.6102, 85.2799];
const MAX_MAP_ROWS = 500;

function clusterIcon(cluster: ChallengeCluster) {
  // Marker colour now comes from Codex's strataTokens.ts via strataStatusMap,
  // applied as an inline background-color. This also removes the previous
  // Tailwind-scanner hazard: because this HTML is handed to Leaflet as a raw
  // string outside JSX, a class name had to be written out literally or no
  // CSS would be emitted for it. A real hex value has no such constraint.
  const dotColor = strataColorForStatus(cluster.canonical.status);
  const count = cluster.members.length;
  const badge =
    count > 1
      ? `<span class="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-background bg-foreground px-1 font-mono text-[10px] font-medium leading-none text-background">${count}</span>`
      : "";

  return L.divIcon({
    className: "", // suppress Leaflet's default marker box/shadow classes
    html: `<span class="relative flex h-5 w-5 items-center justify-center"><span class="h-4 w-4 rounded-full border-2 border-background shadow" style="background-color:${dotColor}"></span>${badge}</span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
}

/** Frames the map to whatever points are actually loaded, instead of a fixed zoom. */
function FitToMarkers({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [32, 32], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-fit only when the point SET changes, not on every map interaction.
  }, [JSON.stringify(points)]);
  return null;
}

function ClusterPopupContent({ cluster }: { cluster: ChallengeCluster }) {
  const { t, i18n } = useTranslation();
  const { canonical, members } = cluster;
  const { matchesByChallenge, institutionsById } = useChallengeMatches([canonical.id]);
  const matches = matchesByChallenge[canonical.id] ?? [];
  const [topMatch, ...restMatches] = matches;

  return (
    <div className="max-w-xs space-y-3">
      <div>
        <p className="font-display font-semibold leading-snug">{canonical.title}</p>
        <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{canonical.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {canonical.domain ? (
          <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
            {t(`challenge.domain.${canonical.domain}`)}
          </span>
        ) : null}
        <span>{t(`challenge.status.${canonical.status}`)}</span>
      </div>

      {/* MANDATORY SAFETY NET (per coordinator instruction, independent of how
          clean detect-duplicates is): a cluster never presents only a merged
          count. Every individually linked report is visible on request, so a
          wrong auto-link is something a citizen or institution can catch by
          looking, not something that silently hides a report. */}
      {members.length > 1 ? (
        <details className="rounded-none border border-border p-2">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
            {t("map.linkedReports", { count: members.length })}
          </summary>
          <ul className="mt-2 space-y-2">
            {members.map((m) => (
              <li key={m.id} className="border-t border-border pt-2 first:border-t-0 first:pt-0">
                <p className="text-sm font-medium">{m.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{m.description}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  {new Date(m.created_at).toLocaleDateString(i18n.language)}
                  {m.id === canonical.id ? ` · ${t("map.canonicalReport")}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {topMatch ? (
        <div className="space-y-2">
          <MatchExplainer
            compact={false}
            domain={canonical.domain ?? "public_administration"}
            matchScore={topMatch.match_score}
            matchReason={topMatch.match_reason}
            institution={{
              name: institutionsById[topMatch.institution_id]?.name ?? topMatch.institution_id,
              department: institutionsById[topMatch.institution_id]?.department ?? null,
              institutionType: asInstitutionType(
                institutionsById[topMatch.institution_id]?.institution_type ?? "university",
              ),
            }}
          />
          {restMatches.length > 0 ? (
            <details className="rounded-none border border-border p-2">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                {t("match.showMore", { count: restMatches.length })}
              </summary>
              <ul className="mt-2 space-y-1.5">
                {restMatches.map((m) => (
                  <li key={m.id}>
                    <MatchExplainer
                      compact
                      domain={canonical.domain ?? "public_administration"}
                      matchScore={m.match_score}
                      matchReason={m.match_reason}
                      institution={{
                        name: institutionsById[m.institution_id]?.name ?? m.institution_id,
                        department: institutionsById[m.institution_id]?.department ?? null,
                        institutionType: asInstitutionType(
                          institutionsById[m.institution_id]?.institution_type ?? "university",
                        ),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      ) : canonical.domain ? (
        <p className="text-xs text-muted-foreground">{t("empty.matches")}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{t("challenge.awaitingCategorisation")}</p>
      )}
    </div>
  );
}

/*
 * design-brief.md pass: Leaflet tiles are real external requests, and this
 * audience is "citizens submitting from phones" — loading the map by default
 * for every visitor spends data most of them didn't ask to spend. Challenges.tsx
 * gates this behind an explicit List/Map choice rather than always mounting it;
 * this component assumes it is only rendered once that choice is made.
 *
 * Clustering is the REAL detect-duplicates output (challenges.duplicate_of),
 * not a seeded example — see clusterChallenges.ts and the Task 4 status entry
 * for how that was verified against live data. Marker colour reuses the same
 * status.* tokens as PipelineStrata, so the map and the feed read as one
 * system rather than two different colour languages for the same lifecycle.
 */
export function ChallengeMap() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: err } = await supabase
        .from("challenges")
        .select("*")
        .not("lat", "is", null)
        .not("lon", "is", null)
        .order("created_at", { ascending: false })
        .limit(MAX_MAP_ROWS);
      if (!active) return;
      if (err) setError(err.message);
      else setChallenges(data ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const clusters = useMemo(() => clusterChallenges(challenges), [challenges]);
  const points = useMemo<[number, number][]>(
    () => clusters.map((c) => [Number(c.canonical.lat), Number(c.canonical.lon)]),
    [clusters],
  );

  if (loading) {
    return <Skeleton className="h-[420px] w-full rounded-none" />;
  }

  if (error) {
    return (
      <div className="rounded-none border border-destructive bg-destructive/10 p-6 text-center text-sm" role="alert">
        {error}
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">{t("map.noLocatedChallenges")}</p>
      </div>
    );
  }

  return (
    <div className="h-[420px] overflow-hidden rounded-none border border-border sm:h-[520px]">
      <MapContainer center={JHARKHAND_CENTER} zoom={7} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToMarkers points={points} />
        {clusters.map((cluster) => (
          <Marker
            key={cluster.canonical.id}
            position={[Number(cluster.canonical.lat), Number(cluster.canonical.lon)]}
            icon={clusterIcon(cluster)}
          >
            <Popup maxWidth={340}>
              <ClusterPopupContent cluster={cluster} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
