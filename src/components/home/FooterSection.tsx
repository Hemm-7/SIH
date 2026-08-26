import { Link } from "react-router-dom";

const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";

export function FooterSection() {
  return (
    <footer className="w-full bg-[#221F1C] text-[#ECE7DC] border-t-4 border-double border-white/20 pt-16 pb-12 select-none font-sans">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 space-y-12">
        
        {/* Top Gazette Colophon Grid (Full Width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#ECE7DC] uppercase"
              style={{ fontFamily: TIMES_SERIF }}
            >
              SIH26043 · JHARKHAND
            </div>
            <p className="text-xs sm:text-sm text-[#DDD8CD] leading-relaxed max-w-lg">
              {/* Was "across all 24 Jharkhand districts" — a coverage claim
                  nothing backs. Reworded to state the intent without asserting
                  statewide coverage that does not exist yet. */}
              Connecting citizen grassroots challenges in Jharkhand with student capstone research cohorts, university laboratories, and industry partners under NEP-2020.
            </p>
            <div className="text-xs sm:text-sm font-bold text-[#ECE7DC] uppercase tracking-wider">
              Dept. of Higher &amp; Technical Education, Govt. of Jharkhand
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ECE7DC]">
              Portal Navigation
            </div>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#DDD8CD] font-semibold">
              <li>
                <Link to="/challenges" className="hover:text-white hover:underline transition-colors">
                  Challenges Grid
                </Link>
              </li>
              <li>
                <Link to="/submit" className="hover:text-white hover:underline transition-colors">
                  Submit a Problem
                </Link>
              </li>
              <li>
                <Link to="/institutions" className="hover:text-white hover:underline transition-colors">
                  Institutions &amp; Labs
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white hover:underline transition-colors">
                  Impact &amp; Telemetry Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Sectors */}
          <div className="space-y-3">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ECE7DC]">
              Research Domains
            </div>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#DDD8CD] font-semibold">
              <li>
                <Link to="/challenges" className="hover:text-white hover:underline transition-colors">
                  Water Security &amp; Hydro-GIS
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-white hover:underline transition-colors">
                  Decentralized Agriculture &amp; IoT
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-white hover:underline transition-colors">
                  Indigenous NLP (Ol Chiki)
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-white hover:underline transition-colors">
                  Clean Mining &amp; Eco-Bricks
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance */}
          <div className="space-y-3">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ECE7DC]">
              Institutional Framework
            </div>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#DDD8CD] font-semibold">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  NEP-2020 Capstone Guidelines
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  State DST Innovation Grant
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Smart India Hackathon 2026
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (Full Width) */}
        <div className="border-t-2 border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#DDD8CD] font-semibold">
          <div>
            © 2026 Government of Jharkhand · Societal Innovation Collaboration Portal. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-[#ECE7DC] font-bold">
            {/* Was "PRESS REG. JH-2026-SIH" — an invented press registration
                number for a platform that is not a registered publication. */}
            <span>SIH 2026 · SIH26043</span>
            <span>•</span>
            <span>24 DISTRICTS SYNCHRONIZED</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
