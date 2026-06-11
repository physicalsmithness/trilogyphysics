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

Tag every item with board+tier, finest v3 code, subtag, atoms, and misconception_id per diagnostic distractor plus applicable_misconceptions (so the dashboard counts avoids, not just fires). Your WS-slug question is routed to the Overview seat (q-ws-taxonomy); until it rules, reference the three WS slugs as shared, do not bury them in 6.2. Start the chunks; report each as review/<subtag>.md.
