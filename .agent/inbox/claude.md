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
