# Trilogy Physics: ITEM SCHEMA v1.0 (locked 2026-06-08, resolves q-schema-lock)

The contract every item obeys and every chat builds against. Locked by Architecture from the ratified 6.2 vocabulary proposal (`review/trilogy_electricity_vocabulary_proposal.md`), the v3 syllabus spine (`review/SYLLABUS_6_2.md`, d021), the Codex six-layer calc tagging (d003), and the ECM/Pre-IB engine shapes (d015, d016). Authoring proposes changes from the material (principle 5); Architecture versions this file.

## Every item carries
- `id` — stable snake_case unique id.
- `board` — `aqa_trilogy_8464` (first-class, d005 / principle 6).
- `tier` — `F` | `H` | `FH` (shared cross-tier item; tier on the item, atoms shared, d005).
- `topic` — e.g. `6.2`.
- `subtag` — one dashboard group (6.2 set: circuit_basics, charge_current, resistance_ohm, iv_characteristics, series_parallel, mains_ac_dc, mains_safety, power_electrical, energy_appliances, national_grid).
- `syllabus_codes` — array of the finest applicable v3 codes (d021), e.g. `["6.2.1.3.c"]`.
- `atoms` — array of `atom_id` from the registry (the per-skill units the dashboard tracks, d004). Multi-cell types may add `atomMap: { atom_id: [cellIndex,...] }` (ECM pattern).
- `qtype` — see QUESTION_TYPES.md. Gradeable now: `mcq`, `mcq_multi`, `short`, `calc_workings`. Staged: `level_of_response_6`, `circuit_draw`, `graph_sketch` (d023).
- `difficulty` — `d1` | `d2` | `d3` (calibration/sequencing; informed by the AQA national facility, NOT our cohort, d006).
- `prompt` — stem text.
- `marks` — integer.
- `equation_sheet` — `from_insert` | `must_recall` where a formula is involved (principle 6). NB all six 6.2 formulae are on the 2023 insert but none on the pre-Covid insert.
- `commonMisconceptions` — array of misconception slugs predicted for this item (ECM capture-while-authoring; engine may ignore, tooling reads).
- `applicable_misconceptions` — slugs that COULD fire here, so the dashboard can count avoids as well as fires (principle 1: track non-fires).
- `explanation` — mark-scheme text. For ported items, quote the AQA source (no invented port claims); else `based_on` / `in_style_of`.
- `diagram` (optional) — `{ kind, params }`. `kind:"circuit"` routes to the Circuit Builder (Housing); other kinds route to the Widgets registry (see Widgets dispatch). 
- `source` — `authored` | `ported_from_ecm` | `aqa_ppq:<ref>`.

## Per-qtype fields
- **mcq / mcq_multi** — `choices: [ {text | symbolKind | graphKind | svgKind | diagram, label} ]`, `answerIndex` (or `answerIndices`), and **per diagnostic distractor** `misconception_id` (d004) plus a `rationale`. Optional `distractorErrorTypes` (ECM error-type tags). Choices may be widget/circuit renders (this is the interim form of the draw/sketch types, d023).
- **short** — `markPoints: [ {any:[synonyms]} ]`. Keyword-presence marking only; the engine shows the auto-mark warning. Avoid multi-point `short`; prefer `calc_workings` or `level_of_response_6` claim-points where the answer is structured.
- **calc_workings** (the 4-line marks-the-method type, d016, from the Pre-IB engine) — `knowns: { SYM:{ value, unit, dimension, asGiven } }`, `unknown`, `equationCanonicalForms: [...]`, `expectedFinalValue`, `expectedUnit:[...]`, `tolerance`, `allowRepeat`, `requireUnit`, `marks:4`. Each line maps to the Codex Layer-5 mark categories 6.2 uses: `equation_quoted`, `substitution`, `rearrangement`, `evaluation`, `prefix_conv`, `sig_figs`, `standard_form`, `unit`. ECF via `gate:{kind:"from_previous_part"}` (anti-ECF gating is rare in 6.2).

## Registries (data, owned with Authoring; Architecture ratifies)
- **Atom registry** — the ratified `atom_id` set grouped by subtag (proposal §2). Atoms are tier-shared.
- **Misconception registry** — ECM `misconceptions` schema (`slug / topic / label / description`), seeded from proposal §3 (ported / port-trim / NEW_FLAG). `topic` uses the subtag. Lives in `data/misconceptions` for the engine to read (d016).
- **Working-scientifically slugs** (`repeatability_reproducibility_confused`, `freehand_line_not_ruled`, `prefix_not_converted`) are cross-topic; they live in a SHARED WS taxonomy owned at the GCSE Physics Overview level, referenced by items, not duplicated per topic (q-ws-taxonomy, routed to Overview).

