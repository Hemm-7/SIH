import { Menu } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { cn } from "@/lib/utils";

type NavItem = { to: string; labelKey: string; end?: boolean };

const NAV: NavItem[] = [
  // `end` only on the index route — without it "/" matches every path and the
  // Home link renders as active everywhere.
  { to: "/", labelKey: "nav.home", end: true },
  { to: "/challenges", labelKey: "nav.challenges" },
  { to: "/submit", labelKey: "nav.submit" },
  { to: "/institutions", labelKey: "nav.institutions" },
  { to: "/dashboard", labelKey: "nav.dashboard" },
];

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("nav.language")}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <Button
          key={lang.code}
          size="sm"
          variant={i18n.resolvedLanguage === lang.code ? "secondary" : "ghost"}
          onClick={() => void i18n.changeLanguage(lang.code)}
          aria-pressed={i18n.resolvedLanguage === lang.code}
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
      <Button asChild variant="outline" size="sm">
        <NavLink to="/signin">{t("auth.signIn")}</NavLink>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Role shown because it changes which pages work — a user bounced from the
          institution portal should be able to see why without guessing. */}
      <span className="hidden font-mono text-xs text-muted-foreground md:inline">
        {user.email}
        {userType ? ` · ${userType}` : ""}
      </span>
      <Button variant="ghost" size="sm" onClick={() => void signOut()}>
        {t("auth.signOut")}
      </Button>
    </div>
  );
}

export function AppLayout() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-secondary text-secondary-foreground"
        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
    );

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Keyboard users shouldn't have to tab the whole nav on every page. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <NavLink to="/" className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight">
              {t("app.name")}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t("app.tagline")}
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <AccountButton />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Menu"
            >
              <Menu />
            </Button>
          </div>
        </div>

        {open ? (
          <nav
            id="mobile-nav"
            className="container flex flex-col gap-1 border-t border-border py-3 lg:hidden"
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
                {t(item.labelKey)}
              </NavLink>
            ))}
            <div className="pt-2 sm:hidden">
              <LanguageSwitcher />
            </div>
          </nav>
        ) : null}
      </header>

      <main id="main" className="container flex-1 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6">
        <div className="container text-sm text-muted-foreground">
          Department of Higher &amp; Technical Education, Government of Jharkhand
        </div>
      </footer>
    </div>
  );
}
