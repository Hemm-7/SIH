# Project Handoff — SIH26043 Societal Innovation Collaboration Portal

**Written:** 27 August 2026
**Repo:** https://github.com/Pranav-0710/sih26043
**Submission deadline:** 20 September 2026 (idea + PPT/video screening stage — *not* the 36-hour finale)

Read [README.md](./README.md) first for architecture, setup and data model.
This document covers everything the README doesn't: **current true state, what
is verified vs. assumed, what will bite you, and what to do next.**

---

## 1. The single most important thing to understand

This project has one non-negotiable rule that shaped most of the codebase:

> **Nothing in the UI displays a number or a "problem" that isn't a live
> database read. Where no real data exists, the element is removed — never
> filled with a plausible-looking value.**

This is not a style preference. Government officials and judges are the
audience, and a dashboard that *could* be showing fabricated data is worth
less than one showing three honest rows. A large chunk of recent work was
tearing out fabricated content that had accumulated (invented statistics, fake
newspaper articles with bylines, a fictional case study presented as audited
fact, and real institutions named as partners who are not on the platform).

**If you change one thing about how you work on this repo, make it this:**
before you display a number, ask which column it comes from. If there isn't
one, hide the element.

---

## 2. Current state — what actually works

All of the following was verified by **loading the page in a real browser and
clicking it**, plus independent REST queries against the database that bypass
the app entirely. Not by "it compiles".

| Module | State | Evidence |
|---|---|---|
| Citizen submission (text, photo, geolocation) | Working | End-to-end verified in an earlier session |
| AI categorisation (`categorize-challenge`) | Working, deployed | Writes real `domain` + confidence |
| AI matching (`match-institutions`) | Working, deployed | 38 real matches across 12 challenges, all with written reasons |
| Duplicate detection (`detect-duplicates`) | Working, deployed | Regression-tested against 4 real scenarios |
| Institution queue + claim | Working | Live click-through as `university.test` |
| Institution "mark resolved" | Working | Trigger-driven status advance verified server-side |
| Citizen resolution confirmation | Working | Live click-through, DB re-read confirmed |
| Challenges page — list / map / clusters | Working | 11 map markers, 9 cluster markers, popups asserted |
| Government dashboard + department aggregates | Working | Every figure cross-checked against raw counts |
| i18n English / Hindi | Working | Toggle asserted to actually change rendered copy |
| Homepage | Working, fully de-fabricated | ~45-token sweep across all routes returns clean |

**Last full regression: 22/22 checks passed, zero console errors on every route.**

### Real data currently in the database

Small, and deliberately not padded:

```
12 challenges     (all categorised, 11 with coordinates)
38 matches        (3 claimed)
18 institutions   (11 university, 7 industry — all fictitious seed data)
 2 resolved       ( 1 citizen-confirmed)
11 distinct locations
```

Numbers in the UI look small because **they are true**. Do not "improve" them
by inserting rows.

---

## 3. Test accounts

Four seeded accounts exist on the live Supabase project, one per role:

| Email | Role | Sees |
|---|---|---|
| `citizen.test@sih26043.local` | citizen | Submit form, own reports, confirmation prompt |
| `university.test@sih26043.local` | university | `/institutions` queue, claim + resolve |
| `industry.test@sih26043.local` | industry | `/institutions` queue, claim + resolve |
| `admin.test@sih26043.local` | admin | `/dashboard` — the department view |

> **Passwords are deliberately not in this file — this repository is public.**
> These accounts work against a live database with real RLS: anyone who found
> them could sign in as the department admin or claim and resolve challenges,
> mutating the demo data before submission. **Get the passwords from Pranav
> directly** (they follow a simple per-role convention).
>
> If this project ever goes near production data, rotate all four first.

`/dashboard` is **admin-only** — you need the admin account to see it at all.
Signing in as a citizen and visiting `/dashboard` correctly shows a "this page
is for the department" explanation rather than the dashboard.

---

## 4. Gotchas that will absolutely bite you

These are all real problems that already cost time. None are obvious.

### 4.1 A blocked write returns HTTP 200, not an error

PostgREST returns **200 with an empty array** when an `UPDATE`/`INSERT` is
silently filtered by Row Level Security. It does *not* throw.

```ts
// WRONG — this "succeeds" when RLS blocked the write
const { error } = await supabase.from("x").update({...}).eq("id", id);
if (!error) showSuccess();

// RIGHT — row count is the success signal
const { data, error } = await supabase.from("x").update({...}).eq("id", id).select();
if (error || !data || data.length === 0) showFailure();
```

Every write path in this codebase already does the right thing. Match that
pattern in anything new.

### 4.2 `supabase gen types` corrupts the file it writes

