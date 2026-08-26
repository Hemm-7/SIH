# Claude Code Status

(Claude Code writes here after every completed task, using the format below. Claude reads this file to decide when to activate the debate room.)

```
STATUS: COMPLETE / BLOCKED / IN PROGRESS
WHAT I BUILT: [description]
FILES CHANGED: [list]
INTEGRATION NOTES: [what Codex needs to know]
BLOCKERS: [none OR description]
```

---

## Task 1c — Auth flow — 2026-08-25

```
STATUS: COMPLETE — builds clean, all routes serve, claim gate verified end to end

WHAT I BUILT:
Formalised Task 2's useAuth stopgap into a real auth layer, and provisioned the
institution test accounts that unblock Task 5.

  AuthProvider + useAuth (src/hooks/useAuth.tsx)
    Context rather than a bare hook, so profiles.user_type is fetched ONCE instead
    of once per component that asks who is signed in. Exposes session, user,
    userType, a combined loading flag (session OR profile still resolving),
    signIn/signUp/signOut, refreshProfile.

  AuthForm (src/components/auth/AuthForm.tsx)
    One credential surface for the whole app. Used by /signin, /signup, AND inline
    by ChallengeSubmissionForm, so there is a single set of error strings to keep
    translated and the two can never drift apart visually.

  RequireAuth + RequireUserType (src/components/auth/RequireAuth.tsx)
    Route guards. RequireUserType renders an EXPLANATION rather than redirecting —
    bouncing someone to the home page with no reason is the dead end the design
    brief calls out. Applied: /institutions -> university|industry, /dashboard ->
    any signed-in user. /submit is deliberately NOT wrapped, so a citizen mid-
    thought gets inline sign-in instead of being thrown to another page.

  SignIn / SignUp pages, AccountButton in the header (email · role, sign out).

=== SECURITY FINDING — user_type is self-writable ===

Before designing the guard I checked what the policies actually permit. The
profiles policy is `"Users can update their own profile" USING (auth.uid() =
user_id)` with NO column restriction, so a user can write their own user_type.

Verified against the live project rather than assumed:
  citizen PATCHes own profile user_type -> 'university'  -> HTTP 200
  RE-READ user_type = university                          <== ESCALATION SUCCEEDED
  same citizen then claims a match                        -> HTTP 200, body []
  RE-READ is_claimed = false                              <== correctly blocked

So the escalation is real but INERT: the claim gate is
`institutions.admin_user_id = auth.uid()`, which a user cannot set because
`institutions` is admin-manage-only. RLS held.

Two consequences, both now baked into the code and commented at the definitions:
  1. userType is a UX signal ONLY and must never become an authorisation boundary.
  2. Sign-up offers NO role picker. Adding one would normalise the escalation path.
     Institution roles are provisioned service-side, never self-selected.

=== DESIGN PASS (Global Rule #13) ===

Rejected the universal default for auth screens: a floating centred card on a
gradient. It communicates nothing and looks like every other product.

Chosen: a split layout where the left column answers the question the citizen
actually has at that exact moment — "why do you want my email just to report a
broken handpump?" — in three plain-language reasons (follow your report; an
institution may need one more detail; repeat reports get counted together). The
form is the right column, and is FIRST in DOM order so mobile users reach it
without scrolling past prose.

One page serves both audiences because the copy explains the account's PURPOSE
rather than addressing a role — a citizen and a university admin both land on
something that makes sense. Reuses the ore-toned stratum markers from
PipelineStrata so it belongs to the same system.

=== TEST ACCOUNTS — Task 5 is now unblocked ===

  university.test@sih26043.local / [redacted — see .env or ask coordinator]
    uid f2896183-fb9c-4c64-b6dc-bac533d5ab76
    -> Ranchi Institute of Rural Technology
  industry.test@sih26043.local / [redacted — see .env or ask coordinator]
    uid ef74c59a-c45e-4831-995a-9c9bc62c1979
    -> Palamu Agri-Tech Innovations Pvt. Ltd.

Created by supabase/seed/link-institution-admins.mjs (idempotent, service-role,
re-runnable). It verifies every write by RE-READING per Global Rule #15 rather
than trusting the PATCH status.

CLAIM FLOW VERIFIED END TO END as university.test:
  claim OWN match     -> HTTP 200, 1 row returned, RE-READ is_claimed = true
  claim OTHER's match -> HTTP 200, 0 rows returned, RE-READ is_claimed = false
  (test claim reset afterwards; no state left behind)

** NOTE FOR TASK 5 — this is exactly Global Rule #15 **
Both outcomes return HTTP 200. The ONLY difference is the row count. ClaimButton
must therefore either request `Prefer: return=representation` and check that a row
came back, or re-read the row after the update. Checking `!error` will report a
successful claim to an institution that claimed nothing.

VERIFICATION:
  npm run build      clean. 1722 modules, 542 kB JS (160 kB gzip), 32.6 kB CSS.
  routes (dev)       /signin /signup /submit /institutions /dashboard /challenges
                     all 200; useAuth.tsx module compiles and serves 200.
  i18n               105 keys per language, automated parity check OK, Hindi is
                     real translation not transliteration.

FILES CHANGED:
- src/hooks/useAuth.tsx                       (new — replaces the .ts stopgap)
- src/hooks/useAuth.ts                        (deleted)
- src/components/auth/AuthForm.tsx            (new)
- src/components/auth/RequireAuth.tsx         (new)
- src/pages/SignIn.tsx, src/pages/SignUp.tsx  (new)
- src/App.tsx                                 (AuthProvider + guarded routes)
- src/components/layout/AppLayout.tsx         (AccountButton)
- src/components/challenges/ChallengeSubmissionForm.tsx
                                              (bespoke SignInPrompt removed,
                                               now uses shared AuthForm)
- src/i18n/locales/{en,hi}.json               (+21 keys each)
- supabase/seed/link-institution-admins.mjs   (new)

INTEGRATION NOTES:
- profiles.user_type for a NEW signup is whatever the trigger defaults to
  ('tourist'). That enum value is a leftover from the base repo and reads oddly for
  a civic portal — a citizen is a 'tourist'. Not changed (enum change is a
  migration, and Rule #14 says checkpoint first), but worth a decision.
- /dashboard is currently guarded to any signed-in user. contracts.md implies Task 7
  is government-facing; if it should be admin-only, switch it to
  RequireUserType allow={["admin"]}. No admin account exists yet.
- Bundle still 542 kB in one chunk. Code-splitting deferred to Tasks 4/7 when
  leaflet and recharts actually render.

BLOCKERS: none.

TASK 3 REMAINS ON HOLD per instruction — not started, awaiting Codex's
ranking/stopword report before building MatchExplainer.
```

---

## Post-Task-1c verification pass — 2026-08-25

```
STATUS: COMPLETE — no code changed, state re-confirmed on disk

WHY THIS ENTRY EXISTS:
Two "continue" turns were spent re-verifying Task 1c's output without logging
anything here. Global Rule #3 says the status file is updated after every
completed task, and a verification pass that produces findings is work — if it
is not written down, the next session cannot tell whether it happened. Logging
it rather than leaving a silent gap.

WHAT WAS CHECKED (all re-run against disk, not recalled):
  src/components/auth/          AuthForm.tsx, RequireAuth.tsx present
  src/hooks/useAuth.tsx         present
  src/hooks/useAuth.ts          GONE — stopgap correctly replaced, not left
                                alongside its successor
  ChallengeSubmissionForm.tsx   0 occurrences of `function SignInPrompt` —
                                consolidation onto shared AuthForm is real, not
                                just an added import with dead code behind it
  src/pages/                    SignIn.tsx, SignUp.tsx present
  supabase/seed/                institutions.json, load-institutions.mjs,
                                link-institution-admins.mjs

  npm run build                 clean. 542.68 kB JS (160.04 kB gzip),
                                32.64 kB CSS, built in 7.81s
  i18n parity                   en 105 / hi 105, identical key sets

RESULT: no drift. Task 1c's reported state matches the tree exactly. Nothing
was fixed because nothing was broken.

FILES CHANGED: none.

BLOCKERS: none.
```

---

## Task 1d — rename tourist->citizen, admin-only dashboard, admin account — 2026-08-25

```
STATUS: COMPLETE — both parts done, migration applied, guard changed, verified live

=== PART 0: migration file ===
Created supabase/migrations/20260825150000_rename_tourist_to_citizen.sql with
exactly the content specified — not modified, not second-guessed. Rule #14
applied in reverse here: this WAS the checkpoint (the user wrote the exact SQL
and named the exact file), so it executes on receipt rather than being logged
as a proposal first.

Pre-flight check before applying (habit from the last enum-adjacent migration):
  rows with user_type='tourist' before push: 1 (citizen.test@sih26043.local only)
No other data at risk.

=== PART 1: apply + regenerate types ===
  supabase db push -> Applying 20260825150000_rename_tourist_to_citizen.sql...
                       Finished supabase db push.
  Recorded: 20260825150000 | 20260825150000 (Local | Remote)

VERIFIED, not assumed:
  the one existing 'tourist' row auto-updated:
    citizen.test@sih26043.local -> user_type: "citizen"
    (RENAME VALUE preserves the enum OID, as the migration's own comment claims —
    confirmed empirically rather than trusted from the comment alone)
  the old label is genuinely gone, not just hidden:
    querying user_type=eq.tourist -> HTTP 400
    {"code":"22P02","message":"invalid input value for enum user_type: \"tourist\""}

  supabase gen types typescript --linked, then grepped the actual enum union:
    user_type:
      | "citizen"
      | "local_guide"
      | "agency"
      | "admin"
      | "university"
      | "industry"
  Matches exactly what was asked for.

=== PART 2: admin-only /dashboard + admin test account ===

App.tsx: dashboard's guard changed from RequireAuth (any signed-in user) to
RequireUserType allow={["admin"]}, matching contracts.md's stated audience
(Department of Higher & Technical Education officials). RequireAuth had no other
call site, so its now-unused import was removed rather than left dangling.

supabase/seed/create-admin-account.mjs (new) — same shape as
link-institution-admins.mjs: service-role, idempotent, re-reads every write per
Global Rule #15 instead of trusting the PATCH status.

  admin.test@sih26043.local / [redacted — see .env or ask coordinator]
    uid f1deef4e-30e2-4b1a-9dad-5fe47f7c28cc
    profile.user_type -> admin (verified by re-read)

FINAL STATE OF ALL FOUR TEST ACCOUNTS, confirmed live in one query:
  admin.test@sih26043.local        admin
  citizen.test@sih26043.local      citizen        <- shows the rename took
  industry.test@sih26043.local     industry
  university.test@sih26043.local   university

Guard behaviour this implies for /dashboard, allow=["admin"]:
  citizen, university, industry -> denied (university/industry COULD reach it
                                    before this change; that access is now closed)
  admin                         -> allowed

npm run build -> clean. 1722 modules, 542.51 kB JS (160.01 kB gzip), 32.64 kB CSS.

FILES CHANGED:
- supabase/migrations/20260825150000_rename_tourist_to_citizen.sql  (new, exact
  content as specified)
- src/integrations/supabase/types.ts   (regenerated)
- src/App.tsx                          (dashboard guard: RequireAuth ->
  RequireUserType allow=["admin"]; unused RequireAuth import removed)
- supabase/seed/create-admin-account.mjs  (new)

INTEGRATION NOTES:
- Signup default is now 'citizen', not 'tourist' — matches the note left in the
  previous Task 1c entry. No further enum cleanup outstanding from that list.
- /dashboard access for university/industry test accounts, which worked under the
  previous RequireAuth guard, is now correctly closed. If Task 5's institution
  flows are ever tested by clicking through /dashboard as a sanity check, that
  will no longer work by design — use /institutions instead.
- This is a UX guard only, per RequireAuth.tsx's existing header comment — no
  admin-only RLS exists yet on any table read by Task 7's eventual queries. If
  Dashboard.tsx starts reading anything sensitive, that needs its own RLS policy,
  not reliance on this guard.

BLOCKERS: none.
```

---

## Task 3 — ChallengeFeed.tsx, ChallengeCard.tsx, MatchExplainer.tsx — 2026-08-25

