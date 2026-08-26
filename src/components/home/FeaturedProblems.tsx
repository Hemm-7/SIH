import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Droplets,
  Sprout,
  Languages,
  Zap,
  Users,
  Building2,
  MapPin,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

const FEATURED_CHALLENGES = [
  {
    num: "01",
    domain: "Water Security",
    domainIcon: Droplets,
    title: "Unreliable water access & natural fluoride contamination affecting rural habitations.",
    district: "Palamu & Garhwa",
    affected: "2,400 people affected",
    collaborators: "18 potential collaborators",
    tags: ["IoT Telemetry", "GIS Hydrology", "Water Management", "Nano-Adsorption"],
    matchedLab: "BIT Mesra • Advanced Separation Technologies Lab",
    span: "lg:col-span-7",
  },
  {
    num: "02",
    domain: "Decentralized Agriculture",
    domainIcon: Sprout,
    title: "Unpredictable irrigation & lack of solar thermal cold storage reducing tribal farmers' harvest.",
    district: "Khunti & Gumla",
    affected: "1,800 people affected",
    collaborators: "14 potential collaborators",
    tags: ["AI Sensing", "IoT Soil", "Agriculture", "Thermal Storage"],
    matchedLab: "Birsa Agricultural University (BAU) Ranchi",
    span: "lg:col-span-5",
  },
  {
    num: "03",
    domain: "Indigenous NLP & Access",
    domainIcon: Languages,
    title: "Digital exclusion of Santhali Ol Chiki speakers in accessing public welfare schemes.",
    district: "Dumka & Santhal Parganas",
    affected: "12,000 people affected",
    collaborators: "9 potential collaborators",
    tags: ["NLP Models", "Speech Synthesis", "Ol Chiki OCR"],
    matchedLab: "Dept of Computer Science & Eng, BIT Mesra",
    span: "lg:col-span-5",
  },
  {
    num: "04",
    domain: "Clean Recycling & Materials",
    domainIcon: Zap,
    title: "Overburden slag dumps causing air pollution & requiring geopolymer eco-brick recycling.",
    district: "Dhanbad & Bokaro",
    affected: "25,000 people affected",
    collaborators: "16 potential collaborators",
    tags: ["Geopolymers", "Eco-Bricks", "Structural Testing"],
    matchedLab: "IIT (ISM) Dhanbad • CRF Geotechnical Division",
    span: "lg:col-span-7",
  },
];

export function FeaturedProblems() {
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
        
        {/* Section Header (Full Width) with Silky Smooth Scroll Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#2C2925] pb-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="space-y-3 max-w-3xl transform-gpu will-change-transform"
          >
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#2C2925]">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <FileText className="h-4 w-4 text-[#2C2925]" />
              </motion.div>
              <span>SECTION III · LIVE CITIZEN INVESTIGATION QUEUE</span>
            </div>
            <h2
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-[#2C2925] leading-[0.92]"
              style={{ fontFamily: TIMES_SERIF }}
            >
              WHAT NEEDS<br />
              <span className="text-[#5C564E] italic font-normal">SOLVING?</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE }}
            className="transform-gpu will-change-transform"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-6 rounded-sm font-sans font-bold border-2 border-[#2C2925] bg-[#FAF8F4] hover:bg-[#2C2925] hover:text-[#ECE7DC] text-[#2C2925] text-xs sm:text-sm gap-2 shrink-0 tracking-tight shadow-xs hover:scale-105 active:scale-95 transition-all uppercase group"
            >
              <Link to="/challenges">
                <span>View All 14,286 Challenges</span>
                <ArrowRight className="h-4 w-4 text-[#2C2925] group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Large Varied Staggered Broadsheet Panels (Smooth) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {FEATURED_CHALLENGES.map((challenge, idx) => {
            const DIcon = challenge.domainIcon;
            return (
              <motion.div
                key={challenge.num}
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
                transition={{ duration: 0.45, delay: idx * 0.07, ease: SMOOTH_EASE }}
                whileHover={{ y: -6, scale: 1.015 }}
                className={`relative overflow-hidden rounded-sm border-2 border-[#2C2925] bg-[#FAF8F4] p-7 sm:p-9 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-default font-sans transform-gpu will-change-transform ${challenge.span}`}
              >
                {/* Subtle top card shimmer bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#2C2925] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-4">
                  {/* Top Meta */}
                  <div className="flex items-center justify-between border-b border-[#2C2925]/15 pb-3.5">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#5C564E] group-hover:text-[#2C2925] transition-colors flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#2C2925] opacity-0 group-hover:opacity-100 transition-opacity" />
                      DOSSIER #{challenge.num}
                    </span>
                    <Badge variant="secondary" className="font-sans font-bold text-xs py-1 px-3 border border-[#2C2925]/20 bg-black/[0.04] text-[#2C2925] group-hover:bg-[#2C2925] group-hover:text-[#ECE7DC] transition-all">
                      <DIcon className="h-3.5 w-3.5 mr-1 text-inherit" />
                      {challenge.domain}
                    </Badge>
                  </div>

                  {/* Title & Location */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-[#5C564E] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#2C2925]" />
                      <span>{challenge.district}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2C2925] leading-snug group-hover:underline decoration-1 underline-offset-4 transition-all">
                      {challenge.title}
                    </h3>
                  </div>

                  {/* Affected Count & Collaborators */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#3D3831] font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#2C2925]" />
                      <span>{challenge.affected}</span>
                    </div>
                    <span className="text-[#2C2925]/30">•</span>
                    <div className="text-[#2C2925] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      {challenge.collaborators} →
                    </div>
                  </div>

                  {/* Tags with Spring Hover */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {challenge.tags.map((tag, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.06, y: -2 }}
                        className="px-2.5 py-1 rounded-sm bg-black/[0.03] text-xs font-semibold text-[#3D3831] border border-[#2C2925]/15 hover:border-[#2C2925] hover:text-[#2C2925] hover:bg-white shadow-2xs transition-all cursor-pointer"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-5 mt-5 border-t border-[#2C2925]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#3D3831] font-medium">
                    <Building2 className="h-4 w-4 text-[#2C2925] shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate max-w-md text-[#2C2925] font-bold">{challenge.matchedLab}</span>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    className="h-10 px-5 rounded-sm bg-[#2C2925] hover:bg-[#1E1C1A] text-[#ECE7DC] font-sans font-bold text-xs sm:text-sm gap-1.5 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-xs border border-[#2C2925] uppercase tracking-wider group/btn"
                  >
                    <Link to="/challenges">
                      <span>Explore Dossier</span>
                      <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
