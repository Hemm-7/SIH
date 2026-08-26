import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle, PenTool, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

export function FinalCtaSection() {
  return (
    <section className="py-28 sm:py-36 bg-[#ECE7DC] text-[#2C2925] relative w-full overflow-hidden border-b-2 border-[#2C2925] font-sans">
      
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10 text-center space-y-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.45, ease: SMOOTH_EASE }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2C2925]/30 bg-black/[0.06] text-[#2C2925] text-xs font-bold uppercase tracking-widest shadow-xs transform-gpu will-change-transform"
        >
          <PenTool className="h-4 w-4 text-[#2C2925] animate-pulse" />
          <span>SECTION IX · CALL FOR CITIZEN PROBLEMS &amp; LAB COLLABORATIONS</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE }}
          className="space-y-4 max-w-5xl mx-auto transform-gpu will-change-transform"
        >
          <h2
            className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight uppercase text-[#2C2925] leading-[0.9]"
            style={{ fontFamily: TIMES_SERIF }}
          >
            WHAT<br />
            WILL YOU<br />
            <span className="text-[#5C564E] italic font-normal">SOLVE?</span>
          </h2>

          <p className="text-sm sm:text-lg text-[#3D3831] max-w-3xl mx-auto leading-relaxed pt-2 font-medium">
            Every meaningful societal solution starts with someone willing to identify the problem and map it to scientific innovation.
          </p>
        </motion.div>

        {/* Action Buttons with Smooth Light Sweep & Scaling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.45, delay: 0.12, ease: SMOOTH_EASE }}
          className="flex flex-wrap items-center justify-center gap-5 pt-3 transform-gpu will-change-transform"
        >
          <Button
            asChild
            size="lg"
            className="relative overflow-hidden h-14 sm:h-16 px-10 sm:px-12 rounded-sm font-sans font-bold bg-[#2C2925] hover:bg-[#1E1C1A] text-[#ECE7DC] text-sm sm:text-base border-2 border-[#2C2925] gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl uppercase tracking-wider group"
          >
            <Link to="/submit">
              {/* Light Sweep Reflection */}
              <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                animate={{ translateX: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", repeatDelay: 1 }}
              />
              <PlusCircle className="h-5 w-5 text-[#ECE7DC] group-hover:rotate-90 transition-transform duration-300 relative z-10" />
              <span className="relative z-10 font-black">Submit a Problem Statement</span>
              <ArrowRight className="h-5 w-5 text-[#ECE7DC] group-hover:translate-x-1.5 transition-transform relative z-10" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 sm:h-16 px-9 sm:px-11 rounded-sm font-sans font-bold border-2 border-[#2C2925] bg-[#FAF8F4] hover:bg-[#2C2925] hover:text-[#ECE7DC] text-[#2C2925] text-xs sm:text-base gap-2.5 transition-all hover:scale-105 active:scale-95 tracking-wider uppercase shadow-md group"
          >
            <Link to="/challenges">
              <Compass className="h-5 w-5 text-inherit group-hover:rotate-45 transition-transform" />
              <span>Explore Challenges Grid</span>
            </Link>
          </Button>
        </motion.div>

        {/* Bottom Sparkle Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -20px 0px" }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="pt-6 flex items-center justify-center gap-2 text-xs font-mono text-[#5C564E] font-bold uppercase tracking-wider"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#2C2925] animate-spin-slow" />
          <span>Over 14,286 Active Problems · All 24 Jharkhand Districts</span>
        </motion.div>

      </div>
    </section>
  );
}