```
STATUS: COMPLETE — builds clean, verified against 17 real match rows across
        all three confidence tiers and both fallback states

=== PRE-BUILD: did not trust Codex's self-report, re-verified the fix live ===

Re-ran the exact two previously-bad cases against the deployed function before
designing anything:

  handpump  #1 Damodar Valley Institute (0.3710) -> HONEST fallback
            #2 Ranchi Institute, "handpump and borewell maintenance" (0.2480)
  school    #1 Khunti Centre (0.4320) -> HONEST fallback
            #3 Deoghar College, "teacher training and pedagogy,
               school dropout intervention" (0.1492)

Fabrication is gone — no more "artisan and handicraft cooperatives" attached
to a teacher-shortage report. Ranking is NOT fully fixed (Deoghar is #3, not
#1; Codex's own report says the school case was "not a clear improvement") but
that is an accepted, separately-scoped trade-off per the coordinator's
message, not something Task 3 owns. Confirmed the code matches the report:
MATCH_STOPWORDS set present, domain-word discounting present, deployed to
fhjxngqfredhsszwqmuf.

=== DESIGN PASS (Global Rule #13) — MatchExplainer is the signature element ===

Re-read design-brief.md's signature-element paragraph and both new
contracts.md sections immediately before building, per instruction.

Three options considered for the "labelled bridge/thread" the brief asks for:
  A. Caption under the institution name ("matched because: ..."). REJECTED —
     this is literally the caption the brief says not to build.
  B. Animated SVG thread/particle connector. REJECTED — expensive to keep
     legible across two languages of variable text length, breaks under
     prefers-reduced-motion, and is genuinely hard to read correctly at feed-
     card density on a phone, which is this audience's actual device.
  C. CHOSEN — two labelled nodes (problem domain / institution) joined by a
     visible connector carrying a confidence-tier badge, with the REAL
     matched terms rendered as pills directly under it — literally what
     matched, not prose describing that something matched. Connector rotates
     to vertical on mobile rather than disappearing, so the bridge reading
     survives at the width citizens actually use.

Confidence handling, per contracts.md "Displaying match confidence": the raw
score NEVER reaches the DOM as text or a percentage. Centralised in
src/lib/matchConfidence.ts (confidenceTier()) so it is the single place the
float is looked at; every component downstream reads only "strong" | "likely"
| "possible". The connector's weight (solid/thin, opaque/faded) is driven by
the discrete TIER, not a continuous score-mapped width — a continuous bar
would leak the same information the rule exists to hide, just visually
instead of as digits. Possible-tier matches are visually de-emphasised
(opacity-70), per the contract's explicit suggestion.

Honest fallback, per contracts.md's other new section: detected by exact-
string match against Codex's literal output (src/lib/matchConfidence.ts,
isHonestFallback()), rendered in a visually DISTINCT register — italic,
muted, an info icon instead of the sparkle used for real matches — so it
never looks like a confident finding that happens to be generic. Comment on
the constant flags the coupling to Codex's exact wording and notes the
graceful-degradation path if it ever drifts.

=== REUSE, not new files ===

  PipelineStrata.tsx — reused for status, not rebuilt. Added a `compact` prop
  (slim bands, no detail line) so ChallengeCard can show the full 5-stage
  lifecycle without a 5-row block per card. While already in the file for
  this, fixed a real gap: the state words ("working"/"done"/"waiting") were
  hardcoded English — harmless when only the submission form used it, not
  harmless once this ships to a public bilingual feed. Now pulled from i18n
  (`pipeline.*`).

  challengeLifecycle.ts (new, small) — the submitted/ai_matched/claimed/
  in_progress/resolved order and stateOf() logic, extracted so ChallengeCard
  doesn't duplicate what ChallengeSubmissionForm already encodes inline.

  matchConfidence.ts, db-narrow.ts (new, small) — confidence bucketing and
  the JSONB/TEXT-CHECK narrowing contracts.md's boundary-notes section calls
  for (photo_urls, expertise_tags, institution_type). Centralised because
  Task 4 and Task 7 will need the identical narrowing and tier logic; better
  one audited function than three copies drifting.

=== VERIFICATION — against 17 real rows, all three tiers, both fallback states ===

Anonymous (no session) read, exactly as ChallengeFeed queries:
  challenges         -> HTTP 200, 5 rows
  challenge_matches  -> HTTP 200, 17 rows
  institutions       -> HTTP 200, 12 rows
Confirms the public-transparency RLS intent actually holds for an
unauthenticated visitor, not just an authenticated one.

Replicated MatchExplainer's exact render logic (isHonestFallback gate ->
splitReason only when NOT honest) against all 17 real match_reason strings.
Sample:
  Giridih Assistive Technology Labs [strong] -> pills: ["assistive devices
    for visual impairment"]
  Khunti Centre for Tribal Livelihoods [likely] -> HONEST message (not pills)
  Ranchi Institute of Rural Technology [possible] -> pills: ["village-scale
    infrastructure","handpump and borewell maintenance"]
All 17 rows resolved to the correct branch — no honest-fallback text ever
became a "matched term" pill, no real match ever fell into the honest branch.
(Caught and fixed one thing in my own verification along the way: my FIRST
check script called splitReason() unconditionally, which DOES incorrectly
treat the fallback sentence as a single giant pill — that would have been a
real defect. It wasn't in the component, because MatchExplainer gates on
isHonestFallback before calling splitReason; only my ungated test script had
the bug. Re-ran gated and confirmed clean, recording the near-miss since it
is exactly the class of thing a rushed check would have missed.)

  npm run build   clean. 1729 modules, 555.40 kB JS (163.23 kB gzip),
                  34.18 kB CSS. Built in 7.25s.
  dev server      /, /challenges, /submit all 200; ChallengeFeed.tsx,
                  ChallengeCard.tsx, MatchExplainer.tsx all serve 200.
  i18n            121 keys per language (+16 from Task 2's 105), parity OK.

One TS fix needed: .replaceAll() is ES2021, tsconfig targets ES2020 ->
switched to .replace(/_/g, " "), same result, no lib-target bump needed.

FILES CHANGED:
- src/components/challenges/ChallengeFeed.tsx      (new)
- src/components/challenges/ChallengeCard.tsx       (new)
- src/components/challenges/MatchExplainer.tsx      (new — signature element)
- src/components/challenges/challengeLifecycle.ts   (new)
- src/components/challenges/PipelineStrata.tsx      (compact prop + i18n fix)
- src/lib/matchConfidence.ts                        (new)
- src/lib/db-narrow.ts                               (new)
- src/components/ui/skeleton.tsx                     (new shadcn primitive)
- src/pages/Challenges.tsx                           (placeholder -> real feed)
- src/i18n/locales/{en,hi}.json                      (+16 keys each)

INTEGRATION NOTES:
- ChallengeFeed paginates (12/page, "load more" button, not infinite scroll —
  deliberate, infinite scroll fights screen readers and loses place on a slow
  connection). Institution and match lookups are batched per page (one IN
  query each), not per card — N+1 avoided.
- MatchExplainer takes raw enum/db values (domain, institution row shape,
  match_score, match_reason) and translates internally, so Task 4 (map
  popups) and Task 7 (dashboard) can reuse it directly without re-deriving
  tier/honest-fallback logic themselves.
- ChallengeMap.tsx (Task 4) is NOT built. Challenges.tsx currently renders
  the feed only; the page comment says the map lands alongside it.
- Bundle now 555 kB (was 542 kB). Code-splitting still deferred, still
  flagged as the same open item — no new decision needed here.

BLOCKERS: none.
```

---

## Part 1 — verify detect-duplicates for real — 2026-08-25

```
STATUS: PART FAIL — positive case and one negative case pass; the other
        negative case surfaces a real clustering defect. NOT proceeding to
        Task 4 against live detect-duplicates output until this is resolved
        — see the question posed to the coordinator below.

=== POSITIVE CASE — PASSED, verified by re-read per Rule #15 ===

Signed in as citizen.test, inserted two near-identical challenges ~278m apart
(under the 500m radius), called detect-duplicates on the second:

  A "Collapsed culvert near school"   id 7b4836da...
  B "Culvert broken near the school"  id 7344688f...  (~278m from A)

  detect-duplicates(B) -> HTTP 200
    {"duplicateOf":"7b4836da...","clusterSize":2}

  RE-READ B: duplicate_of = 7b4836da...   <- matches A, correct
  RE-READ A: report_count = 2             <- incremented, correct

Not trusting the response body alone (Rule #15): both facts independently
re-read from the table, not taken from what the function said about itself.

=== NEGATIVE CASE (far away) — PASSED ===

Inserted D with nearly the SAME wording as A/B but ~5.5km away:

  D "Similar wording, far away" id feb85c44...  (~5.5km from A)
  detect-duplicates(D) -> HTTP 200  {"duplicateOf":null,"clusterSize":1}
  RE-READ D: duplicate_of = null    <- distance gate held correctly

=== NEGATIVE CASE (same location, unrelated topic) — FAILED ===

Inserted C ~110m from A/B — same location, genuinely unrelated topic (health
centre out of medicine, not a collapsed culvert):

  C "No medicine at the health centre" id 42fa68d9...
  detect-duplicates(C) -> HTTP 200  {"duplicateOf":"7b4836da...","clusterSize":2}
  RE-READ C: duplicate_of = 7b4836da...   <- FALSE POSITIVE, confirmed by re-read,
                                             not just the response body

ROOT CAUSE — found by replicating the function's own terms()/STOPWORDS logic
against the real strings, not guessed:

  terms(A) vs terms(C): ZERO overlap. Direct comparison to A correctly finds
  nothing in common.

  terms(B) vs terms(C): overlap = ["week"]  <- the ONLY shared word, from
  "...heavy rain last WEEK" (B) and "...doctor...twice a WEEK" (C). A topically
  meaningless coincidence, not evidence the two reports are the same problem.

  Because C is also within 500m of B, and B's own duplicate_of already points
  at A (from the positive-case test just before it), the candidate that
  matched was B — but the function reports duplicateOf as B's CANONICAL id
  (A), not B itself. So the single word "week" was enough to silently fold an
  unrelated health-centre report into a culvert-collapse cluster, and the
  response makes it look like C matched A directly when the only real
  (extremely weak) signal was against B.

  Two compounding defects, not one:
    1. overlap.length > 0 is far too weak a bar — a single shared word,
       including near-universal ones like "week"/"long"/"way"/"only" that
       survive the stopword filter, is treated as sufficient evidence.
    2. Canonical-collapsing hides WHICH row actually matched. Reading the
       response, there is no way to tell that the true (weak) match was
       against B and not A.

  Consequence checked, not assumed: A's report_count stayed at 2, not 3 — the
  increment only fires when `duplicateOf === canonical.id`, which was false
  here (duplicateOf was A's id, the matched candidate was B). So the count
  didn't silently inflate, but the LINK itself is still wrong: a distinct
  problem now has duplicate_of set, meaning it would vanish from any view
  that filters out non-canonical duplicates (exactly what Task 4's clustering
  would do).

CLEANUP: C's duplicate_of was reverted to null via service-role (my own test
row's corrupted state, not a fix to the function). Left A, B, D in place as
real fixture data, matching how earlier tasks' test challenges were kept as
live demo rows on the public feed rather than deleted.

FILES CHANGED: none. detect-duplicates/index.ts not touched — Codex's file,
Global Rule #4.

BLOCKERS: the false-positive above is why I have not proceeded to Part 2.
Options as I see them, for the coordinator to choose:
  (a) hold Task 4 until Codex raises the overlap bar (e.g. require >=2 shared
      terms, or exclude very-high-frequency words, or weight by term rarity)
  (b) proceed to Task 4 now, but design the map defensively — e.g. show
      cluster membership as a citizen-facing "these may be related" prompt
      rather than an authoritative silent merge, so a false positive is
      recoverable rather than a report quietly disappearing
  (c) proceed to Task 4 using report_count/duplicate_of as-is and accept the
      known false-positive rate for the MVP demo, flagged as a known issue
  I have not picked one — this is exactly the kind of call Rule #14 says to
  checkpoint on rather than execute past on my own reasoning, even though the
  reasoning above is fairly confident.
```

---

## Part 1 re-verify — Codex's detect-duplicates fix — 2026-08-25

