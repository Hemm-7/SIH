import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { strataColorForStatus } from "@/lib/strataStatusMap";

/*
 * design-brief.md pass for this page:
 *
 * Rejected the universal default — a floating centred card on a gradient. It says
 * nothing and looks like every other product.
 *
 * Chosen: a split where the left column answers the question a citizen actually has
 * at this exact moment ("why do you want my email for reporting a broken handpump?")
 * in plain language, and the right column is the form. On mobile it stacks with the
 * form first, so the friction is not pushed below a wall of text on a phone.
 *
 * One page serves both audiences — a citizen reporting a problem and institution
 * staff signing in — because the copy explains the account's purpose rather than
 * addressing a role.
 */
export default function SignIn({ initialMode = "signin" }: { initialMode?: "signin" | "signup" }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const reasons = [
    t("auth.why.follow"),
    t("auth.why.contact"),
    t("auth.why.duplicate"),
  ];

  return (
    <div className="grid gap-10 py-6 lg:grid-cols-2 lg:gap-16">
      {/* Form first in DOM order so mobile users reach it without scrolling past prose. */}
      <div className="order-1 lg:order-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {mode === "signup" ? t("auth.createAccount") : t("auth.signIn")}
        </h1>
        {/* Instruction copy for completing sign-in — functional, so it keeps
            real contrast rather than the decorative muted-foreground tone. */}
        <p className="mt-2 text-foreground/70">
          {mode === "signup" ? t("auth.signUpIntro") : t("auth.signInIntro")}
        </p>
        <div className="mt-6 max-w-md">
          <AuthForm mode={mode} onSwitchMode={setMode} />
        </div>
      </div>

      <aside className="order-2 lg:order-1">
        <h2 className="font-display text-xl font-semibold">{t("auth.why.heading")}</h2>
        <ul className="mt-4 space-y-4">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-3">
              {/* Ore-toned stratum marker, tying back to the lifecycle bands. */}
              <span
                aria-hidden
                className="mt-1 h-full w-1 shrink-0"
                style={{ backgroundColor: strataColorForStatus("submitted") }}
              />
              {/* foreground/70, not muted-foreground: this is the copy that
                  persuades a hesitant citizen to create an account, so it sits
                  on the functional side of the low-contrast carve-out. */}
              <span className="text-foreground/70">{reason}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">{t("auth.why.institutionNote")}</p>
      </aside>
    </div>
  );
}
