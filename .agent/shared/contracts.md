# Contracts — Single Source of Truth

## File Structure

```
src/
  components/
    challenges/
      ChallengeSubmissionForm.tsx   # citizen submission: text + photo + geolocation — BUILT (Task 2)
      PipelineStrata.tsx             # status-pipeline visualization, extracted from Task 2's
                                      # progress display — BUILT. Task 3/7 should reuse this,
                                      # not build a separate status-pipeline component.
      ChallengeCard.tsx              # single challenge display, incl. match_reason
      ChallengeFeed.tsx               # public feed — same shape as Community.tsx
      ChallengeMap.tsx                # Leaflet, clusters duplicates by location
      MatchExplainer.tsx              # renders match_reason + confidence badge
    institutions/
      InstitutionQueue.tsx            # matched-challenges list for a logged-in institution
      ClaimButton.tsx                 # calls UPDATE on challenge_matches.is_claimed
    dashboard/
      ChallengeDashboard.tsx          # government-facing analytics (extends existing Dashboard.tsx)
  pages/
    Challenges.tsx                    # public challenge feed + map page
    InstitutionPortal.tsx             # institution-role landing page
  integrations/supabase/
    types.ts                          # regenerated after migration is applied

supabase/
  migrations/
    20260825120000_societal_challenges.sql   # ALREADY WRITTEN — do not modify without flagging Claude
  functions/
    categorize-challenge/index.ts     # Codex owns this
    match-institutions/index.ts       # Codex owns this
    detect-duplicates/index.ts        # Codex owns this (stretch — see Phase notes)
  seed/
    institutions.json                 # Claude Code owns this — 15-20 fictitious entries
```

## API Endpoints (Supabase Edge Functions)

### POST /functions/v1/categorize-challenge
Request:
```json
{ "challengeId": "uuid", "description": "string" }
```
Response:
```json
{ "success": true, "result": { "domain": "water_resources", "confidence": 0.87 } }
```
`domain` must be one of the 10 values in `public.challenge_domain` (see migration).
On success with a valid `challengeId`, persists `domain` + `domain_confidence` to
the `challenges` row — same ownership-check pattern as `classify-condition`
(caller's own JWT establishes identity; service-role write is scoped to rows
the caller owns via `submitted_by`).

### POST /functions/v1/match-institutions
Request:
```json
{ "challengeId": "uuid", "description": "string", "domain": "water_resources" }
```
Response:
```json
{
  "success": true,
  "matches": [
    { "institutionId": "uuid", "score": 0.91, "reason": "water resources, civil infrastructure" },
    { "institutionId": "uuid", "score": 0.74, "reason": "rural development, public works" }
  ]
}
```
Fetches candidate institutions (filtered by seeded `institutions.expertise_tags`),
runs zero-shot classification with institution names/departments as
`candidate_labels`, returns top 3 ranked, and inserts rows into
`challenge_matches` including a non-empty `match_reason` per Global Rule #9.

### POST /functions/v1/detect-duplicates (STRETCH — only after MVP modules complete)
Request:
```json
{ "challengeId": "uuid", "lat": 23.35, "lon": 85.33, "description": "string" }
```
Response:
```json
{ "duplicateOf": "uuid | null", "clusterSize": 3 }
```
Do not start this until both MVP edge functions are COMPLETE and reviewed.

## Shared Data Schemas (TypeScript, must match the migration exactly)

```typescript
type ChallengeDomain =
  | "education" | "agriculture" | "healthcare" | "water_resources"
  | "environment" | "energy" | "urban_development" | "accessibility"
  | "public_administration" | "rural_livelihoods";

type ChallengeStatus = "submitted" | "ai_matched" | "claimed" | "in_progress" | "resolved";

interface Challenge {
  id: string;
  submitted_by: string | null;
  title: string;
  description: string;
  domain: ChallengeDomain | null;
  domain_confidence: number | null;
  photo_urls: string[];
  lat: number | null;
  lon: number | null;
  location_text: string | null;
  status: ChallengeStatus;
  duplicate_of: string | null;
  report_count: number;
  created_at: string;
  updated_at: string;
}

interface Institution {
  id: string;
  admin_user_id: string | null;
  name: string;
  department: string | null;
  institution_type: "university" | "industry";
  expertise_tags: string[];
  contact_email: string | null;
  created_at: string;
}

interface ChallengeMatch {
  id: string;
  challenge_id: string;
  institution_id: string;
  match_score: number;
  match_reason: string;      // NEVER empty — see Global Rule #9
  is_claimed: boolean;
  claimed_at: string | null;
  created_at: string;
}
```

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `HUGGINGFACE_API_KEY` | Supabase secret | Auth for both edge functions' HF calls |
| `SUPABASE_URL` | Edge function env (auto) | Service-role + anon client construction |
| `SUPABASE_ANON_KEY` | Edge function env (auto) | Caller-identity client (see classify-condition pattern) |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge function env (auto) | Scoped writes bypassing RLS |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Frontend `.env` | Client-side Supabase connection |

## ✅ RESOLVED — Project Location & Database Isolation

**User decision (confirmed): SIH26043 uses a genuinely separate, fresh
Supabase project. It does NOT share a database with the tourism app.**

Action required before any more work proceeds:
1. A new Supabase project must be created (new project ref, new URL/keys).
2. `20260825120000_societal_challenges.sql` and
   `20260825130000_fix_challenge_matches_claim_rls.sql` are applied there,
   as the first migrations in a clean history — not layered onto the
   tourism app's existing schema.
3. `types.ts` is regenerated against the NEW project. Any types generated
   against `hjduluddbxgyynrnqpay` are stale and must not be used.
