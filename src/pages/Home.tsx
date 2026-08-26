import { ArrowRight, ScanSearch, SendHorizontal, Stamp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { StrataDivider } from "@/components/StrataDivider";
import { MatchExplainerDemo } from "@/components/challenges/MatchExplainerDemo";
import { AsciiBlock } from "@/components/home/AsciiBlock";
import { TICKER_DOMAIN_KEYS, Ticker } from "@/components/home/Ticker";
import { Button } from "@/components/ui/button";
import { useLiveChallengeMetrics } from "@/hooks/useAnimatedCounter";
import { cn } from "@/lib/utils";

const STEP_ICONS = [SendHorizontal, ScanSearch, Stamp] as const;

/** A thin rule between steps, roughly at icon-center height — the sequence
 * reads as one connected flow, not three unrelated tiles side by side. */
function StepConnector() {
  return <div aria-hidden className="mt-7 hidden h-px flex-1 self-start bg-border sm:block" />;
}

export default function Home() {
  const { t } = useTranslation();
  const steps = [1, 2, 3].map((n) => ({
    Icon: STEP_ICONS[n - 1],
    title: t(`home.steps.step${n}.title`),
    body: t(`home.steps.step${n}.body`),
  }));
  const domainLabels = TICKER_DOMAIN_KEYS.map((key) => t(`challenge.domain.${key}`));
  const metrics = useLiveChallengeMetrics();

  return (
    <div className="pb-8">
      {/* Hero — Task 4: breaking the centered-stack default. Headline is
          left-weighted and off-center rather than mx-auto/text-center; the
          right column bleeds to the viewport edge with real (not decorative)
          content — live counts from the actual database, not a stat a
          citizen can't verify. */}
      <section className="relative overflow-hidden pt-4 sm:pt-10">
        <div className="grid gap-10 sm:grid-cols-12 sm:items-end sm:gap-6">
          <div className="sm:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("home.eyebrow")}</p>
            <h1 className="mt-4 text-left font-display text-[14vw] font-black leading-[0.92] tracking-tight sm:text-[6vw]">
              {t("home.heading")}
            </h1>
            <p className="mt-6 max-w-lg text-left text-lg text-foreground/70">{t("home.body")}</p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link to="/submit">{t("home.cta")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/challenges">{t("home.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>

          {/* Bleeds past the container edge on desktop — content spilling
              toward one side, not centered inside its own column. */}
          <div className="sm:col-span-5">
            <div className="flex flex-col gap-4 border-2 border-border bg-card p-6 sm:relative sm:-right-6 sm:w-[calc(100%+1.5rem)]">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {t("home.stats.eyebrow")}
              </p>
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {t("home.stats.raised")}
                  </dt>
                  <dd className="font-display text-4xl font-black text-foreground">
                    {Math.round(metrics.challengesRaised)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {t("home.stats.matched")}
                  </dt>
                  <dd className="font-display text-4xl font-black text-accent">
                    {Math.round(metrics.institutionsMatched)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {t("home.stats.resolved")}
                  </dt>
                  <dd className="font-display text-4xl font-black text-foreground">
                    {metrics.resolutionRate.toFixed(0)}%
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <div className="my-16 sm:my-20">
        <StrataDivider className="-rotate-1" />
      </div>

      {/* Marquee — placeholder content (real subject domains), swapped for
          Codex's live feed once that lands. */}
      <Ticker labels={domainLabels} />

      <div className="my-16 sm:my-20">
        <StrataDivider className="rotate-1" />
      </div>

      {/* How it works — step 2 (classify + match) is the actual differentiator,
          so it carries real visual weight; steps 1 and 3 are its smaller,
          quieter satellites, joined by a connecting rule rather than presented
          as three equal, isolated cards. */}
      <section>
        <h2 className="text-center font-display text-3xl font-black tracking-tight sm:text-4xl">
          {t("home.steps.heading")}
        </h2>
        <ol className="mx-auto mt-12 flex max-w-4xl flex-col gap-8 px-6 sm:flex-row sm:items-start sm:gap-0">
          {steps.map(({ Icon, title, body }, i) => {
            const isCenter = i === 1;
            return (
              <li key={title} className="flex gap-2 sm:contents">
                {i > 0 ? <StepConnector /> : null}
                <div
                  className={cn(
                    "flex gap-4 sm:flex-1 sm:flex-col sm:items-center sm:text-center",
                    isCenter && "sm:flex-[1.35]",
                  )}
                >
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center border-2",
                      isCenter
                        ? "h-14 w-14 border-accent bg-accent text-accent-foreground"
                        : "h-10 w-10 border-border bg-secondary text-secondary-foreground",
                    )}
                  >
                    <Icon aria-hidden className={isCenter ? "h-6 w-6" : "h-5 w-5"} />
                  </span>
                  <div className={cn(isCenter && "sm:mt-1 sm:border-2 sm:border-accent/40 sm:px-5 sm:py-4")}>
                    <p className="font-mono text-xs text-muted-foreground">0{i + 1}</p>
                    <h3
                      className={cn(
                        "font-mono font-bold uppercase tracking-wide",
                        isCenter ? "mt-0.5 text-lg" : "mt-1 text-sm",
                      )}
                    >
                      {title}
                    </h3>
                    <p className={cn("mt-1.5 text-sm text-foreground/70", !isCenter && "sm:max-w-[16rem]")}>{body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="my-16 sm:my-20">
        <StrataDivider className="-rotate-1" />
      </div>

      {/* The signature moment — explainable matching, dramatized. */}
      <section className="mx-auto max-w-3xl px-6 pb-8">
        <div className="flex items-center justify-center gap-4">
          <AsciiBlock className="hidden text-[9px] sm:block" />
          <div>
            <p className="text-center font-mono text-xs uppercase tracking-widest text-accent">
              {t("home.demo.eyebrow")}
            </p>
            <h2 className="mt-3 text-center font-display text-3xl font-black tracking-tight sm:text-4xl">
              {t("home.demo.heading")}
            </h2>
          </div>
          <AsciiBlock className="hidden text-[9px] sm:block" />
        </div>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-foreground/70">{t("home.demo.intro")}</p>

        <div className="mt-8">
          <MatchExplainerDemo />
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/challenges"
            className="inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-wide text-accent hover:underline"
          >
            {t("home.demo.cta")}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
