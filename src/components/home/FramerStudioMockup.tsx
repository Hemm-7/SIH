import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Layers,
  Cpu,
  Building2,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Flame,
  Droplets,
  Sprout,
  Languages,
  Zap,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FramerStudioMockupProps {
  onOpenAgent: (initialQuery?: string) => void;
}

const STUDIO_SCENARIOS = [
  {
    id: "water",
    icon: Droplets,
    label: "Water Fluorosis (Palamu)",
    color: "text-cyan-400",
    bgAccent: "bg-cyan-500/10",
    borderAccent: "border-cyan-500/30",
    glowColor: "rgba(6, 182, 212, 0.3)",
    citizenReport: "High fluoride (4.8 ppm) in 32 village borewells causing crippling skeletal fluorosis.",
    aiClassification: "Domain: Water Resources • Sub-domain: Geochemical De-fluoridation",
    matchedLab: "BIT Mesra • Advanced Separation Technologies Lab",
    facultyHead: "Prof. R. Sengupta (Lead Researcher)",
    deliverable: "Solar Nano-Alumina Adsorbent Filtration Cartridge + GSM Fluoride Telemetry",
    budget: "₹3.80 Lakhs",
    timeline: "4 Months",
    credits: "6 NEP R&D Credits",
    matchScore: 97.4,
    status: "R&D Prototype Ready",
  },
  {
    id: "agri",
    icon: Sprout,
    label: "Solar Cold Chain (Khunti)",
    color: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.3)",
    citizenReport: "Tribal SHG tomato & mahua farmers facing 40% post-harvest spoilage without grid power.",
    aiClassification: "Domain: Agriculture • Sub-domain: Thermal Energy Storage Cold Chain",
    matchedLab: "Birsa Agricultural University (BAU) Ranchi",
    facultyHead: "Dr. P. K. Jha (Post-Harvest Lead)",
    deliverable: "500kg Modular Phase Change Material (PCM) Solar Chiller with Tribal SHG App",
    budget: "₹4.50 Lakhs",
    timeline: "5 Months",
    credits: "8 NEP R&D Credits",
    matchScore: 98.2,
    status: "Field Pilot Approved",
  },
  {
    id: "nlp",
    icon: Languages,
    label: "Santhali Voice AI (Dumka)",
    color: "text-purple-400",
    bgAccent: "bg-purple-500/10",
    borderAccent: "border-purple-500/30",
    glowColor: "rgba(168, 85, 247, 0.3)",
    citizenReport: "Santhali Ol Chiki native speakers excluded from mobile banking and e-panchayat portals.",
    aiClassification: "Domain: Indigenous Tech & NLP • Sub-domain: Low-Resource Speech Synthesis",
    matchedLab: "Dept of Computer Science & Eng, BIT Mesra",
    facultyHead: "Dr. K. Soren (Indigenous NLP Lead)",
    deliverable: "Offline Edge ASR/TTS Engine with Ol Chiki Unicode Transliteration API",
    budget: "₹2.90 Lakhs",
    timeline: "3 Months",
    credits: "6 NEP R&D Credits",
    matchScore: 96.0,
    status: "Dataset Trained",
  },
  {
    id: "mining",
    icon: Zap,
    label: "Coal Slag Eco-Bricks (Dhanbad)",
    color: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    borderAccent: "border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.3)",
    citizenReport: "Massive open cast coal mine overburden causing airborne silica dust in Jharia.",
    aiClassification: "Domain: Clean Mining & Material Science • Sub-domain: Slag Geopolymerization",
    matchedLab: "IIT (ISM) Dhanbad • CRF Geotechnical Division",
    facultyHead: "Dr. A. K. Mishra (Environmental Tech)",
    deliverable: "Autoclaved Zero-Carbon Geopolymer Bricks utilizing 85% coal overburden slag",
    budget: "₹5.20 Lakhs",
    timeline: "6 Months",
    credits: "8 NEP R&D Credits",
    matchScore: 94.7,
    status: "Lab Spec Tested",
  },
];