## Trilogy scope exclusions (ratified, d024) — do NOT author these for Trilogy
Parallel-resistance reciprocal calculation (spec 6.2.2 excludes it); resistivity `R=ρL/A`, potential dividers, capacitance (Triple/A-level); `P=V²/R` (not a Trilogy equation; power is `P=VI` and `P=I²R` only); static electricity (Triple-only). Much of ECM's `resistor_combinations`/`resistivity`/`potential_divider` content therefore does NOT port.

---

## v1.1 additions (2026-06-11, d028-d030)

- **calc_workings `stages`** (d029): optional ordered array of 4-line blocks for multi-stage calculations. Each stage carries its own knowns/unknown/equationCanonicalForms/expectedFinalValue/expectedUnit; a stage may set `gate:{kind:"from_previous_part"}` and reference the prior stage's evaluated result for ECF (ecf_allowed). Absent or length-1 = the single-formula case. Per-stage atoms and misconception_id still logged.
- **qtype `fbd_vector_draw`** (STAGED, d028): free-body / resultant / scale-vector diagrams. Interim form is `mcq` with `free_body_diagram` / `ramp_fbd` / `vector_addition` widget options. Full placement/scale-diagram grading is a Widgets-interactive + Housing milestone.
- **Cross-topic atoms** (d030): forces items invoking KE (1/2 m v^2) or GPE (mgh) reference the Energy 6.1 atom ids (`energy_ke_calc`, `energy_gpe_calc`) via `atomMap`, not forces-local duplicates. These shared atom ids are Architecture-owned pending 6.1 authoring, like the WS taxonomy.
- **Shared WS / cross-topic misconceptions** now include `proportionality_stated_as_increases` (promoted from 6.2, d028), joining `prefix_not_converted`, `freehand_line_not_ruled`, `repeatability_reproducibility_confused`, `sig_figs_not_applied` (q-ws-taxonomy, owned at Overview).

---

## v1.2 additions (2026-06-11, d035): the interactive `widget` qtype

Resolves the schema half of d031 (widgets central). Ratifies the contract the Widgets chat proposed and built (inter_chat/Widgets_Housing_interactive_65.md), which mirrors the Fields driller.

- **`qtype: "widget"`** makes an interactive widget a first-class GRADED item. The item carries `widget: { kind, config }`, parallel to the static `diagram: { kind, params }`. Static stimulus = `diagram`; graded interactive surface = `widget`. (A static-illustration item keeps using `diagram`.)
- **Grading contract:** a second registry `window.TOPIC_WIDGETS[kind] = (hostElement, config) => instance`, with `instance.getAnswer()` (structured pupil response), `instance.score(answer, config) => { marksAwarded, marksPossible, status: full|partial|none, hits, misses, errorCodes }`, `instance.destroy()`. Scoring delegates to PURE model functions so the engine can re-score stored attempts headless (no widget mount needed).
- **Engine flow:** mount via the factory; on submit call `getAnswer()` then `score()`; write `marksAwarded/marksPossible/status/errorCodes` onto the attempt event, exactly as calc_workings writes its per-line outcome. Load order: `widgets_core.js` before any topic widget file.
- **errorCodes ARE misconception slugs (architecture ruling):** every widget errorCode (e.g. `chord_used`, `inverse_gradient`, `scalar_sum_given`, `square_value_not_applied`) is registered in the misconception registry, or mapped to an existing slug, so the d004 fire/avoid dashboard unifies widget errors with MCQ-distractor and calc_workings errors. ONE misconception taxonomy across mcq, calc_workings, and widget, not three parallel ones. The topic Widgets chat proposes the slugs in its hand-back; Architecture registers them. `atoms` and `applicable_misconceptions` are still declared on the item.
- **marksPossible** per kind (defaults: 2 for area_under_vt / gradient_tool / vector_addition / vector_resolve; 4 for vector_scale_drawing), overridable via `config.marks`.

---

## v1.3 addition (2026-06-11, d036): diagram/widget options in MCQ

An `mcq` / `mcq_multi` option may be `{ text }` OR `{ diagram: { kind, params } }` OR `{ widget: { kind, config } }`, not text only. The engine's renderMcq renders an option's diagram/widget through the same registry lookup as a stem diagram. Per-option `misconception` still applies (a wrong-diagram option carries the slug it diagnoses). This is REQUIRED for the interim MCQ forms of the staged draw/sketch types (circuit_draw, fbd_vector_draw, graph_sketch): "which circuit / free-body diagram / graph is correct?". Without it those interim forms (d023, OQ-E) cannot be authored.

