import { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedProblems } from "@/components/home/FeaturedProblems";
import { IndiaNeedMap } from "@/components/home/IndiaNeedMap";
import { CoreConceptEcosystem } from "@/components/home/CoreConceptEcosystem";
import { AiMatchingSection } from "@/components/home/AiMatchingSection";
import { ProblemToImpactJourney } from "@/components/home/ProblemToImpactJourney";
import { ImpactStories } from "@/components/home/ImpactStories";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { FooterSection } from "@/components/home/FooterSection";
import { FramerAiAgentModal } from "@/components/ai/FramerAiAgentModal";

export default function Home() {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [initialAgentQuery, setInitialAgentQuery] = useState("");

  const handleOpenAgent = (query?: string) => {
    setInitialAgentQuery(query || "");
    setIsAgentOpen(true);
  };

  return (
    <div className="w-full overflow-hidden bg-[#F4EFE6] text-[#141414]">
      {/* 1. HERO SECTION: "BUILDING SOLUTIONS FOR A BETTER TOMORROW" Broadsheet */}
      <HeroSection onOpenAgent={handleOpenAgent} />

      {/* 2. SCALE: "THOUSANDS OF PROBLEMS. ONE CONNECTED ECOSYSTEM." */}
      <StatsSection />

      {/* 3. EXPLORE PROBLEMS: "WHAT NEEDS SOLVING?" Editorial Panels */}
      <FeaturedProblems />

      {/* 4. JHARKHAND MAP: "WHERE DOES JHARKHAND NEED YOU?" */}
      <IndiaNeedMap />

      {/* 5. ECOSYSTEM: "EVERY PROBLEM NEEDS A DIFFERENT TEAM." */}
      <CoreConceptEcosystem />

      {/* 6. AI MATCHING: "YOU BRING THE PROBLEM. WE FIND THE PEOPLE." */}
      <AiMatchingSection onOpenAgent={handleOpenAgent} />

      {/* 7. FROM PROBLEM TO IMPACT: 7-Stage Innovation Flow */}
      <ProblemToImpactJourney />

      {/* 8. IMPACT STORIES: "FROM PROBLEM TO IMPACT." */}
      <ImpactStories />

      {/* 9. FINAL CTA: "WHAT WILL YOU SOLVE?" */}
      <FinalCtaSection />

      {/* 10. FOOTER: Broadsheet Gazette Colophon */}
      <FooterSection />

      {/* Global AI Match Modal */}
      <FramerAiAgentModal
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
        initialPrompt={initialAgentQuery}
      />
    </div>
  );
}
