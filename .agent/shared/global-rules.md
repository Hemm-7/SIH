# Global Rules — All Agents

1. **contracts.md is law.** If you disagree with it, write to claude's inbox — do not deviate.
2. **Minimal targeted edits only.** Never rewrite entire files.
3. **Update your status file after every completed task.**
4. **Never directly instruct the other agent.** Route everything through Claude.
5. **When blocked, write to `.agent/inbox/claude.md` immediately** using the blocker format.
6. **Use Plan Mode** (Claude Code's real Plan Mode feature) for any task touching more than 1 file.
7. **Restart the server after any code change.** Old code stays in memory.

## Project-specific rules

8. **Domain categorization and institution matching MUST reuse the existing
   zero-shot classification pattern** (Hugging Face `facebook/bart-large-mnli`
   via `router.huggingface.co/hf-inference/models/...`) already proven working
   in the base repo's `classify-condition` function. Do not introduce a
   different ML approach (embeddings, a different model, a custom classifier)
   without first writing to `.agent/inbox/claude.md` and getting approval —
   this stack choice was deliberately made to minimize technical risk before
   the deadline.
9. **Every AI match written to `challenge_matches` must include a non-empty
   `match_reason`.** This is a scored differentiator (explainable matching),
   not a nice-to-have — a match row without a reason is an incomplete task,
   not a complete one.
10. **RLS policies must follow the ownership pattern already in the migration**:
    institution admins can only claim matches for their own `institution_id`
    (checked via `institutions.admin_user_id = auth.uid()`). Do not weaken
    this to make testing easier — test with real seeded institution accounts
    instead.
11. **Do not touch, port, or reference any tourism-specific feature** from the
    base repo (TripGenie, VR tours, Funscapes, GenZ corner, travel bookings).
    Only auth patterns, the dashboard shell, the community-feed component
    shape, and the edge-function pattern are in scope for reuse.
12. **Scope is frozen at the 3 MVP modules** listed in CLAUDE.md. If either
    agent finds themselves building project-lifecycle tracking, industry
    funding flows, or a notification system, stop and flag it — that means
    scope has silently crept and needs to be caught immediately, not after
    the fact.
13. **UI/UX quality is a graded criterion, not a final polish pass.** Every
    frontend task must read `.agent/shared/design-brief.md` before building
    and run its own brainstorm → critique → build loop against it — not
    default to out-of-the-box shadcn/Tailwind looks or a generic AI-template
    palette. The explainable-match visualization is the signature element;
    treat it as such, not as a caption under a card.
14. **Logging a decision to an inbox file is not the same as getting approval
    for it.** For anything high-stakes or hard to reverse — schema changes on
    a database also serving another live app, copying restricted features
    into scope, irreversible operations like `ALTER TYPE ADD VALUE` — stop
    and wait for Claude's actual response before executing, even if you've
    already written up the decision and your reasoning looks sound. Good
    reasoning after the fact does not substitute for a checkpoint before the
    fact; the point of routing through a coordinator is catching the cases
    where the reasoning turns out not to hold, and that only works if
    execution waits for the response.
15. **A blocked write under RLS can report success.** PostgREST returns
    HTTP 200 with an empty result array when an UPDATE or INSERT is silently
    filtered by a row-level-security policy — it does not error. Any task
    that writes to a table with restrictive RLS (the claim flow on
    `challenge_matches`, any future admin action) must verify the write
    actually landed by re-reading the row afterward, not just checking the
    HTTP status. Task 2 hit this on `challenges.photo_urls` and worked
    around it by restructuring the write order; the same discipline applies
    anywhere else a write might be silently no-op'd.
