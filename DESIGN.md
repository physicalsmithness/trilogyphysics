# Trilogy Physics: DESIGN

Light at seed; the Architecture-and-Housing chat fills this out as it locks the schema and revives the engine. Records the engine, schema, and display design. For the rationale behind choices, see DECISIONS.

## Engine and housing

The existing `trilogyphysics` repo carries an engine.js / questions.js / styles.css pattern per topic (currently 1_Energy and 7_Magnetism). The Magnetism build has about 160 questions with mixed qtypes and mark-point breakdowns. M2 evaluates whether to keep, refactor, or replace this engine (OPEN_QUESTION q-engine). Architecture-and-Housing owns both the schema and the display so the two stay coherent (DECISIONS d002).

A future consideration is whether Trilogy and Pre-IB converge on one shared GCSE driller engine and display rather than each maintaining its own (ROADMAP M5). The Calculation Automation calc_checker is a candidate shared calculation component.

## Item schema (starting reference, to be locked at M1)

Structural starting point: the Pre-IB topic-7 schema v0.5 (multiple qtypes, atom registries). Calculation-item attributes draw on the Codex six-layer tagging vocabulary (shape, formula/relation/rule, number sources, unit handling, mark categories, ECF gates). Every item carries board and tier tags (standing principle 6) and, where applicable, a misconception_id per distractor and an applicable-but-avoided record so the dashboard can show fire/avoid ratios (standing principle 1, DECISIONS d004).

## Display

The differentiating surface is the atom-level dashboard: per-atom coverage and per-misconception fire-versus-avoid counts, shown in v1 (DECISIONS d004). Fields-style last-N ticks-and-crosses per (topic, qtype) and a greenness widget are reasonable early progress indicators; the deeper per-misconception view is the one that must not slip to a later milestone.

## To be designed

- The grader's handling of written explanation questions (free-text vs selectable claim-points where no grader exists). High-importance for Trilogy given its explanation load.
- The tier model in the UI (how Foundation and Higher, and shared items, are presented and filtered).
- Persistence and identity (localStorage first; accounts later, per ROADMAP).
