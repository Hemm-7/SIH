import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const PEOPLE_PILLARS = [
  {
    role: "NEP-2020 Student Cohorts",
    sub: "Interdisciplinary Capstone Teams",
    tag: "Degree Accredited",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Final-year engineering, computer science, and MBA students building functional hardware MVPs and field prototypes.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    stats: "2,400+ Active Student Innovators",
    institutes: "BIT Mesra • IIT ISM • NIT JSR",
  },
  {
    role: "University Research Faculty",
    sub: "Laboratory Directors & Mentors",
    tag: "DST & CSIR Funded",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Distinguished professors providing advanced laboratory instrumentation, spectroscopic verification, and patents.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
    stats: "140+ Faculty Principal Investigators",
    institutes: "Central Research Facility Division",
  },
  {
    role: "Rural SHGs & Gram Sabhas",
    sub: "Grassroots Community Custodians",
    tag: "Village Ownership",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Mahila Kisan Samitis, Jal Sahiyyas, and Village Panchayats who test, validate, and maintain solutions locally.",
    image: "https://images.unsplash.com/photo-1596405835955-465de5c3dfb7?auto=format&fit=crop&w=600&q=80",
    stats: "650+ Village Jal & Agri Samitis",
    institutes: "24 Jharkhand Districts",
  },
  {
    role: "Industry & CSR Innovators",
    sub: "Scale & Deployment Capital",
    tag: "Corporate R&D Partners",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Corporate innovation funds and incubators financing on-ground pilot fabrication and state technology transfer.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    stats: "₹12.4 Cr Direct Pilot Grants",
    institutes: "Tata Steel Foundation • CIL CSR",
  },
];

export function PeopleBehindSolutions() {
  return (
    <section className="py-24 bg-[#FAF9F5] relative overflow-hidden border-b border-slate-200">
      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            HUMAN-CENTERED COLLABORATION
          </div>

          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-[-0.03em] uppercase text-[#0B0F19] leading-[0.95]">
            THE PEOPLE WHO TURN<br />
            <span className="text-slate-500">PROBLEMS INTO PROGRESS.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            No innovation happens in a vacuum. Meet the multidisciplinary network of students, professors, community leaders, and industry partners solving real societal challenges.
          </p>
        </div>

        {/* Human Profile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PEOPLE_PILLARS.map((person, idx) => (
            <motion.div
              key={person.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image Frame */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${person.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md ${person.tagColor}`}>
                    {person.tag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                    {person.sub}
                  </div>
                  <div className="font-display text-lg font-extrabold text-white leading-tight">
                    {person.role}
                  </div>
                </div>
              </div>

              {/* Description & Metrics */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {person.description}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <div className="text-xs font-bold text-indigo-700 font-mono">
                    {person.stats}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {person.institutes}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
