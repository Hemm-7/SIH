import { STRATA_COLORS, STRATA_LAYER_THICKNESS, STRATA_STATES } from "@/lib/strataTokens";
import { cn } from "@/lib/utils";

/*
 * Reusable section-break, replacing plain <hr>/border rules between major
 * homepage sections. Renders Codex's five strata layers as stacked bands
 * with irregular (not straight, not a smooth gradient) boundary edges —
 * geological cross-section, per the dispatch. Colors and thickness ratios
 * are imported directly from strataTokens.ts, not redefined here.
 *
 * DATA-SHAPE FLAG: strataTokens.ts's STRATA_STATES are
 * ["submitted","reviewing","matched","in_progress","resolved"] — this does
 * NOT match the real public.challenge_status enum
 * ("submitted"|"ai_matched"|"claimed"|"in_progress"|"resolved") from
 * contracts.md, which is law per Global Rule #1. "reviewing" isn't a real
 * lifecycle stage, and Codex's "matched" sits at position 3 where the real
 * lifecycle's ai_matched is position 2. This component is purely decorative
 * (aria-hidden, a section divider, not a status indicator), so it uses
 * Codex's 5 colors/thicknesses POSITIONALLY as a palette/rhythm, not as a
 * claim about which real status each band represents. Flagged in
 * .agent/status/claude-code-status.md; do not reuse this mapping anywhere
 * that actually displays challenge status (PipelineStrata's own real-status
 * mapping is separate and unaffected).
 */

const VIEW_WIDTH = 1000;
const HEIGHT = 44;
const SEGMENTS = 28;

function boundaryYs(baseY: number, seed: number, amplitude: number): number[] {
  const ys: number[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const wobble = Math.sin(i * 1.3 + seed) * amplitude * 0.6 + Math.sin(i * 0.55 + seed * 2.3) * amplitude * 0.4;
    ys.push(baseY + wobble);
  }
  return ys;
}

function xs(): number[] {
  return Array.from({ length: SEGMENTS + 1 }, (_, i) => (VIEW_WIDTH / SEGMENTS) * i);
}

export function StrataDivider({ className }: { className?: string }) {
  const xCoords = xs();

  // One jagged boundary curve per gap between bands, plus the outer top and
  // bottom edges — 6 curves for 5 bands, each with its own seed so no two
  // boundaries wobble in lockstep.
  let cumulative = 0;
  const boundaries = [boundaryYs(0, 0, 3)];
  STRATA_LAYER_THICKNESS.forEach((thickness, i) => {
    cumulative += thickness * HEIGHT;
    boundaries.push(boundaryYs(cumulative, i + 1, 3));
  });

  const bandPoints = STRATA_STATES.map((state, i) => {
    const top = boundaries[i];
    const bottom = boundaries[i + 1];
    const forward = xCoords.map((x, j) => `${x},${top[j]}`);
    const backward = xCoords
      .map((x, j) => `${x},${bottom[j]}`)
      .reverse();
    return { state, color: STRATA_COLORS[state], points: [...forward, ...backward].join(" ") };
  });

  return (
    <div
      aria-hidden
      className={cn("relative left-1/2 w-screen -translate-x-1/2 overflow-hidden", className)}
    >
      <svg viewBox={`0 0 ${VIEW_WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="block h-11 w-full">
        {bandPoints.map((band) => (
          <polygon key={band.state} points={band.points} fill={band.color} />
        ))}
      </svg>
    </div>
  );
}
