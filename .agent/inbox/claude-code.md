# Claude Code Inbox

Read `.agent/shared/global-rules.md`, `.agent/shared/contracts.md`, and
`.agent/shared/design-brief.md` in full before starting any UI task — the
design brief applies to Tasks 2, 3, 4, 5, and 7 (everything with a visible
frontend surface). Task 1 and 6 (data-only) don't need the design pass first.

Work through tasks roughly in order, but Tasks 1 and 6 can start immediately
in parallel with Codex — they don't depend on the edge functions existing yet.

## Task 1 — Apply migration + regenerate types
- Apply `supabase/migrations/20260825120000_societal_challenges.sql` to the
  Supabase project.
- Regenerate `src/integrations/supabase/types.ts` and confirm the generated
  types match the shapes in contracts.md exactly. If they don't match, the
  migration is the source of truth — flag the mismatch to Claude, don't hand-edit
  generated types to paper over it.

## Task 1b — Frontend scaffold (new — do this before Task 2)
The workspace has no package.json, Vite config, or app shell. This gap only
exists because we deliberately stopped copying the tourism repo wholesale —
own the fix rather than reaching for that shortcut again.
- Scaffold: Vite + React + TypeScript + Tailwind + shadcn/ui, matching the
  stack in CLAUDE.md.
- Add: react-leaflet (Task 4), recharts (Task 7), react-i18next (design
  brief's accessibility requirements).
- Basic app shell + routing (React Router or equivalent) with placeholder
  routes for `/challenges` and `/institution-portal` per contracts.md's
  pages list — empty pages are fine, this task is the shell, not the content.
- Wire the Supabase client using the new project's `.env` values already in
  place.
- Only NOW bring in the Dashboard.tsx + Recharts pattern and the
  Community.tsx shape from the tourism repo as reference material for Tasks
  3 and 7 — as reference/inspiration files, not wired into the running app,
  and not the surrounding tourism-specific logic those files may call.


- Text description, optional photo upload (to the `challenge-photos` storage
  bucket, already created by the migration), geolocation capture.
- On submit: insert into `challenges`, then call `categorize-challenge`, then
  `match-institutions` with the returned domain (see Integration Points in
  contracts.md). This depends on Codex's Task 1 + Task 2 being complete —
  build the form and stub the two calls first if Codex isn't done yet, don't block.

## Task 1c — Auth flow (new — do this before Task 5, can start now)
Not originally scoped — a real gap, since we stopped copying the tourism
repo's auth UI wholesale and nothing replaced it. Task 2's inline stopgap
(`useAuth.ts` + inline sign-in) was the right call to stay unblocked; this
task formalizes it rather than discarding it.
- Build real SignIn/SignUp pages using the same Supabase auth calls the
  stopgap already proved work. Consolidate ChallengeSubmissionForm's inline
  sign-in to use this instead of its own copy.
- Extend `useAuth.ts` into a proper session hook usable across the app
  (current session, sign out, loading state).
- Add a route-guard component gating by `profiles.user_type` — needed for
  Task 5 (university/industry only) and Task 7 (admin only). Don't
  re-implement the actual access control client-side as the only defense;
  RLS is still the real boundary, this guard is just UX (don't show a page
  that will just fail to load data).
- Once this exists: create a small number of real test accounts (at least
  one `university` and one `industry` user_type) and link their `user_id`
  into a couple of seeded `institutions.admin_user_id` rows, so Task 5 can
  be tested end-to-end against real accounts instead of NULL admin links.


- Public feed, same layout shape as the base repo's `Community.tsx`.
- `MatchExplainer.tsx` must visibly render `match_reason` and the confidence
  score on each card — this is a scored differentiator, not decoration.

## Task 4 — `ChallengeMap.tsx`
- Leaflet map (reuse patterns from the base repo's Emergency/Transport pages),
  clustering challenges by location. Duplicate-cluster visualization can use
  `report_count` even before Codex's stretch `detect-duplicates` function
  exists — start with manual/seeded duplicate examples if needed.

## Task 5 — `InstitutionPortal.tsx` + `InstitutionQueue.tsx` + `ClaimButton.tsx`
- Gated to `profiles.user_type IN ('university', 'industry')`.
- Queue reads `challenge_matches` for the logged-in institution's own
  `institution_id` (RLS handles the actual restriction — don't re-implement
  access control client-side as the only line of defense).

## Task 6 — `institutions.json` seed data
- 15-20 fictitious Jharkhand university/industry entries with realistic
  `expertise_tags` (education, agri-tech, water resources, public health,
  rural infrastructure, etc.). This is the candidate pool Codex's
  `match-institutions` function depends on — do this early, and flag Claude
  immediately if you change its field shape after Codex has started Task 2.

## Task 7 — `ChallengeDashboard.tsx`
- Extends the existing `Dashboard.tsx` + Recharts pattern. Domain-wise
  distribution, status funnel (submitted → ai_matched → claimed → in_progress
  → resolved), institution participation. Do not invent metrics not backed
  by real columns (no "patents generated" — that data doesn't exist).

## When blocked
Write to `.agent/inbox/claude.md` using the blocker format in global-rules.md.
Use Plan Mode for every task above — all of them touch more than one file.
