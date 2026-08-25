STATUS: COMPLETE
WHAT I BUILT: Updated `match-institutions` overlap reasoning and ran one bounded ranking experiment. Matching terms now exclude common stopwords and words from the challenge's own domain label, so generic domain language cannot masquerade as specialization evidence. Candidate labels now place free-text specialization tags before institution name and department.
FILES CHANGED: supabase/functions/match-institutions/index.ts; .agent/status/codex-status.md
INTEGRATION NOTES: Deployed to Supabase project `fhjxngqfredhsszwqmuf`. Before/after experiment using the same Hugging Face model and known descriptions:

- School: before Khunti Centre for Tribal Livelihoods and Craft #1 (0.3286), Deoghar College of Education absent from top three; after Khunti remained #1 (0.3233), Deoghar moved to #2 (0.2732). This is not a clear improvement.
- Handpump: before Sahibganj Water and Sanitation #1 (0.3439), Ranchi Institute of Rural Technology #2 (0.2509); after Ranchi moved to #1 (0.3611), Sahibganj moved to #3 (0.2015). This is a clear improvement.

The single label-order attempt is complete; no further ranking iteration was performed. Task 3 remains available for the coordinator to schedule.
BLOCKERS: None. The deployed function was parsed and uploaded successfully; no authenticated end-to-end challenge mutation was performed during this isolated ranking experiment.

## Stretch Task — detect-duplicates

STATUS: COMPLETE
WHAT I BUILT: Added `detect-duplicates` with 500-meter spatial matching, stopword-filtered description overlap, caller ownership verification, canonical duplicate linking, canonical `report_count` incrementing, and idempotent handling of already-linked reports.
FILES CHANGED: supabase/functions/detect-duplicates/index.ts; .agent/status/codex-status.md
INTEGRATION NOTES: Request `{ challengeId, lat, lon, description }`; success response `{ duplicateOf: string | null, clusterSize: number }`. Deployed to Supabase project `fhjxngqfredhsszwqmuf`. A non-mutating live validation returned HTTP 400 with `lat must be a valid latitude.` for an incomplete request, confirming deployment and input validation.
BLOCKERS: None. A successful cluster mutation was not run without an authenticated challenge fixture.

## Stretch Fix — duplicate false-positive regression

STATUS: COMPLETE
WHAT I BUILT: Extended the duplicate exclusion set with civic-complaint vocabulary (`week`, `month`, `day`, `year`, `time`, `still`, `area`, `near`, `recently`, `many`, `need`, `help`, `problem`, `issue`, and the related terms), raised the required meaningful overlap from one term to two, and added `matchedChallengeId` plus `matchedTerms` to successful and no-match responses for diagnosis.
FILES CHANGED: supabase/functions/detect-duplicates/index.ts; .agent/status/codex-status.md
INTEGRATION NOTES: Deployed to `fhjxngqfredhsszwqmuf`. Regression results, re-read from the live database:

- Positive culvert reports (~278 m): before linked correctly; after linked correctly to `7b4836da-70de-42ca-8afc-f27387f879fe`, with `matchedChallengeId` naming the actual candidate and 12 qualifying terms. Temporary copy was removed and the canonical count restored.
- Far-distance near-identical report (~5.5 km): before returned `duplicateOf: null`; after returned `duplicateOf: null`, `clusterSize: 1`, `matchedChallengeId: null`, and `matchedTerms: []`. Re-read confirmed `duplicate_of: null` and the original count was restored after test cleanup.
- Culvert versus medicine-shortage (~110 m, only `week` shared before): before falsely linked into the culvert cluster; after returned `duplicateOf: null`, `clusterSize: 1`, `matchedChallengeId: null`, and `matchedTerms: []`. Re-read confirmed the medicine row remained unlinked.

The response retains the contracted `duplicateOf` and `clusterSize` fields while adding the candidate/term diagnostics requested for debugging.
BLOCKERS: None.

## Match Status Transition

STATUS: COMPLETE
WHAT I BUILT: After successful `challenge_matches` upsert, `match-institutions` now updates the owned challenge from `submitted` to `ai_matched` only when its current status is still `submitted`. Retries or re-matches cannot overwrite later workflow states such as `claimed`.
FILES CHANGED: supabase/functions/match-institutions/index.ts; .agent/status/codex-status.md
INTEGRATION NOTES: Deployed to Supabase project `fhjxngqfredhsszwqmuf`. Ran the function against real challenge `b2977e51-4a10-4562-a14f-55f6fe687b80` (handpump report), which returned three persisted matches. A separate service-role REST re-read confirmed the row status is `ai_matched`.
BLOCKERS: None.

## Final Stretch Fix — dynamic duplicate-term frequency filter

STATUS: COMPLETE
WHAT I BUILT: Added request-time whole-word frequency counting across existing `challenges.description` rows. Any candidate shared term occurring in more than 25% of those rows is excluded as a dynamic stopword, on top of the static exclusion set and the existing two-qualifying-term minimum. No continuous weighting or further tuning was introduced.
FILES CHANGED: supabase/functions/detect-duplicates/index.ts; .agent/status/codex-status.md
INTEGRATION NOTES: Deployed to Supabase project `fhjxngqfredhsszwqmuf`. Final live regression results:

- Positive near-identical culvert reports (~278 m): PASS. Linked to canonical `7b4836da-70de-42ca-8afc-f27387f879fe`; diagnostics identified the actual candidate and qualifying terms (`main`, `recent`, `cross`, `dangerous`).
- Negative-distance near-identical reports (~5.5 km): PASS. Returned `duplicateOf: null`, `clusterSize: 1`, and no matched candidate/terms.
- Culvert versus medicine shortage (~110 m, only `week` shared): PASS. Returned `duplicateOf: null`; the medicine row remained unlinked.
- Motorbike hazard versus ration-shop lock (~110 m, shared `school`/`gate`): PASS after the dynamic filter. Returned `duplicateOf: null`, so common landmark terms no longer create a duplicate link.

The temporary positive fixture was deleted and the canonical `report_count` restored to its pre-test value. This completes the final planned iteration for this duplicate-detection bug class.
BLOCKERS: None.
