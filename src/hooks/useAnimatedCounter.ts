import { useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export interface ChallengeMetrics {
  challengesRaised: number;
  institutionsMatched: number;
  markedResolved: number;
  confirmedResolutions: number;
  resolutionRate: number;
  confirmedResolutionRate: number;
}

export async function loadChallengeMetrics(): Promise<ChallengeMetrics> {
  const [
    { count: challengeCount, error: challengeError },
    { count: matchCount, error: matchError },
    { count: resolvedCount, error: resolvedError },
    { count: confirmedCount, error: confirmedError },
  ] =
    await Promise.all([
      supabase.from("challenges").select("id", { count: "exact", head: true }),
      supabase.from("challenge_matches").select("id", { count: "exact", head: true }),
      supabase.from("challenges").select("id", { count: "exact", head: true }).eq("status", "resolved"),
      supabase.from("challenges").select("id", { count: "exact", head: true }).not("resolved_confirmed_at", "is", null),
    ]);

  if (challengeError) throw new Error(`Failed to load challenge count: ${challengeError.message}`);
  if (matchError) throw new Error(`Failed to load institution match count: ${matchError.message}`);
  if (resolvedError) throw new Error(`Failed to load resolution count: ${resolvedError.message}`);
  if (confirmedError) throw new Error(`Failed to load confirmed resolution count: ${confirmedError.message}`);

  const total = challengeCount ?? 0;
  const markedResolved = resolvedCount ?? 0;
  const confirmedResolutions = confirmedCount ?? 0;
  return {
    challengesRaised: total,
    institutionsMatched: matchCount ?? 0,
    markedResolved,
    confirmedResolutions,
    resolutionRate: total === 0 ? 0 : (markedResolved / total) * 100,
    confirmedResolutionRate: total === 0 ? 0 : (confirmedResolutions / total) * 100,
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
    markedResolved: 0,
    confirmedResolutions: 0,
    resolutionRate: 0,
    confirmedResolutionRate: 0,
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
    markedResolved: useAnimatedCounter(metrics.markedResolved),
    confirmedResolutions: useAnimatedCounter(metrics.confirmedResolutions),
    resolutionRate: useAnimatedCounter(metrics.resolutionRate),
    confirmedResolutionRate: useAnimatedCounter(metrics.confirmedResolutionRate),
  };
}
