import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { getChallengeClusters, type ChallengeCluster } from "@/lib/challengeClusters";
import { domainColor } from "@/lib/domainColors";
import { Skeleton } from "@/components/ui/skeleton";

const JHARKHAND_CENTER: [number, number] = [23.6102, 85.2799];
const MIN_ICON_PX = 22;
const MAX_ICON_PX = 56;

/** Report count -> marker diameter, capped so one large cluster can't dwarf the tile layer. */
function iconSizeFor(count: number): number {
  return Math.min(MAX_ICON_PX, MIN_ICON_PX + Math.sqrt(count) * 10);
}

function clusterIcon(cluster: ChallengeCluster) {
  const size = iconSizeFor(cluster.challengeCount);
  const color = domainColor(cluster.category);
  return L.divIcon({
    className: "",
    html: `<span class="flex items-center justify-center rounded-full border-2 border-background font-mono font-semibold text-background shadow" style="width:${size}px;height:${size}px;background-color:${color};font-size:${Math.max(10, size * 0.32)}px">${cluster.challengeCount}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function FitToMarkers({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 11);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [32, 32], maxZoom: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-fit only when the point SET changes.
  }, [JSON.stringify(points)]);
  return null;
}

/*
 * A second, deliberately different map view from ChallengeMap.tsx: that one
 * plots individual (duplicate-clustered) reports; this one plots Codex's
 * getChallengeClusters() output — active reports grouped by subject + 500m
 * proximity, sized and coloured by how many reports fall in the same
 * category and place. Built for the "provable at a glance" institution/
 * government audience in design-brief.md: where problems are concentrated,
 * by subject, without reading every individual card.
 */
export function ClusterMap() {
  const { t } = useTranslation();
  const [clusters, setClusters] = useState<ChallengeCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getChallengeClusters()
      .then((result) => {
        if (active) setClusters(result);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const points = useMemo<[number, number][]>(
    () => clusters.map((c) => [c.centroid.lat, c.centroid.lng]),
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
        {clusters.map((cluster, index) => (
          <Marker
            key={`${cluster.category}-${cluster.centroid.lat}-${cluster.centroid.lng}-${index}`}
            position={[cluster.centroid.lat, cluster.centroid.lng]}
            icon={clusterIcon(cluster)}
          >
            <Popup>
              <p className="text-sm font-medium">
                {t("map.cluster.summary", {
                  count: cluster.challengeCount,
                  category: t(`challenge.domain.${cluster.category}`),
                })}
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
