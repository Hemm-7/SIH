import { useTranslation } from "react-i18next";

import { ChallengeDashboard } from "@/components/dashboard/ChallengeDashboard";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t("dashboard.heading")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("dashboard.intro")}</p>
      <div className="mt-8">
        <ChallengeDashboard />
      </div>
    </div>
  );
}
