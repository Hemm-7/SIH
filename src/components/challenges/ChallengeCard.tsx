import { MapPin, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { lifecycleStages, lifecycleStateOf } from "@/components/challenges/challengeLifecycle";
import { MatchExplainer } from "@/components/challenges/MatchExplainer";
import { PipelineStrata } from "@/components/challenges/PipelineStrata";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { asInstitutionType, asStringArray } from "@/lib/db-narrow";
import type { Database } from "@/integrations/supabase/types";

type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
type ChallengeMatch = Database["public"]["Tables"]["challenge_matches"]["Row"];
type InstitutionSummary = { name: string; department: string | null; institution_type: string };

function relativeTime(iso: string, locale: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffH = Math.round(diffMs / 3_600_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (Math.abs(diffH) < 24) return rtf.format(-diffH, "hour");
  return rtf.format(-Math.round(diffH / 24), "day");
}

export function ChallengeCard({
  challenge,
  matches,
  institutionsById,
}: {
  challenge: Challenge;
  /** Pre-sorted by match_score descending — the feed does this once per page, not per card. */
  matches: ChallengeMatch[];
  institutionsById: Record<string, InstitutionSummary>;
}) {
  const { t, i18n } = useTranslation();
  const photos = asStringArray(challenge.photo_urls);
  const [topMatch, ...restMatches] = matches;

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <h3 className="font-display text-xl font-semibold leading-snug">{challenge.title}</h3>
          <time
            dateTime={challenge.created_at}
            className="shrink-0 text-sm text-muted-foreground"
            title={new Date(challenge.created_at).toLocaleString(i18n.language)}
          >
            {relativeTime(challenge.created_at, i18n.language)}
          </time>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {challenge.domain ? (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {t(`challenge.domain.${challenge.domain}`)}
            </span>
          ) : (
            <span className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs">
              {t("challenge.categorising")}
            </span>
          )}
          {challenge.location_text ? (
            <span className="flex items-center gap-1">
              <MapPin aria-hidden className="h-3.5 w-3.5" />
              {challenge.location_text}
            </span>
          ) : null}
          {challenge.report_count > 1 ? (
            <span className="flex items-center gap-1">
              <Users aria-hidden className="h-3.5 w-3.5" />
              {t("challenge.reportCount", { count: challenge.report_count })}
            </span>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-foreground/90">{challenge.description}</p>

        {photos.length > 0 ? (
          <img
            src={photos[0]}
            alt=""
            loading="lazy"
            className="max-h-72 w-full rounded-none border border-border object-cover"
          />
        ) : null}

        <PipelineStrata
          compact
          stages={lifecycleStages(t)}
          stateOf={lifecycleStateOf(challenge.status)}
        />

        {/* Explainable matching — the project's signature element, never reduced
            to a caption even when space is tight. */}
        {topMatch ? (
          <div className="space-y-3">
            <MatchExplainer
              domain={challenge.domain ?? "public_administration"}
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
              <details className="rounded-none border border-border p-3">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                  {t("match.showMore", { count: restMatches.length })}
                </summary>
                <ul className="mt-3 space-y-2">
                  {restMatches.map((m) => (
                    <li key={m.id}>
                      <MatchExplainer
                        compact
                        domain={challenge.domain ?? "public_administration"}
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
        ) : challenge.domain ? (
          <p className="text-sm text-muted-foreground">{t("empty.matches")}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{t("challenge.awaitingCategorisation")}</p>
        )}
      </CardContent>
    </Card>
  );
}
