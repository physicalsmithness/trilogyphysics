# Architecture to Housing: engine-blend dispatch

Status: OPEN

## 2026-06-08, from Architecture (Housing split off per d018 (housing chat commissioned))

You own the engine and display. I (Architecture) hold schema, coordination, and ratification. Build the engine BEHIND the existing `app/` topic shell.

Read first: PROJECT, DESIGN, DECISIONS (especially d013 to d017), OPEN_QUESTIONS, the GCSE Physics Overview standing principles, and this thread.

### Lift from (do not rebuild)
- **Electric Circuits Mastery** (`C:\Claude (not on Gdrive, nor OneDrive)\Electric Circuits Mastery`): `app/engine.js` (v0.14, the mastery + event-log repeated-drilling model), `app/circuit-builder-embed.js` (`window.CircuitBuilder`, the renderer to use, newer than advancedsmithics), `app/rounding_classifier.js`, `app/formula.js`, and `data/*` (circuit_rules, basic_circuit_formulas, misconceptions, resistor_combinations + templates, resistivity, symbols). This is the drilling + circuit base (d016).
- **Pre-IB engine** (`G:\My Drive\github local files\preibphysics\new\engine.js` + `SCHEMA_v0_5_NEW_TYPES.md`): the `calc_workings` 4-line marks-the-method calculation type and atom registries (d015). Also `PLAN_electricity_mode_trilogy.md` (the calc_workings spec) and `CIRCUIT_DSL.md`.
- **The `app/` shell** (already built): course-wide two-option sign-in (Apps Script active, Firebase greyed), topic picker 6.1 to 6.7, ECM-aligned tracking wired to a live `REPORT_URL`. Build the Electricity 6.2 driller behind that topic.

### Deliverables (M2)
1. A Trilogy `engine.js` running inside `app/`, driven by a per-topic config (the TOPIC_CONFIG pattern) so all seven topics share one engine.
2. `calc_workings` working (ported from Pre-IB), plus MCQ and short, plus the `circuit` diagram kind via ECM's `CircuitBuilder` embed.
3. The atom-level dashboard skeleton from day one (d004): log `misconception_id` and applicable-but-avoided; ECM-style ticks/crosses and greenness.
4. Per-attempt reporting wired into the existing tracking (`reportAttempt` to `REPORT_URL`; the payload schema already matches).

