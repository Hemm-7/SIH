import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

/*
 * The single auth form. Used by the SignIn and SignUp pages AND inline by
 * ChallengeSubmissionForm, so there is exactly one place where credentials are
 * collected and one set of error strings to keep translated.
 *
 * There is intentionally NO role picker. profiles.user_type is self-writable under
 * the current RLS (see useAuth.tsx), so offering the choice here would normalise a
 * privilege-escalation path. Institution accounts are provisioned, not claimed.
 */
export function AuthForm({
  mode,
  onSwitchMode,
  onSuccess,
  compact = false,
}: {
  mode: "signin" | "signup";
  onSwitchMode?: (next: "signin" | "signup") => void;
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSignUp = mode === "signup";
  const canSubmit = email.trim().length > 0 && password.length >= 6 && !busy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setBusy(true);
    setError(null);
    setNotice(null);

    const { error: err } = isSignUp
      ? await signUp(email.trim(), password, fullName.trim() || undefined)
      : await signIn(email.trim(), password);

    setBusy(false);

    if (err) {
      setError(err.message);
      return;
    }

    if (isSignUp) {
      // Depending on project settings a signup may need email confirmation, in which
      // case no session exists yet. Say so rather than appearing to hang.
      setNotice(t("auth.signUpMaybeConfirm"));
    }
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {isSignUp ? (
        <div className="space-y-2">
          <Label htmlFor="auth-name">{t("auth.name")}</Label>
          <Input
            id="auth-name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("auth.namePlaceholder")}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="auth-email">{t("auth.email")}</Label>
        <Input
          id="auth-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="auth-password">{t("auth.password")}</Label>
        <Input
          id="auth-password"
          type="password"
          required
          autoComplete={isSignUp ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby="auth-password-help"
        />
        <p id="auth-password-help" className="text-sm text-muted-foreground">
          {t("auth.passwordHelp")}
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p role="status" className="rounded-md border border-border bg-secondary p-3 text-sm">
          {notice}
        </p>
      ) : null}

      <Button type="submit" variant="accent" size={compact ? "default" : "lg"} disabled={!canSubmit} className="w-full">
        {busy ? <Loader2 className="animate-spin" /> : null}
        {isSignUp ? t("auth.createAccount") : t("auth.signIn")}
      </Button>

      {onSwitchMode ? (
        <p className="text-sm text-muted-foreground">
          {isSignUp ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
          <button
            type="button"
            className="font-medium text-accent underline underline-offset-4"
            onClick={() => onSwitchMode(isSignUp ? "signin" : "signup")}
          >
            {isSignUp ? t("auth.signIn") : t("auth.createAccount")}
          </button>
        </p>
      ) : null}
    </form>
  );
}
