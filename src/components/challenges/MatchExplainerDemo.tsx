import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

/*
 * Homepage-only dramatization of MatchExplainer's real bridge layout (same
 * two-node-plus-connector shape, same tier badge, same "real terms as pills"
 * rule — this is a costume on identical structure, not a different
 * component). Debate-room review named this the single highest-value
 * "impress the judges" moment in the product: watching a citizen's problem
 * visibly resolve into a matched institution, once, on scroll into view.
 *
 * Razorpay-AI-Builders reskin: sharp corners (no pill badges), rigid mono
 * for every label/identifier, electric-blue connector/badge instead of
 * verdigris — reskinned surface only, the reveal sequencing and underlying
 * MatchExplainer structure are untouched.
 *
 * Canned data, clearly framed as illustrative by the section copy around it
 * (never presented as live) — the real, unscripted version of this exact
 * bridge sits one page away on /challenges for every actual match.
 */

const DEMO_TERMS = ["irrigation systems", "watershed management", "canal desilting"];

function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

/** Fade + rise, staggered by an explicit delay so the sequence reads as cause and effect. */
function reveal(inView: boolean, delayMs: number) {
  return {
    className: cn(
      "transition-all duration-700 ease-out",
      inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
    ),
    style: { transitionDelay: inView ? `${delayMs}ms` : "0ms" },
  };
}

export function MatchExplainerDemo() {
  const { t } = useTranslation();
  const { ref, inView } = useRevealOnce<HTMLDivElement>();
  const node1 = reveal(inView, 0);
  const node2 = reveal(inView, 1150);
  const annotation = reveal(inView, 1500);

  return (
    <div ref={ref} className="border-2 border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {/* Node 1 — the problem, exactly as a citizen would have described it. */}
        <div style={node1.style} className={cn("flex-1 border-2 border-border px-4 py-3", node1.className)}>
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t("match.theProblem")}</p>
          <p className="mt-1 font-mono text-lg font-bold uppercase tracking-wide">
            {t("challenge.domain.water_resources")}
          </p>
          <p className="mt-1 text-sm text-foreground/70">{t("home.demo.problem")}</p>
        </div>

        {/* The bridge — draws in once the problem node has landed. */}
        <div className="flex flex-row items-center justify-center gap-2 sm:flex-col">
          <span
            aria-hidden
            className={cn(
              "h-px w-8 origin-left bg-accent transition-transform duration-700 ease-out sm:hidden",
              inView ? "scale-x-100" : "scale-x-0",
            )}
            style={{ transitionDelay: inView ? "500ms" : "0ms" }}
          />
          <span
            aria-hidden
            className={cn(
              "hidden w-px flex-1 origin-top bg-accent transition-transform duration-700 ease-out sm:block",
              inView ? "scale-y-100" : "scale-y-0",
            )}
            style={{ minHeight: 28, transitionDelay: inView ? "500ms" : "0ms" }}
          />
          <span
            className={cn(
              "shrink-0 whitespace-nowrap border-2 border-accent bg-accent px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-accent-foreground transition-all duration-500 ease-out",
              inView ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
            style={{ transitionDelay: inView ? "950ms" : "0ms" }}
          >
            {t("match.tier.strong")}
          </span>
          <span
            aria-hidden
            className={cn(
              "h-px w-8 origin-left bg-accent transition-transform duration-700 ease-out sm:hidden",
              inView ? "scale-x-100" : "scale-x-0",
            )}
            style={{ transitionDelay: inView ? "500ms" : "0ms" }}
          />
          <span
            aria-hidden
            className={cn(
              "hidden w-px flex-1 origin-top bg-accent transition-transform duration-700 ease-out sm:block",
              inView ? "scale-y-100" : "scale-y-0",
            )}
            style={{ minHeight: 28, transitionDelay: inView ? "500ms" : "0ms" }}
          />
        </div>

        {/* Node 2 — the matched institution, arriving after the badge. Border
            in the accent color: this is the destination the bridge resolves to. */}
        <div style={node2.style} className={cn("flex-1 border-2 border-accent px-4 py-3", node2.className)}>
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {t("institution.type.university")}
          </p>
          <p className="mt-1 font-mono text-lg font-bold uppercase tracking-wide">{t("home.demo.institution")}</p>
          <p className="text-sm text-foreground/70">{t("home.demo.department")}</p>
        </div>
      </div>

      {/* The annotation — the same real-terms-as-pills rule as every live match. */}
      <div style={annotation.style} className={cn("mt-5 flex items-start gap-2", annotation.className)}>
        <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{t("match.why")}</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {DEMO_TERMS.map((term) => (
              <li
                key={term}
                className="border border-secondary bg-secondary px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide text-secondary-foreground"
              >
                {term}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