The CLI prints its own status banners ("Initialising login role…", update
nags) to **stdout**. Redirect that into `types.ts` and those lines land inside
the file and break the build with cascading syntax errors.

Always check the top of the generated file before committing it.

### 4.3 Restart the dev server after config changes

Vite HMR does **not** reliably pick up `tailwind.config.ts` changes. A stale
screenshot once showed the wrong font for an hour. If a change to config
doesn't seem to apply, kill and restart the dev server before debugging
anything else.

### 4.4 Institution admins cannot update `challenges`

By design. RLS gives them `UPDATE` on `challenge_matches` **only** (ownership-
checked via `institutions.admin_user_id = auth.uid()`). Status advances happen
through two `SECURITY DEFINER` triggers:

- `on_challenge_match_claimed` → status becomes `claimed`
- `on_challenge_match_resolved` → status becomes `resolved`

If you need a new institution-driven status change, **add a trigger — do not
loosen RLS.**

### 4.5 Never render a raw match score as a percentage

Zero-shot classification splits probability across all candidate labels, so a
*correct* top match commonly scores 0.30–0.40. Rendering "34% confidence"
makes a good match look like a bad one. Use the qualitative tiers in
`src/lib/matchConfidence.ts` (≥0.5 strong, 0.25–0.5 likely, <0.25 possible).

### 4.6 JSONB and CHECK columns generate as loose types

`photo_urls` and `expertise_tags` are JSONB → `Json | null`.
`institution_type` is `TEXT CHECK` → `string`. Narrow at the boundary
(`(row.expertise_tags as string[]) ?? []`). Helpers live in
`src/lib/db-narrow.ts`. This is a Postgres/TS limitation, **not** something to
"fix" in the migration.

### 4.7 `location_text` is free text, not a district

A citizen typed it. There is no district table, no validation, no canonical
list. The dashboard deliberately says "reports by location", never "by
district". Don't build district-level logic on this column without adding real
district resolution first.

---

## 5. Known issues and technical debt

Honest list. Nothing here is hidden.

### High value, low risk

| # | Issue | Detail |
|---|---|---|
| 1 | **No test suite at all** | There is no `npm test`. All verification is manual browser interaction + REST cross-checks. This is the single biggest risk to anyone changing code confidently. |
| 2 | **Main bundle is 904 kB** (263 kB gzip) | Over Vite's 500 kB warning. Recharts and Leaflet are already split out; the remaining bulk is Framer Motion + the homepage sections. |
| 3 | **10 dead files** | Listed in §6. They contain fabricated content and are not rendered anywhere. Delete them or rewrite them before wiring any up. |
| 4 | **5 pre-existing lint warnings** | 0 errors. 4 are `react-refresh/only-export-components` (harmless), 1 is a genuine `exhaustive-deps` in `FramerAiAgentModal.tsx:60`. |
| 5 | **`CLAUDE.md` phase tracker is stale** | Still says "PHASE 1 — SETUP" with an unticked checklist. Reality is far ahead of that. |

### Not tested at all

- **Responsive / mobile.** Every check ran at 1440×1000. The design brief says
  citizens submit from phones — **this is a real gap for a demo.**
- **Cross-browser.** Chromium only.
- **Load / concurrency.**
- **Accessibility beyond colour contrast.** Contrast was computed properly
  (all lifecycle bands ≥4.5:1, worst 4.81:1) and reduced-motion is respected,
  but there has been no screen-reader or keyboard-only pass.

### Deliberate non-features — don't "fix" these

- **Santhali localisation is not shipped, on purpose.** A translation function
  was evaluated and rejected: the available model (`ai4bharat/IndicTrans3-beta`)
  labels its Santali support preliminary and low-resource with variable
  quality. Shipping a language toggle with unreliable output behind it is
  worse than not shipping it. English + Hindi only. Revisit only if a
  genuinely reliable model appears.
- **The portal lists this PS's theme as "Disaster Management."** That's a
  tagging error in the source data, not a requirement. Build nothing
  disaster-flavoured on it.

---

## 6. Dead code — delete or rewrite, don't wire up

These are **not rendered anywhere**. Most contain fabricated content (fake
partner institutions, invented metrics, fake case studies) left over from an
earlier design direction. If you import one, you reintroduce fabrication.

```
src/components/home/FramerStudioMockup.tsx
src/components/home/LiveMetricsTicker.tsx
src/components/home/PartnerInstitutions.tsx      <- names real institutions as partners
src/components/home/PeopleBehindSolutions.tsx
src/components/home/PipelineVisualizer.tsx
src/components/home/SectorBentoGrid.tsx
src/components/ai/FramerAiCommandBar.tsx
src/lib/grainTexture.ts
src/lib/matchSimulator.ts
src/lib/tickerData.ts
```