```
STATUS: 3 of 4 cases PASS, 1 FAILS. NOT proceeding to Task 4 — per explicit
        instruction, stopping to report rather than deciding a fix myself.

Confirmed the fix in the deployed source before testing: overlap threshold
raised from `> 0` to `>= 2`, stopword list extended (now excludes "week",
"month", "day", "year", "time", "problem", "issue", etc.), and the response
now returns `matchedChallengeId` + `matchedTerms` — which independently fixes
the OTHER half of the original defect (the response no longer hides which
row actually matched). Good fix on that front regardless of the result below.

=== CASE 1 — positive, ~278m, near-identical text — PASS ===
  New pothole-report pair (not reusing the earlier A/B, so the fresh-match
  path is actually exercised, not the already-linked short-circuit).
  detect-duplicates -> duplicateOf = canonical id, matchedTerms = 10 words
  RE-READ (Rule #15, not the response body): duplicate_of set correctly on
  the second row; canonical's report_count = 2, confirmed by re-read.

=== CASE 2 — negative distance, ~5.5km, same wording — PASS ===
  Inserted a third copy of the same text ~5.5km out.
  detect-duplicates -> duplicateOf: null
  RE-READ: duplicate_of = null. Distance gate holds regardless of text match.

=== CASE 3 — the original failure, culvert vs. medicine shortage, ~110m — PASS ===
  Recreated the exact two descriptions from the first find. Their only prior
  overlap was "week", now stopworded, so direct term overlap is genuinely
  zero under the new list.
  detect-duplicates -> duplicateOf: null, matchedTerms: []
  RE-READ: duplicate_of = null. Correctly not linked.
  Note: this retests the DIRECT overlap claim, not the indirect canonical-
  collapse mechanism from the original bug (which required a third,
  already-linked row sharing the weak word) — the >=2 threshold makes that
  specific propagation path much harder to hit by chance, and the new
  matchedChallengeId field would make it diagnosable if it recurred, but it
  was not independently re-created here.

=== CASE 4 (mine) — boundary probe, exactly 2 shared terms, unrelated topics — FAIL ===
  Designed and verified offline first (replicated the function's own
  terms()/STOPWORDS logic against draft text, iterated until the pair shared
  EXACTLY 2 qualifying words) before running anything live:
    X: "Motorbikes race dangerously past the school gate every morning
       during drop-off..." (road-safety hazard)
    Y: "The lock on our ration shop gate is broken and the shopkeeper now
       opens randomly..." (an unrelated shop-access complaint)
    shared terms, confirmed by script: ["school", "gate"] — exactly 2.
  Inserted ~110m apart, called detect-duplicates on Y:
    -> {"duplicateOf":"<X's id>","clusterSize":2,
        "matchedChallengeId":"<X's id>","matchedTerms":["gate","school"]}
  RE-READ (Rule #15): Y.duplicate_of = X's id — LINKED.
  RE-READ: X.report_count = 2 — incremented. Unlike the original bug, this
  is a DIRECT two-row match (not routed through a third linked row), so the
  false link took completely: both the pointer and the count.

  WHY THIS IS A DIFFERENT FINDING FROM THE ORIGINAL, NOT THE SAME BUG
  RECURRING: the original failure was about one INCIDENTAL word ("week")
  slipping past a too-low count threshold. This is not that — "school" and
  "gate" are not accidental filler words, they are ordinary, HIGH-FREQUENCY
  NOUNS specific to this civic-complaint domain. Almost any report near a
  school could plausibly mention "school" and "gate" as a landmark, the same
  way "road", "water", or "government" would recur across many unrelated
  reports in this domain. A general-English stopword list, however long,
  cannot catch this — "school" and "gate" are meaningful English words. The
  gap is that raw shared-term COUNT treats these the same as genuinely rare,
  specific terms (like "culvert" or "borewell"), when domain-common nouns
  carry much less evidence value per occurrence.

CLEANUP: Y's duplicate_of and X's report_count reverted via service-role
after capturing the full result (my own test rows' corrupted state, not a
fix to the function) — same practice as the previous round's cleanup.

FILES CHANGED: none. detect-duplicates/index.ts not touched.

BLOCKERS: 3/4 cases pass, but the instruction was explicit — "if anything
doesn't hold, stop and report back rather than deciding a fix yourself."
Case 4 doesn't hold. Not proceeding to Task 4. Filing this to
.agent/inbox/claude.md with the finding above; a plausible next fix (not
decided, just observed) would need something beyond a bigger stopword list —
e.g. discounting terms by how often they appear across ALL challenges in the
table (so "school"/"gate" naturally weigh less than "culvert" the more
reports use them), which needs the coordinator's and Codex's judgment, not
mine to pick.
```

---

## Part 1, round 3 — detect-duplicates: dynamic-frequency fix — 2026-08-25

```
STATUS: All 4 required cases PASS. My own 5th probe finds a genuinely new
        failure mode. Per explicit instruction: reporting it plainly, NOT
        attempting a fix, and proceeding straight to Task 4 with the
        required expand-to-show-underlying-reports safety net.

Confirmed the fix in the deployed source first: a `dynamicStopwords()` pass
computes, per request, what fraction of ALL OTHER existing challenge
descriptions already contain each candidate term (whole-word match) and
excludes any term over 25% frequency before the >=2 overlap count is taken.

=== METHOD NOTE: predicted every outcome before running anything live ===

Before touching the live function, checked the actual current corpus (16
rows, accumulated across every prior verification round) for how often my
planned test words already appear in it — "school" 56%, "culvert" 31%,
"week" 31%, "gate" 13%, "pothole" 19%. This mattered: reusing the exact old
Case 3/4 text without checking would have risked a pass that looked like the
fix working, but was really just MY OWN repeated test insertions having
already inflated those specific words past the 25% cutoff — not evidence the
mechanism generalizes. So every case's overlap and dynamic-exclusion outcome
was computed offline against the real corpus snapshot first, and only run
live once the prediction was in hand — the live run either confirms or
contradicts a stated prediction, not a blind "see what happens."

=== THE 4 REQUIRED CASES — all matched their prediction, all PASS ===

  Case 1 — positive, fresh vocabulary (streetlights, never used before in
  the corpus), ~278m: predicted 8-term overlap, none dynamically excluded
  (0% prior frequency) -> link. ACTUAL: linked, RE-READ confirmed
  duplicate_of set and canonical report_count = 2.

  Case 2 — negative distance, same wording as Case 1, ~5.5km: predicted not
  linked (distance gate). ACTUAL: RE-READ duplicate_of = null.

  Case 3 — literal repeat of the original failure (culvert vs. medicine
  shortage): predicted overlap 0. Worth noting WHY it's 0 now — not only is
  "week" statically stopworded, but "culvert" itself gets dynamically
  excluded this round (now at 31% corpus frequency, from my own repeated
  culvert-themed test insertions across rounds), so this pair's pass is
  doubly guaranteed and isn't a clean read on the dynamic mechanism alone.
  ACTUAL: matched prediction, RE-READ duplicate_of = null.

  Case 4 — literal repeat of the school/gate boundary case: predicted
  overlap 1 ("gate" only — "school" now dynamically excluded at 56% corpus
  frequency, "children" also excluded). ACTUAL: matched prediction, RE-READ
  duplicate_of = null.

=== CASE 5 (mine) — fresh cold-start probe — CONFIRMS A NEW, DIFFERENT GAP ===

Designed to test a specific structural question, not to fish for any old
bug: does the 25%-frequency filter protect against a domain-common word the
FIRST time it starts recurring, or only after enough occurrences have
already piled up? Chose vocabulary the corpus had genuinely never seen
before ("market", "junction" — 0% prior frequency, confirmed against the
live corpus before running):

  M: "Every evening vendors leave rotting vegetable waste piled beside the
     market junction..." (illegal dumping)
  N: "Auto drivers say an unofficial tout near the market junction charges
     them fifty rupees..." (extortion/illegal toll) — genuinely unrelated
     to M, sharing only the landmark words "market" and "junction".

  Predicted: overlap = ["market","junction"] = 2, neither dynamically
  excluded (0% frequency going in) -> link (false positive).
  ACTUAL: {"duplicateOf":"<M's id>","matchedTerms":["market","junction"]}.
  RE-READ (Rule #15): N.duplicate_of = M's id. Prediction confirmed exactly.

  WHY THIS IS A DIFFERENT GAP FROM BOTH PRIOR FINDINGS: the first bug was a
  single incidental word slipping under a too-low count. The second was two
  domain-common nouns the corpus had already made common. This third one is
  structural, not a wording accident: dynamicStopwords() can only discount a
  term AFTER a quarter of the existing corpus already uses it. A brand-new
  MVP launch spends its early life with a small, sparse corpus by
  definition — every domain-common phrase starts at 0% and stays under 25%
  until enough real citizens have used it. During exactly that window (which
  could be weeks of real usage), the frequency defence provides none of its
  intended protection, and a fresh, genuinely common landmark phrase used by
  just two unrelated reports can still silently merge them.

  A second, smaller observation from the Case 3 prediction, worth recording
  even though it didn't change any pass/fail result here: the same mechanism
  can also swing the OTHER way — "culvert" itself is now excluded at 31%
  corpus frequency, purely from my own repeated test insertions. In a real
  deployment, many citizens genuinely reporting the SAME real collapsed
  culvert would also legitimately push a specific, meaningful word like
  "culvert" past 25% — at which point the algorithm stops treating it as
  duplicate evidence right when it would be most useful (recognising many
  independent reports of one real, recurring problem). Not tested to a
  pass/fail outcome here, just recorded as visible in the simulation.

Per the explicit instruction for this round: NOT attempting a fix for
either observation. This is the point at which iterating on the algorithm
stops, and Task 4's safety net (below) is relied on instead.

CLEANUP: Case 5's false link (N.duplicate_of, M.report_count) reverted via
service-role after capturing the result — my own test data, not a function
change, same practice as both prior rounds.

FILES CHANGED: none. detect-duplicates/index.ts not touched.

BLOCKERS: none for proceeding — the 4 required cases hold, and the
instruction for a genuinely new 5th failure was explicit: report plainly,
rely on the safety net, do not chase a fifth fix. Filed to
.agent/inbox/claude.md for the record. Proceeding to Task 4 below.
```

---

## Task 4 — ChallengeMap.tsx — 2026-08-25

