import { useTranslation } from "react-i18next";

import { InstitutionQueue } from "@/components/institutions/InstitutionQueue";

export default function InstitutionPortal() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t("institution.portalHeading")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("institution.portalIntro")}</p>
      <div className="mt-8">
        <InstitutionQueue />
      </div>
    </div>
  );
}
