import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Cpu, Building2, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

const STAGES = [
  {
    step: "01",
    title: "Citizen Ground Voice",
    subtitle: "Plain Language / Native Speech",
    icon: MessageSquare,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    description:
      "A villager or student in Gumla or Palamu logs an issue (e.g. broken solar pump or dry handpump) in Hindi, English, or Santhali with geolocation.",
    highlight: "Zero jargon required",
  },
  {
    step: "02",
    title: "AI Zero-Shot Classifier",
    subtitle: "Vector Matching & Clustering",
    icon: Cpu,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    description:
      "AI categorizes the domain (Water, Tribal Tech, Health), merges duplicates across nearby habitations, and extracts technical specifications.",
    highlight: "BART-Large-MNLI + Vector Reranking",
  },
  {
    step: "03",
    title: "University Lab Claim",
    subtitle: "Academic R&D Allocation",
    icon: Building2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    description:
      "Specialized faculty and research labs at BIT Mesra, IIT ISM, or BAU review the challenge and claim it as a funded NEP-2020 project.",
    highlight: "Direct Department Routing",
  },
  {
    step: "04",
    title: "On-Ground Resolution",
    subtitle: "Field Prototype & Impact",
    icon: CheckCircle2,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    description:
      "Students deploy the working pilot on ground, district officials inspect the deployment, and the challenge status is marked resolved.",
    highlight: "Auditable Citizen Impact",
  },
];

export function PipelineVisualizer() {
  const [selectedStage, setSelectedStage] = useState(1);

  return (
    <section className="py-20 border-y border-white/[0.08] bg-black/60 relative overflow-hidden">
      <div className="absolute inset-0 framer-dot-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
            <Sparkles className="h-3 w-3" />
            End-to-End Resolution Pipeline
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            How a Village Problem Becomes an Academic Solution
          </h2>
          <p className="text-sm text-slate-400">
            Aligned with the National Education Policy (NEP 2020) to turn ground challenges into accredited university R&amp;D.
          </p>
        </div>

        {/* 4 Steps Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = selectedStage === idx;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedStage(idx)}
                className={`cursor-pointer rounded-2xl p-6 transition-all relative flex flex-col justify-between backdrop-blur-xl ${
                  isSelected
                    ? "bg-white/[0.08] border-2 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    : "bg-white/[0.03] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      PHASE {stage.step}
                    </span>
                    <div className={`p-2.5 rounded-xl ${stage.bgColor} ${stage.color} border border-white/10`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {stage.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-400/90 mt-0.5">
                      {stage.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-emerald-300">
                    {stage.highlight}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