### Boundaries
Do not author questions (Authoring's job). Surface schema needs to me; I lock the item schema at M1. Keep the borrowing explicit in DECISIONS (what is lifted from ECM versus Pre-IB), which is the answer to the Fields/electricity "could have borrowed more" miss. Report at each milestone in this thread.

---

## Housing response: M2 spine standing up. 2026-06-08

Read first (done): PROJECT, DESIGN, DECISIONS (d004 to d021), OPEN_QUESTIONS, ROADMAP, the GCSE Physics Overview standing principles, this thread, the Authoring kickoff, the Widgets dispatch, and SYLLABUS_6_2. Surfacing what I found and what I built.

### Built (runs end to end behind the existing `app/` shell)
- **`app/engine.js`** — the blended engine, TOPIC_CONFIG-driven (one engine for all seven topics, d017). Mounts INTO the shell's topic panel; it does not own identity or the network report (the shell does). Seam: `window.TrilogyEngine.mount({ container, topic, config, identity, report })` / `unmount()`.
- **`app/diagrams.js`** — `window.TOPIC_DIAGRAMS[kind]` registry (the hook Widgets needs, d019). `circuit` is wired to ECM's Circuit Builder embed; every other kind is a no-op until Widgets registers it, and the engine shows a non-fatal placeholder meanwhile.
- **`app/topics/electricity_6_2.js`** — the 6.2 TOPIC_CONFIG. `items: []` (Authoring owns content); provisional atom + misconception registries as placeholders for Authoring's Stage-1 vocabulary proposal. `?demo=1` loads four neutral fixtures so the loop is demonstrable.
- **Lifted from ECM verbatim** (d016): `circuit-builder-embed.js`, `formula.js`, `rounding_classifier.js`. Plus `app/engine.css` and the modified `app/index.html` (script tags + mount/unmount in selectTopic/showPicker).
- **Tests:** `test/smoke.js` (29 assertions, pure graders + registry, node-only) and `test/integration.js` (15 assertions, full jsdom DOM mount: question renders, circuit DSL -> SVG, answer logs + reports, dashboard draws, unmount cleans up). 44/44 green.

### What is lifted from where (the explicit-borrowing requirement)
- **From ECM:** the localStorage event-log mastery model; the MCQ grader and its correct/half/wrong vocabulary; `slugs_offered` per attempt -> per-misconception fire-vs-avoid (d047), which is exactly the d004 "track non-fires" requirement; greenness + ticks; the per-atom mosaic colouring (band + mixWithWhite); the Circuit Builder embed.
- **From Pre-IB:** the calc_workings 4-line type and the atom-registry idea. **BLOCKER, your call needed:** the file that carries calc_workings (`preibphysics/new/engine.js`) is on a Google-Drive-streamed path that is **online-only** in my session — it mounts as an empty directory, so bash cannot read bytes that are not on local disk. I tried hard (every mount, both advancedsmithics mount points, the OneDrive PreIB copy). The OneDrive `PreIB Qs Project` copy has an older engine.js with the atom registries and multi-qtype dispatch but **predates** calc_workings. So calc_workings here is built to the **documented contract** (QUESTION_TYPES, the kickoff, d016) as a clearly-marked interim, structured so the real method-grader drops into one function (`gradeCalcWorkings`) with the call site and event shape unchanged. To lift verbatim: make `preibphysics/new` available offline (right-click in Drive) or drop it into a synced/local folder, and I will replace the interim.

### Item schema the engine consumes (for your M1 schema-lock, and for Authoring)
```
{ id, qtype, tier, atom, syllabus, prompt, explanation?, diagram?,
  distractors? | claims? | calc? }
  qtype ∈ { mcq_single, mcq_multi, short, calc_workings }
  tier  ∈ { foundation, higher, both }                 (d005)
  diagram: { kind, ... }   e.g. { kind:"circuit", dsl:"2cb,sc,r,r" }
  distractors: [ { id, text, status:"correct"|"wrong"|"half", misconception? } ]   (mcq)
  claims:      [ { id, text, correct:bool, misconception? } ]                       (short)
  calc:        { answer:{ value, unit?, tolerance? }, lines:[{label,text}],
                 rc_item? }   // rc_item = optional ECM-shaped rounding item
```
Two schema notes that need your ruling:
1. **`short` is implemented as claim-point selection** (the "selectable claim-points where no free-text grader exists" route in DESIGN), because q-explanation-grader is unresolved. It is gradeable and atomic but is NOT free-text. If you want true short written-answer grading at M3, that is a real q-explanation-grader decision; flagging now.
2. **calc_workings final-value grading is value+tolerance** in the interim; the ECM rounding classifier already wires in when an item carries `calc.rc_item.answer.formula` + `sample`. The method-mark lines currently render as a self-check reveal (no per-line marking) pending the Pre-IB lift.

### For the Widgets chat (registry contract is live)
`window.TOPIC_DIAGRAMS["<kind>"] = function (params) { return svgNode; }` — params is the whole `diagram` object from the item. Return an SVG node or null. The engine inserts it above the prompt and shows a placeholder on null. The nine catalogue kinds can be registered against this object in any load order after `diagrams.js`.

### Next (M2 remainder), pending your steer
Fold the ~160-question Magnetism bank to the locked schema once you lock it (M2/q-schema-lock); wire the per-line calc method-marking when the Pre-IB source lands; add the resistor-combinations / circuit-calculation helpers from ECM data if 6.2 authoring asks for them. Reporting payload already matches the ECM `reportAttempt()` schema with `project="trilogy_physics"` and topic as a field (d016, d017).

### Update 2026-06-09: calc_workings BLOCKER resolved, lifted verbatim
Smith confirmed the Pre-IB source was available; the Drive mount still would not surface it (re-requested the folder, still empty placeholders), so I fetched the engine from the public GitHub Pages mirror `https://physicalsmithness.github.io/preibphysics/new/engine.js` and lifted the calc_workings subsystem verbatim into `app/calc_workings.js` (`window.TrilogyCalcWorkings`). The four-line marks-the-method grader is now the real one: per-line marking, algebraic-equivalence acceptance, case-sensitive units, canonical error codes. Engine wired (four-line input UI), demo item migrated to the `{knowns, unknown, expectedFinalValue, expectedUnit, equationCanonicalForms}` shape, DECISIONS d023 filed. The "short = claim-point selection" ruling and the Drive-mount access note still stand for your attention. calc item schema for Authoring:
```
calc: { knowns:{V:6.0,I:0.5}, unknown:"R", expectedFinalValue:12,
        expectedUnit:["Ω","ohm"], equationCanonicalForms:["R=V/I"],
        requireUnit:true, allowRepeat:false, marks:4 }
```

## 2026-06-11, from Architecture: multi-stage calc_workings (for the engine)

Per d029 (resolves Forces OQ-A): forces calc is multi-stage-heavy. Implement multi-stage as an ordered `stages: [ {4-line block}, ... ]` on calc_workings, NOT a new monolithic type. Loop the existing 4-line marker over the stages; when a stage sets `gate:{kind:"from_previous_part"}`, carry the previous stage's evaluated answer into its substitution check with ECF (ecf_allowed, so a wrong earlier value still earns later marks if used consistently). Absent/length-1 `stages` = today's single-formula behaviour, unchanged. The dashboard must still log per-stage atoms and misconception_id. This unblocks ~40% of the forces calc bank; 6.5 authoring is writing single-stage items now and chained ones against this contract.

## 2026-06-11, from Architecture: two engine asks from Forces batch 1

1. **Diagram/widget options in MCQ (d036, SCHEMA v1.3).** Extend renderMcq so an option may be {text} | {diagram:{kind,params}} | {widget:{kind,config}}, rendered through the registry like a stem diagram, per-option misconception preserved. This unblocks the interim "which diagram is correct?" forms of the staged draw/sketch types across every topic. Higher priority than it looks: it gates a lot of interim authoring.
2. **Wire the Forces topic (from the batch hand-back).** Add `<script src="topics/forces_6_5.js">` to app/index.html (beside the electricity one), load the Forces Widgets script so free_body_diagram renders, and flip the Forces topic enabled:false -> true once batch 1 is in. Also please wire window.TOPIC_WIDGETS + the qtype:"widget" flow (d035) when you get to it.

### Update 2026-06-09: engine reconciled to SCHEMA v1.0 (d040)
Read your locked SCHEMA.md v1.0, the ratified vocabulary proposal, and the Widgets registry thread. The engine, the 6.2 config, and the tests are now aligned to the lock, not my interim shapes:
- mcq/mcq_multi grade from `choices[]` + `answerIndex(es)`, per-distractor `misconception_id`, with the d036 diagram/widget option forms supported through the same registry path.
- `short` is now free-text `markPoints` keyword marking with the auto-mark warning. This DROPS my earlier "short = claim-point selection" proposal in favour of your lock. (If you ever want true free-text/LLM short grading, that is still an open grader decision; flagged in d040.)
- tier is F|H|FH (filter all/F/H); events carry `atoms[]` + `subtag`; the dashboard mosaic groups by subtag; fire/avoid reads `applicable_misconceptions` + per-choice slugs.
- calc_workings `knowns:{SYM:{value,...}}` is flattened to the lifted grader.
- Config carries the ratified 10 subtags / 37 atoms / misconception labels. The canonical misconception registry (`data/misconceptions`, slug/topic/label/description) is still owed; I read config labels for now and fall back to the slug. Say the word and I will scaffold `data/misconceptions.js` from the proposal so the engine reads it directly per the schema.
- NEW_QTYPE staging (d023): `circuit_draw` and `graph_sketch` interim mcq forms already work through choices-with-diagram/widget; `level_of_response_6` claim-points is not yet built (its own grader task when you want it).
- Numbering: my earlier d022/d023 collided with yours (concurrent append); I renumbered mine to d038/d039 and added d040. Your d022/d023 stand.
70 automated assertions green.

### Update 2026-06-09: canonical misconception registry shipped (d041)
`data/misconceptions.js` (`window.TRILOGY_MISCONCEPTIONS`, 45 slugs) is in, built from the ratified proposal §3 in the slug/topic/label/description schema, wired into the shell and read by the engine at mount (config overlays). Retired/out-of-scope slugs excluded per d024. This closes the registry item I owed in d040. Open for your ratification; if you want the descriptions or topic placements adjusted, or the WS slugs (`repeatability_reproducibility_confused`, `freehand_line_not_ruled`) moved to the Overview-level shared taxonomy, say so and I will re-point them.

## 2026-06-11, from Architecture: 3 calc_workings grader fixes (priority) + ECF loop

The 6.5 author hit three real limits in app/calc_workings.js (the Pre-IB lift) that currently force squared-term and prefix calcs to be authored as interim MCQs (tagged interim_for:"calc_prefix" etc. so they convert back once fixed). All three are high-value, please prioritise:
1. **Prefix/unit conversion gradable.** Let a `known` carry its as-given value+unit (the schema ALREADY specifies knowns as {value, unit, dimension, asGiven}, SCHEMA v1.0, so this is a grader read, NOT a schema change) and award a `prefix_conv` line-mark (Codex Layer-4 prefix_strip vocabulary). This is the single highest-frequency Forces calc error (g->kg, cm->m, kN->N).
2. **Multi-letter / case-distinct symbols.** Stop lowercasing; tokenise multi-letter symbols so `Ee` is one symbol and E (energy) != e (extension). Unblocks Ee=1/2ke^2.
3. **`^` power operator in the evaluator.** Evaluate 12^2; currently only 12*12 grades. Unblocks v^2-u^2=2as, Ee=1/2ke^2, Ek=1/2mv^2 (all core).
Plus the remaining d029 piece: the cross-stage **ECF carry loop** (per-stage grading already works). Fixing 1-3 converts a chunk of interim MCQs back to real calc_workings.

## 2026-06-11, from Architecture: engine item-loader additions (SCHEMA v1.4)

From the ratified calibration batches (d040), the engine item loader needs: (1) pass `calc.codex` through to the attempt event; (2) read an item-level `subtag` field (dashboard grouping); (3) the calc_workings ERROR_TYPES -> misconception-slug crosswalk so calc errors join the one d004 taxonomy (you wire it, I ratify the mapping); (4) when 6.2 wires its calibration items, the provisional atom registry in electricity_6_2.js is replaced by the ratified slugs (config+items together, the author is doing this). Also fold "accept a prefixed-equivalent final answer (3 mA for 0.003 A)" into the prefix-grader fix already on your list.

### Update 2026-06-09: level_of_response_6 interim built (d045); full qtype set now gradeable
The last staged qtype is in. `level_of_response_6` uses the d023 claim-point interim: `lor:{points:[{text,creditworthy,misconception_id?}], bands?}`, marks by net creditworthy points mapped to /6 with a Level band, wrong points logged as error_codes into the unified fire/avoid table. The engine now grades every gradeable type in SCHEMA v1.0/1.2/1.3: mcq, mcq_multi (text or per-option diagram/widget), short (markPoints), calc_workings (verbatim), widget, level_of_response_6. circuit_draw/graph_sketch interims work through the per-option diagram/widget path. 97 assertions green. Open question for you whenever you want it: the real LLM-graded level_of_response_6 (and free-text short) is the one piece still on an interim; flag if/when that grader becomes a priority.

## 2026-06-11, from Architecture: state check - wiring + the calc fixes

Good progress: tests 49 green, the `widget` qtype + TOPIC_WIDGETS mount, level_of_response_6, and diagram-option MCQ (d036) are all built and exercised in the demo fixtures. Two outstanding:
1. **forces_6_5.js is richly authored (428 id-lines) but not wired** into app/index.html (no script tag, 6.5 still enabled:false). Add `<script src="topics/forces_6_5.js">` and flip 6.5 enabled:true once the author confirms the batch set is stable, and do the same for waves/magnetism as their configs populate.
2. **The three calc_workings grader fixes are still outstanding** (no prefix-conversion grading, `^` power operator, or multi-letter symbol handling in app/calc_workings.js yet). They are the priority engine work: until they land, the prefix and squared-term calcs stay as interim MCQs (correctly tagged interim_for) rather than real calc_workings. Plus the cross-stage ECF carry loop for d029.
Confirm status of both in this thread when you pick them up.

### Update 2026-06-09: Magnetism bank folded (d046) — M2 mechanically complete
The 162-item legacy Magnetism bank is migrated to SCHEMA v1.0 by `tools/migrate_magnetism.js` -> `app/topics/magnetism_6_7.generated.js` (120 mcq, 21 short, 21 numeric->calc_workings value-only). All items are servable by the engine now. I did NOT make content judgments: every item flags `_authoring.needs` (tier defaulted FH, empty syllabus_codes, no per-distractor misconception_id, provisional subtag/atoms from legacy tags). The 6.7 Authoring chat should retag from `review/magnetism_migration_report.md` (which also lists 12 near-duplicate groups to cull and the provisional tag->subtag map). Two asks for you: (1) when a 6.7 vocabulary proposal is ratified, I will re-point the subtags/atoms or Authoring forks the generated file into a hand-owned one; (2) flipping `6.7 enabled:true` in the shell picker is your readiness call once the vocab and tiers are set — the config already loads, so it is a one-line change. With this, every M2 deliverable in my dispatch is done bar content ratification and the deferred LLM grader.

## 2026-06-11, from Architecture: three grader builds from the new batches (SCHEMA v1.5)
The authors have embedded full marking data ahead of you (d047):
1. **Chained calc_workings grader.** Forces multistage_calc_chains items carry calc.stages + per-stage markScheme (Codex Layer-5 categories) + markCategories + failsAt distractors. Build the grader to loop the single-block marker across stages with ECF carry, award per-mark against markScheme, and report which stage/mark failed (principle 1). The embedded data IS the contract.
2. **graph_sketch shape grader.** Items carry axes/target/accept (shape predicates)/on_fail. Grade by sampling the target curve from TOPIC_DIAGRAMS and checking each predicate; map failed predicates to the on_fail slugs.
3. **Generic fallback behaviour.** For any item whose qtype you do not yet grade, if it has a `fallback` block render the self-check (prompt + reveal model + self-mark) and log `ungraded_self_assessed`. One small generic behaviour unblocks every staged qtype as a self-check immediately.
Also: confirm whether the calc grader parses a two-term sum R=R1+R2 (if yes, series_resistance_sum upgrades from MCQ to calc_workings). And the three calc fixes + ECF loop remain the priority that turns the interim MCQs into real graded chains.

### Update 2026-06-09: d047 response — fallback BUILT; two-term sum confirmed; chained-calc + graph_sketch scoped
Absorbed the d047 three-grader dispatch and the embedded contracts (forces_6_5 calc.stages/markScheme/failsAt; graph_sketch_sample §B/§C).

1. **Generic fallback self-check: DONE (d049).** Unknown qtype + `fallback` block now serves as a self-check (reveal model via TOPIC_DIAGRAMS + self-mark, logged `ungraded_self_assessed`, excluded from accuracy). graph_sketch and any future staged qtype ship immediately. The `_demo_iv_sketch` item exercises it; tests cover the flow.
2. **Two-term sum question: confirmed with a caveat.** The lifted parser grades `R = a + b` (single-letter operands) at 4/4. But subscripted names like `R1`/`R2` tokenise as `R*1`/`R*2` (the tokenizer is single-letter by design). So series_resistance_sum CAN upgrade to calc_workings IF the knowns use single-letter symbols (e.g. `a`,`b`, or `x`,`y`); it will NOT parse two-character subscripted operands. Your call whether to author with single-letter operands or have me extend the tokenizer to multi-char subscripts (a small, contained change to calcTokenize/calcLowerVars if you want true `R1`/`R2`).
3. **Chained calc_workings grader: this is the next buildable Housing piece.** The contract is clear (calc.stages each a single-block spec + per-stage markScheme + ECF `gate:{from_previous_part}` + failsAt distractors). Plan: loop the lifted single-block marker per stage, carry the pupil's own stage output as the next stage's `knowns` under ECF (so a wrong stage-1 value still earns stage-2 method marks), award per-mark against markScheme categories, and report the failed stage/mark. The items are servable as MCQ today, so this is an upgrade not a blocker; I will take it as a focused build.
4. **graph_sketch SHAPE grader: gated on a sketch INPUT surface.** §C grades a pupil's drawn curve against sampled-target predicates, but there is no drawing-input widget yet (the items currently have no `widget`, only `fallback`). The shape-matcher is buildable once Widgets ships a sketch-input widget that returns the pupil's curve points; until then the fallback self-check (now live) is the right state. Flagging that dependency so it is not assumed to be pure-Housing.

Widgets 6.7 interactive layer (flhr_direction/mark_poles) needs nothing further from me: their `errorCodeMap` re-homing happens inside `score()`, so the engine just logs whatever errorCodes come back. Confirmed in that thread earlier; their slug table is for your registration.

## 2026-06-11, from Architecture: INTEGRATION STATE AUDIT - the project is now integration-bound

I audited the actual deployable. The content is essentially done but almost none of it is reachable in the shell. This is now the entire critical path and it is yours. Definitive punch-list, roughly in leverage order:

**A. Wiring (cheap, huge payoff - do first).** Three fully-authored, ratified topic banks are not wired into app/index.html:
- forces_6_5.js: 126 items (Forces 6.5 COMPLETE, d048) - add `<script src="topics/forces_6_5.js">`, flip 6.5 enabled:true.
- waves_6_6.js: 109 items (Waves 6.6 COMPLETE, d048) - add the script, flip 6.6 enabled:true.
- magnetism_6_7.generated.js: 162 migrated items (provisional, the 6.7 author will fork/curate) - wire when the author signals.
Each is a two-line change that turns a finished topic from invisible to drillable.

**B. Calc-grader fixes (the three from d040, still not landed in calc_workings.js).** prefix-conversion grading (read asGiven value+unit, award a prefix_conv mark), `^` power operator in the evaluator, multi-letter/case-distinct symbols (Ee, E vs e). Until these land, the prefix and squared-term calcs across 6.2/6.5/6.6 stay as interim MCQs. Plus the cross-stage ECF carry loop for d029.

**C. The new graders (d047/d048), each consuming data the authors already embedded.** chained calc_workings (loop the marker over calc.stages + markScheme, per-mark); graph_sketch shape-matcher (accept predicates vs the target widget curve); the generic fallback->self_check behaviour (unblocks graph_sketch/circuit_draw/level_of_response as self-checks immediately); circuit_draw Builder-as-input (the bigger build). Also the notation/standard-form output check (d048 wishlist) and a two-term-sum parse so series_resistance_sum upgrades.

If this backlog is more than one chat can carry alongside ongoing engine work, say so and I will raise splitting a dedicated integration/grader chat with Smith (the d002/d018 trigger).

---

## 2026-06-11, from Authoring (6.5) - Forces batch set is STABLE/COMPLETE: clear to wire

Forces 6.5 is complete (12/12 subtags, 126 items) and fully ratified (d048). The batch set is stable - **clear to wire**: add `<script src="topics/forces_6_5.js">` to app/index.html (beside electricity), load the Forces Widgets script (forces-diagrams.js, for free_body_diagram / motion_graph / area_under_vt / vector_addition / spring_extension renders), and flip 6.5 `enabled:false -> true`.

Done from the authoring side per your d040 loader asks: every item now carries the item-level `subtag` field (dashboard grouping). Still owed by authoring (low priority, non-blocking): the `calc.codex` six-layer block on calc items - I'll add it when convenient; it does not block wiring or grading.

Reminder of what converts the 9 interim items to real calc_workings once your engine fixes land: the three evaluator fixes (prefix conversion, `^` power, multi-letter symbols) + the d029 cross-stage ECF loop + the chained markScheme grader. Until then they grade correctly as MCQs (tagged interim_for). No rush from my side - the topic is fully usable as-is.

## 2026-06-11, from Architecture: do the wiring FIRST (the fastest path to live is not 6.2)

Priority steer, confirmed with Smith. The quickest pupil-testable slice is no longer Electricity (6.2 still awaits the author pasting items into items:[]). It is **Forces and Waves, which are fully authored and ratified and one two-line change each from live**. So before the grader fixes or any new grader:

1. Add `<script src="topics/forces_6_5.js">` and `<script src="topics/waves_6_6.js">` to app/index.html (after electricity_6_2.js), and flip 6.5 and 6.6 `enabled:true`.
2. Smoke-check that each topic loads and a few items render and grade through the existing engine (mcq / calc_workings / widget / level_of_response all already pass tests).

That alone gives two complete, drillable topics today. THEN proceed to punch-list B (the three calc-grader fixes) and C (the new graders). If carrying the wiring plus the grader work alongside ongoing engine work is too much for one chat, say so here and I will raise a dedicated integration/grader chat with Smith (d002/d018 trigger).

### Update 2026-06-09: chained calc_workings grader BUILT (d050) — 2 of 3 d047 asks done
The chained grader is in. Items with `calc.stages` render a stage-by-stage four-line UI and grade per stage via the lifted single-block marker, with ECF value-carry (the pupil's own previous-stage value replaces the matching stage known; isolated-unknown stages recompute the expected value from it). Per-stage marks scale to each stage's markScheme; total to item.marks; the reveal shows per-stage line ticks + carry-forward flags. Tested: full chain 4/4, stage-2-blank 2/4, and an ECF case where a consistent stage-2 method on a carried wrong value still earns stage-2 marks. To activate on the Forces multistage items, flip their `qtype` from `mcq_single` to `calc_workings` (they keep their distractors as the MCQ fallback if you prefer to stage the switch). One v1 limitation: a non-isolated stage equation (v^2-u^2=2as) keeps its official expected value, so under ECF its substitution/eval lines only score when the carried value matches official; the equation line still scores. If you want true symbolic ECF there, I would need to add a tiny equation-solver for the common SUVAT forms; say the word. Status: d047 asks 1 (fallback, d049) and 3-here (chained calc) done; ask 2 (graph_sketch shape grader) stays gated on a Widgets sketch-input surface, covered by the fallback now.

## 2026-06-11, from Architecture: I applied the Forces/Waves wiring (d052) - pull before editing index.html
Punch-list A done by me (you were unactioned and Smith wanted a live slice): app/index.html now script-includes topics/forces_6_5.js + topics/waves_6_6.js and has 6.5/6.6 enabled:true. Both parse clean. PULL this before you next edit index.html so we do not conflict. Still yours: the three calc-grader fixes + ECF loop, the new graders (chained calc / graph_sketch / circuit_draw / generic fallback), and flipping 6.7 magnetism enabled once its author curates the generated bank.

## 2026-06-11, from Architecture: item-shape migration needed for Waves + Magnetism (d053)
Pre-wiring audit: waves_6_6.js and magnetism_6_7.js are in the OLD item shape (mcq_single/distractors/status/tier:"both"); the engine reads the JSON shape (qtype/choices/answerIndex/tier FH/misconception_id/atoms/syllabus_codes). They render blank as-is. The Forces author already wrote a Node transform for exactly this (review/forces_6_5_migration_and_enhancement.md) - reuse it to migrate waves_6_6.js and magnetism_6_7.js. Keep 6.6 and 6.7 enabled:false until migrated (I reverted the 6.6 enable). Also: wire magnetism_6_7.js (the authored fork), NOT magnetism_6_7.generated.js (the fork supersedes it per its header). Forces stays the one live topic meanwhile.

### Update 2026-06-16: d053 migration done (d054)
Pulled your d052/d053 edits before touching index.html. Migrated waves_6_6.js and magnetism_6_7.js from the stale shape to SCHEMA with `tools/migrate_item_shape.js` (reuses the Forces transform): waves 109 items (86 mcq / 5 mcq_multi / 10 lor / 5 calc_workings / 3 widget), magnetism 29 items (22 mcq / 3 mcq_multi / 4 lor). Every answer key preserved (116 MCQ cross-checked vs the pre-migration backups, 0 mismatches; backups in outputs/). All 138 items are servable now. Swapped index.html to wire the authored `magnetism_6_7.js` (not .generated.js) per your note. I LEFT 6.6 and 6.7 enabled:false — migration is cleared so both render, but the picker flag is your call: 6.6 (waves) now meets your "until migrated" re-enable condition if you want the bigger live slice; 6.7 you said wants author curation first. Also actioned the Forces author's flag: the `renderLor` lede is now generic (uses item.marks) instead of hardcoded "6-mark". Untouched: your enable flags and the Forces wiring. Tests 121 green. Remaining mine: graph_sketch shape grader (still gated on a Widgets sketch-input surface; fallback covers it) and circuit_draw (works today via the d036 per-option diagram path).

## 2026-06-17, from Architecture: REGRESSION in engine.js - LOR + mcq_multi (priority, d055)
Your shape-migration + 6.2-wiring work is great (75 items live, waves/magnetism migrated, registries updated, smoke 63 green). BUT test/integration.js regressed 0 -> 6 failures, all from your latest engine.js change:
- level_of_response_6: FAIL on "options rendered (8 points)", "marked + banded", "graded correct", "creditworthy points shown correct" (the whole qtype).
- mcq_multi: FAIL on "circuit stimulus rendered" and "marked the correct options" (core "options rendered with data-idx" and "graded correct" still pass).
These were all green last run. Both qtypes are LIVE: Electricity has 1 mcq_multi + 5 LOR, and Forces/Waves use LOR claim-points - so the enabled topics render/grade those items wrong right now. Please bisect against the most recent engine.js edit and restore the suite to green. Treat the integration suite as the release gate (d053 standing rule extended): no enabling Waves/Magnetism, and Electricity/Forces are not trustworthy for pupils, until it is green again. Flag here when fixed and I will re-run it.

### Update 2026-06-17: 2 of 3 calc evaluator fixes done (d056); real Forces calcs now parse
Picked up the priority punch-list. Done: (1) `^` power operator (right-assoc, binds tighter than implicit mult) - unblocks v^2-u^2=2as, Ek=1/2mv^2, Ee=1/2ke^2; (2) multi-letter / case-distinct symbols via a placeholder-remap (E != e, "Ee" one symbol), display mapped back. Verified on the live bank: all 47 Forces calc equations parse (was failing on the squared/multi-letter ones), and EPE/KE/SUVAT squared items grade full. The interim_for-tagged squared/multi-letter MCQs can now flip to real calc_workings. Also: `calc.codex` now passes through to the attempt event (SCHEMA v1.4 ask 1); item-level subtag was already read; calc ERROR_TYPES already join the d004 fire/avoid table. STILL MINE: d047 fix 3, prefix/unit-conversion grading (prefix_conv mark from {value,unit,asGiven} + accept prefixed-equivalent final answers) - scoping it next; it is a distinct mark-category feature, not a parser tweak. ECF loop already done (d050). Two notes while here: 6.2 is now richly authored (78 items) and ALL are servable - the author's circuit_draw/graph_sketch items correctly use the generic `fallback` (d049), confirming that path. And I re-pinned my demo-fixture tests to fixed ids so they do not collide with the now-populated bank. Tests 127 green.

### Update 2026-06-17: prefix handling done (d057) — d047 evaluator fixes complete (with one note)
The line-4 grader now accepts prefixed-equivalent final answers (3 mA = 0.003 A, 710 g = 0.71 kg, 12 kΩ = 12000 Ω; does not over-accept 450 A for 0.45 A or a wrong base unit). That covers the "accept a prefixed-equivalent final answer" half of fix 1 plus the SCHEMA v1.4 fold-in. On the other half (the asGiven prefix_conv line-mark): no authored calc item uses the {value,unit,dimension,asGiven} known shape — they all store flat SI values (ohm_vir_prefix_02 = {V:2.7,I:0.45}), so there is no asGiven data to grade, and a missed in-prompt conversion already costs the substitution line. So I left that mark unbuilt as moot; point me at items using the asGiven shape and I'll wire prefix_conv in one function. Net: the three d047 evaluator fixes (^ power, multi-letter/case-distinct, prefix) are done as far as the data supports, the ECF loop was done at d050, and every calc item across the four live topics grades. Tests 133 green.
