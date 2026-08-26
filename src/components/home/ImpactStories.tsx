import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImpactStories } from "@/hooks/useHomepageData";

const TIMES_SERIF = "'Times New Roman', Times, 'Playfair Display', Georgia, serif";
const SMOOTH_EASE = [0.25, 0.1, 0.25, 1] as const;

const DOMAIN_LABEL: Record<string, string> = {
  education: "Education",
  agriculture: "Agriculture",
  healthcare: "Healthcare",
  water_resources: "Water Resources",
  environment: "Environment",
  energy: "Energy",
  urban_development: "Urban Development",
  accessibility: "Accessibility",
  public_administration: "Public Administration",
  rural_livelihoods: "Rural Livelihoods",
};

/*
 * PHASE 1 (fabricated-content remediation): this section was a single
 * invented case study presented as audited fact — "CASE STUDY ARCHIVE:
 * PALAMU-2025-W1", "48,000 villagers with safe water access", fluoride
 * "reduced from 5.2 ppm to 0.8 ppm", a named professor ("Prof. R. Sengupta"),
 * a funding scheme, and an "Audited by Public Health Engineering Dept (PHED)"
 * sign-off. None of it happened and none of it exists in the schema — there
 * is no case-study table, no measurement table, and no audit record.
 *
 * It now renders the real challenges that actually reached `resolved`, with
 * the citizen-confirmed ones first. The invented outcome metrics are gone
 * entirely rather than replaced: the honest "impact" facts we hold are who
 * reported it, who claimed it, and whether the original reporter confirmed
 * the fix — so that is what is shown. If nothing is resolved yet, the whole
 * section hides instead of inventing a success.
 */
