# Societal Innovation Collaboration Portal (SIH26043) — Claude Memory

> This file serves two roles: it's the PM/coordinator's (this chat's) tracked
> project memory, AND it is auto-loaded as project context by Claude Code the
> moment it's run inside this directory. Keep it accurate — Claude Code will
> read it as ground truth on every session start, not just when told to.

## Project Goal
A digital platform for Government of Jharkhand (Department of Higher & Technical
Education) where citizens submit real-world local problems (education, agriculture,
healthcare, water, environment, etc.), an AI classifier categorizes and routes each
one to the most relevant university/industry partner by expertise, and the whole
pipeline is tracked through to resolution. Positioned to the sponsoring department
as a NEP-2020-aligned research/innovation pipeline — NOT as a generic civic
complaint app (a near-identical idea, SIH25031, was already submitted by the same
state in a prior cycle; the AI-matching + duplicate-clustering pieces are the
differentiators that make this not a repeat).

Built on top of an existing base project (github.com/Pranav-0710/sih2026) — a
React/Supabase tourism app whose AUTH, DASHBOARD, COMMUNITY-FEED, and AI-EDGE-FUNCTION
patterns are being reused, but whose tourism-specific features (TripGenie, VR tours,
Funscapes, bookings) are NOT part of this project and should not be touched or ported.

## Current Phase
PHASE 1 — SETUP

## Stack
- Frontend: React + TypeScript + Vite, shadcn/ui + Tailwind
- Backend: Supabase (Postgres, Auth, Storage, Edge Functions on Deno)
- AI: Hugging Face Inference API, zero-shot classification
  (facebook/bart-large-mnli via router.huggingface.co — same model + endpoint
  already proven working in the base repo's classify-condition function)
- Maps: Leaflet + react-leaflet
- Charts: Recharts
- i18n: i18next (Hindi/English at minimum; base repo also has Santali strings
  from an unrelated PS — do not assume those are directly reusable here)

## Phase Tracker
- [ ] Phase 1: Context files written and approved
- [ ] Phase 2: Codex activated and complete
- [ ] Phase 2: Claude Code activated and complete
- [ ] Phase 3: Coordination (if blockers arose)
- [ ] Phase 4: Debate room review complete
- [ ] Phase 5: All tests pass
- [ ] Phase 5: Docker build and smoke test pass
- [ ] Phase 5: Deployed to production

## Known Constraints
- SIH26043 runs on its OWN fresh Supabase project (`fhjxngqfredhsszwqmuf`) —
  confirmed isolated from the tourism app's project. Migration order:
  1) `20260825100000_foundation_profiles_and_auth.sql`
  2) `20260825120000_societal_challenges.sql`
  3) `20260825130000_fix_challenge_matches_claim_rls.sql`
  4) `20260825140000_enforce_match_reason.sql`
  Only these four files, plus the two edge functions and frontend code
  described in contracts.md, should exist in this project. No tourism-app
  code should be copied in wholesale — see contracts.md's reuse-scope note.
- No frontend scaffold exists yet on this project (the workspace reset wiped
  everything, including the previously-copied tourism app that had been
  supplying package.json/vite config/etc. as an unintended side effect).
  A clean scaffold is now its own explicit task — see Claude Code's inbox.
- Codex has limited quota — used only for the two AI edge functions and duplicate-
  detection logic. Everything else (frontend, seed data, wiring) goes to Claude Code.
- Requires a `HUGGINGFACE_API_KEY` configured as a Supabase secret before either
  edge function can be tested — this is a hard blocker for Codex's tasks until set.
- Submission deadline: 20 September 2026 (idea/PPT+video screening stage, not the
  36-hour finale). There is real multi-week runway here — do not compress the plan
  into a hackathon-weekend shape.
- MVP scope is deliberately 3 modules only: citizen submission + AI categorization/
  matching, institution claim workflow, government dashboard. Project-lifecycle
  management, industry funding flows, and the notification system are ROADMAP ONLY
  — do not let either agent start building them without an explicit scope change
  logged here first.
- Official portal metadata for this PS lists Theme as "Disaster Management" —
  this is a scraping/tagging mismatch (same class of bug we found elsewhere in
  the portal's data), not a real requirement. Ignore it; do not build anything
  disaster-response-flavored on the strength of that field.

## Agent Roles (actual tooling)
- **Codex** — backend/logic agent, run via CLI or its own session. Limited quota.
- **Claude Code** — primary builder, run via CLI/IDE in this project directory.
  No separate "Claude Code-style" persistent memory folder is needed — Claude
  Code auto-loads this CLAUDE.md file itself on every session start. Its Plan
  Mode is a real feature (not a stand-in) — use it for any multi-file task.
