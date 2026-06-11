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