```
STATUS: COMPLETE — builds clean, clustering verified against 25 real rows,
        mandatory safety net implemented, lazy-loaded so the map costs
        nothing until a visitor actually asks for it.

=== PRE-CONTRACT CHECK: the "reuse MatchExplainer" rule wasn't in the file ===

The instruction referenced an explicit contracts.md rule for map popups
reusing MatchExplainer directly. Checked contracts.md first — that specific
rule text is not present as a heading (only the two Task 3 sections already
known). Found a newer sih26043-agent-setup.zip in Downloads (11:08 vs the
10:33 contracts.md already installed) and diffed it byte-for-byte against
what's on disk before touching anything: IDENTICAL content, just re-encoded
through the zip round-trip (different byte count, zero line differences).
Nothing to install. Also confirmed the zip's own status/inbox files are a
stale bare template (345 bytes) — did NOT let it anywhere near
claude-code-status.md or CLAUDE.md. Treated the coordinator's message itself
as sufficient instruction to reuse MatchExplainer directly, which is what
got built.

=== DESIGN PASS (Global Rule #13) ===

Considered a permanent desktop side-by-side (feed | map) with a toggle only
on mobile. Rejected once traced through properly: a CSS-only
hidden/lg:block split still MOUNTS the map component underneath on mobile,
so Leaflet would fetch tiles regardless of whether the panel is visually
shown — getting the bandwidth-conscious behaviour right there needs a JS
viewport check, real complexity for a debatable payoff. Chose one explicit
List/Map toggle at every breakpoint instead: only the selected view is ever
mounted. List is the default.

Marker colour reuses the exact status.* tokens PipelineStrata already
defines (submitted=rust, resolved=verdigris, etc.), so the map and the feed
read as one visual system for the lifecycle, not two separate colour
languages. Markers are custom L.divIcon circles, not Leaflet's default blue
teardrop — sidesteps the well-known Leaflet+Vite default-marker-asset-path
bug for free, and avoids another "generic AI-default" look in a place
(maps) that's easy to leave stock.

=== MANDATORY SAFETY NET — built, not optional ===

Per the coordinator's explicit requirement, independent of how clean the
clustering algorithm is: a cluster marker's popup NEVER shows only a merged
count. When a cluster has more than one member, a `<details>` disclosure
(same accessible-by-default pattern used for ChallengeCard's "show more
matches") lists every individually linked report — title, description
snippet, date, and which one is the "first report" (canonical) — so a wrong
auto-link is something a citizen or institution can catch by looking, not
something that silently hides a report. This exists regardless of today's
detect-duplicates fix quality, and stays exactly as useful if a 6th failure
mode is ever found later.

=== CODE-LEVEL REUSE ===

  useChallengeMatches.ts (new hook) — the matches+institutions batch-fetch/
  group logic was identical between ChallengeFeed and the new map popups, so
  extracted it once rather than writing a second near-copy. ChallengeFeed
  was refactored to use it too (net simplification, not just avoided
  duplication going forward).

  clusterChallenges.ts (new, pure function, no React/no fetching) — turns a
  flat challenges array into {canonical, members}[] purely from
  `duplicate_of`. Kept pure specifically so it could be verified against
  real data independently of any rendering, which is exactly what the
  verification below does.

  MatchExplainer reused DIRECTLY in map popups (both full and compact modes,
  same component Task 3 built) — no tier/honest-fallback logic re-derived.

=== VERIFICATION — clustering checked against 25 REAL, messy, multi-round rows ===

Not synthetic: this is the actual `challenges` table after three rounds of
detect-duplicates testing (positive links, reverted false positives, the
lot). Ran the exact clusterChallenges() logic against a live snapshot:

  total rows with lat/lon: 25
  total map markers (clusters): 22
  single-report markers: 19

  CLUSTER (2) "Streetlights dark near hall" + "...by community hall"
  CLUSTER (2) "Pothole at bus stand" + "Big pothole near bus stand"
  CLUSTER (2) "Collapsed culvert near school" + "Culvert broken near..."

These are exactly the three genuine positive-case links created across all
three verification rounds — and NONE of the reverted false positives
(culvert/medicine, motorbike/gate, market/junction) show up as clusters,
confirming the earlier cleanup actually stuck. Integrity checks: all 25 rows
accounted for across the 22 clusters (none dropped), no row appears in more
than one cluster.

  npm run build   clean. Main chunk 559.71 kB (164.61 kB gzip) — back to
                  the SAME size as before Task 4, because:
  ChallengeMap.tsx is React.lazy()-loaded from Challenges.tsx, not imported
  eagerly. First attempt shipped it in the main bundle (719.53 kB) --
  caught immediately because it directly contradicted the design pass's own
  stated reasoning (don't spend a citizen's data on a map they never asked
  for) -- fixed same session. Leaflet + react-leaflet now live in their own
  159.92 kB chunk that only downloads when a visitor taps "Map".

  dev server      /challenges 200; ChallengeMap.tsx, clusterChallenges.ts,
                  useChallengeMatches.ts all serve 200.
  i18n            128 keys per language (+7 from Task 3's 121), parity OK.

NOT independently verified: actual browser rendering of markers/popups (no
browser-automation tool available in this environment). What IS verified:
the data layer feeding the map is correct against real rows, the build
type-checks every prop wired into Leaflet's API, and the same popup-content
component pattern (details/summary, MatchExplainer reuse) already proved
out visually in Task 3's ChallengeCard.

NOTED, NOT FIXED: attempted to lint the new files and found `npm run lint`
has never actually worked — no eslint.config.js exists anywhere in the
scaffold (ESLint 9 requires flat config; the script in package.json was
wired in Task 1b but never verified end-to-end). Pre-existing scaffold gap,
not something Task 4 introduced; flagging since I only just hit it.

FILES CHANGED:
- src/components/challenges/ChallengeMap.tsx        (new)
- src/components/challenges/clusterChallenges.ts     (new)
- src/hooks/useChallengeMatches.ts                   (new)
- src/components/challenges/ChallengeFeed.tsx        (refactored to use the
  new shared hook — net simplification)
- src/pages/Challenges.tsx                           (List/Map toggle,
  ChallengeMap lazy-loaded)
- src/i18n/locales/{en,hi}.json                      (+7 keys each)

INTEGRATION NOTES:
- ChallengeMap fetches up to 500 located challenges in one query (not
  paginated like the feed — a spatial overview wants the whole picture, not
  12-at-a-time). Will need revisiting if the table grows well past that;
  flagged as a scale limit, not fixed now.
- Two independent queries hit challenge_matches/institutions when List and
  Map are both used in one session (the hook is per-component, not shared
  across the toggle) — acceptable for MVP scale, noted rather than solved,
  consistent with how other minor perf tradeoffs have been handled this
  session.
- Task 5 (InstitutionQueue.tsx) can reuse clusterChallenges.ts and
  useChallengeMatches.ts directly if it ever needs either.

BLOCKERS: none.
```

---

## eslint.config.js — fixing the Task 1b lint gap — 2026-08-25

```
STATUS: COMPLETE — npm run lint now runs and reports clean

WHAT I BUILT: a standard flat config (eslint 9 requires this format; the
package.json script was wired in Task 1b but no config file ever existed,
so `npm run lint` had been silently broken since then). Uses only packages
already in package.json's devDependencies — nothing new installed:
  @eslint/js recommended + typescript-eslint recommended, react-hooks
  recommended rules, react-refresh's only-export-components as a warning.

FIRST RUN found 2 real errors + 6 warnings. Both errors were in
reference/Community-REFERENCE-PATTERN.tsx (`any` types) — that file is
tourism-repo material deliberately kept OUTSIDE tsconfig's `include` so it's
never typechecked or bundled (see Task 1b's status entry), but ESLint's
default `eslint .` glob doesn't know about tsconfig's include and scanned it
anyway. Added `reference` to the config's `ignores`, consistent with that
file's own stated purpose, rather than "fixing" content in a file that isn't
supposed to be live code.

SECOND RUN, clean: 0 errors, 3 warnings — all `react-refresh/only-export-
components`, all the ordinary "a hook/variant-helper is exported alongside a
component" pattern (button.tsx's buttonVariants, useAuth.tsx's
AuthProvider/useAuth/INSTITUTION_TYPES). This is the ​exact same warning
shadcn's own official scaffolding produces on its own button.tsx — not
restructuring working files to silence a fast-refresh-only warning.

FILES CHANGED:
- eslint.config.js  (new)

BLOCKERS: none.
```

---

## Task 5 — InstitutionPortal.tsx, InstitutionQueue.tsx, ClaimButton.tsx — 2026-08-25

```
STATUS: COMPLETE — builds clean, lint clean, claim-write discipline verified
        against 3 real scenarios including the exact case flagged in Task 1c

=== FIXTURE CHECK BEFORE BUILDING, per instruction to use existing data ===

  Ranchi Institute (university.test): 1 real unclaimed match, score 0.248,
  "water resources, village-scale infrastructure, handpump and borewell
  maintenance" — from the real insert -> categorize -> match chain run
  during earlier verification, not fabricated for this task.
  Palamu Agri-Tech (industry.test): 0 matches. A genuinely real state, not a
  gap — used as the live test of the empty-queue message rather than
  inventing a fixture the instruction said not to need.

=== DESIGN PASS (Global Rule #13) ===

Two real decisions, not a default list view:
  1. Split into "waiting for your decision" (unclaimed, ranked by match
     score — the most confident match first, since that's the one worth
     acting on) and "claimed by you" (a running record, newest first). An
     institution admin's actual question is "what do I need to act on right
     now" vs "what have I already committed to" — a flat list answers
     neither well.
  2. Every row shows the SAME MatchExplainer bridge a citizen sees on the
     public feed — not a stripped internal summary. The explainability is
     exactly what makes a claim defensible later; showing institutions a
     lesser version of the citizen-facing evidence would undercut the
     "not a black box" premise the whole project is built on.
  A third, smaller decision: an institution-role account with no linked
  institution row gets an explicit message naming the setup gap, not a
  generic empty queue — indistinguishable-looking states ("no institution
  linked" vs "no matches yet") hide a problem the admin can't fix
  themselves. Not a state that exists in the current 2 test accounts (both
  are linked), but real given profiles.user_type and institutions.admin_user_id
  are two separate writes that can legitimately land out of step.

=== THE FLAGGED RISK (Task 1c) — verified against 3 real live scenarios,
    not just read back from the code ===

ClaimButton uses `.eq("is_claimed", false).select()` and treats the
RETURNED ROW COUNT as the only success signal — never `!error`. Verified by
literally running the same write three ways against the real Ranchi match:

  1. REAL CLAIM (university.test claims its own unclaimed match):
     HTTP 200, 1 row returned, full row body including claimed_at.
     RE-READ: is_claimed = true. Matches.

  2. RACE / ALREADY CLAIMED (same match, claimed again immediately after):
     HTTP 200, 0 rows returned — the `is_claimed=false` guard excluded it.
     This is what ClaimButton's `data.length === 0` branch handles: shows
     notClaimed, never claims-that-didn't-happen.

  3. THE EXACT CASE FLAGGED IN TASK 1c (industry.test attempts to claim
     Ranchi's match, i.e. cross-institution): HTTP 200, 0 rows returned.
     RE-READ: is_claimed stayed false. RLS silently blocked the write and
     the response looked identical in STATUS to a real success — exactly
     the failure mode `!error` alone would have missed, confirmed live
     against the real claim policy, not assumed from reading the migration.

  Match state restored to genuinely claimed=true afterward (the real
  outcome of scenario 1) so the live app reflects true data, not leftover
  test artifacts.

=== QUERY VERIFIED AGAINST BOTH REAL ACCOUNTS ===

Ran InstitutionQueue's exact query (institution lookup by admin_user_id,
then challenge_matches with the challenges(...) embed, ordered by score) as
both test users:
  university.test -> institution found, 1 match, now correctly [CLAIMED]
  industry.test   -> institution found, 0 matches -> real empty-queue state
Confirmed the PostgREST embed key is literally `challenges` (tested directly
against the API before writing the TS interface, not guessed from the
generated types, since supabase-js doesn't strongly type nested embeds).

FILES CHANGED:
- src/components/institutions/ClaimButton.tsx     (new)
- src/components/institutions/InstitutionQueue.tsx (new)
- src/pages/InstitutionPortal.tsx                  (placeholder -> real page)
- src/i18n/locales/{en,hi}.json                    (+12 keys each)

One TS fix during build: `institution` state carries an `undefined`
"not yet fetched" sentinel in its type even though it can only be that at
runtime before `loading` clears — added an explicit `if (!institution)
return null;` guard after the real null-check so the rest of the render
narrows cleanly, rather than sprinkling `institution!` non-null assertions.

INTEGRATION NOTES:
- The institution identity header, MatchExplainer reuse, and claim-button
  write pattern here are the same shapes Task 7's dashboard could reuse if
  it ever needs an institution-scoped view.
- No "unclaim" action exists — not requested, not built.
- npm run lint: clean (0 errors, same 3 pre-existing warnings as before,
  none new from these files).
- npm run build: clean, 567.30 kB main chunk (164.61 -> 166.17 kB gzip,
  the queue/claim components' own weight), ChallengeMap's 159.92 kB chunk
  unaffected (still lazy, still separate).

BLOCKERS: none.
```

---

## Task 7 — ChallengeDashboard.tsx — 2026-08-25

