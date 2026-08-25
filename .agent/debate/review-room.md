# Debate Room — SIH26043 Integration Review

Trigger this when BOTH `codex-status.md` and `claude-code-status.md` report
STATUS: COMPLETE for the MVP tasks (Codex Tasks 1-2, Claude Code Tasks 1-7).

Paste both status files to Claude here, then Claude runs the three-role review below.

## Round 1

### Architect
[Focus: does ChallengeSubmissionForm's insert → categorize → match sequence
actually match the contract shapes? Do the RLS policies as implemented match
the ownership model in contracts.md — specifically, can an institution admin
claim a match that isn't theirs?]

### Pragmatist
[Focus: does `npm run build` pass? Does the migration apply cleanly on a fresh
Supabase project? Do both edge functions return real responses when curled
directly, not just when called from the UI?]

### Critic
[Focus: what happens if `match-institutions` returns fewer than 3 matches, or
zero? What happens if a citizen submits with no photo, no geolocation? Can a
malicious client claim someone else's match by guessing a challenge_matches id?]

## VERDICT
**Overall status:** PASS / FAIL

### Ranked Fix List
1. [fix] → dispatched to [agent]
2. [fix] → dispatched to [agent]
