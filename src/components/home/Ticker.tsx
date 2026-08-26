/*
 * Infinite linear marquee — placeholder content only. Codex is building a
 * live-data feed for this in parallel (see .agent/inbox); swap the static
 * ITEMS list for real data once that lands, same component shell.
 *
 * Content is honest in the meantime: the real, fixed set of subject domains
 * the classifier actually routes to (challenge_domain enum) — not a
 * fabricated activity count or invented stat.
 */
export const TICKER_DOMAIN_KEYS = [
  "education",
  "agriculture",
  "healthcare",
  "water_resources",
  "environment",
  "energy",
  "urban_development",
  "accessibility",
  "public_administration",
  "rural_livelihoods",
] as const;

export function Ticker({ labels }: { labels: string[] }) {
  // Doubled for a seamless loop — animate-marquee translates exactly -50%.
  const track = [...labels, ...labels];

  return (
    // Full-bleed: AppLayout wraps pages in a max-width container, and a
    // marquee that stops short of the viewport edges reads as a boxed widget
    // rather than an edge-to-edge ticker.
    <div
      aria-hidden
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y-2 border-border bg-black py-3"
    >
      <div className="flex w-max animate-marquee items-center">
        {track.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="flex shrink-0 items-center gap-4 whitespace-nowrap px-4 font-mono text-xs uppercase tracking-widest text-muted-foreground"
          >
            {label}
            <span className="text-accent">*</span>
          </span>
        ))}
      </div>
    </div>
  );
}
