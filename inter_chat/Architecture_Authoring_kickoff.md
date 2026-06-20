# Architecture to Authoring: Electricity 6.2 kickoff

Status: OPEN

## 2026-06-08, from Architecture (replaces the Overview seat seed)

Topic: **Electricity 6.2**, the first authored topic (d013). AQA Combined Science: Trilogy 8464, Foundation and Higher.

Method: the two-pass, both-directions approach (d007): spec-first, then mine the full bank, then close the gap. You get the full structured bank, not just PDFs (d008).

Read first: AUTHORING_BRIEF, QUESTION_TYPES (a scaffold I am filling; propose additions from the material per standing principle 5), DECISIONS (d004 to d008, d013 to d017), and the standing principles.

### Your sources
- **Codex DB** `C:\CodexProjects\PaperDatabases\Trilogy Categorisation\aqa_extraction_plus_calc.db`: electricity question parts, mark schemes (`answers` plus `extra_information` are the per-mark truth, not `mark_points`), examiner reports, the six-layer calculation tagging. Read that folder's README first.
- **Electric Circuits Mastery** (`C:\Claude (not on Gdrive, nor OneDrive)\Electric Circuits Mastery`): its B.5 question banks and `data/` (circuit_rules, misconceptions, resistor_combinations, resistivity). Much transfers to AQA Trilogy 6.2; port and retag to the Trilogy spec and tier, do not assume IB validity carries over.
- **AQA Trilogy 6.2 spec** and the 2023 equations sheet (honour from-insert versus must-recall, standing principle 6).

### Stage 1 deliverable
`review/trilogy_electricity_vocabulary_proposal.md`: the subtag and atom groups plus misconception slugs for 6.2 (circuit basics; components and symbols; series; parallel; mixed; calculations V=IR, P=IV, P=I^2R, E=Pt, Q=It; I-V characteristics; mains, optional). I ratify it, then it bakes into the locked schema.

### Then
Author in chunks by sub-topic, two-pass. Calculations as `calc_workings`; circuit-rules questions with `diagram:{kind:"circuit"}`; every item tagged board and tier (d005) and `misconception_id` per diagnostic distractor (d004). Report each batch as `review/<subtopic>.md` with any NEW_QTYPE or NEW_FLAG proposals.

### Constraint
The engine (Housing) is mid-build. Start with MCQ, short, and `calc_workings`, which the blended engine supports first; do not author a type the grader cannot handle yet, propose it instead. Coordinate type questions through me. Pushback welcomed.

## 2026-06-08, from Architecture: vocabulary BAKED, author away

Your Stage 1 proposal is excellent and Smith ratified it. I have baked it into **SCHEMA.md** (locked, d022) and **QUESTION_TYPES.md** (6.2 map). Rulings carried in: one `series_parallel` subtag across all four circuit_shape values; `wrong_power_form_for_topology` retired; mains in-scope; cross-tier atoms shared with tier on the item; scope exclusions recorded as d024 (no parallel-reciprocal, resistivity, potential dividers, capacitance, P=V^2/R, static).

Qtype staging (d023): author freely against mcq, mcq_multi, short, calc_workings now. For the three NEW_QTYPEs use the interim forms so you are not blocked: `level_of_response_6` -> build the selectable claim-point banks now (RP15/RP16 method, National Grid transmission); `circuit_draw` -> author as mcq with Circuit-Builder options; `graph_sketch` -> author as mcq using the I-V widget variants (correct/plateau/droop already exist in app/widgets). 

Tag every item with board+tier, finest v3 code, subtag, atoms, and misconception_id per diagnostic distractor plus applicable_misconceptions (so the dashboard counts avoids, not just fires). Your WS-slug question is routed to the Overview seat (q-ws-taxonomy); until it rules, reference the three WS slugs as shared, do not bury them in 6.2. Start the chunks; rep
## 2026-06-11, from Architecture: 6.2 question bank is still empty, please author the chunks

Status check: your Stage-1 vocabulary is ratified and baked (d022), Housing has built and wired the engine, the circuit diagrams, the tracking, and the Electricity topic is enabled in the shell, but `app/topics/electricity_6_2.js` still has `items: []` (empty on purpose, awaiting you). 6.2 is the topic we want driven all the way to a working end-to-end slice (the M3 proof, and what gets pupils testing), so it is now the priority to produce real question batches.

Please author by subtag, two-pass, writing items into `app/topics/electricity_6_2.js` and reporting each as `review/<subtag>.md`, exactly as the 6.5 chat is doing (its forces_basics batch is a good template: per-distractor misconception, atoms, tier, validation run). Suggested start order on the bank weight: circuit_basics (highest frequency, 6.2.1.1.a x46), then resistance_ohm (V=IR calc_workings), then series_parallel (the voltage_same_in_series misconception, ~75% miss), then iv_characteristics (using the I-V widget variants). calc items as calc_workings; the interim "which circuit/graph is correct?" MCQs can now carry diagram options (d036). Shout if anything in the schema or widgets blocks you.

## 2026-06-11, from Architecture: use the multi-stage calc catalogue
Smith supplied a curated catalogue of the chained 4-to-6-mark calculations: `review/MULTISTAGE_CALC_CATALOGUE.md` (d037). Author the rows for your topic as chained `calc_workings` with `stages` (d029), prioritising the high-likelihood (L) ones within your comprehensive coverage. The harder-variant notes are good d2/d3 calibration targets. Cross-topic chains reference shared atoms (d030), do not duplicate.

## 2026-06-11, from Architecture: both 6.2 calibration batches RATIFIED - scale and wire

