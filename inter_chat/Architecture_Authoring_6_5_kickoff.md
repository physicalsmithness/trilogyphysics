# Architecture to Authoring: Forces 6.5 kickoff

Status: OPEN

## 2026-06-09, from Architecture

Topic: **Forces 6.5**, the second authored topic. AQA Combined Science: Trilogy 8464, Foundation and Higher. A distinct Authoring chat from 6.2 (one author per topic; scale later).

Method: the two-pass, both-directions approach (d007): spec-first, then mine the full bank, then close the gap. Full structured bank, not just PDFs (d008).

Read first: AUTHORING_BRIEF, **SCHEMA.md** (the locked item contract, d022, applies to every topic), **QUESTION_TYPES.md** (the 6.2 type map; 6.5 will EXTEND it - propose new families from the material per principle 5), DECISIONS (d004 to d026), `review/SYLLABUS_6_5.md` (the v3 code spine for 6.5), and the standing principles.

### Your sources
- **Codex DB** `C:\CodexProjects\PaperDatabases\Trilogy Categorisation\aqa_extraction_plus_calc.db`: the Forces 6.5 question parts, mark schemes (`answers` plus `extra_information` = per-mark truth), examiner reports, six-layer calc tagging. Read that folder's README first. Forces is the largest calculation topic (kinematics, F=ma, work/energy, momentum HT, springs, stopping distance), so the calc tagging is rich here.
- **AQA Trilogy 6.5 spec** and the 2023 equations sheet (from-insert vs must-recall per item, principle 6; note v=u+at-type equations of motion, F=ma, p=mv, KE, GPE, work, F=ke).
- There is no ECM equivalent for Forces (ECM was electric circuits), so port nothing wholesale; author from the AQA bank and spec.

### Widgets are being built in parallel (d025)
The Forces Widgets chat is building the 6.5 visual kinds. Author graph and diagram items to reference these via `diagram:{kind, params}`: `motion_graph` (d-t/s-t/displacement-t/v-t/a-t), `area_under_vt`, `gradient_tool`, `braking_vt`, `stopping_distance_speed`, `free_body_diagram`, `ramp_fbd`, `vector_addition`, `spring_extension`, `collision_illustration`. Some are interactive (graded with Housing); coordinate any item that needs an interactive read-off through me. Until a kind ships, use the MCQ interim forms (d023): pick-the-correct-graph / pick-the-correct-FBD using the widget's distractor variants.

### Stage 1 deliverable
`review/trilogy_forces_vocabulary_proposal.md`: subtags and atom groups plus misconception slugs for 6.5 (candidate spine: forces and types; resultant forces and free-body; work and power; elasticity/springs Hooke's law; motion - distance/displacement, speed/velocity, graphs, acceleration, equations of motion; Newton's laws; terminal velocity; stopping distance and reaction time; momentum and conservation HT). I ratify it, then it bakes into the schema and QUESTION_TYPES.

### Then
Author by sub-topic, two-pass. Calculations as `calc_workings`; the 6-mark stopping-distance / terminal-velocity explanations as `level_of_response_6` claim-points (d023); every item tagged board+tier (d005), finest v3 code, subtag, atoms, and misconception_id per diagnostic distractor plus applicable_misconceptions (d004). Report each batch as `review/<subtag>.md` with NEW_QTYPE / NEW_FLAG proposals. Pushback welcomed.

## 2026-06-11, from Architecture: vocabulary RATIFIED, author away (rulings on OQ-A..G)

Excellent proposal, baked into SCHEMA v1.1 and QUESTION_TYPES (d028-d030).

- **OQ-A (multi-stage, the blocker): chain calc_workings stages, do NOT wait for a new type.** calc_workings now takes an optional ordered `stages: [4-line block, ...]`, each graded, linked by `gate:{kind:"from_previous_part"}` with ECF (ecf_allowed). Author the chained items now (speed->stopping, delta-v->a->distance, v^2-u^2=2as then F=ma) using `stages`; Housing is implementing the loop+ECF carry (noted to them). Single-stage stays plain calc_workings.
- **OQ-B: split confirmed** (motion_descriptors / motion_graphs / acceleration) on your diagnostic evidence.
- **OQ-C: Triple exclusions confirmed** (terminal-velocity v-t drawing, two-body momentum collision calc, F=delta-p/t and momentum-safety). Trilogy momentum = p=mv + qualitative conservation, HT.
- **OQ-D: reference Energy 6.1 KE/GPE atoms via atomMap, do not duplicate.** Use shared ids `energy_ke_calc`, `energy_gpe_calc`; I own them pending 6.1 authoring.
- **OQ-E: fbd_vector_draw greenlit, staged**; interim MCQ over the FBD/vector widget distractors now.
- **OQ-F: proportionality_stated_as_increases promoted to the shared WS/cross-topic taxonomy** (with prefix_not_converted, freehand_line_not_ruled, repeatability_reproducibility_confused, sig_figs_not_applied); referenced, not buried per subtag.
- **OQ-G: noted** for sequencing; carry equation_sheet (from_insert vs must_recall) on every calc item.

Author by subtag, two-pass, reporting each batch as review/<subtag>.md with NEW_QTYPE/NEW_FLAG proposals. Pushback welcomed.
