import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Command, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FramerAiCommandBarProps {
  onOpenAgent: (initialQuery?: string) => void;
}

const PLACEHOLDER_PROMPTS = [
  "Solar cold storage for tribal tomato farmers in Khunti...",
  "AI drone drops for antivenom & maternal medicines in Latehar...",
  "Groundwater fluoride nano-adsorption filtration in Palamu...",
  "Santhali Ol Chiki speech-to-text NLP assistant in Dumka...",
  "Saranda forest fire early thermal satellite alert system...",
  "Low-carbon eco-bricks from Dhanbad coal overburden slag...",
];

export function FramerAiCommandBar({ onOpenAgent }: FramerAiCommandBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    const fullText = PLACEHOLDER_PROMPTS[placeholderIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, 45);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2500);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, 20);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, placeholderIndex]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputVal.trim() || currentText;
    onOpenAgent(query);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Floating Framer-style Glowing Command Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-accent/50 via-emerald-500/40 to-blue-500/50 shadow-2xl shadow-accent/15"
      >
        <div className="relative flex flex-col sm:flex-row items-center gap-2 rounded-[15px] bg-card/95 backdrop-blur-xl p-2 sm:p-2.5 border border-border/60">
          <div className="flex items-center gap-2 pl-3 flex-1 w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
              <Sparkles className="h-4 w-4 animate-pulse text-accent" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={currentText || "Describe any societal challenge in Jharkhand..."}
              className="w-full bg-transparent py-2.5 text-sm sm:text-base font-medium text-foreground focus:outline-none placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/60 text-[11px] font-mono text-muted-foreground border border-border/50">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
            <Button
              type="button"
              onClick={() => handleSubmit()}
              size="default"
              className="w-full sm:w-auto h-11 px-5 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md shadow-accent/25 transition-all gap-2 group-hover:scale-[1.02]"
            >
              <span>Ask AI Design Agent</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Suggested Quick Triggers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
      >
        <span className="flex items-center gap-1 font-medium text-[11px]">
          <Zap className="h-3 w-3 text-amber-500" /> Popular R&amp;D Tracks:
        </span>
        {[
          { label: "Palamu Fluoride Filter", query: "Groundwater fluoride nano-adsorption filtration in Palamu" },
          { label: "Khunti Solar Cold Storage", query: "Solar cold storage for tribal tomato farmers in Khunti" },
          { label: "Santhali Voice AI", query: "Santhali Ol Chiki speech-to-text NLP assistant in Dumka" },
          { label: "Saranda Forest Fire Alert", query: "Saranda forest fire early thermal satellite alert system" },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => onOpenAgent(item.query)}
            className="rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-medium text-foreground hover:bg-accent/15 hover:border-accent/50 transition-all hover:scale-105"
          >
            {item.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
