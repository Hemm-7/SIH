# Codex Inbox

Read `.agent/shared/global-rules.md` and `.agent/shared/contracts.md` in full before
starting. Do not begin Task 2 until Task 1 is COMPLETE and its status file is updated.

## Task 1 — `categorize-challenge` edge function
- Copy the structure of the base repo's `supabase/functions/classify-condition/index.ts`
  almost directly — same HF router URL, same request/response shape, same
  caller-identity-scoped write pattern.
- Replace `SEVERITY_LABELS` with the 10 `challenge_domain` enum values (see contracts.md).
- Persist `domain` + `domain_confidence` to the `challenges` table (not `condition_reports`),
  scoped to rows where `submitted_by = caller`.
- Match the exact request/response JSON shape in contracts.md — Claude Code's
  form is being built against that shape in parallel.

## Task 2 — `match-institutions` edge function
- Fetch candidate institutions from the `institutions` table.
- Run zero-shot classification using institution `name` + `department` +
  `expertise_tags` (joined into a single string per institution) as the
  `candidate_labels` array passed to the same HF endpoint used in Task 1.
- Return the top 3 by score. For each, write a `challenge_matches` row with
  a real `match_reason` — a short string describing which expertise tags or
  terms drove the match (Global Rule #9 — this is not optional).
- Match the exact request/response JSON shape in contracts.md.

## Task 3 — STRETCH, do not start until Tasks 1 & 2 are reviewed COMPLETE
- `detect-duplicates` function per the contract spec. Only begin if Claude
  explicitly reopens this in CLAUDE.md's phase tracker.

## When blocked
Write to `.agent/inbox/claude.md` using the blocker format in global-rules.md.
The most likely blocker: `HUGGINGFACE_API_KEY` not yet set as a Supabase secret
— check this first before assuming your code is wrong if calls fail with 401/403.
