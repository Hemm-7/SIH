import { motion } from "framer-motion";
import {
  Droplets,
  Sprout,
  Languages,
  HeartPulse,
  Zap,
  GraduationCap,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SectorBentoGridProps {
  onOpenAgent: (initialQuery?: string) => void;
}

const SECTORS = [
  {
    id: "water",
    title: "Water Resources & Filtration",
    subtitle: "Fluoride, Arsenic & Jal Nigam Telemetry",
    icon: Droplets,
    color: "from-cyan-500/20 via-blue-500/10 to-transparent",
    textColor: "text-cyan-400",
    borderGlow: "group-hover:border-cyan-400/60 shadow-cyan-500/10",
    badge: "14 Challenges",
    matchedLabs: "BIT Mesra • IIT ISM Water Div",
    query: "Groundwater fluoride nano-adsorption filtration in Palamu",
    description:
      "Addressing high fluoride zones in Palamu and Garhwa through solar-assisted decentralized nano-filtration units.",
    span: "col-span-1 md:col-span-2",
  },
  {
    id: "agri",
    title: "Agriculture & Tribal Livelihoods",
    subtitle: "Off-Grid Cold Chains & MFP Value Add",
    icon: Sprout,
    color: "from-emerald-500/20 via-teal-500/10 to-transparent",
    textColor: "text-emerald-400",
    borderGlow: "group-hover:border-emerald-400/60 shadow-emerald-500/10",
    badge: "21 Challenges",
    matchedLabs: "Birsa Agricultural University",
    query: "Solar cold storage for tribal tomato and lac farmers in Khunti",
    description:
      "Preventing 40% post-harvest loss in perishable crops using off-grid phase change thermal storage for tribal SHGs.",
    span: "col-span-1 md:col-span-1",
  },
  {
    id: "nlp",
    title: "Tribal Languages & NLP AI",
    subtitle: "Santhali (Ol Chiki), Ho & Mundari",
    icon: Languages,
    color: "from-purple-500/20 via-indigo-500/10 to-transparent",
    textColor: "text-purple-400",
    borderGlow: "group-hover:border-purple-400/60 shadow-purple-500/10",
    badge: "8 Challenges",
    matchedLabs: "Dept of CSE, BIT Mesra",
    query: "Santhali Ol Chiki speech-to-text NLP assistant in Dumka",
    description:
      "AI voice and text models empowering indigenous language speakers to access government welfare schemes and digital learning.",
    span: "col-span-1 md:col-span-1",
  },
  {
    id: "health",
    title: "Rural Health & Drone Logistics",
    subtitle: "Remote Hills & Antivenom Corridors",
    icon: HeartPulse,
    color: "from-rose-500/20 via-pink-500/10 to-transparent",
    textColor: "text-rose-400",
    borderGlow: "group-hover:border-rose-400/60 shadow-rose-500/10",
    badge: "12 Challenges",
    matchedLabs: "AIIMS Deoghar • RIMS Ranchi",
    query: "AI drone drops for antivenom & maternal medicines in Latehar",
    description:
      "Autonomous cold-chain drone delivery corridors for maternal therapeutics and anti-venom in cutoff latehar habitations.",
    span: "col-span-1 md:col-span-2",
  },
  {
    id: "energy",
    title: "Clean Energy & Mine Tailing Reuse",
    subtitle: "Overburden Eco-Bricks & Microgrids",
    icon: Zap,
    color: "from-amber-500/20 via-orange-500/10 to-transparent",
    textColor: "text-amber-400",
    borderGlow: "group-hover:border-amber-400/60 shadow-amber-500/10",
    badge: "16 Challenges",
    matchedLabs: "IIT (ISM) Dhanbad Mining Lab",
    query: "Low-carbon eco-bricks from Dhanbad coal overburden slag",
    description:
      "Repurposing Dhanbad coal overburden and tailing waste into high-strength, carbon-sequestering building materials.",
    span: "col-span-1 md:col-span-2",
  },
  {
    id: "edu",
    title: "NEP-2020 Student Capstones",
    subtitle: "Accredited Multi-Disciplinary Thesis",
    icon: GraduationCap,
    color: "from-teal-500/20 via-emerald-500/10 to-transparent",
    textColor: "text-teal-300",
    borderGlow: "group-hover:border-teal-400/60 shadow-teal-500/10",
    badge: "100% Accredited",
    matchedLabs: "All Partner Universities",
    query: "Multidisciplinary NEP 2020 student research capstone blueprint for Jharkhand",
    description:
      "Converting live village problem statements into mandatory multi-disciplinary student final-year project credits.",
    span: "col-span-1 md:col-span-1",
  },
];

export function SectorBentoGrid({ onOpenAgent }: SectorBentoGridProps) {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
              <Sparkles className="h-3 w-3" />
              Priority R&amp;D Domains
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Jharkhand Societal Innovation Sectors
            </h2>
            <p className="text-sm text-slate-400">
              Explore key focus areas mapped directly to specialized university laboratories.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
            Click any sector to run an AI Solution Architecture
          </span>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.id}
                whileHover={{ y: -4 }}
                onClick={() => onOpenAgent(sector.query)}
                className={`group cursor-pointer rounded-2xl border border-white/[0.08] bg-gradient-to-br ${sector.color} bg-[#0c1222]/80 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 ${sector.borderGlow} hover:shadow-2xl relative flex flex-col justify-between ${sector.span}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-black/60 border border-white/10 ${sector.textColor} shadow-inner`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] font-mono border-white/20 bg-white/5 text-white">
                        {sector.badge}
                      </Badge>
                      <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {sector.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-400/80 mt-0.5">
                      {sector.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    🔬 {sector.matchedLabs}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="h-3 w-3" /> Synthesize
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
