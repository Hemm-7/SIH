import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Droplets,
  Sprout,
  Zap,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AI_DEMO_PROMPTS = [
  {
    id: "water",
    icon: Droplets,
    label: "Fluoride Filtration",
    userPrompt: "High fluoride contamination in Daltonganj village borewells is causing severe skeletal fluorosis among children.",
    extractedDomain: "Water Resources · Geochemistry · Nano-Materials",
    analysisTokens: ["Geochemical Leaching", "Nano-Alumina Adsorbent", "Continuous Solar Pumping", "GSM Telemetry", "Jal Samiti SOP"],
    matchFit: 95,
    matches: [
      { name: "BIT Mesra • Dept. of Chemical Engineering", role: "Research Laboratory", score: 98 },
      { name: "IIT (ISM) Dhanbad • Central Research Facility", role: "Institute of National Importance", score: 94 },
      { name: "District Jal Nigam & Public Health Eng Dept", role: "Government Agency", score: 89 },
      { name: "Student Water Chemistry & IoT Cohort", role: "Student Innovation Team", score: 84 },
    ],
  },
  {
    id: "agri",
    icon: Sprout,
    label: "Irrigation Prediction",
    userPrompt: "Farmers in this region struggle to predict irrigation requirements and lose 40% tomato harvest to summer heat.",
    extractedDomain: "Agriculture · IoT · Weather · Remote Sensing",
    analysisTokens: ["Soil Moisture Dynamics", "IoT Telemetry", "Weather Forecasting", "Phase Change Thermal Storage", "Gram Panchayat SHG"],
    matchFit: 92,
    matches: [
      { name: "Birsa Agricultural University (BAU), Ranchi", role: "Agricultural University", score: 96 },
      { name: "BIT Mesra • Solar Thermal & Refrigeration Lab", role: "IoT Research Lab", score: 92 },
      { name: "AgriTech Innovation Team • IIT ISM Foundation", role: "AgriTech Startup", score: 87 },
      { name: "NEP-2020 Student Multidisciplinary Squad", role: "Student Innovation Team", score: 83 },
    ],
  },
  {
    id: "mining",
    icon: Zap,
    label: "Mine Slag Eco-Bricks",
    userPrompt: "Massive open cast coal mine overburden dumps in Dhanbad causing particulate air pollution and requiring sustainable reuse.",
    extractedDomain: "Clean Mining · Material Science · Geopolymers",
    analysisTokens: ["Silica Sand Extraction", "Geopolymerization", "Zero-Carbon Curing", "Structural Compressive Strength"],
    matchFit: 91,
    matches: [
      { name: "IIT (ISM) Dhanbad • Dept. of Mining Engineering", role: "Lead Academic Institute", score: 97 },
      { name: "Coal India & Tata Steel CSR Division", role: "Industry Funding Partner", score: 93 },
      { name: "NIT Jamshedpur • Civil Structural Lab", role: "Testing & Certification", score: 88 },
      { name: "Local Rural Masonry SHG Co-operative", role: "Community Production", score: 81 },
    ],
  },
];

interface AiMatchingSectionProps {
  onOpenAgent: (initialQuery?: string) => void;
}

export function AiMatchingSection({ onOpenAgent }: AiMatchingSectionProps) {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const activeScenario = AI_DEMO_PROMPTS[activePromptIndex];

  return (
    <section className="py-28 bg-[#081113] text-[#F3F7F6] relative overflow-hidden border-b border-white/[0.08]">
      {/* Background Subtle Dark Grid */}
      <div className="absolute inset-0 framer-teal-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#4FD1C5]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#4FD1C5]">
            People-to-Problem Collaborative Matcher
          </div>

          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] uppercase text-white leading-[0.92]">
            YOU BRING<br />
            THE PROBLEM.<br />
            <span className="text-[#6F8381]">WE FIND THE PEOPLE.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#9BAEAC] leading-relaxed font-normal pt-2">
            Our zero-shot semantic matching engine connects citizen challenges directly with university laboratories, faculty mentors, and student thesis cohorts.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {AI_DEMO_PROMPTS.map((p, idx) => {
            const PIcon = p.icon;
            const isSelected = activePromptIndex === idx;
            return (
              <button
                key={p.id}
                onClick={() => setActivePromptIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all border ${
                  isSelected
                    ? "bg-[#4FD1C5] border-[#4FD1C5] text-[#081113] font-bold shadow-lg shadow-teal-950/30"
                    : "bg-[#142124] border-white/[0.08] text-[#9BAEAC] hover:text-white"
                }`}
              >
                <PIcon className="h-3.5 w-3.5" />
                <span>Scenario: {p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Real Collaborative Matching Interface Layout */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#142124] p-6 sm:p-12 shadow-2xl relative space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Problem & AI Analysis (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Problem Block */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#081113] p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#6F8381]">
                  <span className="uppercase font-bold text-white">01 / Community Voice</span>
                  <span>Citizen Input</span>
                </div>
                <p className="text-base font-semibold text-white leading-relaxed">
                  "{activeScenario.userPrompt}"
                </p>
              </div>

              {/* AI Analysis Block */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#081113] p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#4FD1C5]">
                  <span className="font-bold uppercase flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> 02 / Semantic Domain Mapping
                  </span>
                  <span>Zero-Shot NLP</span>
                </div>

                <div className="text-sm font-semibold text-white">
                  {activeScenario.extractedDomain}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeScenario.analysisTokens.map((token, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#9BAEAC]"
                    >
                      + {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column: Match Fit Gauge (2 Cols) */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-2 py-4">
              <div className="text-5xl sm:text-6xl font-black font-mono text-[#4FD1C5]">
                {activeScenario.matchFit}%
              </div>
              <div className="text-xs font-mono uppercase text-[#9BAEAC] font-bold text-center">
                Match Fit
              </div>
            </div>

            {/* Right Column: Matched Collaborators (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="text-xs font-mono uppercase font-bold text-[#6F8381] px-1 pb-1 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#4FD1C5]" />
                03 / Matched Multidisciplinary Squad:
              </div>

              {activeScenario.matches.map((match, i) => (
                <motion.div
                  key={match.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="p-4 rounded-2xl bg-[#081113] border border-white/[0.08] hover:border-[#4FD1C5]/40 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-sm text-white leading-tight">
                      {match.name}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#4FD1C5]">
                      {match.score}%
                    </span>
                  </div>

                  <div className="text-xs font-mono text-[#6F8381]">
                    {match.role}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6F8381] font-mono">
              ⚡ Over 312 university laboratories &amp; 14,000+ challenges synchronized in real-time.
            </div>

            <Button
              onClick={() => onOpenAgent(activeScenario.userPrompt)}
              className="h-11 px-6 rounded-xl bg-[#4FD1C5] hover:bg-[#72E2D6] text-[#081113] font-bold text-xs gap-2 border border-[#4FD1C5]"
            >
              <span>Test with Your Own Problem (⌘K)</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