---

## v1.4 additions (2026-06-11, d040): calc Codex tagging, item subtag, calc error crosswalk

From the 6.2 and 6.5 calibration batches:
- **`calc.codex` block** on calc_workings items: optional `{ formula, sources:[...], unit_actions:[...], mark_categories:[...], ecf }` recording the Codex six-layer static tagging (d003/d016) so per-atom coverage analytics has a home, not only the grader's live error derivation. Authoring fills it; the engine passes it through to the attempt event.
- **Item-level `subtag`** field: items carry their subtag explicitly (the dashboard grouping layer the proposals are built on), not overloaded onto `atom`. The engine item loader reads it.
- **calc_workings ERROR_TYPES are misconception slugs** (extends d035 to calc): the grader's auto-derived calc error types map to registered misconception slugs via an ERROR_TYPES->slug crosswalk (Housing wires, Architecture ratifies the mapping), so calc errors join MCQ-distractor and widget errors in ONE d004 taxonomy.
- **`syllabus` is the finest leaf code** (confirmed, d021), e.g. 6.2.1.3.c not the parent.
- Board stays topic-level for now (per-item board deferred to the cross-board future; not urgent).

---

## v1.5 additions (2026-06-11, d047): marked multi-stage calc, graph_sketch, the generic fallback pattern

**1. Marked / multi-stage calc structure (Smith-directed).** Calc items (real or MCQ-interim) carry the full mark-scheme data so they are a complete dataset for the chained grader, not just a shell:
- `calc.stages[]` - the d029 per-stage 4-line blocks (equation, knowns, unknown, expectedFinalValue, expectedUnit, gate).
- `calc.markScheme[]` per stage - the real AQA per-mark steps, each tagged with its Codex Layer-5 mark category (substitution / non_final_evaluation / rearrangement / evaluation / prefix_conv / unit).
- `calc.markCategories[]` - the ordered per-mark category list for the part.
- item-level `marks` (real AQA count), `difficulty` (from facility, d006), `facility_pct`, `source` (aqa_ppq ref), `equation_sheet`.
- On the MCQ-interim form, each distractor carries `failsAt` (the stage/mark whose failure yields that wrong number) beside `misconception`, so a wrong pick already identifies the failed mark. The chained grader (Housing) consumes stages + markScheme to award per-mark and report which stage failed (principle 1); failsAt is the interim equivalent.

**2. `graph_sketch` NEW_QTYPE.** Item carries `axes`, `target:{kind,params}` (a Widgets model curve, which IS the answer key so author and grader never drift), `accept` (shape predicates: through_origin, monotonic, linearity, quadrants, gradient_trend, symmetry), and `on_fail` (predicate -> misconception slug). Grader = a shape-matcher checking the predicates against the sampled target curve; the grade is atomic (which predicate failed), not pass/fail.

**3. Generic `fallback` block (adopt as engine behaviour).** ANY item whose qtype the engine cannot yet grade may carry `fallback:{ mode:"self_check", reveal:{kind,params}, self_mark_prompt, log_as:"ungraded_self_assessed" }`. The engine, on an unknown/ungraded qtype WITH a fallback block, renders the prompt + axes/reveal-model + self-mark control and logs the attempt as `ungraded_self_assessed` (excluded from accuracy stats; exposure and applicable-but-avoided still tick). This lets any NEW_QTYPE ship as a self-check the day it is authored and auto-grade later with no re-authoring. A general pattern, not graph-specific.

---

## v1.6 additions (2026-06-11, d048): circuit_draw qtype; shared chain misconceptions

- **`circuit_draw` NEW_QTYPE** (instance of the d047 fallback pattern): item carries `axes`/`target:{dsl}` (the Circuit Builder DSL as the answer key), `accept` predicates (components present, series/parallel relationship, complete loop), `on_fail` slug map, and a `fallback` self-check (reveal the model circuit via the Circuit Builder, pupil self-marks, log ungraded). The real grader is "Builder-as-input": the pupil assembles a circuit in the embedded Circuit Builder and the grader checks the predicates against the target DSL. Bigger build than graph_sketch (the Builder must be an input surface, not just a renderer); scheduled with Housing.
- **`chain_prep_stage_skipped` and `chain_intermediate_as_final` promoted to the shared cross-calc misconception set** (used by both 6.5 and 6.6; they are generic multi-stage failure modes, not topic-local).
- **Calc grader wishlist (Housing):** a notation/standard-form OUTPUT check on the line-4 value (the grader checks numeric value, not notation, so "give your answer in standard form" / nm-on-output items ride as MCQ-interim until added). Same fix territory as the prefix extension.
