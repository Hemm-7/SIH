import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Microscope,
  Building2,
  Landmark,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  Network,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

export function CoreConceptEcosystem() {
  const [activeStakeholder, setActiveStakeholder] = useState<number>(0);

  const stakeholders = [
    {
      role: "Gram Sabhas & Citizens",
      tag: "Problem Origin & Field Intake",
      icon: HeartHandshake,
      description: "Self-Help Groups (Mahila Kisan Samitis, Village Jal Samitis) identify local pain points and operate deployed systems.",
      action: "Daily operations, ground telemetry feedback & grassroots maintenance",
      metrics: "1,200+ Village Panchayats",
    },
    {
      role: "Student Innovators",
      tag: "NEP-2020 Capstone Cohorts",
      icon: GraduationCap,
      description: "Engineering and postgraduate students earn mandatory multidisciplinary degree credits by building field prototypes.",
      action: "Hardware MVPs, IoT telemetry & village pilot deployment",
      metrics: "6-8 Capstone Credits",
    },
    {
      role: "University Researchers",
      tag: "Faculty & Laboratory Directors",
      icon: Microscope,
      description: "Specialized professors at BIT Mesra, IIT-ISM Dhanbad, and BAU Ranchi guide scientific feasibility and testing.",
      action: "Material characterization & analytical verification",
      metrics: "42+ Research Labs Active",
    },
    {
      role: "Startups & Incubators",
      tag: "Technology Incubation & Tooling",
      icon: Building2,
      description: "Incubated teams build production-grade, low-cost iterations and provide continuous technical support.",
      action: "Commercial tooling, IoT firmware & field manufacturing",
      metrics: "48 Incubated Prototypes",
    },
    {
      role: "Industry & CSR Allies",
      tag: "Grant Capital & Scaling",
      icon: Building2,
      description: "Corporate CSR funds (Tata Steel Foundation, Coal India) finance prototype fabrication and field deployment.",
      action: "CSR capital grants, mentorship & technology scale-up",
      metrics: "₹12.4 Cr Grant Pipeline",
    },
    {
      role: "District Administration",
      tag: "Public Policy & Infrastructure",
      icon: Landmark,
      description: "District Magistrates, Jal Nigam, and Agricultural Officers validate on-ground utility and oversee public rollout.",
      action: "Administrative sign-off, permissions & public procurement",
      metrics: "24 Districts Coordinated",
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#ECE7DC] text-[#2C2925] relative w-full overflow-hidden border-b-2 border-[#2C2925]">
      
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10 space-y-16">
        
        {/* Section Header with Smooth Scroll Reveal */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.45, ease: SMOOTH_EASE }}
            className="flex items-center justify-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#2C2925] transform-gpu will-change-transform"
          >
            <Network className="h-4 w-4 text-[#2C2925] animate-spin-slow" />
            <span>SECTION V · MULTIDISCIPLINARY INNOVATION CONSORTIUM</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-[#2C2925] leading-[0.92] transform-gpu will-change-transform"
            style={{ fontFamily: TIMES_SERIF }}
          >
            EVERY PROBLEM<br />
            NEEDS A DIFFERENT<br />
            <span className="text-[#5C564E] italic font-normal">TEAM.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.12, ease: SMOOTH_EASE }}
            className="text-sm sm:text-base text-[#3D3831] leading-relaxed max-w-3xl mx-auto font-sans transform-gpu will-change-transform"
          >
            An open collaborative infrastructure where a single grassroots challenge unites citizens, students, researchers, industry, and government into one multidisciplinary squad.
          </motion.p>
        </div>

        {/* Floating Ecosystem Nodes Layout with Smooth Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: SMOOTH_EASE }}
          className="rounded-sm border-2 border-[#2C2925] bg-[#FAF8F4] p-7 sm:p-10 shadow-xl space-y-6 font-sans transform-gpu will-change-transform"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            
            {/* Stakeholder Selector (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="text-xs sm:text-sm font-sans uppercase font-bold text-[#2C2925] px-1 pb-1 flex items-center justify-between">
                <span>Collaborative Stakeholder Nodes:</span>
                <span className="text-[11px] font-mono text-[#5C564E] font-semibold">6 Interactive Nodes</span>
              </div>

              <div className="space-y-2">
                {stakeholders.map((s, idx) => {
                  const SIcon = s.icon;
                  const isSelected = activeStakeholder === idx;

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => setActiveStakeholder(idx)}
                      whileHover={{ scale: 1.015, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-sm border-2 transition-all flex items-center gap-4 relative overflow-hidden ${
                        isSelected
                          ? "bg-[#2C2925] text-[#ECE7DC] border-[#2C2925] shadow-lg"
                          : "bg-[#FAF8F4] border-[#2C2925]/15 hover:border-[#2C2925] text-[#2C2925] hover:bg-white"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-sm transition-all ${
                          isSelected ? "bg-[#1E1C1A] text-[#ECE7DC] scale-110" : "bg-black/[0.04] text-[#2C2925]"
                        }`}
                      >
                        <SIcon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm sm:text-base leading-tight flex items-center justify-between">
                          <span className={isSelected ? "text-white font-bold" : "text-[#2C2925]"}>{s.role}</span>
                          <span
                            className={`text-xs font-semibold ${
                              isSelected ? "text-[#DDD8CD]" : "text-[#5C564E]"
                            }`}
                          >
                            {s.metrics}
                          </span>
                        </div>
                        <div
                          className={`text-xs truncate mt-0.5 ${
                            isSelected ? "text-[#C5BEB3]" : "text-[#5C564E]"
                          }`}
                        >
                          {s.tag}
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? "text-[#ECE7DC] translate-x-1" : "text-[#5C564E]"
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Stakeholder Role Inspector (7 Cols) with Smooth Morphing Transitions */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStakeholder}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: SMOOTH_EASE }}
                  className="rounded-sm border-2 border-[#2C2925] bg-[#DDD8CD] p-8 sm:p-9 space-y-5 shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2C2925]/20 pb-4">
                    <div className="space-y-1">
                      <h3
                        className="text-2xl sm:text-3xl font-bold text-[#2C2925]"
                        style={{ fontFamily: TIMES_SERIF }}
                      >
                        {stakeholders[activeStakeholder].role}
                      </h3>
                      <p className="text-xs font-bold text-[#2C2925] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        {stakeholders[activeStakeholder].tag}
                      </p>
                    </div>

                    <Badge variant="outline" className="text-xs font-bold px-3 py-1 bg-[#FAF8F4] text-[#2C2925] border-[#2C2925]/30 shadow-2xs">
                      {stakeholders[activeStakeholder].metrics}
                    </Badge>
                  </div>

                  <p className="text-sm sm:text-base text-[#2C2925] leading-relaxed font-sans font-medium">
                    {stakeholders[activeStakeholder].description}
                  </p>

                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold uppercase text-[#5C564E] tracking-wider">
                      Core Role in Social Impact Delivery:
                    </div>
                    <div className="p-4 rounded-sm bg-[#FAF8F4] border border-[#2C2925]/20 text-xs sm:text-sm font-semibold text-[#2C2925] flex items-start gap-3 shadow-xs">
                      <CheckCircle2 className="h-4 w-4 text-[#2C2925] shrink-0 mt-0.5" />
                      <span>{stakeholders[activeStakeholder].action}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-[#2C2925] text-[#ECE7DC] flex items-center justify-between gap-4 text-xs font-medium shadow-xs">
                    <div className="text-[#DDD8CD] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#ECE7DC] animate-ping" />
                      Consortium Protocol: Active
                    </div>
                    <div className="text-[#ECE7DC] font-bold">● Synchronized Innovation Mesh</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
