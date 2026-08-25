import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-md py-16 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {t("error.notFound")}
      </h1>
      <Button asChild variant="outline" className="mt-6">
        <Link to="/">{t("error.backHome")}</Link>
      </Button>
    </section>
  );
}
