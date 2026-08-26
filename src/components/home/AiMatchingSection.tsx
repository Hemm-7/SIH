import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Droplets,
  Sprout,
  Zap,
  Users,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomepageStats, useMatchShowcase, type MatchTier } from "@/hooks/useHomepageData";

const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

/*
 * PHASE 1 (fabricated-content remediation): this section was a scripted demo.
 * Three invented problems were paired with invented collaborators — BIT
 * Mesra, IIT (ISM) Dhanbad, BAU Ranchi, NIT Jamshedpur, "Coal India & Tata
 * Steel CSR Division" — each carrying an invented percentage score (98/94/
 * 89/84 …) and an invented "95% Match Fit". None of those institutions are on
 * this platform and none of those matches existed.
 *
 * It now runs on real `challenge_matches` rows: real citizen problem text,
 * the real institutions the classifier actually matched, and the real reason
 * strings it wrote. This is the project's signature "explainable matching"
 * claim, so demonstrating it with real data rather than a script is the whole
 * point.
 *
 * Scores are shown as qualitative tiers, never as raw percentages —
 * contracts.md is explicit about this: zero-shot splits probability mass
 * across all candidate labels, so a correct top match commonly lands near
 * 0.30-0.40 and rendering that as "34%" misrepresents the model as unsure.
 */

const DOMAIN_ICON: Record<string, typeof Droplets> = {
  water_resources: Droplets,
  agriculture: Sprout,
  rural_livelihoods: Sprout,
  environment: Sprout,
  energy: Zap,
  urban_development: Zap,
  education: Users,
  healthcare: Users,
  accessibility: Users,
  public_administration: Users,
};

const DOMAIN_LABEL: Record<string, string> = {
  education: "Education",
  agriculture: "Agriculture",
  healthcare: "Healthcare",
  water_resources: "Water Resources",
  environment: "Environment",
  energy: "Energy",
  urban_development: "Urban Development",
  accessibility: "Accessibility",
  public_administration: "Public Administration",
  rural_livelihoods: "Rural Livelihoods",
};

const TIER_LABEL: Record<MatchTier, string> = {
  strong: "Strong match",
  likely: "Likely match",
  possible: "Possible match",
};

/** Short, human label for a scenario button, derived from the real row. */
function shortLabel(title: string): string {
  const clean = title.trim();
  return clean.length > 34 ? `${clean.slice(0, 34).trimEnd()}…` : clean;
}

interface AiMatchingSectionProps {
  onOpenAgent: (initialQuery?: string) => void;
}

