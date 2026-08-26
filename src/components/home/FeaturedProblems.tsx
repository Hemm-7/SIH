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
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURED_CHALLENGES = [
  {
    num: "01",
    domain: "WATER SECURITY",
    domainIcon: Droplets,
    title: "Unreliable water access & natural fluoride contamination affecting rural habitations.",
    district: "Palamu & Garhwa",
    affected: "2,400 people affected",
    collaborators: "18 potential collaborators",
    tags: ["IoT", "GIS", "Water Management", "Nano-Adsorption"],
    matchedLab: "BIT Mesra • Advanced Separation Technologies Lab",
    span: "lg:col-span-7",
  },
  {
    num: "02",
    domain: "DECENTRALIZED AGRICULTURE",
    domainIcon: Sprout,
    title: "Unpredictable irrigation & lack of solar thermal cold storage reducing tribal farmers' harvest.",
    district: "Khunti & Gumla",
    affected: "1,800 people affected",
    collaborators: "14 potential collaborators",
    tags: ["AI", "IoT", "Agriculture", "Thermal Storage"],
    matchedLab: "Birsa Agricultural University (BAU) Ranchi",
    span: "lg:col-span-5",
  },
  {
    num: "03",
    domain: "INDIGENOUS NLP & CITIZEN ACCESS",
    domainIcon: Languages,
    title: "Digital exclusion of Santhali Ol Chiki speakers in accessing public welfare schemes.",
    district: "Dumka & Santhal Parganas",
    affected: "12,000 people affected",
    collaborators: "9 potential collaborators",
    tags: ["NLP", "Speech Synthesis", "Ol Chiki OCR"],
    matchedLab: "Dept of Computer Science & Eng, BIT Mesra",
    span: "lg:col-span-5",
  },
  {
    num: "04",
    domain: "CLEAN RECYCLING & MATERIAL SCIENCE",
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
    <section className="py-24 bg-[#081113] relative overflow-hidden border-b border-white/[0.08]">
      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#6F8381]">
              Live Citizen Problem Queue
            </div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] uppercase text-[#F3F7F6] leading-[0.92]">
              WHAT NEEDS<br />
              <span className="text-[#6F8381]">SOLVING?</span>
            </h2>
          </div>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-6 rounded-xl font-bold border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-[#F3F7F6] text-xs gap-2 shrink-0 backdrop-blur-md"
          >
            <Link to="/challenges">
              <span>View All 14,286 Challenges</span>
              <ArrowRight className="h-4 w-4 text-[#4FD1C5]" />
            </Link>
          </Button>
        </div>

        {/* Large Varied Staggered Panels on Dark Surfaces */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {FEATURED_CHALLENGES.map((challenge, idx) => {
            const DIcon = challenge.domainIcon;
            return (
              <motion.div
                key={challenge.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-3xl border border-white/[0.08] bg-[#142124] p-8 sm:p-10 shadow-xl hover:border-[#4FD1C5]/30 transition-all duration-300 flex flex-col justify-between group ${challenge.span}`}
              >
                <div className="space-y-6">
                  {/* Top Meta */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <span className="font-mono text-3xl font-black text-[#6F8381] group-hover:text-[#4FD1C5] transition-colors">
                      {challenge.num}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#0D181A] font-mono text-[11px] font-bold text-[#9BAEAC] flex items-center gap-1.5 border border-white/[0.08]">
                      <DIcon className="h-3.5 w-3.5 text-[#4FD1C5]" />
                      {challenge.domain}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold text-[#6F8381] flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#4FD1C5]" />
                      {challenge.district}
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F3F7F6] leading-snug">
                      {challenge.title}
                    </h3>
                  </div>

                  {/* Affected Count & Collaborators */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#9BAEAC] font-medium font-mono">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-[#4FD1C5]" />
                      <span>{challenge.affected}</span>
                    </div>
                    <span className="text-white/20">•</span>
                    <div className="text-[#4FD1C5] font-semibold">
                      {challenge.collaborators} →
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {challenge.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-[#0D181A] text-xs font-mono text-[#9BAEAC] border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 mt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#6F8381]">
                    <Building2 className="h-4 w-4 text-[#9BAEAC] shrink-0" />
                    <span className="truncate max-w-xs text-[#9BAEAC]">{challenge.matchedLab}</span>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    className="h-10 px-5 rounded-xl bg-white/[0.06] hover:bg-[#4FD1C5] hover:text-[#081113] text-[#F3F7F6] font-bold text-xs gap-2 transition-all shrink-0 border border-white/[0.08] hover:border-[#4FD1C5]"
                  >
                    <Link to="/challenges">
                      <span>Explore</span>
                      <ArrowUpRight className="h-4 w-4" />
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