```
STATUS: COMPLETE — builds clean, lint clean, every number verified against
        real live data before a single chart was written. THIS WAS THE LAST
        TASK ON THE ORIGINAL INBOX — see closing note at the end of this
        entry.

=== REAL-DATA CHECK BEFORE DESIGNING ANYTHING ===

Surveyed the actual `challenges`/`challenge_matches`/`institutions` tables
first, and it surfaced something that changed how the funnel had to be built
honestly:

  by status: {"submitted":25}   <- ALL 25 rows, zero exceptions
  by domain: 20 "uncategorised", 5 real domains at 1 each

Checked WHY every row sits at 'submitted': grepped every edge function and
every frontend write path for anything that sets `challenges.status`.
NOTHING does. categorize-challenge writes domain/domain_confidence only;
match-institutions writes challenge_matches only; nothing anywhere
transitions status past its DEFAULT 'submitted' value, regardless of how far
a challenge has actually progressed (categorised, matched, even claimed).

This is a genuine, previously undiscovered functional gap, not a dashboard
defect — the schema and PipelineStrata were built around a 5-stage
lifecycle that nothing currently drives. NOT fixed here: it would mean
either writing to Codex's edge functions (Global Rule #4) or adding a new
frontend write path against a column whose only UPDATE policy is
admin-only (would itself hit the exact Rule #15 silent-block pattern
Task 5 just verified), which is a real scope decision, not a one-line fix.
Filed to .agent/inbox/claude.md rather than patched. The dashboard itself
was built to show this HONESTLY (25/0/0/0/0 in the funnel) rather than
hide or approximate it — the gap is real information, not a rendering bug.

=== DESIGN PASS (Global Rule #13) ===

"Provable at a glance — real numbers, real matches, real reasoning, not a
dashboard that could be showing fake data" produced two decisions that are
NOT the default choice for a metrics page:

  1. The domain chart includes an explicit "Not yet categorised" bar (20 of
     25) rather than silently excluding rows with no domain. Hiding it would
     make categorisation coverage look better than the data actually shows.
  2. Institutional participation lists ALL 18 institutions, including the 6
     with zero matches — not a "top N" of active partners. A curated list of
     only winners is exactly the misleading polish this specific audience
     (deciding whether AI-matching is reaching the WHOLE partner network,
     not just a favoured few) needs to not see.

=== REUSE, verified — not re-derived ===

  MatchExplainer — reused directly for a "real match, explained" section
  (the single highest-scoring real match on record), explicitly labelled as
  an example rather than implied to be typical. No tier/fallback logic
  re-derived.
  PipelineStrata (compact) — reused directly for the most recently created
  challenge's real lifecycle position. CAUGHT MYSELF DUPLICATING LOGIC
  DURING THIS BUILD: first draft re-derived the stage order and stateOf()
  inline instead of importing lifecycleStages()/lifecycleStateOf() from
  challengeLifecycle.ts, which ChallengeCard already uses for the exact same
  purpose — fixed before finishing the task, not left in.
  clusterChallenges.ts — reused directly (via dashboardStats.ts) for the
  duplicate-cluster count and list, same function Task 4's map uses.

=== dashboardStats.ts — pure functions, verified against real data first ===

Every aggregate (domainCounts, statusFunnel, institutionParticipation,
duplicateClusterSummary, dashboardKpis) is a pure function taking real rows
in and real numbers out — written this way specifically so each could be
checked against a live snapshot BEFORE any chart code existed. Ran that
check; results below are what actually shipped, not adjusted after seeing
charts render:

  domainCounts:  uncategorised 20, water_resources 1, education 1,
                 healthcare 1, environment 1, accessibility 1
  statusFunnel:  submitted 25, ai_matched 0, claimed 0, in_progress 0,
                 resolved 0
  institutionParticipation: all 18 institutions present, sorted by total
                 matches desc, 6 genuinely at zero (not omitted)
  duplicateClusterSummary: 22 total clusters, 3 folded reports, matching
                 the exact 3 clusters Task 4 verified (streetlights,
                 pothole, culvert-near-school) — confirms detect-duplicates'
                 real output is what's driving this number, not a
                 recomputation that happens to agree
  KPIs: totalChallenges 25, institutionsEngaged 12 of 18, matchesClaimed 1
                 of 17, duplicateClusters 22
  integrity: every challenge accounted for exactly once across both the
                 domain buckets and the status buckets — no row dropped,
                 none double-counted.

=== BUNDLE SIZE — caught before it shipped, same pattern as Task 4 ===

First build: main chunk 961.14 kB — Recharts adds ~400 kB and I had imported
Dashboard.tsx eagerly in App.tsx. /dashboard is admin-gated, so almost no
visitor ever needs this code — the exact same reasoning Task 4's lazy-loaded
map already established, and shipping it eagerly here would have directly
contradicted that precedent. Lazy-loaded Dashboard.tsx itself (React.lazy +
Suspense in App.tsx, matching the ChallengeMap pattern): main chunk back to
570.31 kB, Dashboard now its own 389.67 kB chunk, ChallengeMap's 159.64 kB
chunk unaffected.

  npm run build   clean.
  npm run lint    clean (0 errors, same 3 pre-existing warnings, none new).
  dev server      /dashboard 200; ChallengeDashboard.tsx, dashboardStats.ts
                  both serve 200.
  i18n            162 keys per language (+22 from Task 5's 140), parity OK.

FILES CHANGED:
- src/components/dashboard/dashboardStats.ts       (new — pure, verified)
- src/components/dashboard/ChallengeDashboard.tsx  (new)
- src/pages/Dashboard.tsx                          (placeholder -> real page)
- src/App.tsx                                      (Dashboard route lazy-loaded)
- src/i18n/locales/{en,hi}.json                    (+22 keys each)

BLOCKERS: none for Task 7 itself. See the status-advancement gap above,
filed separately.
```

---

## MVP TASK LIST — CLOSED — 2026-08-25

