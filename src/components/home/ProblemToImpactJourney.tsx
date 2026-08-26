import { motion } from "framer-motion";
import { GitCommit, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

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
    title: "Zero-Shot NLP Audit",
    description: "The platform clusters duplicate reports, analyzes root-causes, and identifies exact technical requirements.",
  },
  {
    step: "03",
    phase: "MATCH",
    title: "Specialized Lab Routing",
    // Was "against 312 university laboratories with faculty expertise and past
    // patent track records" — neither the count nor the patent-record claim is
    // backed by anything. Describes what the matcher actually does instead.
    description: "A zero-shot classifier ranks registered university and industry partners by how well their stated expertise fits the problem, and records a written reason for each match.",
  },
  {
    step: "04",
    phase: "CLAIM",
    title: "NEP-2020 Capstone Cohort",
    description: "Multidisciplinary student cohorts claim the challenge as their final-year degree thesis under faculty guidance.",
  },
  {
    step: "05",
    phase: "BUILD",
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
    phase: "AUDIT",
    title: "Audited Public Resolution",
    // Was "telemetry confirms water/crop yield improvement" — there is no
    // telemetry. The real confirmation step is the citizen's own.
    description: "The institution marks the work done, and the citizen who reported the problem confirms independently that it was actually fixed.",
  },
];

export function ProblemToImpactJourney() {
  return (
    <section className="py-24 sm:py-32 bg-[#ECE7DC] text-[#2C2925] relative w-full overflow-hidden border-b-2 border-[#2C2925] font-sans">
      
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10 space-y-16">
        
        {/* Section Header (Full Width) with Smooth Scroll Reveal */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.45, ease: SMOOTH_EASE }}
            className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C2925] transform-gpu will-change-transform"
          >
            <GitCommit className="h-4 w-4 text-[#2C2925] animate-pulse" />
            <span>SECTION VII · 7-STAGE INNOVATION LIFECYCLE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-[#2C2925] leading-[0.92] transform-gpu will-change-transform"
            style={{ fontFamily: TIMES_SERIF }}
          >
            FROM PROBLEM<br />
            <span className="text-[#5C564E] italic font-normal">TO IMPACT.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.12, ease: SMOOTH_EASE }}
            className="text-sm sm:text-base text-[#3D3831] leading-relaxed max-w-3xl mx-auto transform-gpu will-change-transform"
          >
            Every societal challenge follows a rigorous, accredited, and fully auditable pipeline from initial citizen submission to verified district deployment.
          </motion.p>
        </div>

        {/* Animated Connecting Flow Track Header (Desktop) */}
        <div className="hidden lg:flex items-center justify-between px-6 pb-2 text-[11px] font-mono text-[#5C564E] uppercase font-bold tracking-wider">
          <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-[#2C2925]" /> INPUT PIPELINE</span>
          <div className="flex-1 mx-6 h-[2px] bg-gradient-to-r from-[#2C2925] via-[#5C564E] to-[#2C2925] relative overflow-hidden">
            <motion.div
              className="absolute inset-0 w-24 bg-white"
              animate={{ x: ["-100%", "800%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
          </div>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#2C2925]" /> VERIFIED AUDIT SIGN-OFF</span>
        </div>

        {/* Minimal Linear Journey Grid (Full Width) with Smooth Scroll Cascade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-5">
          {JOURNEY_STEPS.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
              transition={{ duration: 0.45, delay: idx * 0.05, ease: SMOOTH_EASE }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-sm border-2 border-[#2C2925] bg-[#FAF8F4] p-5 sm:p-6 hover:shadow-2xl hover:bg-white transition-all flex flex-col justify-between space-y-4 group shadow-xs cursor-default transform-gpu will-change-transform"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#2C2925]/15">
                  <span className="text-xs font-bold text-[#5C564E] group-hover:text-[#2C2925] transition-colors flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2C2925] opacity-0 group-hover:opacity-100 transition-opacity" />
                    STAGE {s.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#2C2925] bg-black/[0.05] group-hover:bg-[#2C2925] group-hover:text-[#ECE7DC] px-2 py-0.5 rounded-sm border border-[#2C2925]/20 transition-colors">
                    {s.phase}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#2C2925] leading-snug group-hover:underline underline-offset-2">
                  {s.title}
                </h4>

                <p className="text-xs text-[#3D3831] leading-relaxed font-medium">
                  {s.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#2C2925]/10 text-[11px] text-[#5C564E] font-semibold flex items-center justify-between">
                <span>Phase {idx + 1} of 7</span>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#2C2925]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
