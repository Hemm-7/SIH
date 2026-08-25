import type { Json } from "@/integrations/supabase/types";

/*
 * contracts.md "Known schema/TypeScript boundary notes": photo_urls and
 * expertise_tags are JSONB and generate as `Json | null`, and institution_type is
 * a TEXT CHECK column that generates as `string`, not the narrower union the
 * contract describes. Postgres/TS limitation, not a defect — narrow at the
 * boundary instead of hand-editing generated types. Centralised here so every
 * task that reads these columns narrows the same way.
 */

export function asStringArray(json: Json | null | undefined): string[] {
  return Array.isArray(json) ? json.filter((v): v is string => typeof v === "string") : [];
}

export type InstitutionType = "university" | "industry";

export function asInstitutionType(value: string): InstitutionType {
  return value === "industry" ? "industry" : "university";
}
