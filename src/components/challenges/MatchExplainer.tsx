import { Sparkles, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { confidenceTier, isHonestFallback, type ConfidenceTier } from "@/lib/matchConfidence";
import { cn } from "@/lib/utils";
import type { InstitutionType } from "@/lib/db-narrow";
import type { Database } from "@/integrations/supabase/types";

type ChallengeDomain = Database["public"]["Enums"]["challenge_domain"];

/*
 * design-brief.md's signature element: "the explainable-match connection between a
 * citizen's challenge and its matched institution should be the one memorable
 * visual moment — not a caption, an actual visualized connection ... annotated
 * with the real matched expertise terms and confidence."
 *
 * Design pass (Global Rule #13):
 *
 * REJECTED: a caption under the institution's name ("matched because: ..."). That
 * is precisely the caption the brief says not to build.
 *
 * REJECTED: a literal animated SVG thread/particle connector. Striking once, but
 * expensive to keep legible across two languages of variable text length, breaks
 * under reduced-motion, and is genuinely hard to make read correctly at feed-card
 * density on a phone — the audience this page is actually for.
 *
 * CHOSEN: two labelled nodes (the problem's domain / the institution) joined by a
 * visible connecting line with a confidence-tier badge sitting on it, and the
 * REAL matched expertise terms rendered as pills directly under the connector —
 * literally what matched, not prose describing that something matched. On mobile
 * the connector rotates to vertical rather than disappearing, so the "bridge"
 * reading survives at the width citizens actually use.
 *
 * The connector's weight (solid/thin, opaque/faded) is driven by the discrete
 * TIER, never the raw score — contracts.md forbids the float leaking out even as
 * a percentage, and a continuous-width bar keyed to score would leak the same
 * information a different way.
 */

const TIER_LINE: Record<ConfidenceTier, string> = {
  strong: "bg-accent",
  likely: "bg-accent/50",
  possible: "bg-border",
};

const TIER_BADGE: Record<ConfidenceTier, string> = {
  strong: "bg-accent text-accent-foreground",
  likely: "border border-accent/60 text-accent-foreground/90 bg-accent/10",
  possible: "border border-border text-muted-foreground",
};

function splitReason(domain: ChallengeDomain, reason: string): string[] {
  // match-institutions joins as "<domain>, <term>, <term>" — drop the leading
  // domain segment since the domain node already shows it, keep the terms that
  // are the actual "why", so they can be rendered as their own pills.
  const domainPhrase = domain.replace(/_/g, " ");
  return reason
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.toLowerCase() !== domainPhrase);
}

interface MatchExplainerProps {
  domain: ChallengeDomain;
  institution: { name: string; department: string | null; institutionType: InstitutionType };
  matchScore: number;
  matchReason: string;
  /** Row form for a card's secondary matches — no bridge, same information. */
  compact?: boolean;
}

export function MatchExplainer({ domain, institution, matchScore, matchReason, compact = false }: MatchExplainerProps) {
  const { t } = useTranslation();
  const tier = confidenceTier(matchScore);
  const honest = isHonestFallback(matchReason);
  const terms = honest ? [] : splitReason(domain, matchReason);

  const tierLabel = t(`match.tier.${tier}`);
  const domainLabel = t(`challenge.domain.${domain}`);
  const institutionTypeLabel = t(`institution.type.${institution.institutionType}`);

  if (compact) {
    return (
      <div className={cn("flex items-start gap-2 text-sm", tier === "possible" && "opacity-70")}>
        <span
          aria-hidden
          className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", tier === "possible" ? "bg-border" : "bg-accent")}
        />
        <span>
          <span className="font-medium">{institution.name}</span>{" "}
          <span className="text-muted-foreground">
            ({tierLabel}) —{" "}
            {honest ? (
              <span className="italic">{t("match.honestFallback")}</span>
            ) : (
              terms.join(", ")
            )}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-none border border-border p-4 sm:p-5",
        // contracts.md: de-emphasize Possible tier rather than presenting it with
        // equal weight to the top result.
        tier === "possible" && "opacity-70",
      )}
    >
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {/* Node 1 — the problem, by domain. */}
        <div className="flex-1 rounded-none border border-dashed border-border px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("match.theProblem")}</p>
          <p className="font-display font-semibold">{domainLabel}</p>
        </div>

        {/* The bridge — horizontal on desktop, vertical on mobile, either way it
            does not disappear at narrow widths. */}
        <div className="flex flex-row items-center justify-center gap-2 sm:flex-col sm:justify-self-center">
          <span aria-hidden className={cn("h-px w-6 sm:hidden", TIER_LINE[tier])} />
          <span aria-hidden className={cn("hidden w-px flex-1 sm:block", TIER_LINE[tier])} style={{ minHeight: 12 }} />
          <span
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide",
              TIER_BADGE[tier],
            )}
          >
            {tierLabel}
          </span>
          <span aria-hidden className={cn("h-px w-6 sm:hidden", TIER_LINE[tier])} />
          <span aria-hidden className={cn("hidden w-px flex-1 sm:block", TIER_LINE[tier])} style={{ minHeight: 12 }} />
        </div>

        {/* Node 2 — the institution. */}
        <div className="flex-1 rounded-none border border-border px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{institutionTypeLabel}</p>
          <p className="font-display font-semibold">{institution.name}</p>
          {institution.department ? (
            <p className="text-sm text-muted-foreground">{institution.department}</p>
          ) : null}
        </div>
      </div>

      {/* The annotation — the real matched terms as pills, or the honest
          admission that none were found. Never a fabricated-sounding sentence. */}
      <div className="mt-4 flex items-start gap-2">
        {honest ? (
          <>
            <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm italic text-muted-foreground">{t("match.honestFallback")}</p>
          </>
        ) : (
          <>
            <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">{t("match.why")}</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {terms.map((term) => (
                  <li
                    key={term}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
