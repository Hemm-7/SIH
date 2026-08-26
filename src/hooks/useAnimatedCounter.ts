import { useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export interface ChallengeMetrics {
  challengesRaised: number;
  institutionsMatched: number;
  resolutionRate: number;
}

export async function loadChallengeMetrics(): Promise<ChallengeMetrics> {
  const [{ count: challengeCount, error: challengeError }, { count: matchCount, error: matchError }, { count: resolvedCount, error: resolvedError }] =
    await Promise.all([
      supabase.from("challenges").select("id", { count: "exact", head: true }),
      supabase.from("challenge_matches").select("id", { count: "exact", head: true }),
      supabase.from("challenges").select("id", { count: "exact", head: true }).eq("status", "resolved"),
    ]);

  if (challengeError) throw new Error(`Failed to load challenge count: ${challengeError.message}`);
  if (matchError) throw new Error(`Failed to load institution match count: ${matchError.message}`);
  if (resolvedError) throw new Error(`Failed to load resolution count: ${resolvedError.message}`);

  const total = challengeCount ?? 0;
  return {
    challengesRaised: total,
    institutionsMatched: matchCount ?? 0,
    resolutionRate: total === 0 ? 0 : ((resolvedCount ?? 0) / total) * 100,
  };
}

export function useAnimatedCounter(target: number, durationMs = 1200): number {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const valueRef = useRef(0);
  valueRef.current = value;

  useEffect(() => {
    const startValue = valueRef.current;
    startRef.current = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = startValue + (target - startValue) * eased;
      valueRef.current = nextValue;
      setValue(nextValue);
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [durationMs, target]);

  return value;
}

export function useLiveChallengeMetrics() {
  const [metrics, setMetrics] = useState<ChallengeMetrics>({
    challengesRaised: 0,
    institutionsMatched: 0,
    resolutionRate: 0,
  });

  useEffect(() => {
    let active = true;
    loadChallengeMetrics().then((next) => {
      if (active) setMetrics(next);
    }).catch(() => {
      // Keep zeroes for a public dashboard that is temporarily offline.
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    challengesRaised: useAnimatedCounter(metrics.challengesRaised),
    institutionsMatched: useAnimatedCounter(metrics.institutionsMatched),
    resolutionRate: useAnimatedCounter(metrics.resolutionRate),
  };
}
