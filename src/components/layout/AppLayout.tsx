import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FramerAiAgentModal } from "@/components/ai/FramerAiAgentModal";
import { motion, useScroll, useSpring } from "framer-motion";

type NavItem = { to: string; label: string; end?: boolean };

const NAV: NavItem[] = [
  { to: "/challenges", label: "Challenges" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/institutions", label: "Collaborate" },
  { to: "/dashboard", label: "Impact & Telemetry" },
];

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div
      className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-sm border border-[#2C2925]/20"
      role="group"
      aria-label={t("nav.language")}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <Button
          key={lang.code}
          size="sm"
          variant={i18n.resolvedLanguage === lang.code ? "secondary" : "ghost"}
          onClick={() => void i18n.changeLanguage(lang.code)}
          aria-pressed={i18n.resolvedLanguage === lang.code}
          className={cn(
            "h-7 px-2.5 text-xs font-sans font-bold uppercase rounded-xs transition-all",
            i18n.resolvedLanguage === lang.code
              ? "bg-[#2C2925] text-[#ECE7DC] shadow-xs"
              : "text-[#2C2925] hover:bg-black/[0.06]"
          )}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}

function AccountButton() {
  const { t } = useTranslation();
  const { user, userType, loading, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="h-11 px-4 text-xs sm:text-sm font-sans font-bold text-[#2C2925] hover:bg-black/[0.06] rounded-sm border border-[#2C2925]/20 shadow-xs"
      >
        <NavLink to="/signin">{t("auth.signIn")}</NavLink>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden font-sans text-xs sm:text-sm text-[#2C2925] font-bold md:inline">
        {user.email}
        {userType ? ` · ${userType}` : ""}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => void signOut()}
        className="h-10 px-3 text-xs sm:text-sm font-sans font-bold text-[#2C2925] hover:bg-black/[0.06] rounded-sm border border-[#2C2925]/20"
      >
        {t("auth.signOut")}
      </Button>
    </div>
  );
}

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Smooth Reading Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll listener for drop-down translucent animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Command+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsAiAgentOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-sm px-4 py-2 text-[13px] sm:text-[14px] font-sans font-bold tracking-tight transition-all",
      isActive
        ? "bg-[#2C2925] text-[#ECE7DC] shadow-xs"
        : "text-[#2C2925] hover:bg-black/[0.06]",
    );

  return (
    <div className="flex min-h-dvh flex-col bg-[#ECE7DC] text-[#2C2925] antialiased selection:bg-black/10 selection:text-[#2C2925] relative">
      
      {/* ─── ULTRA-SMOOTH READING PROGRESS BAR AT TOP ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#2C2925] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-[#2C2925] focus:px-4 focus:py-2 focus:text-[#ECE7DC] font-bold"
      >
        Skip to content
      </a>

      {/* ─── FULL-WIDTH TRANSLUCENT DROP-DOWN NAVBAR ON SCROLL ─── */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full select-none transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-[#ECE7DC]/95 backdrop-blur-md border-b-2 border-[#2C2925] shadow-[0_10px_35px_rgba(0,0,0,0.06)] translate-y-0"
            : "bg-[#ECE7DC]/85 backdrop-blur-sm border-b border-[#2C2925]/20"
        )}
      >
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 flex h-20 sm:h-22 items-center justify-between gap-6">
          
          {/* Left: Brand Wordmark (Times of India Style) */}
          <NavLink to="/" className="flex items-center gap-3.5 leading-none group shrink-0">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2C2925] uppercase flex items-center gap-2.5" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                SIH26043
                <span className="inline-flex px-2.5 py-0.5 rounded-sm bg-black/[0.06] border border-[#2C2925]/30 text-[11px] font-sans font-bold text-[#2C2925] tracking-wider">
                  JHARKHAND
                </span>
              </span>
              <span className="text-[12px] font-sans text-[#5C564E] font-semibold tracking-tight pt-1">
                Societal Innovation Collaboration Portal
              </span>
            </div>
          </NavLink>

          {/* Center Navigation Links (Enlarged Full-Width Spread) */}
          <nav className="hidden items-center gap-2 md:flex bg-black/[0.03] p-1.5 rounded-sm border border-[#2C2925]/15" aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              asChild
              size="default"
              className="h-11 sm:h-12 px-6 rounded-sm font-sans font-bold bg-[#2C2925] hover:bg-[#1E1C1A] text-[#ECE7DC] text-xs sm:text-sm tracking-tight gap-2 shadow-xs transition-all hover:scale-[1.02] border border-[#2C2925]"
            >
              <Link to="/submit">
                <PlusCircle className="h-4 w-4 text-[#ECE7DC]" />
                <span>Submit a Problem</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={() => setIsAiAgentOpen(true)}
              className="hidden lg:flex h-11 sm:h-12 px-4 rounded-sm border-2 border-[#2C2925] bg-[#FAF8F4] text-[#2C2925] hover:bg-[#2C2925] hover:text-[#ECE7DC] font-sans font-bold text-xs sm:text-sm gap-1.5 transition-all shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-inherit" />
              <span>AI Match (⌘K)</span>
            </Button>

            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <AccountButton />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-11 w-11 text-[#2C2925] hover:bg-black/[0.06] rounded-sm border border-[#2C2925]/30"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {open ? (
          <nav
            id="mobile-nav"
            className="w-full border-t-2 border-[#2C2925] p-5 md:hidden bg-[#ECE7DC] shadow-2xl space-y-3"
            aria-label="Main"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-3 sm:hidden flex items-center justify-between border-t border-[#2C2925]/20">
              <LanguageSwitcher />
            </div>
          </nav>
        ) : null}
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      {/* Floating AI Agent Trigger Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsAiAgentOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-sm bg-[#2C2925] text-[#ECE7DC] shadow-xl hover:scale-105 active:scale-95 transition-all p-3.5 border-2 border-[#2C2925] hover:bg-[#1E1C1A]"
          title="Open AI Innovation Agent (⌘K)"
        >
          <Sparkles className="h-6 w-6 text-[#ECE7DC] animate-pulse" />
        </button>
      </div>

      {/* Global AI Design Agent Modal */}
      <FramerAiAgentModal
        isOpen={isAiAgentOpen}
        onClose={() => setIsAiAgentOpen(false)}
      />
    </div>
  );
}