export function FramerStudioMockup({ onOpenAgent }: FramerStudioMockupProps) {
  const [activeScenarioId, setActiveScenarioId] = useState("water");

  const scenario = STUDIO_SCENARIOS.find((s) => s.id === activeScenarioId) || STUDIO_SCENARIOS[0];

  return (
    <div className="w-full max-w-6xl mx-auto pt-6">
      {/* Studio Window Frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="rounded-3xl border border-white/10 bg-[#0a0f1d]/90 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden relative"
      >
        {/* Top Studio Control Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-black/40 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 text-white/70 font-mono text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-semibold text-white">Framer AI Design Studio</span>
              <span className="text-white/40">/</span>
              <span className="text-emerald-400 font-medium">Jharkhand R&amp;D Architecture Canvas</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-lg border border-white/[0.06]">
              {STUDIO_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScenarioId(s.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    activeScenarioId === s.id
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {s.label.split(" ")[0]}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenAgent(scenario.citizenReport)}
              className="h-7 px-2.5 text-[11px] bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-black font-semibold rounded-lg gap-1 transition-all"
            >
              <Sparkles className="h-3 w-3" />
              Edit in AI Studio
            </Button>
          </div>
        </div>

        {/* Studio Workspace Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] bg-[#030712] relative overflow-hidden framer-dot-grid">
          {/* Left Panel: Problem & Layer Navigator */}
          <div className="lg:col-span-3 border-r border-white/[0.06] bg-black/40 p-4 space-y-4 text-xs">
            <div className="flex items-center justify-between text-white/50 font-mono text-[10px] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-white/70" />
                Scenario Presets
              </span>
              <span>4 Active</span>
            </div>

            <div className="space-y-1.5">
              {STUDIO_SCENARIOS.map((s) => {
                const SIcon = s.icon;
                const isSelected = s.id === activeScenarioId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenarioId(s.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-white/[0.08] border-emerald-500/50 shadow-md shadow-emerald-500/10 text-white"
                        : "bg-white/[0.02] border-transparent hover:bg-white/[0.04] text-white/70"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${s.bgAccent} ${s.color}`}>
                      <SIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate text-[12px]">{s.label}</div>
                      <div className="text-[10px] text-white/40 font-mono">{s.matchScore}% Match Fit</div>
                    </div>
                    {isSelected && <ChevronRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* NEP-2020 Accordion Snippet */}
            <div className="pt-2 border-t border-white/[0.06] space-y-2">
              <div className="text-[10px] font-mono text-white/40 uppercase">Academic Routing</div>
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-300 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  NEP-2020 Aligned
                </div>
                <p className="text-[10px] text-white/60 leading-tight">
                  Auto-mapped to student internship thesis &amp; Jharkhand State Innovation DST grant.
                </p>
              </div>
            </div>
          </div>

          {/* Center Canvas: Interactive Flow Architecture & Prototype Node */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-center relative space-y-5">
            {/* Ambient Background Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ background: scenario.glowColor }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="space-y-4 relative z-10"
              >
                {/* Node 1: Citizen Ground Trigger */}
                <div className="rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-xl p-4 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-amber-400 font-mono">
                      <Flame className="h-3.5 w-3.5" />
                      INPUT NODE • Citizen Problem
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono border-amber-500/30 text-amber-300">
                      Ground Telemetry
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-white/90">
                    "{scenario.citizenReport}"
                  </p>
                </div>

                {/* Connecting Visual Connector */}
                <div className="flex justify-center -my-2 relative z-20">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 shadow-lg">
                    <Sparkles className="h-3 w-3 animate-spin" />
                    BART-Large-MNLI Vector Matching → {scenario.matchScore}%
                  </div>
                </div>

                {/* Node 2: Matched Academic Lab & Deliverable */}
                <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-black/80 to-teal-950/30 backdrop-blur-xl p-5 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
                      <Building2 className="h-3.5 w-3.5" />
                      OUTPUT NODE • Matched University Lab
                    </span>
                    <Badge variant="glow" className="text-[10px] font-mono">
                      {scenario.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-base font-bold font-display text-white">
                      {scenario.matchedLab}
                    </h4>
                    <p className="text-xs text-emerald-300/80 font-mono mt-0.5">
                      Lead: {scenario.facultyHead}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs space-y-1">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-teal-400" />
                      Synthesized Prototype Blueprint:
                    </div>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      {scenario.deliverable}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Panel: Property Inspector */}
          <div className="lg:col-span-3 border-l border-white/[0.06] bg-black/40 p-4 space-y-4 text-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-white/50 font-mono text-[10px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-white/70" />
                  Blueprint Inspector
                </span>
                <span>Live Telemetry</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-white/40 font-mono">AI Matching Precision</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {scenario.matchScore}%
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${scenario.matchScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-white/40 font-mono">Estimated R&amp;D Budget</div>
                  <div className="text-lg font-bold font-mono text-white">
                    {scenario.budget}
                  </div>
                  <div className="text-[10px] text-white/50">Funded via State DST Innovation Scheme</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                  <div className="text-[10px] text-white/40 font-mono">Deployment Timeline</div>
                  <div className="text-lg font-bold font-mono text-cyan-400">
                    {scenario.timeline}
                  </div>
                  <div className="text-[10px] text-white/50">{scenario.credits} Multi-Disciplinary</div>
                </div>
              </div>
            </div>

            {/* Quick Action in Inspector */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <Button
                onClick={() => onOpenAgent(scenario.citizenReport)}
                className="w-full h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5"
              >
                <span>Customize in Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
