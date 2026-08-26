import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  Building2,
  Cpu,
  GraduationCap,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Copy,
  ArrowRight,
  RefreshCw,
  Sliders,
  Flame,
  Droplets,
  Bot,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PRESET_PROMPTS,
  type SolutionBlueprint,
  generateFramerAiBlueprint,
} from "./framerAiData";

interface FramerAiAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export function FramerAiAgentModal({
  isOpen,
  onClose,
  initialPrompt = "",
}: FramerAiAgentModalProps) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [blueprint, setBlueprint] = useState<SolutionBlueprint | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "institutions" | "nep" | "timeline">("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setPrompt(initialPrompt);
      handleGenerate(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const generationSteps = [
    "Vectorizing Problem Context via Zero-Shot NLP...",
    "Querying Jharkhand Academic Knowledge Base...",
    "Matching Specialized Research Labs (BIT, IIT ISM, BAU)...",
    "Generating NEP-2020 Multidisciplinary R&D Blueprint...",
  ];

  const handleGenerate = (queryToRun?: string) => {
    const q = queryToRun || prompt;
    if (!q.trim()) return;

    setIsGenerating(true);
    setBlueprint(null);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev >= generationSteps.length - 1) {
          clearInterval(stepInterval);
          setIsGenerating(false);
          const generated = generateFramerAiBlueprint(q);
          setBlueprint(generated);
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#14b8a6", "#10b981", "#3b82f6"],
          });
          return prev;
        }
        return prev + 1;
      });
    }, 450);
  };

  const handleCopyBlueprint = () => {
    if (!blueprint) return;
    const text = `
# ${blueprint.title}
**Domain:** ${blueprint.domain} (${blueprint.subDomain}) | **District:** ${blueprint.district}
**Severity Index:** ${blueprint.severityScore}/10 | **Estimated Reach:** ${blueprint.impactReach}
**Budget Estimate:** ${blueprint.estimatedBudget} | **Timeline:** ${blueprint.timelineMonths} Months

## Problem Summary
${blueprint.summary}

## Top Matched Academic Institutions
${blueprint.matchedInstitutions.map((inst, i) => `${i + 1}. **${inst.name}** (${inst.department}) - Match: ${inst.matchScore}%\n   - *Recommended Lab:* ${inst.recommendedLab}\n   - *Rationale:* ${inst.rationale}`).join("\n")}

## NEP-2020 R&D Blueprint
- **Student Roles:** ${blueprint.nepTrack.studentRoles.join(", ")}
- **Academic Credits:** ${blueprint.nepTrack.academicCredits}
- **Mentor Department:** ${blueprint.nepTrack.facultyMentorDepartment}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeployToChallenge = () => {
    if (!blueprint) return;
    onClose();
    navigate("/submit", {
      state: {
        prefillTitle: blueprint.title,
        prefillDescription: `${blueprint.summary}\n\nKey Deliverables:\n- ${blueprint.keyDeliverables.join("\n- ")}`,
        prefillDistrict: blueprint.district,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl rounded-2xl">
        {/* Header Glow & Title */}
        <div className="relative p-6 pb-4 border-b border-border/60 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md shadow-accent/20">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
                  Framer AI Innovation Agent
                  <Badge variant="glow" className="text-[10px] uppercase font-mono py-0.5">
                    Jharkhand R&amp;D Grid
                  </Badge>
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Describe any societal problem or R&amp;D project — AI designs the solution architecture and matches university labs in real time.
                </p>
              </div>
            </div>
          </div>

          {/* AI Prompt Input Bar */}
          <div className="mt-4 relative">
            <div className="relative flex items-center rounded-xl border border-accent/40 bg-card shadow-inner focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all">
              <Search className="ml-3.5 h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="e.g., Solar cold storage for tribal tomato farmers in Khunti..."
                className="w-full bg-transparent px-3 py-3 text-sm focus:outline-none placeholder:text-muted-foreground/70"
              />
              <Button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                size="sm"
                className="mr-1.5 h-8 gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground font-medium shadow-sm transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate Blueprint
                  </>
                )}
              </Button>
            </div>

            {/* Quick Prompt Pills */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Flame className="h-3 w-3 text-amber-500" /> Presets:
              </span>
              {PRESET_PROMPTS.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p.query);
                    handleGenerate(p.query);
                  }}
                  className="rounded-full border border-border/80 bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-accent/15 hover:border-accent/40 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[62vh] overflow-y-auto space-y-5">
          {/* Generation Loader Animation */}
          {isGenerating && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                <Bot className="h-7 w-7 text-accent animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold text-foreground font-display">
                  {generationSteps[generationStep]}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Analyzing 40+ Jharkhand academic research centers &amp; NEP-2020 curriculum guidelines...
                </p>
              </div>
              <div className="flex gap-1.5 pt-2">
                {generationSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i <= generationStep ? "w-8 bg-accent" : "w-2 bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State / Initial View */}
          {!isGenerating && !blueprint && (
            <div className="py-10 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary border border-border">
                <Sliders className="h-6 w-6 text-accent" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-semibold font-display">
                  Framer AI Societal Architecture Canvas
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select a preset challenge or type your local problem above to instantly produce an institutional matching matrix, hardware/software specifications, and student capstone track.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left max-w-2xl mx-auto">
                <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Droplets className="h-3.5 w-3.5 text-blue-500" />
                    Water &amp; Health
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    De-fluoridation, arsenic filters, and rural piped water monitoring.
                  </p>
                </div>
                <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Building2 className="h-3.5 w-3.5 text-emerald-500" />
                    Tribal Agro-Tech
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Off-grid cold chain, lac processing, and minor forest produce logistics.
                  </p>
                </div>
                <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Cpu className="h-3.5 w-3.5 text-purple-500" />
                    NLP &amp; Indigenous AI
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Santhali (Ol Chiki), Ho, Mundari speech synthesis and citizen access bots.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Solution Blueprint */}
          {!isGenerating && blueprint && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Header Title & Key Badges */}
              <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-card via-card to-accent/5 p-4 shadow-sm space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="glow" className="font-mono text-[11px]">
                      {blueprint.domain}
                    </Badge>
                    <Badge variant="outline" className="text-[11px]">
                      📍 {blueprint.district}
                    </Badge>
                    <Badge variant="amber" className="text-[11px]">
                      🔥 Severity {blueprint.severityScore}/10
                    </Badge>
                  </div>
                  <div className="text-xs font-mono font-medium text-muted-foreground">
                    Reach: <span className="text-foreground font-semibold">{blueprint.impactReach}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-display text-foreground leading-snug">
                  {blueprint.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {blueprint.summary}
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-border gap-2 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-2 px-2 border-b-2 transition-all ${
                    activeTab === "overview"
                      ? "border-accent text-accent font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ✨ Problem Architecture
                </button>
                <button
                  onClick={() => setActiveTab("institutions")}
                  className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "institutions"
                      ? "border-accent text-accent font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Matched University Labs ({blueprint.matchedInstitutions.length})
                </button>
                <button
                  onClick={() => setActiveTab("nep")}
                  className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "nep"
                      ? "border-accent text-accent font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  NEP-2020 Student Track
                </button>
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "timeline"
                      ? "border-accent text-accent font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Milestones &amp; Budget
                </button>
              </div>

              {/* Tab 1: Problem Overview */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-destructive" />
                      Identified Root Causes
                    </h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {blueprint.rootCauses.map((rc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-accent font-mono text-[10px] mt-0.5">•</span>
                          <span>{rc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Core R&amp;D Deliverables
                    </h4>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {blueprint.keyDeliverables.map((kd, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-mono text-[10px] mt-0.5">✓</span>
                          <span>{kd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-2 rounded-xl border border-border/80 bg-secondary/30 p-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-accent" />
                      <span className="text-xs font-medium text-foreground">Suggested Tech Stack:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {blueprint.techStack.map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-[11px] bg-background">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Matched Institutions */}
              {activeTab === "institutions" && (
                <div className="space-y-3">
                  {blueprint.matchedInstitutions.map((inst, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/80 bg-card p-4 shadow-sm hover:border-accent/50 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent font-mono text-xs font-bold">
                            #{idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold font-display text-foreground">
                              {inst.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">{inst.department}</p>
                          </div>
                        </div>
                        <Badge variant="glow" className="font-mono text-xs">
                          {inst.matchScore}% Match Fit
                        </Badge>
                      </div>

                      <div className="bg-secondary/40 rounded-lg p-2.5 text-xs space-y-1">
                        <div className="text-muted-foreground">
                          <span className="font-semibold text-foreground">🔬 Facility:</span> {inst.recommendedLab}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-semibold text-foreground">💡 Matching Rationale:</span> {inst.rationale}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {inst.expertise.map((exp, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: NEP-2020 Student Track */}
              {activeTab === "nep" && (
                <div className="rounded-xl border border-border/80 bg-card p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold font-display flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-accent" />
                      NEP-2020 Multi-Disciplinary Integration Plan
                    </h4>
                    <Badge variant="outline" className="font-mono text-xs bg-accent/10 text-accent border-accent/30">
                      {blueprint.nepTrack.academicCredits}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Under the National Education Policy 2020, university students work in cross-departmental cohorts under faculty mentorship to solve this ground challenge for real course credit.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-foreground">Assigned Student Cohort Roles:</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {blueprint.nepTrack.studentRoles.map((role, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-border bg-secondary/30 p-2.5 text-xs font-medium text-foreground"
                        >
                          👤 {role}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground border-t border-border pt-3">
                    <span className="font-semibold text-foreground">Lead Academic Department:</span>{" "}
                    {blueprint.nepTrack.facultyMentorDepartment}
                  </div>
                </div>
              )}

              {/* Tab 4: Timeline & Budget */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
                        Estimated R&amp;D Budget
                      </div>
                      <div className="text-base font-bold font-mono text-foreground">
                        {blueprint.estimatedBudget}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        Deployment Timeline
                      </div>
                      <div className="text-base font-bold font-mono text-foreground">
                        {blueprint.timelineMonths} Months
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground">Phased Milestone Tracker</h4>
                    <div className="space-y-2">
                      {blueprint.phases.map((ph, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-border bg-card p-3 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="font-semibold text-foreground">{ph.phase}</div>
                            <div className="text-muted-foreground">{ph.milestone}</div>
                          </div>
                          <Badge variant="secondary" className="font-mono text-[10px] shrink-0">
                            {ph.duration}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        {blueprint && !isGenerating && (
          <div className="p-4 border-t border-border bg-card flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyBlueprint}
              className="gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Markdown Brief
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleGenerate()}
                className="gap-1 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={handleDeployToChallenge}
                className="gap-1.5 text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20"
              >
                Publish Challenge to Grid
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