All 7 tasks from the original `.agent/inbox/claude-code.md` are now complete,
each built, verified against real live data (not synthetic fixtures), and
logged in this file with what was checked and how:

  Task 1  — migration applied, types regenerated, conformance audited
  Task 1b — frontend scaffold (Vite/React/TS/Tailwind/shadcn/i18n/Supabase)
  Task 1c — auth flow, real test accounts (citizen/university/industry)
  Task 1d — citizen->tourist rename, admin-gated dashboard, admin account
  Task 2  — ChallengeSubmissionForm.tsx, full submit path verified live
  Task 3  — ChallengeFeed/ChallengeCard/MatchExplainer, verified against
            17 real match rows across all 3 confidence tiers
  Task 4  — ChallengeMap.tsx, real detect-duplicates clustering (3 rounds
            of independent re-verification against Codex's fixes), the
            mandatory expand-to-show-underlying-reports safety net
  Task 5  — InstitutionPortal/InstitutionQueue/ClaimButton, claim-write
            discipline verified against 3 real scenarios incl. the exact
            RLS silent-block case flagged in Task 1c
  Task 6  — institutions.json seed data (18 entries, all 10 domains)
  Task 7  — ChallengeDashboard.tsx, every metric verified against real data
            before being charted

Per instruction: not reaching for new work from here. The next step is a
coordinated review, not another task dispatch — stopping here.

TWO GENUINE FINDINGS ARE STILL OPEN, both filed to .agent/inbox/claude.md,
neither fixed unilaterally (Rule #14 — these are exactly the kind of call
that needs a checkpoint, not my own judgment executed past it):

  1. `challenges.status` never advances past 'submitted' anywhere in the
     system (found while building Task 7's funnel). The 5-stage lifecycle
     the schema and PipelineStrata are built around currently has no real
     driver. Needs a scope decision: an edge-function write (Codex) or a
     new admin-scoped frontend write path (mine), either of which is new
     work beyond what's already built, not a bug in what exists.
  2. detect-duplicates' dynamic-frequency fix has a structural cold-start
     gap: a domain-common word pair used for the first time (0% prior
     corpus frequency) is not yet discounted, so it can still false-link.
     Per explicit instruction, algorithm iteration stopped after this was
     found — Task 4's expand-to-show-underlying-reports safety net is the
     intended mitigation, already built, not pending.

profiles.user_type remains self-writable under current RLS (documented,
inert against every real authorization boundary tested, not touched).


```
1. profiles.user_type is self-writable (see finding above). Inert today because the
   claim gate uses institutions.admin_user_id, but it should never be relied on for
   authorisation anywhere. If it ever needs locking down, that is a migration
   restricting the profiles UPDATE policy's columns.

2. match_reason text quality — Codex's stopword fix outstanding. The overlap
   predicate counts the stopword "and" as a match, so the honest fallback under-
   fires. Task 3 is held on this.

3. categorize-challenge and match-institutions are deployed and working; the full
   insert -> categorize -> match chain is verified.

4. RESOLVED — 'tourist' renamed to 'citizen' via
   20260825150000_rename_tourist_to_citizen.sql. See Task 1d entry above for the
   applied/regenerated/verified detail.
```

---

## 20260825160000_advance_status_on_claim.sql — status-advancement fix, final MVP item — 2026-08-25

```
STATUS: COMPLETE — migration applied exactly as specified, trigger verified
        live with a positive case, a negative case, and confirmed the
        dashboard funnel now shows real non-zero counts. This closes the
        gap flagged from Task 7. No new task started after this, per
        instruction.

Created supabase/migrations/20260825160000_advance_status_on_claim.sql with
the exact content given, unmodified. Applied cleanly:
  supabase db push -> Applying 20260825160000_advance_status_on_claim.sql...
                       Finished supabase db push.
  Recorded: 20260825160000 | 20260825160000 (Local | Remote)

=== A FINDING BEFORE VERIFICATION EVEN STARTED: Codex independently fixed
    the OTHER half of the gap ===

Before selecting test rows, surveyed current status distribution to see
what "one of the real existing ai_matched rows" would even mean given my
Task 7 finding that nothing sets that status. Found: 1 challenge (Ranchi's
"Handpump dry for three weeks") was ALREADY at status='ai_matched' — which
should have been impossible per my own Task 7 grep. Investigated rather
than assuming I'd misremembered: re-grepped the live match-institutions
source and found Codex had added

  .update({ status: "ai_matched" }).eq("status", "submitted")

at index.ts:231-239, file timestamp 15:26 — after my Task 7 survey, before
this task started. Independently, without coordination through this
session. This is genuinely the "two transitions" the coordinator's message
referred to: Codex closed submitted->ai_matched on their own initiative,
this migration closes ai_matched->claimed. Between the two, the gap I
originally flagged is now actually closed, not just half-addressed.

The ONE row already at ai_matched got there because I had re-invoked
match-institutions on it live during earlier detect-duplicates
re-verification rounds, sometime after Codex's fix was deployed — a real
side effect of real testing, not something I engineered.

=== VERIFICATION — 3 real scenarios, re-read per Rule #15 throughout ===

STEP A — a second real ai_matched row, without fabricating one via SQL:
rather than manually setting status on a row (which would misrepresent
what the system actually does), re-invoked the REAL match-institutions
function against a real existing challenge ("Only one teacher for five
classes", owned by citizen.test, already had a real domain and real prior
matches from earlier rounds):
  POST /functions/v1/match-institutions -> HTTP 200, 3 matches
  RE-READ challenge status -> ai_matched. Confirmed by exercising the real,
  already-fixed production function, not by writing the column directly.
  Checked for side effects: table-wide challenge_matches count unchanged
  (17 before, 17 after) — the function's own upsert-by-institution
  correctly updated existing rows rather than duplicating them.

STEP B — the actual trigger under test, on Ranchi's real Handpump match:
  precondition confirmed: challenge status = ai_matched (real, from above)
  reset the EXISTING claim (is_claimed=false, claimed_at=null) via
  service-role first — the prior claimed_at predates this trigger's
  existence, so no trigger had ever fired for it; this creates a genuine
  fresh claim EVENT to observe.
  Then the REAL authenticated write, byte-for-byte what ClaimButton itself
  sends (`.eq("is_claimed", false).select()`, university.test's session):
    HTTP 200, 1 row returned
  RE-READ challenges.status (not the response, not "the trigger exists so
  it must have worked") -> "claimed". TRIGGER FIRED CORRECTLY.

STEP C — negative case, since a trigger that fires unconditionally is as
wrong as one that never fires: picked a real unclaimed match whose
challenge was still genuinely 'submitted' (never reached ai_matched —
"Health centre has no medicines"). Claimed it via service-role directly
(the trigger fires on the UPDATE itself regardless of caller, so this
isolates the trigger's own WHERE-clause behaviour from the RLS/auth
question Task 5 already settled separately).
  RE-READ challenges.status after the claim -> still "submitted". The
  trigger's `AND status = 'ai_matched'` guard correctly refused to advance
  a challenge that was never actually matched. Reverted the probe claim
  afterward (service-role) since it was a trigger-logic test, not a real
  business action.

=== FUNNEL RE-CHECK — the actual point of the whole fix ===

Re-ran Task 7's exact statusFunnel() query against the live table after
the above:

  BEFORE this task: {"submitted":25}
  AFTER:             {"submitted":23,"ai_matched":1,"claimed":1}

Real, non-zero counts in both buckets the coordinator asked to see, sourced
entirely from genuine system behaviour (Codex's fix + this trigger + one
real re-invocation + one real re-claim) — nothing backfilled, nothing set
directly on the challenges table to make the chart look populated. The
other 23 rows correctly remain at 'submitted': most never went through
categorize-challenge/match-institutions at all (they were location/
duplicate-detection test fixtures from earlier rounds), which is the
honest state, not a shortfall.

FILES CHANGED:
- supabase/migrations/20260825160000_advance_status_on_claim.sql (new,
  applied exactly as specified)
- no application code changed

BLOCKERS: none.

CLOSING NOTE: this was explicitly the last item before the coordinated
review. Not starting any new task. The dashboard funnel a reviewer opens
right now will show real, non-trivial values in submitted/ai_matched/
claimed, reflecting genuine data and genuine (now-closed) status-advancement
logic — this was the whole point of the fix, confirmed rather than assumed.
```

---

## Debate-room review — 3 items — 2026-08-25

```
STATUS: ALL 3 COMPLETE. Verification and cleanup only, as instructed — one
        real defect found and fixed in item 2, no scope expansion.

=== ITEM 1 — data hygiene + fresh real demo data ===

Classified all 25 challenges before touching anything: 5 real (from actual
categorize/match chain runs across earlier tasks), 20 synthetic (every
duplicate-detection and RLS-adversarial fixture across three testing rounds
— the culvert/medicine, motorbike/gate, market/junction rows and their
repeats). Checked for cross-references before deleting, not assumed clean:
  - 3 duplicate_of pointers exist among all 25 rows; all 3 point WITHIN the
    synthetic set, none touch a real row.
  - 0 challenge_matches rows reference any of the 20 synthetic ids.
Deleted all 20 via service-role, confirmed by `Prefer: return=representation`
(20 rows returned, not just HTTP 200) and a follow-up RE-READ: 5 real rows
remained, 17 challenge_matches rows unaffected (none belonged to the 20).

Created 6 fresh, realistic demo challenges spanning domains not yet
represented (irrigation/agriculture, transformer/energy, market-road,
ration-card, MGNREGA-wages, sand-mining), submitted as citizen.test through
the REAL chain (insert -> categorize -> match) — all 6 succeeded, all 6
landed at status=ai_matched (re-read confirmed, not assumed from responses).
Classifier's real domain calls didn't always match my intended label (e.g.
"ration card" -> accessibility, not public_administration; "MGNREGA wages"
-> water_resources, not rural_livelihoods) — reported honestly as the real
model output, NOT corrected after the fact to look tidier.

Claimed 2 of the new matches for real, via the actual linked institution
accounts (not fabricated): Ranchi (university.test) claimed its real
MGNREGA-wages match; Palamu (industry.test) claimed its real irrigation
match. Both re-read confirmed is_claimed=true AND the claim trigger fired
(challenges.status -> claimed).

FUNNEL BEFORE -> AFTER (real statusFunnel() query, not estimated):
  BEFORE: submitted 25, ai_matched 0, claimed 0, in_progress 0, resolved 0
  AFTER:  submitted 3,  ai_matched 5, claimed 3,  in_progress 0, resolved 0
  (a 6th ai_matched row was added during item 3's verification below,
  final combined total is submitted 3 / ai_matched 6 / claimed 3 — see
  item 3)
  domains: 7 real, distinct domains represented (was 5 domains + a 20-row
  "uncategorised" bucket that no longer exists at all)
  institutions engaged: 17 of 18 (was 12 of 18)
  matches: 38 total, 3 claimed (was 17 total, 1 claimed)

FILES CHANGED: none (data only, via service-role REST, no schema/code touched)
BLOCKERS: none.

=== ITEM 2 — match-institutions failure degradation ===

Read the exact code path rather than guessing: `if (matErr || !mat?.success)
{ setPhase("done"); setError(t("submit.error.matchPartial")); return; }`
— structurally identical to categorize-challenge's own handling. Confirmed
the i18n string is the honest message asked for: "Your report is saved and
sorted. Matching to institutions did not finish — it will be retried
shortly." Forced a REAL failure live (invalid domain value against the
deployed function) to confirm the response shape actually trips this exact
branch: HTTP 400, {"success":false,...} -> `!mat?.success` is true. Not
theoretical.

FOUND A REAL BUG while verifying, not fixed already: PipelineStrata's
stateOf() computed a "reached" index purely from `phase`, and once phase
hit "done" — which happens on BOTH real success and this soft-fail path —
every stage rendered "done" (green), including the "matched" stage on a
run where matching had just failed. The honest error text below it was
correct; the pipeline visualisation right above it was not — exactly the
"misleading success state" this review item asked to rule out.

FIX: added `failedStage` state (0/1/2, set only on the categorise/match
soft-fail branches, not on thrown exceptions which already had their own
correct "error" phase handling). stateOf() now checks it first: stages
before the failure show "done", the failed stage shows "failed", stages
after show "pending" — never masked as complete.

Verified the fixed logic in isolation (replicated stateOf() exactly)
against all 4 real phase/failedStage combinations:
  match-institutions fails:  done, done, FAILED   (was: done, done, done)
  categorize fails:          done, FAILED, pending (was: done, done, done)
  full real success:         done, done, done      (unchanged, correct)
  thrown exception:          failed, pending, pending (unchanged, correct)

npm run build clean, npm run lint clean (0 errors, same 3 pre-existing
warnings, none new) after the fix.

FILES CHANGED:
- src/components/challenges/ChallengeSubmissionForm.tsx (failedStage state
  + stateOf() fix; resetForm now clears it too)

BLOCKERS: none. This was verification that surfaced a real defect, which
was then fixed per the instruction's own "if it doesn't, fix it" branch —
not scope expansion, the fix is confined to the exact file/behaviour asked
about.

=== ITEM 3 — true-minimal submission path, live ===

Ran citizen.test through the exact minimal path ChallengeSubmissionForm
supports: description only — no title (falls back to a description slice,
same as the real form), no photos (empty array, upload step never invoked),
no location text, no geolocation (lat/lon both null). A real new challenge
("community toilet block locked for a month"), inserted via the RLS INSERT
path, then the real categorize-challenge and match-institutions calls:

  [2 insert]     OK, RE-READ confirmed lat=null lon=null location_text=null
                 photos=0 immediately after insert (Rule #15 — not assumed
                 from the insert response)
  [3 categorize] OK domain=accessibility conf=0.2713
  [4 match]      OK 3 matches, e.g. #1 0.3824 Deoghar College of Education
                 and Pedagogy
  [5 RE-READ]    status=ai_matched, domain populated, photos/lat/lon/
                 location_text still genuinely null/empty — nothing was
                 silently defaulted to a non-null placeholder anywhere in
                 the chain.

VERDICT: PASS. The full insert -> categorize -> match chain completes
successfully with every optional field genuinely absent, confirmed by
re-reading the final row, not by trusting the function responses alone.

This created one additional real challenge (not part of item 1's curated
6 — a natural byproduct of verifying this specific path live, not extra
feature work). Left in place rather than deleted, same "real data, not
fabricated" reasoning as the rest of this session; flagging plainly so the
coordinator can remove it if a more tightly curated count is wanted for the
demo.

FILES CHANGED: none.
BLOCKERS: none.

=== FINAL COMBINED STATE, all 3 items applied ===

  challenges total: 12  (5 kept real + 6 fresh demo + 1 from item 3's test)
  by status:  {"ai_matched":6,"submitted":3,"claimed":3}
  by domain:  accessibility 4, healthcare 1, environment 1, education 1,
              water_resources 2, agriculture 2, energy 1  (7 distinct real
              domains, zero "uncategorised")
  duplicate_of set: 0  (no leftover synthetic clusters)
  matches: 38 total, 3 claimed
  institutions engaged: 17 of 18

Every number above is read directly from the live table after this session's
own real actions (deletions, real chain submissions, real claims) — nothing
here was backfilled or set directly on a status column to make it look
populated.
```

---

## Visual direction — Razorpay AI Builders reskin (homepage only) — 2026-08-26

STATUS: DONE — homepage + shared chrome reskinned, verified live, awaiting
coordinator sign-off before Challenges/Dashboard/InstitutionPortal/Auth.

### Scope
Full replacement of the graphite/rust/ochre/verdigris "mineral strata"
identity, per coordinator dispatch. NOT a blend — the prior palette is gone
from the token layer entirely.

### Design-package preview round (preceding this dispatch)
Previewed 5 typeui.sh packages by pulling real DESIGN.md content (the
`--dry-run` flag only prints a filename, so each was pulled into an isolated
scratch dir instead and read):
- enterprise   — #0C5CAB blue, IBM Plex Sans, dark cloud-dashboard
- bold         — Archivo Black, #0077BC/#009866, poster register
- contemporary — #C800DF/#E60076 magenta, playful bento
- modern       — IBM Plex Serif, #553F83 purple, editorial
- impeccable   — Chakra Petch, #CC8800/#C55221 warm cream
Rejected without preview per instruction: Neon, Cosmic, Pacman, Fantasy,
Glassmorphism, Doodle, Matrix, Retro, Gradient.
Coordinator selected "enterprise as a base only"; that direction was then
SUPERSEDED by the Razorpay reskin dispatch before it reached the rest of the
app. Only the homepage had been built against it.

### Tokens applied (src/index.css — full replacement)
- background pure black `0 0% 0%`; card `0 0% 4%`
- single accent `224 100% 50%` = **#0044FF exactly** (verified live, see below)
- `--radius: 0px` across the board; borderRadius lg/md/sm all flattened in
  tailwind.config.ts (previously `calc(var(--radius) - 2px)`, which would
  compute NEGATIVE at radius 0)
- `--muted-foreground: 0 0% 55%` — deliberately low contrast, DECORATIVE ONLY
- light/dark no longer diverge: `.dark` carries identical values, black is the
  one committed look

### JUDGMENT CALL (flagged, not silently applied)
The old 5-state lifecycle ramp was five unrelated hues (rust, ochre, 2 teals,
verdigris). Kept literally next to pure-black + one aggressive blue, that reads
as two design systems bolted together. Recast as a single-hue BLUE RAMP:
  submitted 224 25% 42% -> ai_matched 224 55% 52% -> claimed 224 75% 55%
  -> in_progress 224 90% 58% -> resolved 224 100% 50% (converges on brand blue)
Still five ordinally distinct states; no longer competes with the single-accent
mandate. Coordinator should confirm or override.

### Typography
- display: Playfair Display 700/900 (headlines only), Georgia fallback
- mono: JetBrains Mono (buttons, labels, nav, IDs, ticker) — already in stack
- sans: Inter RETAINED for body paragraphs. Deliberate: the spec's own
  accessible-contrast carve-out covers functional copy a citizen must read;
  mono body paragraphs would hurt real legibility. Flagging as an
  interpretation, not an omission.
- index.html font link swapped Barlow Semi Condensed -> Playfair Display

### Components
- `src/components/home/Ticker.tsx` NEW — infinite CSS marquee, full-bleed
  (`left-1/2 w-screen -translate-x-1/2`, since AppLayout wraps pages in a
  max-width container and a boxed marquee reads as a widget). PLACEHOLDER
  content = the real challenge_domain enum labels, i18n'd. Swap for Codex's
  live feed when ready; component shell stays.
- `src/components/home/AsciiBlock.tsx` NEW — static ASCII texture PLACEHOLDER.
  Swap for Codex's image-to-ASCII generator when ready; keep the frame.
- `MatchExplainerDemo.tsx` RESKINNED ONLY — reveal sequencing, node structure,
  tier badge and honest-fallback rules all untouched.
- `button.tsx` — rounded-none, font-mono uppercase, hard-invert hover per
  variant (no opacity fades). focus-visible ring deliberately left intact.
- `AppLayout.tsx` — mono nav chrome, hard invert on hover, active = accent.
  Brand mark kept mono (Playfair reserved for oversized headlines).
- `Home.tsx` — vw-scaled headline (`text-[12vw]` / `sm:text-[7vw]`).

### Steps section — flagged pattern corrected BEFORE this dispatch
Coordinator flagged my first homepage pass for using three equal icon+text
cards (the same pattern already removed from the presentation deck). Confirmed
the finding directly rather than defending it. Rebuilt asymmetric: step 02
(classify+match, the actual differentiator) is larger, bordered, accent-filled
and flex-[1.35]; 01/03 are smaller quieter satellites; a connecting rule runs
through all three at icon height so it reads as one sequence, not three tiles.

### BUG FOUND AND FIXED during verification (real, not cosmetic)
Under `prefers-reduced-motion: reduce`, homepage demo content sat at
**opacity 0 for ~1.2-1.4s**. Root cause: the global reduced-motion rule zeroed
`transition-duration` but NOT `transition-delay`, and the reveal drives
visibility off staggered delays up to ~1.5s. Probed the actual timeline before
fixing (0/300/600/1000/1400ms samples), added `transition-delay` +
`animation-delay` resets, re-probed: now opacity 1 by 300ms.
This is exactly the "reduced-motion respect stays functional" clause in the
dispatch — it was NOT functional, and would not have been caught by eye.

### Live verification (Playwright against the running dev server)
- accent CTA rest `rgb(0, 68, 255)` = #0044FF exact; hover hard-inverts to
  black bg / blue text; `border-radius: 0px`; `font-family: JetBrains Mono`
- nav link hover inverts transparent/grey -> white bg / black text
- headline computed family `"Playfair Display", Georgia, serif` (CONFIRMED —
  first screenshot showed stale `Barlow Semi Condensed`; tailwind.config.ts
  changes need a dev-server restart, HMR does not pick them up. Re-verified
  after restart rather than trusting the config edit.)
- marquee translates -44px -> -110px over 900ms (animating, not stalled)
- reduced-motion: marquee holds still, demo content visible
- focus ring present: `rgb(0,68,255) 0 0 0 4px`

### Checks
- `tsc --noEmit` clean
- `npm run lint` 0 errors (3 pre-existing react-refresh warnings, untouched)
- `npm run build` clean; main chunk 583 kB (was 581 kB pre-reskin — the +2 kB
  is the two new placeholder components, no new heavy dependency added)

### FILES CHANGED
- src/index.css (token layer replaced; reduced-motion rule completed)
- tailwind.config.ts (fonts, radius flattening, marquee keyframes/animation)
- index.html (font link)
- src/components/ui/button.tsx
- src/components/layout/AppLayout.tsx
- src/pages/Home.tsx
- src/components/challenges/MatchExplainerDemo.tsx
- src/components/challenges/PipelineStrata.tsx (edge-bar cliche removed in the
  preceding pass: thin sliver -> full-weight band; active state pulses)
- src/components/home/Ticker.tsx (NEW)
- src/components/home/AsciiBlock.tsx (NEW)
- src/i18n/locales/en.json + hi.json (home.eyebrow/steps/demo keys, both
  locales, strict key parity maintained)

### BLOCKERS / OPEN
1. Register tension, flagged not blocked: pure-black + electric-blue +
   brutalist sits further from the "GOV.UK confident" target than the
   enterprise direction did, and closer to a fintech/builder-tool register.
   The dispatch's accessible-contrast carve-out reads as deliberate, so this
   was executed as specified — naming it, not overriding it.
2. Status-ramp recast (above) needs confirm/override.
3. NOT DONE by design: Challenges, Dashboard, InstitutionPortal, Auth, and
   ChallengeSubmissionForm are all still on the OLD visual language. The app
   is visually INCONSISTENT until those land. Held per explicit sequencing
   instruction ("Homepage only first ... Screenshot before proceeding").
4. When the remaining pages are reskinned, `--muted-foreground` must NOT be
   applied to form labels, help text, or error copy — the low contrast is for
   decorative text only.

---

## Strata Visual System Round 2 — Tasks 1, 3, 4 done; Task 2 BLOCKED — 2026-08-26

STATUS: 3 of 4 done. Task 2 (interactive match-simulator hero) is BLOCKED and
was NOT built — blocker written to `.agent/inbox/claude.md` per Global Rule #5.

### Task 2 — BLOCKED, not attempted (summary; full detail in the inbox)
`simulateMatch()` needs `VITE_SIMULATOR_CHALLENGE_ID`, which is not set
(verified: `grep VITE_SIMULATOR_CHALLENGE_ID .env` = 0 matches). Two
independent problems, both checked against real code rather than assumed:
1. Both edge functions enforce challenge ownership via the caller's JWT.
   `/` is a PUBLIC route — confirmed directly in App.tsx, no RequireAuth or
   RequireUserType wraps it. Anonymous visitors (the majority of homepage
   traffic, including judges) have no owning JWT, so every simulator run
   fails the ownership check outright.
2. Even signed in, each run calls the REAL `match-institutions`, which
   INSERTS into `challenge_matches` — unboundedly, against one shared
   placeholder challenge. That re-opens the exact demo-data pollution the
   debate-room review just finished cleaning up, in ongoing rather than
   one-time form.
Homepage centerpiece therefore stays the existing static
`MatchExplainerDemo`. Three options offered in the inbox; not picking one
unilaterally (Rule #14 — this is a cross-agent + data-integrity decision).

### Task 1 — StrataDivider (`src/components/StrataDivider.tsx`, NEW)
SVG polygon bands using Codex's `STRATA_COLORS` + `STRATA_LAYER_THICKNESS`,
imported not redefined. Boundaries are jagged (two summed sine terms per
edge, distinct seed per boundary) so no two edges wobble in lockstep —
geological cross-section, not a gradient bar. Full-bleed, aria-hidden.
Placed between all major homepage sections, alternating -rotate-1/rotate-1
(also satisfies Task 4's "bands at a slight angle").

### Task 4 — asymmetric hero
Was: `mx-auto max-w-4xl text-center` — a centered stack. Now a 12-col grid,
headline left-weighted at col-span-7 with `text-left`, right column
(col-span-5) bleeding PAST the container edge on desktop
(`-right-6 w-[calc(100%+1.5rem)]`). Headline scale raised to
`text-[14vw]`/`sm:text-[6vw]`.
The right column uses Codex's `useLiveChallengeMetrics()` — real counts read
from the live database, not decorative filler and not invented stats. This
respects the design-brief's "not a dashboard that could be showing fake
data" standard on a public marketing surface too. Rendered live: 10 / 32 /
0%, matching the real table state.

### Task 3 — palette migration across remaining pages
New adapter `src/lib/strataStatusMap.ts` (see DATA-SHAPE FLAG below). Then:
- `PipelineStrata` — dropped the hand-authored `--status-*` CSS vars for
  Codex's colours via the adapter; labels switched to mono.
- `ChallengeDashboard` — funnel `Cell` fills now from the adapter, so a
  status is one colour in the chart AND in the strata bands.
- `ChallengeMap` — marker dots now inline `background-color` from the
  adapter. This also REMOVED a real latent hazard: the old code needed
  literal Tailwind class names because the marker HTML is handed to Leaflet
  as a raw string outside JSX, where an interpolated class emits no CSS. A
  hex value has no such constraint.
- `SignIn` — stratum marker via adapter.
- Corner radius flattened to `rounded-none` across all remaining pages
  (`rounded-full` deliberately KEPT for dots/avatars where it is a shape,
  not a style choice). Inputs/textarea also flattened.
- Recharts bar `radius` props removed in 3 places — rounded bar tops
  directly contradicted the sharp-corner token layer.

### ACCESSIBLE-CONTRAST CARVE-OUT — applied deliberately
Per the standing instruction that the low-contrast `--muted-foreground`
trick must NOT touch functional copy: form labels, help text, field
instructions, and the sign-in intro moved to `text-foreground/70`;
placeholders to `text-foreground/50`. `--muted-foreground` now remains only
on genuinely decorative/secondary text. Files: AuthForm,
ChallengeSubmissionForm, SignIn, input.tsx, textarea.tsx.

### BUG FOUND AND FIXED — contrast failure introduced by the new palette
Codex's five strata colours span light tan (`#c28a3d`) to near-black
(`#252b35`). PipelineStrata hardcoded WHITE label text on every filled band.
Computed real WCAG contrast ratios rather than eyeballing it:
    submitted   #c28a3d  white 3.00:1  <-- FAILS (below 4.5)
    ai_matched  #a94b2c  white 5.63:1
    claimed     #66717f  white 4.96:1
    in_progress #252b35  white 14.23:1
    resolved    #0044ff  white 6.42:1
Added `strataTextOn()` (relative-luminance based) so each band picks the
higher-contrast option. `submitted` now uses BLACK text at 7.00:1. All five
bands now clear 4.5:1. Verified numerically before and after.

### BUG FOUND AND FIXED — dashboard funnel hid a whole stage
Screenshot of the live admin dashboard showed the funnel's second bar with
NO x-axis label. Recharts silently drops overlapping ticks, and "Matched to
expertise" was being dropped entirely — an unlabelled bar on the one chart
whose stated job is making the pipeline provable. Fixed with `interval={0}`
plus increased axis height and smaller tick font. Re-verified live: all five
stage labels now render. Pre-existing, surfaced by this pass, not caused by
it.

### DATA-SHAPE FLAG — Codex's STRATA_STATES do not match the real enum
`strataTokens.ts` exports
`["submitted","reviewing","matched","in_progress","resolved"]`.
The real `public.challenge_status` enum (contracts.md, which is law per
Global Rule #1) is
`["submitted","ai_matched","claimed","in_progress","resolved"]`.
"reviewing" is not a real lifecycle stage, and Codex's "matched" sits at
index 2 where the real `ai_matched` is index 1 — there is NO correct
name-for-name mapping. Rather than rename Codex's file (Rule #4) or silently
mismap, added `strataStatusMap.ts` which maps POSITIONALLY: real status at
index i takes Codex's colour/thickness at index i. Colour VALUES are always
imported, never redefined. Lifecycle order is reused from
`challengeLifecycle.ts` rather than re-declared — caught myself duplicating
that constant and removed the duplicate before it spread.
NEEDS A DECISION: either Codex realigns STRATA_STATES to the real enum, or
this positional adapter is ratified as the permanent seam.

### Codex utilities NOT used, and why
- `useAnimatedCounter` — USED (hero metrics).
- `grainTexture.ts` — not used yet. No surface in this dispatch called for
  it; adding grain purely because it exists would be decorative filler,
  which the brief rules out.
- `tickerData.ts` (`loadTickerLabels`) — not wired. Ticker still uses the
  static domain labels. Swapping it in is a live-data change to a public
  surface and belongs with the Task 2 decision, not slipped in silently.

### Checks
- `tsc --noEmit` clean
- `npm run lint` 0 errors (3 pre-existing react-refresh warnings, untouched)
- `npm run build` clean, main chunk 587 kB
- Dev server restarted before every verification pass (Global Rule #7) —
  this matters: an earlier round proved tailwind.config.ts changes do NOT
  survive HMR and produced a misleading screenshot.
- Live page sweep via Playwright: /challenges, /signin, /submit,
  /institutions, /dashboard — zero console errors, zero page errors.
  /institutions and /dashboard correctly redirect to sign-in when
  unauthenticated (route guards intact); dashboard verified while signed in
  as admin.test.

### FILES CHANGED
- src/components/StrataDivider.tsx (NEW)
- src/lib/strataStatusMap.ts (NEW — adapter + contrast helper)
- src/pages/Home.tsx (asymmetric hero, dividers, live metrics)
- src/components/challenges/PipelineStrata.tsx
- src/components/dashboard/ChallengeDashboard.tsx
- src/components/challenges/ChallengeMap.tsx
- src/pages/SignIn.tsx
- src/components/auth/AuthForm.tsx
- src/components/challenges/ChallengeSubmissionForm.tsx
- src/components/ui/input.tsx, textarea.tsx
- src/App.tsx, src/components/layout/AppLayout.tsx (radius sweep)
- ChallengeFeed / ChallengeCard / MatchExplainer / Challenges /
  InstitutionQueue / InstitutionPortal / RequireAuth / NotFound / card /
  skeleton (radius sweep only)
- src/i18n/locales/en.json + hi.json (home.stats.*, both locales, parity kept)
- .agent/inbox/claude.md (Task 2 blocker)

### BLOCKERS / OPEN
1. Task 2 blocked — see inbox. Needs a decision, not more building.
2. STRATA_STATES vs. real enum mismatch — needs confirm/override.
3. `loadTickerLabels` and `grainTexture` deliberately unused; say the word
   and the ticker can move to live data.
4. (CLOSED) InstitutionPortal verified signed in as university.test —
   renders correctly under the new palette with real data (Ranchi Institute
   of Rural Technology, 0 waiting / 2 claimed), no page errors.

---

## Resolution Confirmation Flow — 3 tasks, all end-to-end verified — 2026-08-26

STATUS: DONE. Waited for and confirmed Codex's confirm-resolution
function + migration (20260826100000_add_resolution_confirmation.sql) were
COMPLETE and deployed before starting, per instruction — verified live via a
direct anon-key read of `challenges.resolved_confirmed_at` on
fhjxngqfredhsszwqmuf, not just by trusting Codex's status entry.

### Pre-existing gap found before Task 1 could be built
Institution admins have NO UPDATE grant on `public.challenges` (only admins
do — confirmed by reading the RLS policies directly). "Mark Resolved"
therefore could not be a client-side `challenges.status` write. This is the
same shape as the existing claim→'claimed' transition
(20260825160000_advance_status_on_claim.sql), so a new migration was
required, not optional. Per Global Rule #14 and this project's standing
practice, presented the exact SQL and got explicit confirmation before
applying it to the shared live database — did not proceed on my own
reasoning alone.

### New migration — supabase/migrations/20260826110000_advance_status_on_resolve.sql
Applied via `supabase db push` (confirmed) after sign-off. Adds
`challenge_matches.marked_resolved_at` (nullable, writable by the
institution admin under the EXISTING "Institution admins can claim their
own matches" UPDATE policy — column-agnostic, no RLS change needed) plus a
SECURITY DEFINER trigger `advance_challenge_on_resolve` that flips
`challenges.status` to 'resolved' only from 'claimed' or 'in_progress'.
Deliberately distinct from Codex's `resolved_confirmed_at`/
`resolved_confirmed_by`: this is the INSTITUTION's claim the work is done;
Codex's columns are the CITIZEN's independent confirmation. Never conflated
— two different tables of truth, on purpose.
Regenerated types.ts afterward — caught and fixed a real corruption first:
`supabase gen types` piped its own "Initialising login role..." /
update-nag banner into the redirected file, which would have failed the
build silently if not caught. Verified clean after stripping it (tsc
--noEmit passed after the fix, not before).

### Task 1 — src/components/institutions/MarkResolvedButton.tsx (NEW)
Same RLS-blocked-write discipline as ClaimButton: `.is("marked_resolved_at",
null).select()`, row-count is the success signal, never `!error`. Wired into
`InstitutionQueue.tsx`'s "claimed" section — each claimed row now shows
either the button (challenge still claimed/in_progress) or a
"MARKED RESOLVED {{date}}" label (already resolved by this institution).
LIVE-VERIFIED with a real button click, not just an API call: signed in as
university.test, clicked "Mark resolved" on the real MGNREGA claim, UI
flipped instantly to "MARKED RESOLVED 8/26/2026", re-read confirmed
`challenges.status` = 'resolved' server-side via the trigger.

### Task 2 — src/components/challenges/ConfirmResolutionPrompt.tsx (NEW)
Placed inline on ChallengeCard (public feed / map popups wherever it
renders) rather than a new page or a notification system — the dispatch
said "your call," and both alternatives would have been real scope creep:
Global Rule #12 explicitly freezes a notification system as ROADMAP ONLY,
and there is no "my reports" page to build a dashboard variant on top of.
Gated in ChallengeCard via `useAuth()`: only renders when
`user.id === challenge.submitted_by && status === 'resolved' &&
!resolved_confirmed_at`. Calls Codex's `confirm-resolution` function.
"Not yet" only dismisses locally for the session (no reject/deferred write
exists on Codex's side to persist to) — the prompt will reappear on reload,
which is honest given only a confirm endpoint exists.
LIVE-VERIFIED with a real click: signed in as citizen.test (the real
`submitted_by` on two now-resolved challenges), the prompt appeared on both,
clicked "Yes, it's fixed" on one, it disappeared immediately, and a
service-role re-read confirmed `resolved_confirmed_at` and
`resolved_confirmed_by` (matching the citizen's real user id) both
persisted — the actual edge function ran, not a local-only UI change.

### Task 3 — src/components/home/StatsSection.tsx (headline stat replaced)
### WHERE CONFIRMED-RESOLUTION NOW DISPLAYS
Homepage, "THOUSANDS OF PROBLEMS" stats row, card 01 (the headline/first
position). Was a fabricated "14,286 PROBLEMS IDENTIFIED" (Database icon);
now `useLiveChallengeMetrics().confirmedResolutions`, animated, labeled
"CONFIRMED RESOLUTIONS" with a ShieldCheck icon, description explicitly
distinguishing it from an institution's own resolved-marking. Read 0 before
any citizen had confirmed; read 1 immediately after the live Task 2 click
above, WITHOUT a page reload triggering a refetch of the underlying data —
i.e. verified the number is actually wired to the real count, not cached or
hardcoded.
Card 5's icon was ShieldCheck too (now duplicated with the new card 1) —
swapped to MapPin; unused `Database` import removed.

### KNOWN ISSUE, NOT FIXED, FLAGGED AGAIN
Cards 02-05 in this same StatsSection ("4,821 ACCREDITED SOLUTIONS", "312
RESEARCH INSTITUTIONS", "186 COMMUNITY & CSR ALLIES", "₹12.4 Cr" elsewhere
in LiveMetricsTicker.tsx) remain fabricated placeholder numbers with no
backing column — flagged once already after the merge, still not addressed
because it was out of scope for this dispatch (which asked specifically for
the confirmed-resolution headline, not a full stats audit). Also still
true: `LiveMetricsTicker.tsx` exists in the tree but is not imported/
rendered anywhere — dead code, separate from this task.

### Checks
- `tsc --noEmit` clean (after fixing the leaked-CLI-output corruption above)
- `npm run lint` 0 errors (5 pre-existing/unrelated warnings — 2 are
  Hemm-7's own code from the last merge, not introduced by this task)
- `npm run build` clean
- Dev server restarted before verification (Global Rule #7)
- Live Playwright click-throughs for both Task 1 and Task 2, with a
  service-role database re-read after each per Global Rule #15 — not just
  a UI-state check

### FILES CHANGED
- supabase/migrations/20260826110000_advance_status_on_resolve.sql (NEW)
- src/integrations/supabase/types.ts (regenerated)
- src/components/institutions/MarkResolvedButton.tsx (NEW)
- src/components/institutions/InstitutionQueue.tsx
- src/components/challenges/ConfirmResolutionPrompt.tsx (NEW)
- src/components/challenges/ChallengeCard.tsx
- src/components/home/StatsSection.tsx
- src/i18n/locales/en.json + hi.json (institution.resolve.*,
  institution.queue.resolvedOn, resolution.confirm.*, both locales, parity
  kept)

### BLOCKERS / OPEN
None. All three tasks complete and live-verified. Real test-account state
now reflects genuine actions (not reverted, since these are real accounts
performing real real flows, not throwaway fixtures — consistent with how
Task 5/7 verification worked earlier in this project): the MGNREGA
challenge is fully resolved-and-confirmed; the handpump challenge is
resolved but still awaiting the citizen's confirmation (left as a real,
honest pending state, not force-completed).

---

## Challenges Map: cluster-density view + Santhali toggle check — 2026-08-26

STATUS: Task 1 DONE and live-verified. Task 2 correctly NOT built — see below.
Waited for Codex's `getChallengeClusters()` (STATUS COMPLETE in codex-status.md)
before starting, and separately checked Codex's `translateText()` entry, which
reports STATUS: not shipped, not READY/COMPLETE.

### Task 1 — cluster-density map view

Deliberately a *third* view, not a modification of the existing per-report
map. `ChallengeMap.tsx` already plots individual reports (using its own local
`clusterChallenges.ts`, which merges literal `duplicate_of` links) and colours
by lifecycle *status* via `strataColorForStatus`. Codex's
`getChallengeClusters()` answers a different question — active reports
grouped by *subject* + 500m proximity, independent of duplicate-detection —
so it got its own component rather than being folded into the existing one,
to avoid conflating two different clustering concepts under one marker set.

- `src/lib/domainColors.ts` (NEW) — 10-colour categorical hex map, one per
  `challenge_domain`, chosen to be spread across the hue wheel and visually
  distinct from `strataColorForStatus`'s 5 lifecycle colours (so a viewer
  never has to wonder which colour language a given map is using).
- `src/components/challenges/ClusterMap.tsx` (NEW) — calls
  `getChallengeClusters()` on mount, renders one Leaflet marker per cluster,
  diameter scaled by `sqrt(challengeCount)` (capped 22–56px so one large
  cluster can't swallow the tile layer), fill colour from `domainColor()`.
  Clicking a marker opens a popup with the exact requested shape: count +
  category, e.g. "1 report — Healthcare" (`map.cluster.summary_one/_other`,
  pluralized like every other count string in this project).
- `src/pages/Challenges.tsx` — extended `View` from `"list" | "map"` to add
  `"clusters"`, added a third toggle button (List / Map / Clusters), and gave
  `ClusterMap` its own `lazy()` import — same bandwidth reasoning as the
  existing `ChallengeMap` lazy-load in this file's own comment: a visitor who
  never opens the cluster view shouldn't pay for Codex's clustering query or
  a second Leaflet mount.
- `en.json` / `hi.json` — added `challenge.viewClusters` and
  `map.cluster.summary_one/_other`, both locales, key parity kept.

LIVE-VERIFIED via Playwright against the real dev server (restarted first,
Global Rule #7): navigated to `/challenges`, clicked the new "Clusters" tab,
9 real markers rendered (matching the current 12-challenge seed, several
sharing a domain+location cluster), zero console/page errors. Clicked a
marker — popup read exactly `"1 report — Healthcare"`, confirming the i18n
plural key and Codex's real `category`/`challengeCount` fields are wired
correctly, not placeholder text.

### Task 2 — Santhali toggle: correctly NOT built, not merely stubbed

Codex's own status entry for the Challenge Cluster Utility explicitly
reports `translateText(text, targetLang)` as **not shipped**, with a stated
reason: `ai4bharat/IndicTrans3-beta` labels Santali support
preliminary/low-resource with variable quality, not reliable enough for
citizen-facing translation. That is a real, considered blocker from Codex,
not an oversight — nothing to route back.

Per the dispatch's own instruction ("update status file with what's
live/stubbed if translation isn't ready"): no third language toggle button,
no dead Santhali i18n keys, and no partial/fake Santhali strings were added
anywhere. Adding a visible toggle for a language with no real translation
function behind it would be the same category of problem as the fabricated
stat cards fixed earlier this session — a UI element promising something
that isn't actually there. The existing English/Hindi toggle in the header
is untouched. This is a clean no-op until `translateText()` ships and its
quality is separately judged acceptable for citizen-facing copy — that
judgment call belongs to whoever reviews `translateText()`'s actual output,
not to this task.

### Checks
- `tsc --noEmit` clean
- `npm run lint` — 0 errors, same 5 pre-existing warnings (none introduced)
- `npm run build` clean; `ClusterMap` confirmed in its own separate chunk
  (`ClusterMap-*.js`, 3.61 kB) distinct from `ChallengeMap-*.js`
- Dev server killed and restarted before verification (Global Rule #7)
- Live Playwright click-through against the running app, not just a
  component-level check

### FILES CHANGED
- src/lib/domainColors.ts (NEW)
- src/components/challenges/ClusterMap.tsx (NEW)
- src/pages/Challenges.tsx
- src/i18n/locales/en.json + hi.json (challenge.viewClusters,
  map.cluster.summary_one/_other, both locales, parity kept)

### BLOCKERS / OPEN
None for Task 1. Task 2 remains blocked upstream on Codex's own quality
judgment of Santhali `translateText()` output — nothing for this task to do
until that changes.
