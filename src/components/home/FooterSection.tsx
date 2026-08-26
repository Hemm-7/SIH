import { Link } from "react-router-dom";

export function FooterSection() {
  return (
    <footer className="bg-[#0D181A] text-[#F3F7F6] border-t border-white/[0.08] pt-16 pb-12">
      <div className="container mx-auto px-4 max-w-7xl space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-display text-xl font-black tracking-tight text-[#F3F7F6] uppercase">
              Societal Innovation
            </div>
            <p className="text-xs text-[#9BAEAC] leading-relaxed max-w-sm">
              Connecting citizen ground problems across all 24 Jharkhand districts with students, researchers, universities, and industry partners under NEP-2020.
            </p>
            <div className="text-xs font-mono text-[#6F8381]">
              Dept. of Higher &amp; Technical Education, Govt. of Jharkhand
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3F7F6]">
              Platform
            </div>
            <ul className="space-y-2 text-xs text-[#9BAEAC]">
              <li>
                <Link to="/challenges" className="hover:text-[#4FD1C5] transition-colors">
                  Challenges
                </Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-[#4FD1C5] transition-colors">
                  Submit a Problem
                </Link>
              </li>
              <li>
                <Link to="/institutions" className="hover:text-[#4FD1C5] transition-colors">
                  Institutions &amp; Labs
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#4FD1C5] transition-colors">
                  Impact &amp; Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Sectors */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3F7F6]">
              Domains
            </div>
            <ul className="space-y-2 text-xs text-[#9BAEAC]">
              <li>
                <Link to="/challenges" className="hover:text-[#4FD1C5] transition-colors">
                  Water Security
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-[#4FD1C5] transition-colors">
                  Decentralized Agriculture
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-[#4FD1C5] transition-colors">
                  Indigenous NLP
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-[#4FD1C5] transition-colors">
                  Clean Mining &amp; Recycling
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#F3F7F6]">
              Initiative
            </div>
            <ul className="space-y-2 text-xs text-[#9BAEAC]">
              <li>
                <span className="hover:text-[#4FD1C5] transition-colors cursor-pointer">
                  NEP-2020 Capstone Guidelines
                </span>
              </li>
              <li>
                <span className="hover:text-[#4FD1C5] transition-colors cursor-pointer">
                  State DST Innovation Scheme
                </span>
              </li>
              <li>
                <span className="hover:text-[#4FD1C5] transition-colors cursor-pointer">
                  Smart India Hackathon 2026
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F8381] font-mono">
          <div>
            © 2026 Societal Innovation Collaboration Portal — Jharkhand. SIH 2026.
          </div>
          <div>
            Aligned with National Education Policy (NEP 2020)
          </div>
        </div>
      </div>
    </footer>
  );
}
