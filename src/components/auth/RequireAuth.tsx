import { useTranslation } from "react-i18next";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth, type UserType } from "@/hooks/useAuth";

/*
 * Route guards.
 *
 * THESE ARE UX, NOT SECURITY. Verified against the live project: a signed-in citizen
 * can PATCH their own profiles.user_type to 'university' and it succeeds, because
 * "Users can update their own profile" has no column restriction. What stopped them
 * was RLS on the actual write — claiming a match returned HTTP 200 with an empty
 * body and is_claimed stayed false (Global Rule #15).
 *
 * So the point of these guards is only to avoid showing someone a page that will
 * sit there failing to load data. Every real restriction lives in RLS. Do not add
 * a client check here and treat the server side as covered.
 */

function Gate({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md py-12 text-center">{children}</div>;
}

/** Requires any signed-in user. */
export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (loading) {
    return <Gate>{t("common.loading")}</Gate>;
  }

  if (!user) {
    // Remember where they were headed so sign-in can send them back.
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

/** Requires a signed-in user whose profiles.user_type is in `allow`. */
export function RequireUserType({ allow }: { allow: UserType[] }) {
  const { user, userType, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (loading) {
    return <Gate>{t("common.loading")}</Gate>;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (!userType || !allow.includes(userType)) {
    // Not a redirect — an explanation. Bouncing someone to the home page with no
    // reason is the kind of dead end the design brief calls out.
    return (
      <Gate>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {t("auth.wrongRole.heading")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t("auth.wrongRole.body", { role: userType ?? t("auth.wrongRole.none") })}
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">{t("error.backHome")}</Link>
        </Button>
      </Gate>
    );
  }

  return <Outlet />;
}
