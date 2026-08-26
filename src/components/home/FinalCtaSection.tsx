import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="py-32 bg-[#081113] text-[#F3F7F6] relative overflow-hidden">
      {/* Background Subtle Dark Grid */}
      <div className="absolute inset-0 framer-teal-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#4FD1C5]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[#4FD1C5] text-xs font-mono font-bold"
        >
          NEP-2020 STATEWIDE SOCIAL INNOVATION MESH
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h2 className="font-display text-6xl sm:text-8xl md:text-9xl font-black tracking-[-0.05em] uppercase text-white leading-[0.9]">
            WHAT<br />
            WILL YOU<br />
            <span className="text-[#4FD1C5]">SOLVE?</span>
          </h2>

          <p className="text-base sm:text-xl text-[#9BAEAC] max-w-2xl mx-auto leading-relaxed font-normal pt-2">
            Every meaningful solution starts with someone willing to identify the problem.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Button
            asChild
            size="lg"
            className="h-16 px-10 rounded-2xl font-bold bg-[#4FD1C5] hover:bg-[#72E2D6] text-[#081113] text-base sm:text-lg border border-[#4FD1C5] gap-3 transition-all hover:scale-105 shadow-xl shadow-teal-950/40"
          >
            <Link to="/submit">
              <span>Submit a Problem →</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-16 px-9 rounded-2xl font-bold border-white/20 hover:border-white bg-white/[0.03] hover:bg-white/[0.08] text-white text-base sm:text-lg gap-2.5 transition-all"
          >
            <Link to="/challenges">
              <PlusCircle className="h-5 w-5" />
              <span>Explore Challenges</span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