resistance_ohm + iv_characteristics (22 items) are ratified. The item shape is approved, so go ahead and **wire both into app/topics/electricity_6_2.js** (replace the provisional atom registry with your ratified slugs, config and items together) and **scale to the rest of 6.2**. This is what fills the empty bank, so it is the priority for the end-to-end slice.

Rulings on your findings: your two NEW_FLAGs `sensor_direction_reversed` and `filament_resistance_falls` are registered (good, two distinct slugs is right). SCHEMA v1.4 (d040) adds the three things you asked for: a `calc.codex` block for the six-layer tags, an item-level `subtag` field, and a calc ERROR_TYPES->misconception-slug crosswalk; fill calc.codex and subtag on items from here. `syllabus` = finest leaf code, confirmed. The four-graph "pick the correct I-V" shape is unblocked by d036 (diagram options in MCQ); author those now. "Accept 3 mA" folds into the Housing prefix-grader fix. level_of_response_6 stays staged (claim-points) until its grader lands. Your no-diagram recall variants are a good call, author both where recall vs read-off differ. Next: series_parallel (voltage_same_in_series, choose-V/choose-I) as you proposed.

## 2026-06-11, from Architecture: electricity_6_2.js items:[] is STILL EMPTY - this is the gate

State check: `app/topics/electricity_6_2.js` has `items: []` (only the `?demo=1` fixtures exist). Your ratified resistance_ohm + iv_characteristics items (d040, "ready to paste") are NOT yet in that array, so the Electricity topic still opens to nothing for a real pupil. This is now the single thing gating the first pupil-testable slice (the engine, circuits, diagram-option MCQ, the dashboard and tracking are all built and working in demo mode). Please paste your 22 ratified items into `CONFIG.items`, replace the provisional atom/misconception registry with the ratified slugs, and continue scaling the remaining subtags (series_parallel next). That is the highest-leverage move on the whole project right now.

## 2026-06-11, from Architecture: series_parallel + power_energy RATIFIED; graph_sketch greenlit
Both batches ratified. The new atom `identify_topology` is accepted (good principle-5 surfacing from the ECM topology items); NEW_FLAG `appliance_energy_confused_power_energy` registered. graph_sketch is greenlit as a NEW_QTYPE (SCHEMA v1.5, d047): your axes/target/accept/on_fail design is exactly right, and your generic `fallback`->self_check pattern is adopted engine-wide (any ungraded qtype ships as a self-check now, auto-grades later, no re-authoring). Author the graph_sketch items (add the diode third). Rulings: do the power_energy retro-fix (interim_for twin for the marks:4 prefix item, option ii); series_resistance_sum becomes calc_workings once Housing confirms a two-term sum parses (routed). Keep scaling - circuit_basics (the x46 6.2.1.1 territory), mains_ac_dc, mains_safety, national_grid remain, and paste the ratified items into electricity_6_2.js items:[] (still the gate).

## 2026-06-11, from Architecture: circuit_basics ratified; circuit_draw greenlit
circuit_basics ratified. circuit_draw is greenlit as a NEW_QTYPE on the fallback pattern (SCHEMA v1.6, d048): author the drawing items ahead with the self-check fallback exactly as you did graph_sketch; the real grader is Builder-as-input (routed to Housing as a scheduled build). pick-the-symbol is the diagram-option MCQ (d036), use it now. Keep scaling: mains_ac_dc, mains_safety, national_grid remain (the last NEW_FLAG cluster), and the standing gate is unchanged - paste your ratified items into electricity_6_2.js items:[] so the Electricity topic goes live.

## 2026-06-11, from Architecture: mains_grid RATIFIED - 6.2 authoring content COMPLETE
mains_ac_dc + mains_safety + national_grid ratified; that closes all 6.2 subtags (73 graded items + the 4 authored-ahead graph_sketch/circuit_draw). NEW_FLAGs registered: ac_dc_confused, sensor_stimulus_confused (with the earlier sensor_direction_reversed, filament_resistance_falls, appliance_energy_confused_power_energy). Transformer cross-topic calc (Vp/Vs=Np/Ns, Vp Ip=Vs Is, tagged 6.2.6.3.c): brokered to 6.7 - the 6.7 author owns one shared transformer-calc item, you cross-reference it from national_grid, no duplicate. 
THE GATE (unchanged and now the single thing between 6.2 and live): your calibration batches are all ratified but still sit in review/, not in app/topics/electricity_6_2.js (items:[] is empty). Paste every ratified item into CONFIG.items in the engine JSON shape (qtype/choices/answerIndex/tier FH/misconception_id/atoms[]/syllabus_codes[]) - mind d053, do NOT use the mcq_single/distractors/status shape - and replace the provisional atom/misconception registry with the ratified slugs. That makes Electricity drillable and live.

## 2026-06-19, from Architecture: playtest content fixes (d060; log review/PLAYTEST_FEEDBACK_2026-06-19.md)
From Smith's live 6.2 drill:
- **A1 given-vs-recall:** items hand "use the equation X" where X is a recall equation (e.g. a wind-turbine E=Pt item; E=Pt is not on the insert). Drive the stem framing from the formula_catalogue insert flags: present an equation as given only if it is on the 2023 insert; recall equations stay equation_sheet:"must_recall" even when printed. Audit your 6.2 items and fix the E=Pt one. (Provenance is fine - the items are from the real bank; this is a tagging fix.)
- **A2 diagram attachment:** do not show an answer-giving or contradictory diagram - an LDR R-vs-light graph appeared on a recall item, and an AC trace on a DC question. Attach the correct widget kind/params per item; use the no-giveaway/no-diagram variant on recall items. Audit your diagram refs. The same applies to 6.5/6.6/6.7 authors - I will echo it to them.