export function AiMatchingSection({ onOpenAgent }: AiMatchingSectionProps) {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const showcase = useMatchShowcase(3);
  const stats = useHomepageStats();

  // No scripted fallback: if there are no real matches to show, the section
  // does not render at all.
  if (!showcase || showcase.length === 0) return null;

  const activeScenario = showcase[Math.min(activePromptIndex, showcase.length - 1)];
  const topMatch = activeScenario.matches[0];

  return (
    <section className="py-24 sm:py-32 bg-[#2C2925] text-[#ECE7DC] relative w-full overflow-hidden border-b-2 border-[#2C2925] font-sans">
      
      {/* Texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-25 mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10 space-y-16">
        
        {/* Section Header with Smooth Scroll Reveal */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.45, ease: SMOOTH_EASE }}
            className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DDD8CD] transform-gpu will-change-transform"
          >
            <Cpu className="h-4 w-4 text-[#ECE7DC] animate-pulse" />
            <span>SECTION VI · ZERO-SHOT SEMANTIC MATCHING PROTOCOL</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-[#ECE7DC] leading-[0.92] transform-gpu will-change-transform"
            style={{ fontFamily: TIMES_SERIF }}
          >
            YOU BRING<br />
            THE PROBLEM.<br />
            <span className="text-[#C5BEB3] italic font-normal">WE FIND THE PEOPLE.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.12, ease: SMOOTH_EASE }}
            className="text-sm sm:text-base text-[#DDD8CD] leading-relaxed max-w-3xl mx-auto transform-gpu will-change-transform"
          >
            Our zero-shot semantic matching engine connects grassroots civic challenges directly with qualified university laboratories, faculty mentors, and student thesis cohorts.
          </motion.p>
        </div>

        {/* Preset Selector Chips with Smooth Fade */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.45, delay: 0.08, ease: SMOOTH_EASE }}
          className="flex flex-wrap items-center justify-center gap-2.5 transform-gpu will-change-transform"
        >
          {showcase.map((p, idx) => {
            const PIcon = (p.domain ? DOMAIN_ICON[p.domain] : undefined) ?? Cpu;
            const isSelected = activePromptIndex === idx;
            return (
              <motion.button
                key={p.id}
                onClick={() => setActivePromptIndex(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2.5 rounded-sm text-xs sm:text-[13px] font-bold flex items-center gap-2 transition-all border uppercase tracking-wider ${
                  isSelected
                    ? "bg-[#ECE7DC] border-white text-[#2C2925] shadow-lg scale-105"
                    : "bg-white/10 border-white/20 text-[#ECE7DC] hover:bg-white/20 hover:text-white"
                }`}
              >
                <PIcon className="h-4 w-4" />
                <span>{shortLabel(p.title)}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Real Collaborative Matching Interface Layout with Smooth Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: SMOOTH_EASE }}
          className="rounded-sm border-2 border-white/20 bg-[#383530] p-7 sm:p-11 shadow-2xl relative space-y-7 overflow-hidden transform-gpu will-change-transform"
        >
          {/* Animated AI Scanning Light Bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ECE7DC] to-transparent pointer-events-none opacity-50"
            animate={{ translateY: ["0px", "450px", "0px"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            
            {/* Left Column: Problem & AI Analysis (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Problem Block */}
              <motion.div
                key={`p-${activeScenario.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-sm border border-white/15 bg-white/5 p-5 sm:p-6 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs text-[#C5BEB3] font-medium">
                  <span className="uppercase font-bold text-[#ECE7DC] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ECE7DC] animate-ping" />
                    01 / Community Problem Voice
                  </span>
                  <span>Citizen Input</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-[#ECE7DC] leading-relaxed">
                  &ldquo;{activeScenario.description}&rdquo;
                </p>
              </motion.div>

              {/* AI Analysis Block */}
              <motion.div
                key={`a-${activeScenario.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="rounded-sm border border-white/15 bg-white/5 p-5 sm:p-6 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs text-[#ECE7DC]">
                  <span className="font-bold uppercase flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#ECE7DC] animate-spin-slow" /> 02 / Semantic Domain Mapping
                  </span>
                  <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded-sm">Zero-Shot NLP</span>
                </div>

                <div className="text-xs sm:text-sm font-bold text-[#ECE7DC]">
                  {activeScenario.domain ? DOMAIN_LABEL[activeScenario.domain] ?? activeScenario.domain : "Awaiting categorisation"}
                </div>

                {/* Real expertise terms lifted from the real match_reason
                    strings the matcher wrote for this challenge. When the
                    matcher found no specialisation overlap it says so in
                    plain words instead of listing terms — that honest
                    fallback is surfaced here rather than hidden. */}
                {activeScenario.reasonTerms.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeScenario.reasonTerms.map((token) => (
                      <motion.span
                        key={token}
                        whileHover={{ scale: 1.08 }}
                        className="px-2.5 py-1 rounded-sm bg-white/10 border border-white/20 text-xs font-semibold text-[#ECE7DC] shadow-xs cursor-default"
                      >
                        + {token}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#C5BEB3] pt-1 leading-relaxed">
                    Matched on subject area alone — the classifier found no direct
                    specialisation overlap and says so rather than inventing a reason.
                  </p>
                )}
              </motion.div>
            </div>

            {/* Middle Column: Animated Match Fit Score Gauge (2 Cols) */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-2 py-4">
              {/* Was a fabricated "95%" gauge. Now the real top match's
                  qualitative tier — never the raw score as a percentage,
                  per contracts.md. */}
              <motion.div
                key={activeScenario.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: SMOOTH_EASE }}
                className="relative flex items-center justify-center"
              >
                <span className="absolute h-24 w-24 rounded-full bg-white/10 animate-ping pointer-events-none" />
                <div
                  className="text-2xl sm:text-3xl font-extrabold text-[#ECE7DC] tracking-tight relative z-10 text-center leading-tight"
                  style={{ fontFamily: TIMES_SERIF }}
                >
                  {TIER_LABEL[topMatch.tier]}
                </div>
              </motion.div>

              <div className="text-xs font-bold uppercase text-[#C5BEB3] text-center tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ECE7DC] animate-pulse" />
                Top Match Strength
              </div>
            </div>

            {/* Right Column: Matched Collaborators (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="text-xs sm:text-sm uppercase font-bold text-[#ECE7DC] px-1 pb-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-[#ECE7DC]" />
                03 / Institutions actually matched:
              </div>

              {activeScenario.matches.map((match, i) => (
                <motion.div
                  key={`${match.institutionName}-${i}`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="p-3.5 rounded-sm bg-white/5 border border-white/15 hover:border-white/40 hover:bg-white/10 transition-all space-y-1 cursor-default shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-sm sm:text-base text-[#ECE7DC] leading-tight">
                      {match.institutionName}
                    </div>
                    {/* Qualitative tier, not a raw percentage — see contracts.md */}
                    <span className="shrink-0 text-xs sm:text-sm font-bold text-[#ECE7DC] bg-white/10 px-2 py-0.5 rounded-sm border border-white/20">
                      {TIER_LABEL[match.tier]}
                    </span>
                  </div>

                  {match.department ? (
                    <div className="text-xs text-[#C5BEB3] font-medium">{match.department}</div>
                  ) : null}
                </motion.div>
              ))}
            </div>

          </div>

          {/* Bottom Action */}
          <div className="pt-5 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-[#C5BEB3] font-medium flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ECE7DC] animate-pulse" />
              {/* Was "Over 312 university laboratories & 14,000+ challenges
                  synchronized in real-time" — both figures invented. */}
              {stats
                ? `${stats.partnerInstitutions} partner institutions · ${stats.aiMatchesMade} matches made across ${stats.challengesRaised} reported problems.`
                : "Every match shown here is a real row from the database."}
            </div>

            <Button
              onClick={() => onOpenAgent(activeScenario.description)}
              className="h-11 px-6 rounded-sm bg-[#ECE7DC] hover:bg-white text-[#2C2925] font-bold text-xs sm:text-sm gap-2 shadow-lg uppercase tracking-wider border border-white hover:scale-105 active:scale-95 transition-all group"
            >
              <span>Test with Your Own Problem (⌘K)</span>
              <ArrowRight className="h-4 w-4 text-[#2C2925] group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
