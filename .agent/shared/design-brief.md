# Design Brief — SIH26043

This is direction for Claude Code to run its own brainstorm → critique → build
process against (per its design guidance) — not final pixel specs. The brief's
content below should ground that process, not replace it.

## Subject, audience, and the job each surface does

This platform has two genuinely different audiences, and they should not get
identical treatment:

- **Citizen submission + public feed**: often low digital literacy, submitting
  a real local problem (a broken well, an unsafe road). The page's job: make
  someone feel their problem was *seen* and is genuinely headed toward real
  expertise — not swallowed into a government form. Warm, high-contrast,
  minimal jargon, large touch targets.
- **Institution portal + government dashboard**: Department of Higher &
  Technical Education officials and university/industry reviewers. The page's
  job: make the pipeline's legitimacy provable at a glance — real numbers,
  real matches, real reasoning, not a dashboard that could be showing fake data.
  Credible, data-forward, institutional-innovation register.

## Avoid the generic AI-default looks entirely

Do not reach for: warm cream background + high-contrast serif + terracotta
accent; near-black + single neon accent; broadsheet hairline-rule newspaper
columns. These are defaults, not choices, and a judge who's seen ten hackathon
demos this cycle will recognize them instantly as templated.

## A direction worth exploring (not mandatory — critique and revise it)

**Signature element**: the explainable-match connection between a citizen's
challenge card and its matched institution should be the one memorable visual
moment — not a caption, an actual visualized connection (a labeled bridge/
thread between the two cards, annotated with the real matched expertise terms
and confidence). This is the literal differentiator; it should look like one.

**Status pipeline as strata, not step badges**: Jharkhand's actual identity is
built on mineral strata (coal, mica, iron ore) — the challenge lifecycle
(submitted → ai_matched → claimed → in_progress → resolved) could be rendered
as horizontal layered bands a challenge visibly moves through, rather than
generic numbered circles (01/02/03), which the frontend-design guidance
specifically flags as a default to question rather than reach for by habit.

**Palette rooted in that same material identity** rather than an arbitrary
brand palette — dark slate/graphite grounding tones, a warm rust/ochre accent
for freshly-submitted problems, a cool verdigris accent for matched/resolved
states. Named hex values to be finalized in Claude Code's own brainstorm pass.

**Typography split by audience**: a sturdier, slightly technical display face
for headers (judge-facing credibility), a highly readable humanist body face
for citizen-facing text (accessibility-first — this project already has a
FontSizeProvider in the base repo's pattern; honor it), and a monospace
utility face for IDs/scores/timestamps in the dashboard to reinforce "this is
real, auditable data."

## Quality floor (non-negotiable regardless of final direction)

- Responsive down to mobile — citizens are submitting from phones
- Visible keyboard focus states
- Reduced-motion respected
- Copy is written from the citizen's/institution's side of the screen — name
  things by what people control ("Claim this challenge," not "Update status
  field"), active voice, no filler
- Errors and empty states get real direction ("No challenges matched yet —
  submissions are reviewed within X"), not generic "No data" placeholders

## Process expectation

Run the actual brainstorm → plan → self-critique loop before writing UI code:
propose a compact token system (color/type/layout/signature), check it against
"would this be my generic answer to any similar brief," revise anything that
reads as default, and only then build. Note what you tried in
`.agent/status/claude-code-status.md` so the next task's design pass builds on
this one instead of re-litigating it.
