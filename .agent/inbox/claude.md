# Blocker — Task 2: match-institutions

STATUS: BLOCKED
TASK: Implement and test `match-institutions`.
BLOCKER: The current SIH26043 project `fhjxngqfredhsszwqmuf` has no `HUGGINGFACE_API_KEY` secret. `supabase secrets list --project-ref fhjxngqfredhsszwqmuf` lists only `SUPABASE_DB_URL`.
NEEDED: Set `HUGGINGFACE_API_KEY` on project `fhjxngqfredhsszwqmuf` before Task 2 can be tested.
IMPACT: The zero-shot classifier cannot be invoked safely; no Task 2 implementation or test was started.

(RESOLVED — HUGGINGFACE_API_KEY has since been set on fhjxngqfredhsszwqmuf,
confirmed working. Entry kept for the record, not deleted.)

---

# Blocker — Stretch Task: detect-duplicates clustering false-positive — 2026-08-25

STATUS: BLOCKED (Task 4 held pending this)
TASK: Verify detect-duplicates before Task 4 (ChallengeMap.tsx) depends on it.
BLOCKER: Ran a positive case and two negative cases against the deployed
function with real inserted rows, re-reading every result per Global Rule
#15 rather than trusting the response body.

  POSITIVE (near-identical text, ~278m apart): correct. duplicateOf and
  report_count both landed right, confirmed by re-read.

  NEGATIVE — far away (~5.5km), near-identical wording: correct, not
  clustered. The 500m distance gate held on its own.

  NEGATIVE — same location (~110m), genuinely unrelated topics (a collapsed
  culvert vs. a health centre out of medicine): FALSE POSITIVE. The two
  challenges were clustered together.

  ROOT CAUSE, confirmed by replicating the function's own terms()/STOPWORDS
  logic against the real description strings:
    - The only shared word after stopword filtering was "week" — a
      near-universal word, not topical evidence the two reports describe the
      same problem. `overlap.length > 0` (a single shared word) is too weak
      a bar.
    - Worse: that single word was shared with a THIRD challenge (already
      linked into the first cluster from the positive-case test), not the
      canonical row the response named as duplicateOf. The response collapses
      to the canonical id and gives no way to see which row actually
      produced the (weak) match.

  Checked, not assumed: the canonical row's report_count was NOT
  double-incremented by this false link (the increment only fires when the
  matched candidate IS the canonical row, which wasn't the case here) — but
  the duplicate_of link itself is still wrong, which is exactly what Task
  4's clustering would read.

NEEDED: A decision on the fix approach — options I see: (a) require 2+
shared terms rather than 1, (b) exclude very-high-frequency words beyond the
current stopword list (or weight by term rarity instead of a raw count),
(c) have the response identify which candidate row actually matched instead
of only the collapsed canonical id, so a false positive is at least
diagnosable. Whichever is chosen, needs re-verification with the same rigor
(1 positive + 2 negative live cases, re-read per Rule #15) before Task 4
resumes.
IMPACT: Task 4 (ChallengeMap.tsx) is on hold. Not proceeding to build map
clustering against detect-duplicates output until this is fixed and
re-verified — the coordinator's explicit instruction was conditional on
verification holding up, and it does not fully hold up.

---

# Blocker — detect-duplicates re-verify: 3/4 pass, new failure mode found — 2026-08-25

STATUS: BLOCKED (Task 4 still held)
TASK: Independently re-verify Codex's fix (overlap >= 2, extended stopwords,
matchedChallengeId/matchedTerms added to the response) with the same three
cases as before, plus a fourth of my own choosing.
RESULT:
  Case 1 (positive, ~278m, near-identical text): PASS, re-read confirmed.
  Case 2 (negative distance, ~5.5km): PASS, re-read confirmed.
  Case 3 (the original failure -- culvert vs. medicine shortage, only "week"
    shared): PASS. "week" is now stopworded; overlap is genuinely zero.
  Case 4 (mine -- boundary probe, exactly 2 shared terms, unrelated topics,
    ~110m): FAIL.

CASE 4 DETAIL: designed two genuinely unrelated reports -- a road-safety
hazard ("Motorbikes race dangerously past the school gate...") and an
unrelated shop-access complaint ("The lock on our ration shop gate is
broken...") -- verified offline first that they share EXACTLY 2 qualifying
terms after the new stopword filter ("school", "gate"), then ran them live.
detect-duplicates linked them: duplicateOf set, matchedTerms: ["gate",
"school"], and re-read (not just the response) confirmed both the link and
the canonical row's report_count incrementing to 2. Reverted afterward
(my own test data, not a function change).

WHY THIS IS A NEW FAILURE MODE, NOT THE OLD ONE RECURRING: the original bug
was one incidental word ("week") slipping past a too-low COUNT threshold.
This is different -- "school" and "gate" are not filler words, they are
ordinary high-frequency nouns specific to this civic-complaint domain.
Almost any report near a school could mention "school gate" as a landmark,
the same way "road" or "water" would recur across many unrelated reports.
No general-English stopword list can catch this, because these ARE
meaningful English words -- the gap is that raw shared-term COUNT treats a
domain-common noun the same as a genuinely rare, specific one (e.g.
"culvert" or "borewell"), when the two carry very different evidence value.

NEEDED: A decision on how to weight terms, not just count them -- e.g.
discount a term by how often it already appears across the `challenges`
table (so "school"/"gate" naturally carry less weight than "culvert" the
more reports use them), or some other approach the coordinator/Codex choose.
Not decided by me -- flagging per the explicit instruction to stop and
report rather than pick a fix myself.
IMPACT: Task 4 (ChallengeMap.tsx) remains on hold, still not proceeding to
build map clustering against detect-duplicates output.

---

# Report (not a blocker) — detect-duplicates round 3: 4/4 required pass, a
5th structural gap found — Task 4 now proceeding — 2026-08-25

STATUS: UNBLOCKED. Proceeding to Task 4 per the coordinator's instruction for
this exact outcome (4 required cases hold; a genuinely new 5th failure is
reported plainly, not fixed, and the algorithm is not iterated on further).
TASK: Re-verify Codex's dynamic-frequency fix (25% corpus-frequency exclusion
on top of the >=2 term threshold) with the same 4 cases as before.
RESULT: All 4 required cases PASS, re-read confirmed on every one:
  1. Positive (~278m, fresh vocabulary): linked, report_count -> 2.
  2. Negative distance (~5.5km): not linked.
  3. Culvert vs. medicine shortage (literal repeat): not linked.
  4. Motorbike vs. ration-shop gate (literal repeat): not linked -- "school"
     is now dynamically excluded at 56% corpus frequency (from my own
     repeated test insertions across rounds), so this pair genuinely
     exercises the new mechanism, not just the static stopword list.

  Every outcome was PREDICTED offline first, against the actual current
  corpus (16 accumulated test rows), before running anything live -- both to
  catch a false pass caused by my own test-data pollution having already
  inflated a word's frequency, and to make the live run a check against a
  stated prediction rather than an open-ended look.

FIFTH CASE (mine) -- REPORTING PLAINLY, NOT FIXING, PER INSTRUCTION:
Designed to test a specific structural question: does the 25%-frequency
filter protect against a domain-common word the FIRST time it starts
recurring, or only once enough occurrences have piled up? Used vocabulary
("market", "junction") confirmed at 0% frequency in the corpus beforehand.

  Two genuinely unrelated reports -- illegal dumping near a market junction,
  and an unofficial toll/extortion racket at the same kind of landmark --
  sharing only those two landmark words. Predicted: link (neither word yet
  excluded). ACTUAL, re-read confirmed: linked.

  WHY THIS IS A DIFFERENT GAP FROM BOTH EARLIER ONES: not a wording accident
  (round 1) and not an already-common domain word (round 2). This is
  structural -- dynamicStopwords() can only discount a term AFTER a quarter
  of the existing corpus already contains it. A new MVP launch spends its
  early life with a small, sparse corpus by definition, so every
  domain-common phrase starts at 0% and stays under 25% until enough real
  citizens have used it -- during exactly that window, which could be weeks
  of real usage, the frequency defence provides none of its intended
  protection.

  Smaller, related observation from Case 3's prediction (didn't change any
  pass/fail here, just visible in the simulation): the same mechanism can
  swing the other way too -- "culvert" is now excluded at 31% corpus
  frequency, from my own repeated test insertions. In real use, many
  citizens genuinely reporting the SAME real collapsed culvert would also
  legitimately push a specific, meaningful word past 25% -- at which point
  the algorithm stops treating it as duplicate evidence right when
  recognising a real recurring problem matters most.

