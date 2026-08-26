import { motion } from "framer-motion";

const JOURNEY_STEPS = [
  {
    step: "01",
    phase: "IDENTIFY",
    title: "Citizen Ground Voice",
    description: "A villager, panchayat official, or student logs a local water, agro, health, or energy problem in plain dialect.",
  },
  {
    step: "02",
    phase: "UNDERSTAND",
    title: "AI Zero-Shot Analysis",
    description: "The platform clusters duplicate reports, analyzes root-causes, and identifies exact technical requirements.",
  },
  {
    step: "03",
    phase: "MATCH",
    title: "Specialized Lab Routing",
    description: "AI matches the problem against 312 university laboratories with faculty expertise and past patent track records.",
  },
  {
    step: "04",
    phase: "COLLABORATE",
    title: "NEP-2020 Squad Formation",
    description: "Multidisciplinary student cohorts claim the challenge as their final-year degree thesis under faculty guidance.",
  },
  {
    step: "05",
    phase: "PILOT",
    title: "On-Ground Prototype Build",
    description: "Hardware & software prototypes are bench-tested in university labs and deployed at the model Gram Panchayat.",
  },
  {
    step: "06",
    phase: "SCALE",
    title: "District Rollout & CSR",
    description: "Corporate CSR funds and Jharkhand State DST grants scale the validated prototype to surrounding blocks.",
  },
  {
    step: "07",
    phase: "IMPACT",
    title: "Audited Public Resolution",
    description: "District administration signs off, telemetry confirms water/crop yield improvement, and challenge is marked resolved.",
  },
];

export function ProblemToImpactJourney() {
  return (
    <section className="py-24 bg-[#0D181A] text-[#F3F7F6] relative overflow-hidden border-b border-white/[0.08]">
      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#6F8381]">
            Lifecycle &amp; Traceability
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase text-[#F3F7F6] leading-[0.92]">
            FROM PROBLEM<br />
            <span className="text-[#6F8381]">TO IMPACT.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#9BAEAC] leading-relaxed font-normal">
            Every societal challenge follows a rigorous, accredited, and fully auditable lifecycle from initial submission to verified district deployment.
          </p>
        </div>

        {/* Minimal Linear Journey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {JOURNEY_STEPS.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              className="rounded-2xl border border-white/[0.08] bg-[#142124] p-6 hover:border-[#4FD1C5]/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#6F8381] group-hover:text-[#4FD1C5] transition-colors">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#4FD1C5] bg-[#4FD1C5]/10 px-2 py-0.5 rounded border border-[#4FD1C5]/20">
                    {s.phase}
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-[#F3F7F6] leading-tight">
                  {s.title}
                </h4>

                <p className="text-xs text-[#6F8381] leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-[#6F8381]">
                Stage {idx + 1} of 7
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
