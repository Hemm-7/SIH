import { MapPin, Building2, Cpu, IndianRupee } from "lucide-react";

export function LiveMetricsTicker() {
  const stats = [
    {
      label: "Jharkhand Districts",
      value: "24 / 24",
      sub: "Full statewide sensor coverage",
      icon: MapPin,
      color: "text-emerald-400",
      glow: "border-emerald-500/20",
    },
    {
      label: "Partner Research Labs",
      value: "42+",
      sub: "Tier-1 Institutes & R&D Hubs",
      icon: Building2,
      color: "text-cyan-400",
      glow: "border-cyan-500/20",
    },
    {
      label: "AI Match Precision",
      value: "94.8%",
      sub: "Zero-shot NLP router accuracy",
      icon: Cpu,
      color: "text-teal-300",
      glow: "border-teal-500/20",
    },
    {
      label: "R&D Grant Pipeline",
      value: "₹12.4 Cr",
      sub: "State innovation DST funding",
      icon: IndianRupee,
      color: "text-amber-400",
      glow: "border-amber-500/20",
    },
  ];

  return (
    <section className="py-12 bg-black/60 border-y border-white/[0.08] backdrop-blur-xl">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-white/[0.02] border ${stat.glow} space-y-2 text-center sm:text-left transition-all hover:bg-white/[0.04]`}
              >
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <div className={`p-2 rounded-xl bg-black/60 border border-white/10 ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {stat.label}
                  </span>
                </div>
                <div className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-400">{stat.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
