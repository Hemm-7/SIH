import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImpactStories() {
  return (
    <section className="py-24 bg-[#081113] relative overflow-hidden border-b border-white/[0.08]">
      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#6F8381]">
            Verified Impact Case Study
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase text-[#F3F7F6] leading-[0.92]">
            FROM PROBLEM<br />
            <span className="text-[#4FD1C5]">TO IMPACT.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#9BAEAC] leading-relaxed font-normal">
            Real-world evidence of how the portal bridged a citizen water crisis in Palamu into an accredited university R&amp;D pilot.
          </p>
        </div>

        {/* Large Editorial Dark Magazine Layout Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/[0.08] bg-[#142124] overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Image & Metrics (5 Cols) */}
            <div className="lg:col-span-5 relative bg-[#0D181A] p-8 sm:p-10 text-white flex flex-col justify-between overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb18086f7?auto=format&fit=crop&w=1000&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D181A] via-[#0D181A]/60 to-transparent" />

              <div className="relative z-10 space-y-4">
                <span className="px-3 py-1 rounded-full bg-[#4FD1C5]/10 text-[#4FD1C5] text-xs font-mono font-bold border border-[#4FD1C5]/30 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  VERIFIED PILOT DEPLOYMENT
                </span>

                <div className="space-y-1">
                  <div className="text-xs font-mono text-[#6F8381] uppercase">Palamu &amp; Garhwa Basin</div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    Solar Nano-Adsorption Fluoride Filter
                  </h3>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-4 pt-12 border-t border-white/10 mt-8">
                <div className="space-y-1">
                  <div className="font-display text-3xl sm:text-4xl font-black text-[#4FD1C5]">
                    48,000
                  </div>
                  <div className="text-xs text-[#9BAEAC]">Villagers with safe water access</div>
                </div>
                <div className="space-y-1">
                  <div className="font-display text-3xl sm:text-4xl font-black text-white">
                    0.8 ppm
                  </div>
                  <div className="text-xs text-[#9BAEAC]">Fluoride reduced from 5.2 ppm</div>
                </div>
              </div>
            </div>

            {/* Right Editorial Breakdown (7 Cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-8 bg-[#142124]">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-[#4FD1C5]">
                  01 / The Ground Challenge
                </div>
                <p className="text-[#9BAEAC] text-base leading-relaxed">
                  In April 2025, village Jal Sahiyyas in Chainpur block, Palamu logged reports of severe bone deformities in schoolchildren due to 5.2 ppm natural fluoride in 32 community borewells.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-[#4FD1C5]">
                  02 / The Research &amp; Student Squad
                </div>
                <div className="p-4 rounded-2xl bg-[#081113] border border-white/[0.06] text-sm text-[#F3F7F6] space-y-1">
                  <div className="font-bold">
                    BIT Mesra Dept of Chemical Eng + 4 NEP-2020 Students + District Jal Nigam
                  </div>
                  <div className="text-[#6F8381] text-xs">
                    Guided by Prof. R. Sengupta • Funded via State DST Innovation Scheme
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-[#4FD1C5]">
                  03 / Deployed Technology
                </div>
                <p className="text-[#9BAEAC] text-base leading-relaxed">
                  A solar-powered continuous adsorption column utilizing low-cost modified nano-alumina cartridges with GSM telemetry reporting real-time ion concentrations to the district health portal.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-mono text-[#6F8381]">
                  Accredited Capstone Thesis: Grade A+ (100% Verified)
                </div>

                <Button
                  asChild
                  className="h-11 px-6 rounded-xl bg-[#4FD1C5] hover:bg-[#72E2D6] text-[#081113] font-bold text-xs gap-2 border border-[#4FD1C5]"
                >
                  <Link to="/challenges">
                    <span>Explore Similar Challenges</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
