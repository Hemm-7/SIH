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
    <div className="-mt-6 md:-mt-10 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden bg-[#050707]">
      {/* 1. HERO SECTION: "SOLVE WHAT MATTERS." + Human-Centered Editorial Canvas */}
      <HeroSection onOpenAgent={handleOpenAgent} />

      {/* 2. SCALE: "THOUSANDS OF PROBLEMS. ONE CONNECTED ECOSYSTEM." */}
      <StatsSection />

      {/* 3. EXPLORE PROBLEMS: "WHAT NEEDS SOLVING?" Dark Teal Panels */}
      <FeaturedProblems />

      {/* 4. JHARKHAND MAP: "WHERE DOES JHARKHAND NEED YOU?" */}
      <IndiaNeedMap />

      {/* 5. ECOSYSTEM: "EVERY PROBLEM NEEDS A DIFFERENT TEAM." */}
      <CoreConceptEcosystem />

      {/* 6. AI MATCHING (DARK TEAL): "YOU BRING THE PROBLEM. WE FIND THE PEOPLE." */}
      <AiMatchingSection onOpenAgent={handleOpenAgent} />

      {/* 7. FROM PROBLEM TO IMPACT: 7-Stage Innovation Flow */}
      <ProblemToImpactJourney />

      {/* 8. IMPACT STORIES: "FROM PROBLEM TO IMPACT." */}
      <ImpactStories />

      {/* 9. FINAL CTA (DARK TEAL): "WHAT WILL YOU SOLVE?" */}
      <FinalCtaSection />

      {/* 10. FOOTER: Minimal Dark Footer */}
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