My recommendation: **delete all ten.** They're recoverable from git history if
ever needed, and leaving them invites someone to wire fabricated content back
into the homepage.

---

## 7. Suggested roadmap

Ordered by value for the 20 September screening submission.

### Before the submission

1. **Mobile/responsive pass.** Highest-value gap. The citizen audience is on
   phones and this has genuinely never been tested at narrow widths.
2. **Delete the dead files** (§6). Ten minutes, removes a whole class of risk.
3. **Refresh `CLAUDE.md`** to reflect actual state.
4. **Get more real seed data.** Every metric is honest but thin — 12
   challenges makes charts look sparse. Submit 20–30 more *real* reports
   through the actual form so the data stays genuine while the dashboard fills
   out. **Do not INSERT rows directly to inflate counts** — that breaks the
   project's core discipline and, worse, produces data that didn't go through
   the classifier, so matches and durations would be fake.
5. **Deployment.** There is no Docker/Vercel/Netlify/CI config at all. Vite
   builds to static `dist/` — Vercel or Netlify is a ~15-minute job. Worth
   having a live URL for the video.

### Nice to have

6. **Add tests.** Start with `src/components/dashboard/dashboardStats.ts` and
   `src/lib/challengeClusters.ts` — both are pure functions over arrays,
   trivially unit-testable, and they compute every number a judge will look at.
   Vitest fits the existing Vite setup.
7. **Code-split the homepage** to get the main bundle under 500 kB.
8. **Screen-reader / keyboard-only pass.**

### Explicitly roadmap-only — needs a scope decision first

Scope is frozen at the three MVP modules. Don't start these without deciding
to widen scope:

- Project-lifecycle management beyond the five-state pipeline
- Industry funding / CSR flows
- A notification system
- Any Santhali work (see §5)

---

## 8. How this project was built (context you'll want)

This repo was developed through a **multi-agent workflow**, which explains
some file layout that would otherwise look strange.

```
.agent/
  shared/global-rules.md    15 rules all agents follow — worth reading
  shared/contracts.md       THE source of truth for schema + API shapes
  shared/design-brief.md    Visual direction and audience analysis
  status/claude-code-status.md   Detailed log of every task + verification evidence
  status/codex-status.md         Backend agent's log
  inbox/*.md                Cross-agent blockers and decisions
```

**`contracts.md` is treated as law.** If code and contracts disagree, contracts
wins or the change gets flagged. If you're now working solo, you can retire
this workflow — but **read `contracts.md` and `global-rules.md` at least once**,
because the codebase's conventions come directly from them, and
`claude-code-status.md` contains the reasoning and verification evidence behind
every non-obvious decision.

Some files were "owned" by a backend agent (`src/lib/strataTokens.ts`,
`src/lib/matchSimulator.ts`, `src/hooks/useAnimatedCounter.ts`). That
ownership no longer matters — but note `src/lib/strataStatusMap.ts` exists
specifically to *override* `strataTokens.ts` colours without editing it. If you
find that indirection pointless now, collapsing it is safe.

### Collaboration note

**Hemm-7** contributed the landing-page visual design (2 commits) and may still
be working on it. Their design was deliberately preserved during the
de-fabrication work — only the *content* behind it changed. If they have local
work in flight, expect conflicts in `HeroSection.tsx`, `StatsSection.tsx`,
`AiMatchingSection.tsx`, `IndiaNeedMap.tsx`, `ImpactStories.tsx`.

**Tell them: the data layer moved to `src/hooks/useHomepageData.ts`.** When
resolving conflicts, keep the hook calls — don't restore hardcoded arrays.

---

## 9. Access you'll need

- **GitHub:** push access to `Pranav-0710/sih26043`
- **Supabase:** project `fhjxngqfredhsszwqmuf` — dashboard access, plus the
  anon key and service-role key
- **Hugging Face:** an API token set as the `HUGGINGFACE_API_KEY` Supabase
  secret. **Both AI edge functions are dead without it** — this is a hard
  blocker, not an optional extra.
- **`.env`** is gitignored and not in the repo. Copy `.env.example` and fill in
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 10. Thirty-second orientation

```bash
git clone https://github.com/Pranav-0710/sih26043.git
cd sih26043 && npm install
cp .env.example .env        # fill in Supabase URL + anon key
npm run dev                 # http://localhost:5173
```

Then, in this order:
1. Sign in as `admin.test@sih26043.local` and open `/dashboard` — this is the
   judge-facing view and the best single picture of what the system does.
2. Open `/challenges` and click through **List → Map → Clusters**.
3. Sign in as `university.test` and open `/institutions` to see the claim flow.
4. Skim `.agent/shared/contracts.md`, then the last few entries of
   `.agent/status/claude-code-status.md`.

Good luck. The foundation is honest and verified — the most valuable thing you
can do is keep it that way.
