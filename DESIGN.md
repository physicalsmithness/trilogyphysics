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

## Implemented engine + seam (M2 spine, DECISIONS d022)

The engine is a single TOPIC_CONFIG-driven driller (`app/engine.js`) running behind the course-wide shell (`app/index.html`), not a per-topic engine. The shell owns identity and the network report; the engine owns drilling and display. Seam:

```
window.TrilogyEngine.mount({ container, topic, config, identity, report });
window.TrilogyEngine.unmount();
```

`selectTopic` mounts; `showPicker` / sign-out unmount. The engine keeps its own localStorage event log (global, one mastery profile per pupil across topics per d017; topic is a field, not a key) and calls the shell's `report(partial)` per attempt, payload matching the ECM `reportAttempt()` schema.

### Borrowing ledger (the answer to the Fields/electricity "could have borrowed more" miss)
- **Lifted from Electric Circuits Mastery:** `circuit-builder-embed.js`, `formula.js`, `rounding_classifier.js` (verbatim); the event-log mastery model; the MCQ grader (correct/half/wrong); `slugs_offered` -> per-misconception fired-vs-avoided (d004 non-fires); greenness + ticks; the per-atom mosaic colouring (band + mixWithWhite, itself ECM-from-Pre-IB).
- **From the Pre-IB engine:** the calc_workings 4-line marks-the-method grader, lifted verbatim into `app/calc_workings.js` (`window.TrilogyCalcWorkings`) from the GitHub Pages mirror since the Drive mount never surfaced the file (d023). The four-line UI drives it; per-line marks, reasons, and canonical error codes come from the lifted grader. The atom-registry idea also informs the TOPIC_CONFIG atom list.

### Diagram registry
`window.TOPIC_DIAGRAMS[kind] = (params) => SVGElement|null` (`app/diagrams.js`). `circuit` wired to the Circuit Builder embed; the nine Widgets-catalogue kinds register against the same object (d019). The engine inserts the returned node above the prompt and shows a non-fatal placeholder on null.

### Item schema the engine consumes
`{ id, qtype, tier, atom, syllabus, prompt, explanation?, diagram?, distractors?|claims?|calc? }`, qtype in {mcq_single, mcq_multi, short, calc_workings}, tier in {foundation, higher, both}. `short` is claim-point selection (gradeable, not free-text) pending q-explanation-grader. calc final value is value+tolerance, or ECM's rounding classifier when `calc.rc_item.answer.formula` is supplied.

### Tests
`test/smoke.js` (29, node-only) and `test/integration.js` (15, jsdom full-mount). Run: `node test/smoke.js`; the jsdom test needs `npm i jsdom`.
