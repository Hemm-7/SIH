import { Menu, Sparkles, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { cn } from "@/lib/utils";
import { FramerAiAgentModal } from "@/components/ai/FramerAiAgentModal";

type NavItem = { to: string; label: string; end?: boolean };

const NAV: NavItem[] = [
  { to: "/challenges", label: "Challenges" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/institutions", label: "Collaborate" },
  { to: "/dashboard", label: "Impact" },
];

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.08]" role="group" aria-label={t("nav.language")}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <Button
          key={lang.code}
          size="sm"
          variant={i18n.resolvedLanguage === lang.code ? "secondary" : "ghost"}
          onClick={() => void i18n.changeLanguage(lang.code)}
          aria-pressed={i18n.resolvedLanguage === lang.code}
          className={cn(
            "h-6 px-2 text-[10px] font-mono font-semibold rounded-md transition-all",
            i18n.resolvedLanguage === lang.code
              ? "bg-[#4FD1C5] text-[#081113] shadow-sm font-bold"
              : "text-[#9BAEAC] hover:text-[#F3F7F6]"
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
      <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold text-[#9BAEAC] hover:text-white hover:bg-white/[0.05] rounded-lg">
        <NavLink to="/signin">{t("auth.signIn")}</NavLink>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden font-mono text-xs text-[#6F8381] md:inline">
        {user.email}
        {userType ? ` · ${userType}` : ""}
      </span>
      <Button variant="ghost" size="sm" onClick={() => void signOut()} className="h-8 px-2 text-xs text-[#9BAEAC] hover:text-white hover:bg-white/[0.05]">
        {t("auth.signOut")}
      </Button>
    </div>
  );
}

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);

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
      "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
      isActive
        ? "bg-white/[0.08] text-[#72E2D6] border border-[#4FD1C5]/30 shadow-sm"
        : "text-[#9BAEAC] hover:text-white hover:bg-white/[0.04]",
    );

  return (
    <div className="flex min-h-dvh flex-col bg-[#081113] text-[#F3F7F6] antialiased selection:bg-[#4FD1C5]/30 selection:text-[#72E2D6] relative">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#4FD1C5] focus:px-4 focus:py-2 focus:text-[#081113] font-bold"
      >
        Skip to content
      </a>

      {/* Seamless Transparent Enlarged Navbar floating over Hero */}
      <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-[3px] transition-all py-1">
        <div className="container mx-auto px-4 max-w-7xl flex h-20 items-center justify-between gap-4">
          {/* Left: Brand Wordmark (Enlarged) */}
          <NavLink to="/" className="flex items-center gap-3 leading-none group">
            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-xl font-black tracking-tight text-[#141414] dark:text-[#F2F0E8] uppercase flex items-center gap-2">
                SIH26043
                <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#8B2626]/10 border border-[#8B2626]/30 text-[10px] font-mono font-bold text-[#8B2626]">
                  JHARKHAND
                </span>
              </span>
              <span className="text-[11px] font-mono text-[#575249] dark:text-[#8C9B98] tracking-wider uppercase font-semibold">
                Societal Innovation Collaboration Portal
              </span>
            </div>
          </NavLink>

          {/* Center Navigation Links (Enlarged) */}
          <nav className="hidden items-center gap-1.5 md:flex bg-black/[0.04] dark:bg-white/[0.03] p-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.06]" aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                <span className="text-[13px] font-bold">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons (Enlarged) */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="default"
              className="h-10 px-5 rounded-xl font-bold bg-[#141414] hover:bg-[#2A2A2A] text-[#F4EFE6] text-xs uppercase tracking-wider gap-1.5 shadow-sm transition-all border border-[#141414]"
            >
              <Link to="/submit">
                <PlusCircle className="h-4 w-4 text-[#4FD1C5]" />
                <span>Submit a Problem</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={() => setIsAiAgentOpen(true)}
              className="hidden lg:flex h-10 px-4 rounded-xl border-black/[0.15] dark:border-white/[0.1] bg-white/[0.04] text-[#141414] dark:text-[#F3F7F6] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] font-bold text-xs gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-[#8B2626]" />
              <span>AI Match (⌘K)</span>
            </Button>

            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <AccountButton />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 text-[#9BAEAC] hover:text-white hover:bg-white/[0.05]"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {open ? (
          <nav
            id="mobile-nav"
            className="border-t border-white/[0.08] p-4 md:hidden bg-[#0D181A] shadow-2xl space-y-2"
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
            <div className="pt-2 sm:hidden flex items-center justify-between border-t border-white/[0.08] mt-2">
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
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#142124] text-[#4FD1C5] shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:scale-105 active:scale-95 transition-all p-3.5 border border-white/[0.12] hover:border-[#4FD1C5]"
          title="Open AI Innovation Agent (⌘K)"
        >
          <Sparkles className="h-6 w-6 animate-pulse" />
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