export function ImpactStories() {
  const stories = useImpactStories(2);

  if (!stories || stories.length === 0) return null;

  const lead = stories[0];

  return (
    <section className="py-24 sm:py-32 bg-[#2C2925] text-[#ECE7DC] relative w-full overflow-hidden border-b-2 border-[#2C2925] font-sans">
      
      {/* Texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-25 mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper-grain)' opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 relative z-10 space-y-16">
        
        {/* Section Header with Smooth Scroll Reveal */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.45, ease: SMOOTH_EASE }}
            className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DDD8CD] transform-gpu will-change-transform"
          >
            <Award className="h-4 w-4 text-[#ECE7DC]" />
            <span>SECTION VIII · RESOLVED &amp; CITIZEN-CONFIRMED</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase text-[#ECE7DC] leading-[0.92] transform-gpu will-change-transform"
            style={{ fontFamily: TIMES_SERIF }}
          >
            FROM GROUND TRUTH<br />
            <span className="text-[#C5BEB3] italic font-normal">TO VERIFIED IMPACT.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.12, ease: SMOOTH_EASE }}
            className="text-sm sm:text-base text-[#DDD8CD] leading-relaxed max-w-3xl mx-auto transform-gpu will-change-transform"
          >
            Problems that a citizen reported here, an institution took ownership of,
            and reached resolution — shown exactly as the database records them,
            including whether the original reporter confirmed the fix themselves.
          </motion.p>
        </div>

        {/* Large Editorial Broadsheet Magazine Layout Card with Smooth Elevation */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.08, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: SMOOTH_EASE }}
          whileHover={{ y: -6 }}
          className="rounded-sm border-2 border-white/20 bg-[#383530] overflow-hidden shadow-2xl transition-all group transform-gpu will-change-transform"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Image & Metrics (5 Cols) with Subtle Parallax Zoom */}
            <div className="lg:col-span-5 relative bg-[#221F1C] p-8 sm:p-11 text-[#ECE7DC] flex flex-col justify-between overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-white/20">
              <motion.div
                className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen transition-transform duration-700 ease-out group-hover:scale-108"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb18086f7?auto=format&fit=crop&w=1000&q=80')`,
                }}
              />

              <div className="relative z-10 space-y-4">
                <span className="px-3.5 py-1 rounded-sm bg-white/10 text-[#ECE7DC] text-xs font-bold border border-white/20 inline-flex items-center gap-1.5 uppercase tracking-wider shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-[#ECE7DC]" />
                  {lead.confirmedAt ? "Confirmed by the citizen who reported it" : "Marked resolved by the institution"}
                </span>

                <div className="space-y-1.5">
                  {lead.locationText ? (
                    <div className="text-xs text-[#C5BEB3] uppercase font-bold tracking-wider">{lead.locationText}</div>
                  ) : null}
                  <h3
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#ECE7DC]"
                    style={{ fontFamily: TIMES_SERIF }}
                  >
                    {lead.title}
                  </h3>
                </div>
              </div>

              {/* The invented "48,000 villagers" / "0.8 ppm" outcome metrics
                  were removed rather than replaced — no measurement or
                  beneficiary data exists. These are the real facts on record. */}
              <div className="relative z-10 grid grid-cols-2 gap-5 pt-9 border-t border-white/15 mt-9">
                <div className="space-y-1">
                  <div
                    className="text-3xl sm:text-4xl font-extrabold text-[#ECE7DC]"
                    style={{ fontFamily: TIMES_SERIF }}
                  >
                    {lead.domain ? DOMAIN_LABEL[lead.domain] ?? lead.domain : "Uncategorised"}
                  </div>
                  <div className="text-xs text-[#C5BEB3] font-bold">Subject area assigned by the classifier</div>
                </div>
                <div className="space-y-1">
                  <div
                    className="text-3xl sm:text-4xl font-extrabold text-[#ECE7DC]"
                    style={{ fontFamily: TIMES_SERIF }}
                  >
                    {lead.confirmedAt ? "Confirmed" : "Resolved"}
                  </div>
                  <div className="text-xs text-[#C5BEB3] font-bold">
                    {lead.confirmedAt
                      ? `Reporter confirmed on ${new Date(lead.confirmedAt).toLocaleDateString()}`
                      : "Awaiting the reporter's own confirmation"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Editorial Breakdown (7 Cols) */}
            <div className="lg:col-span-7 p-8 sm:p-11 space-y-6 bg-[#383530]">
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase text-[#ECE7DC] tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ECE7DC]" />
                  01 / The Ground Challenge
                </div>
                {/* The citizen's own words, exactly as submitted. */}
                <p className="text-[#DDD8CD] text-sm sm:text-base leading-relaxed">
                  {lead.description}
                </p>
                <div className="text-xs text-[#C5BEB3] font-semibold pt-1">
                  Reported {new Date(lead.createdAt).toLocaleDateString()} ·{" "}
                  {lead.reportCount} {lead.reportCount === 1 ? "citizen report" : "citizen reports"}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase text-[#ECE7DC] tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ECE7DC]" />
                  02 / Who took it on
                </div>
                <div className="p-4 rounded-sm bg-white/10 border border-white/15 text-xs sm:text-sm text-[#ECE7DC] space-y-1">
                  {lead.claimedInstitutionName ? (
                    <>
                      <div className="font-bold">{lead.claimedInstitutionName}</div>
                      {lead.claimedInstitutionDepartment ? (
                        <div className="text-[#C5BEB3] text-xs font-semibold">{lead.claimedInstitutionDepartment}</div>
                      ) : null}
                    </>
                  ) : (
                    <div className="text-[#C5BEB3] text-xs font-semibold">
                      No institution formally claimed this one — it reached resolved without a recorded claim.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase text-[#ECE7DC] tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ECE7DC]" />
                  03 / How it ended
                </div>
                <p className="text-[#DDD8CD] text-sm sm:text-base leading-relaxed">
                  {lead.confirmedAt
                    ? "The institution marked this resolved, and the citizen who originally reported it independently confirmed the fix actually happened — the two are recorded separately on purpose, so an institution cannot sign off its own work."
                    : "An institution has marked this resolved. It is still waiting on the original reporter to confirm the fix independently, and is deliberately not counted as confirmed until they do."}
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/15">
                <div className="text-xs sm:text-sm text-[#C5BEB3] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#ECE7DC]" />
                  {/* Was "Audited by Public Health Engineering Dept (PHED)" — no
                      such audit exists. */}
                  Read directly from the live database
                </div>

                <Button
                  asChild
                  className="h-11 px-7 rounded-sm bg-[#ECE7DC] hover:bg-white text-[#2C2925] font-bold text-xs sm:text-sm gap-2 border border-white uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md group/btn"
                >
                  <Link to="/challenges">
                    <span>Read Full Case Dossier</span>
                    <ArrowRight className="h-4 w-4 text-[#2C2925] group-hover/btn:translate-x-1 transition-transform" />
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