NOT ACTING ON EITHER OBSERVATION -- per this round's explicit instruction,
this is where algorithm iteration stops. Reported for the record only.
IMPACT: Task 4 (ChallengeMap.tsx) is proceeding now, built with the
mandatory safety net (a duplicate cluster marker expands to show every
individual linked report, never just a merged count) as a permanent
mitigation for exactly this class of false positive -- not conditional on
the algorithm ever being made perfect.

---

# Finding (not urgent) -- challenges.status never advances past 'submitted'
-- found while building Task 7's dashboard -- 2026-08-25

STATUS: OPEN, not fixed. Reporting per Rule #14 -- a real scope decision,
not something to patch on my own judgment.
TASK: Task 7 (ChallengeDashboard.tsx) required an honest status funnel
(submitted -> ai_matched -> claimed -> in_progress -> resolved). Before
charting it, surveyed the real `challenges` table.
FINDING: all 25 real rows sit at status='submitted', with zero exceptions --
including challenges that HAVE been categorised, matched, and one that has
genuinely been claimed by an institution (verified in Task 5). Grepped every
edge function and every frontend write path for anything that sets
`challenges.status`: nothing does, anywhere. categorize-challenge writes
domain/domain_confidence only. match-institutions writes challenge_matches
only. ClaimButton writes challenge_matches.is_claimed only. The DEFAULT
value from the migration is the only value the column has ever held on this
project.
IMPACT: the 5-stage lifecycle the schema defines, and that PipelineStrata
was explicitly built to visualise (design-brief.md's "strata, not step
badges" signature direction), currently has no real driver anywhere in the
system. The dashboard shows this honestly (25/0/0/0/0) rather than hiding
or approximating it -- correct behaviour for a "not a dashboard that could
be showing fake data" audience, but it means the funnel is not yet
demonstrating what it was built to demonstrate.
NEEDED: a scope decision on how status should advance, since neither
obvious path is a trivial fix:
  - An edge-function write (categorize-challenge could set 'ai_matched'
    after a successful match; match-institutions likewise) -- Codex's
    files, Global Rule #4, not mine to add unilaterally.
  - A new admin-scoped frontend write (e.g. ClaimButton also setting
    status='claimed') -- possible from my side, but `challenges`' only
    UPDATE policy is admin-only, so a citizen or institution client
    attempting this would hit the EXACT Rule #15 silent-block pattern
    Task 5 just spent real effort verifying against -- would need either a
    service-role path or a DB trigger, not a one-line client update.
Not decided or attempted by me -- flagging for the coordinator's call,
consistent with how the detect-duplicates findings were handled.

---

# Blocker — Task 2 (interactive match-simulator hero) — 2026-08-26

STATUS: BLOCKED. Not built. Tasks 1, 3, 4 of this same dispatch are proceeding;
only Task 2 is held.
TASK: Build a homepage-hero UI around Codex's `simulateMatch()`
(`src/lib/matchSimulator.ts`), replacing the static demo card with a live
interactive one.
BLOCKER: `simulateMatch()` calls the real `categorize-challenge` and
`match-institutions` edge functions against a fixed
`VITE_SIMULATOR_CHALLENGE_ID` env var, which does not exist yet
(`grep VITE_SIMULATOR_CHALLENGE_ID .env` = 0 matches). Two problems, not one:

1. Both edge functions enforce challenge OWNERSHIP via the caller's JWT
   (contracts.md: "caller's own JWT establishes identity"). The homepage
   (`/`) is a public route with no auth guard — checked `App.tsx` directly,
   confirmed no `RequireAuth`/`RequireUserType` wraps it. An anonymous
   visitor — which is nearly all homepage traffic, including anyone judging
   the live site — has no JWT that owns the placeholder challenge. Every
   simulator attempt from an anonymous visitor fails outright on the
   ownership check. This isn't a hypothetical edge case, it's the majority
   path for the exact audience a homepage hero is built for.

2. Even for a signed-in citizen, every simulator run calls the REAL
   `match-institutions` function, which INSERTS a new row into
   `challenge_matches` per contracts.md — against ONE SHARED placeholder
   challenge row, unboundedly, on every play. That's a public marketing
   surface repeatedly mutating live production data, which is the exact
   thing this project's own debate-room review just spent a full pass
   cleaning up (deleting synthetic fixture rows before demo recording).
   Building this as specified re-opens that same problem in a worse form —
   ongoing, not a one-time fixture.

NEEDED: A decision on approach before I build anything, options I see —
(a) gate the interactive simulator behind sign-in and show the existing
static `MatchExplainerDemo` to anonymous visitors instead (keeps the "wow"
moment for judges who explore past the homepage, doesn't break for the
majority), (b) add a genuinely non-mutating preview path — e.g. a
`dryRun`/`preview` flag on the edge functions that classifies and ranks
without writing to `challenge_matches` — which is a change to Codex's files,
Global Rule #4, not mine to add unilaterally, (c) accept the write-pollution
and add a scheduled cleanup of matches against the placeholder challenge —
functional but reintroduces exactly the demo-data hygiene problem already
solved once. Not decided or attempted by me.
IMPACT: Homepage centerpiece stays as the existing static
`MatchExplainerDemo` (scroll-triggered, canned data, clearly labeled as an
example) until this is resolved. Tasks 1 (StrataDivider), 3 (palette
migration), and 4 (asymmetric hero layout) do not depend on this and are
proceeding.

---

## BLOCKER — Phase 1 scope: fabricated content is homepage-wide, not two files

RAISED BY: Claude Code
DATE: 2026-08-26
PHASE: 1 (fabricated homepage content)
STATUS: Phase 1 as literally scoped is DONE and committed (c7040c7). This
blocker is about the part that turned out to be bigger than the brief.

### What the task said vs what is actually there

The dispatch named two offenders: `StatsSection.tsx` and the featured-problem
cards. Both are fixed, live-verified, and committed — every number in them is
now a real query result.

While verifying, I checked the whole rendered page for the same class of
problem. **8 of the 10 components actually rendered on `/` contain fabricated
content**, not 2. The remediation rule ("never leave a placeholder number
anywhere a user or judge will see") clearly applies to all of them, but
fixing them is not a like-for-like data swap the way the first two were — see
"why I stopped" below.

### Inventory of what is still fabricated and still user-visible

| Component | Fabricated content |
|---|---|
| `HeroSection.tsx` | Ticker headlines "14,286 CITIZEN CHALLENGES LOGGED ACROSS 24 DISTRICTS", "312 UNIVERSITY LABORATORIES MATCHED…"; an impact story citing "48,000 residents" and a "94%" contaminant reduction; "Explore 14,286 Challenges" CTA; "₹5…" figure; two GAZETTE seal/notice elements |
| `IndiaNeedMap.tsx` | Per-district entries with invented matched labs (BIT Mesra, IIT-ISM Dhanbad, AIIMS, NIT Jamshedpur), "48,000" affected, a "98" score, "JHARKHAND GAZETTE MAP" |
| `CoreConceptEcosystem.tsx` | Copy asserting "professors at BIT Mesra, IIT-ISM Dhanbad, and BAU Ranchi guide…"; "₹1…" figure; "24 Districts"; repeated "98" figures |
| `AiMatchingSection.tsx` | Four fake problem→lab pairings with invented match scores (98/94/92/97); "Over 312 university laboratories & 14,000+ challenges synchronized in real-time" |
| `ProblemToImpactJourney.tsx` | "AI matches the problem against 312 university laboratories"; "GAZETTE INNOVATION LIFECYCLE"; "98" |
| `ImpactStories.tsx` | Whole case studies: "48,000", "98", "BIT Mesra Dept of Chemical Eng + 4 NEP-2020 Students + District Jal Nigam" |
| `FinalCtaSection.tsx` | "Over 14,286 Active Problems · All 24 Jharkhand Districts" |
| `FooterSection.tsx` | "24 Jharkhand …" coverage claim |

Also fabricated but NOT currently rendered (dead files, lower priority, listed
so they don't get wired up later by accident): `FramerStudioMockup.tsx`,
`PartnerInstitutions.tsx`, `PeopleBehindSolutions.tsx`, `PipelineVisualizer.tsx`,
`SectorBentoGrid.tsx`, `LiveMetricsTicker.tsx`.

### Two distinct severities here, and the second one is the reason I stopped

**(a) Mechanical — a real number exists, just swap it.** `FinalCtaSection`'s
"14,286", `HeroSection`'s "Explore 14,286 Challenges", `AiMatchingSection`'s
and `ProblemToImpactJourney`'s "312 university laboratories". These map
cleanly onto counts I already expose in `useHomepageData.ts` (12 challenges,
18 institutions). I can do these with no judgment call.

**(b) Structural — there is no real equivalent to swap in.** `ImpactStories`,
`IndiaNeedMap`, `AiMatchingSection`'s problem→lab pairings, `CoreConceptEcosystem`'s
faculty copy, and the whole GAZETTE framing are not "a number in the wrong
place" — they are entire narrative sections built on events that never
happened. There is no resolved-case-study table, no per-district lab
assignment, no funding figure anywhere in the schema. Making these honest
means one of:
  1. delete the section outright,
  2. keep the layout but drive it from the thin real data we have (which for
     several of them means a section with 1-2 items in it), or
  3. keep it and label it unambiguously as an illustrative mock-up.

That is a design and product decision about what the homepage is even for —
it changes what a judge sees on the landing page. Rule #4 of this pass says
to stop rather than guess on exactly that kind of call, so I have not touched
any of them.

### A second, separate concern worth a decision of its own

Several of these name **real institutions** — BIT Mesra, IIT (ISM) Dhanbad,
BAU Ranchi, NIT Jamshedpur, AIIMS Deoghar — as active partners, with
attributed labs, match scores, and completed projects. None of them are in
our `institutions` table and none have matched anything. That is a stronger
claim than an inflated count: it asserts a partnership with a named real
organisation that does not exist. I'd treat removing those names as
non-optional regardless of which option above is chosen for the surrounding
sections.

### What I need

A decision on (b): delete / drive-from-real-data / label-as-illustrative —
and whether it should be applied uniformly or per-section. Given the answer I
can execute the whole remaining list in one pass, including the mechanical (a)
items.

### What I am doing meanwhile

Not proceeding to Phase 2 (UI consistency audit) yet, because the dispatch
said to stop and report after Phase 1 if scope changed — it has. Phase 2 is
read-only reporting and is unblocked if you'd rather I continue there while
this decision is pending.
