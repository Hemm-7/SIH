import { Building2, Award, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const INSTITUTES = [
  {
    name: "BIT Mesra, Ranchi",
    tier: "Institute of Eminence / Tier-1",
    specialization: "Chemical Eng, Nano-Membranes & Environmental Labs",
    reputation: "Top Water & AI Research Facility",
  },
  {
    name: "IIT (ISM) Dhanbad",
    tier: "Institute of National Importance",
    specialization: "Mining Tech, Clean Energy & Geo-hydrology",
    reputation: "Central Research Facility (CRF)",
  },
  {
    name: "NIT Jamshedpur",
    tier: "National Institute of Technology",
    specialization: "Civil & Rural Infrastructure Engineering",
    reputation: "Kolhan Division Project Partner",
  },
  {
    name: "Birsa Agricultural University",
    tier: "State Agricultural University",
    specialization: "Post-Harvest Tech, Tribal Agro & KVK Network",
    reputation: "24 District Extension Center",
  },
  {
    name: "AIIMS Deoghar & RIMS",
    tier: "Apex Medical Research",
    specialization: "Public Health, Tele-medicine & Fluorosis Studies",
    reputation: "Santhal Pargana Clinical Network",
  },
  {
    name: "XLRI Jamshedpur",
    tier: "Premier Management School",
    specialization: "Rural Policy, SHG Economics & Social Impact",
    reputation: "NEP-2020 Policy Lab",
  },
];

export function PartnerInstitutions() {
  return (
    <section className="py-20 bg-black/40 border-t border-white/[0.08]">
      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
            <Sparkles className="h-3 w-3" />
            Academic R&amp;D Backbone
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Jharkhand Premier Partner Institutions
          </h2>
          <p className="text-sm text-slate-400">
            Research facilities and multidisciplinary student cohorts actively claiming and resolving state challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {INSTITUTES.map((inst, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/[0.08] bg-[#0c1222]/70 backdrop-blur-xl p-6 shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-slate-300 bg-white/5">
                  {inst.tier}
                </Badge>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {inst.name}
                </h3>
                <p className="text-xs font-medium text-emerald-400/90 mt-1">
                  {inst.specialization}
                </p>
              </div>

              <div className="text-xs text-slate-400 border-t border-white/[0.08] pt-3 flex items-center gap-1.5 font-mono text-[11px]">
                <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>{inst.reputation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
