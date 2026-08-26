import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Microscope,
  Building2,
  Landmark,
  HeartHandshake,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CoreConceptEcosystem() {
  const [activeStakeholder, setActiveStakeholder] = useState<number>(0);

  const stakeholders = [
    {
      role: "Community & Gram Sabhas",
      tag: "Problem Origin & Ground Validation",
      icon: HeartHandshake,
      description: "Self-Help Groups (Mahila Kisan Samitis, Village Jal Samitis) identify local pain points and operate deployed systems.",
      action: "Daily operations, community feedback & field maintenance",
      metrics: "1,200+ Village Panchayats",
    },
    {
      role: "Student Innovators",
      tag: "NEP-2020 Capstone Cohorts",
      icon: GraduationCap,
      description: "Engineering and postgraduate students earn mandatory multidisciplinary degree credits by building prototypes.",
      action: "Hardware MVPs, IoT telemetry & village field trials",
      metrics: "6-8 Capstone Credits",
    },
    {
      role: "University Researchers",
      tag: "Faculty & Lab Directors",
      icon: Microscope,
      description: "Specialized professors at BIT Mesra, IIT ISM, and BAU guide feasibility and provide advanced instrumentation.",
      action: "Material characterization & analytical verification",
      metrics: "42+ Research Labs Active",
    },
    {
      role: "Startups & Innovators",
      tag: "Technology Incubation",
      icon: Building2,
      description: "Incubated teams build production-grade, low-cost iterations and provide continuous technical support.",
      action: "Commercial tooling, IoT firmware & manufacturing",
      metrics: "48 Incubated Prototypes",
    },
    {
      role: "Industry & CSR Partners",
      tag: "Funding & Scaling Capital",
      icon: Building2,
      description: "Corporate CSR funds (Tata Steel Foundation, Coal India) finance prototype fabrication and field deployment.",
      action: "CSR capital, mentorship & technology scale-up",
      metrics: "₹12.4 Cr Grant Pipeline",
    },
    {
      role: "District Administration",
      tag: "Public Policy & Infrastructure",
      icon: Landmark,
      description: "District Magistrates, Jal Nigam, and Agricultural Officers validate on-ground utility and oversee public rollout.",
      action: "Administrative sign-off, permissions & procurement",
      metrics: "24 Districts Coordinated",
    },
  ];

  return (
    <section className="py-24 bg-[#081113] relative overflow-hidden border-b border-white/[0.08]">
      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#6F8381]">
            Social Innovation Mesh
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase text-[#F3F7F6] leading-[0.92]">
            EVERY PROBLEM<br />
            NEEDS A DIFFERENT<br />
            <span className="text-[#4FD1C5]">TEAM.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#9BAEAC] leading-relaxed font-normal">
            A living innovation loop where a single ground challenge unites students, researchers, industry, and government into one multidisciplinary squad.
          </p>
        </div>

        {/* Floating Ecosystem Nodes Layout */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#142124] p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Stakeholder Selector (5 Cols) */}
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-mono uppercase font-bold text-[#6F8381] px-1 pb-1">
                Collaborative Stakeholders:
              </div>

              <div className="space-y-1.5">
                {stakeholders.map((s, idx) => {
                  const SIcon = s.icon;
                  const isSelected = activeStakeholder === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStakeholder(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-[#19292B] text-white border-[#4FD1C5]/30 shadow-md scale-[1.01]"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] text-[#9BAEAC]"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl ${
                          isSelected ? "bg-[#4FD1C5] text-[#081113]" : "bg-white/[0.05] text-[#F3F7F6]"
                        }`}
                      >
                        <SIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm leading-tight flex items-center justify-between">
                          <span className={isSelected ? "text-white font-bold" : "text-[#F3F7F6]"}>{s.role}</span>
                          <span
                            className={`text-[10px] font-mono font-medium ${
                              isSelected ? "text-[#4FD1C5]" : "text-[#6F8381]"
                            }`}
                          >
                            {s.metrics}
                          </span>
                        </div>
                        <div
                          className={`text-xs truncate mt-0.5 ${
                            isSelected ? "text-[#9BAEAC]" : "text-[#6F8381]"
                          }`}
                        >
                          {s.tag}
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? "text-[#4FD1C5] translate-x-0.5" : "text-[#6F8381]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stakeholder Role Inspector (7 Cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStakeholder}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl border border-white/[0.08] bg-[#0D181A] p-8 space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h3 className="font-display text-2xl font-bold text-[#F3F7F6]">
                        {stakeholders[activeStakeholder].role}
                      </h3>
                      <p className="text-xs font-mono font-semibold text-[#9BAEAC]">
                        {stakeholders[activeStakeholder].tag}
                      </p>
                    </div>

                    <Badge variant="outline" className="font-mono text-xs bg-white/[0.05] text-[#F3F7F6] border-white/[0.1]">
                      {stakeholders[activeStakeholder].metrics}
                    </Badge>
                  </div>

                  <p className="text-sm sm:text-base text-[#9BAEAC] leading-relaxed">
                    {stakeholders[activeStakeholder].description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono uppercase font-bold text-[#6F8381]">
                      Core Role in Social Impact Delivery:
                    </div>
                    <div className="p-4 rounded-2xl bg-[#142124] border border-white/[0.06] text-sm font-medium text-[#F3F7F6] flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#4FD1C5] shrink-0 mt-0.5" />
                      <span>{stakeholders[activeStakeholder].action}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#142124] text-white flex items-center justify-between gap-4 font-mono text-xs border border-white/[0.06]">
                    <div className="text-[#9BAEAC]">Ecosystem State: Connected</div>
                    <div className="text-[#4FD1C5] font-bold">● Active Innovation Node</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