4. `institutions.json` is (re-)loaded into the new project's `institutions`
   table — the earlier load, if any was attempted, was against the wrong
   project.
5. **The "reuse the base repo" instruction is narrowed, effective now.** Do
   NOT copy the tourism app's repo wholesale into this project again — that
   is what caused the entanglement (the copied repo's `config.toml` was
   already linked to the shared project). Only these specific patterns are
   in scope for reuse, copied individually:
   - `profiles` table + `user_type` role pattern (recreate the enum fresh
     here, including `university`/`industry` from day one — no need to
     replicate the shared project's leftover irreversible ADD VALUE)
   - `Dashboard.tsx` + Recharts pattern
   - `Community.tsx` component shape
   - The `classify-condition` edge function pattern (already present in
     `reference/classify-condition-REFERENCE-PATTERN.ts` in this workspace)

   Nothing else — no TripGenie, VR tours, Funscapes, GenZ corner, bookings —
   should exist anywhere in this project's file tree, not present-but-
   forbidden. Global Rule #11 means genuinely absent, not copied-and-ignored.

## Migration order for the fresh project (do not skip step 1)

`societal_challenges.sql` references `public.profiles` and runs
`ALTER TYPE public.user_type ADD VALUE`. Neither exists on a brand-new
Supabase project. Apply in this order:

1. The `profiles` table + `user_type` enum creation ONLY, extracted from the
   base repo's original migration (`20250908161514_...sql`) — just those two
   objects (and any `auth.users` signup trigger it defines, if present), not
   the heritage/travel_packages/bookings/reviews/community_posts tables,
   which this project has no use for and should not carry forward.
2. `20260825120000_societal_challenges.sql`
3. `20260825130000_fix_challenge_matches_claim_rls.sql`

If step 1 is skipped, step 2 will fail outright with a missing-relation or
missing-type error — that's expected and means step 1 wasn't done, not a bug
in the migration itself.

The residual `user_type` enum extension on the shared tourism project
(`hjduluddbxgyynrnqpay`) is harmless and does not need to be reverted —
unused additional enum values don't affect that app. Just do not build
anything further against that project.

## Institution `expertise_tags` convention (ratified)

Resolves an ambiguity between this file (implied a machine-readable filter
key) and codex.md (implied free-text classifier input) — it's both, in a
fixed order:

```json
"expertise_tags": [
  "water_resources", "environment",
  "watershed management", "groundwater recharge", "river basin hydrology"
]
```

1. Leading tags that are exact `challenge_domain` enum values → use these to
   filter candidate institutions before classification.
2. Remaining tags are free-text specializations → join with `name` +
   `department` into the string passed as a `candidate_label` to the zero-shot
   classifier.

Every seeded institution's first tag is guaranteed to be a valid
`challenge_domain` value. `match-institutions` must rely on this ordering.

## Displaying match confidence — do not render raw scores as "% confidence"

Zero-shot classification splits probability mass across every candidate
label, so realistic top-1 scores land around 0.30-0.40 even for a genuinely
correct match — a raw score display (e.g. "34% confidence") reads as "the AI
is unsure" when it may not be. `MatchExplainer.tsx` (Task 3) must bucket
scores into qualitative tiers instead, roughly:
- ≥ 0.5 → "Strong match"
- 0.25–0.5 → "Likely match"
- < 0.25 → "Possible match" (and consider visually de-emphasizing rather
  than presenting with equal confidence to the top result)
Exact thresholds can be tuned once more real test data exists, but the
principle is fixed: never show the bare float as a percentage.

## Honest match_reason fallback (found via real testing, not theoretical)

Real testing surfaced a case where the description shares no real overlap
with any specialization tag. The function must NOT fall back to printing
arbitrary tags and presenting them as if they were the reason — that
produces a confident-sounding but non-sequitur explanation, which is worse
than admitting uncertainty. When no genuine overlap exists, match_reason
should say so plainly, e.g. "matched by domain classification only — no
direct specialization overlap found." This still satisfies Global Rule #9
(non-empty), it just tells the truth about how confident the match is.

## Known schema/TypeScript boundary notes (not defects)

- `challenge_matches.match_reason` is enforced `NOT NULL` with a non-empty
  CHECK constraint via `20260825140000_enforce_match_reason.sql` (applied as
  a reviewed 4th migration, not an inline edit to the original file — keep
  it that way if this project's history is ever replayed elsewhere).
  Generated type is a guaranteed `string`, never `null`, once that migration
  is applied.
- `challenges.photo_urls` and `institutions.expertise_tags` are JSONB columns
  and generate as `Json | null` in TypeScript, not `string[]`. Frontend code
  must narrow at the boundary (e.g. `(row.expertise_tags as string[]) ?? []`).
  This is a Postgres/TS limitation, not something to fix in the migration.
- `institutions.institution_type` is a `TEXT CHECK` column, not a native enum,
  and generates as `string`. Narrow to `'university' | 'industry'` at the
  boundary the same way.

- Claude Code's `ChallengeSubmissionForm.tsx` inserts a row into `challenges`,
  then calls `categorize-challenge`, then `match-institutions` with the returned
  domain — Codex's two functions are the only thing standing between "citizen
  hits submit" and "matches appear in the feed."
- Claude Code's `InstitutionQueue.tsx` reads `challenge_matches` joined to
  `challenges`, filtered to the logged-in institution's own `institution_id`
  (RLS enforces this — the query itself can be permissive).
- Claude Code's `supabase/seed/institutions.json` is the candidate pool
  Codex's `match-institutions` function reads from — if the seed data changes
  shape, Codex's function breaks. Any change to that JSON's fields must be
  flagged to Claude, not made silently.
