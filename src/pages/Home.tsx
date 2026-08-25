import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function Home() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {t("home.heading")}
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">{t("home.body")}</p>
      <Button asChild size="lg" variant="accent" className="mt-8">
        <Link to="/submit">{t("home.cta")}</Link>
      </Button>
    </section>
  );
}
