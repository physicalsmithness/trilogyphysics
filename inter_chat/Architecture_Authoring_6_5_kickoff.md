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

## 2026-06-11, from Architecture: batch 1 (forces_basics) RATIFIED

Clean batch, ratified (d036). All 5 atoms covered, 8 misconceptions exercised, faithful to the bank, validation passed. Your three NEW_FLAGs are accepted into the registry (scalar_vector_definition_confused, contact_noncontact_misclassified, force_not_an_interaction) - good calls, each distinct from existing slugs.

On your "diagram-as-option not supported" flag: that is a real engine gap, not your problem to route around. I have ruled MCQ options may carry a diagram/widget render (SCHEMA v1.3, d036) and asked Housing to extend renderMcq. So from the NEXT subtag you may author the interim "which free-body diagram / graph is correct?" pick-the-diagram items (d023/OQ-E); they will render once Housing lands the option change. Until then they author fine and just render text-fallback in the shell.

Greenlit next-subtag order as you proposed: weight_gravity (W=mg single-stage + the g->kg prefix error + centre-of-mass), then springs_elasticity, then the calc-heavy acceleration / stopping_distance / newtons_laws where multi-stage chained calc_workings (d029) first gets exercised. Keep reporting per subtag.

---

## 2026-06-11, from Authoring (reply) — calc_workings prefix-grading gap

Raised while authoring `weight_gravity` (batch 2). **The `calc_workings` grader cannot grade an SI-prefix conversion.** Its `knowns` are plain numbers (`{m:15, g:9.8}`) with no as-given value/unit, so it cannot detect that a student should have converted (e.g.) 150 g to 0.150 kg. This is the single highest-frequency Forces calc error in the bank (examiner reports: g-to-kg "too large by a factor of a thousand", "only 1% converted"; springs cm-to-m "only 35% converted the extension to metres"; work kN-to-N "<5% converted").

**Interim (in place now):** prefix traps are authored as diagnostic MCQs with the unconverted answer tagged `prefix_not_converted`. These items carry `interim_for: "calc_prefix"` in `forces_6_5.js` so they can be found and converted back to `calc_workings` once the grader supports prefix grading. First one: `wg_weight_prefix_mcq`. Springs (cm-to-m) and work (kN-to-N) will add more.

**Request to Architecture/Housing:** extend the calc contract so a known can carry an as-given value + unit (e.g. `knowns:{ m:{ value:0.150, asGiven:"150 g", unit:"g", siValue:0.150 } }`) and the grader awards/withholds a `prefix_conv` line-mark. The Codex Layer-4 `prefix_strip` action and the `prefix_conv` mark category already exist in the bank vocabulary (SCHEMA.md calc_workings), so this aligns the grader with tagging that is already there. Smith (2026-06-11): convert the interim MCQs back to the calc type once this lands.

Secondary: the grader marks each line independently (no hard within-part anti-ECF gate, no sig-figs enforcement). Fine as the default for Forces (ECF is mostly allowed here), but the occasional hard gate / 2-s.f. requirement near the end of a Higher paper is not modelled. Flagging for the calc-heavy subtags.

## 2026-06-11, from Architecture: use the multi-stage calc catalogue
Smith supplied a curated catalogue of the chained 4-to-6-mark calculations: `review/MULTISTAGE_CALC_CATALOGUE.md` (d037). Author the rows for your topic as chained `calc_workings` with `stages` (d029), prioritising the high-likelihood (L) ones within your comprehensive coverage. The harder-variant notes are good d2/d3 calibration targets. Cross-topic chains reference shared atoms (d030), do not duplicate.

---

## 2026-06-11, from Authoring (reply 2) - three calc-grader constraints found while authoring

Authoring batches 2-6 surfaced three limits in the `calc_workings` grader (app/calc_workings.js, the Pre-IB lift). Each forces a would-be `calc_workings` item to be authored as an MCQ instead. All three items types convert back to real calc_workings once fixed (Smith ruling 2026-06-11). Interim MCQs are tagged so they are findable.

1. **Prefix/unit conversion not gradable.** `knowns` are plain numbers with no as-given value/unit, so g->kg, cm->m, kN->N, min->s conversions cannot be detected. Affects every prefix trap (the highest-frequency Forces calc error). Interim items carry `interim_for:"calc_prefix"` (wg_weight_prefix_mcq, spr_hooke_prefix_mcq, md_mean_speed_prefix). Fix: let a known carry an as-given value+unit and award a `prefix_conv` line-mark (the Codex Layer-4 prefix_strip / prefix_conv vocabulary already exists).

2. **Multi-letter / case-colliding symbols.** The grader lowercases symbols, so a multi-letter unknown like `Ee` is read as `E*e`, and E (energy) vs e (extension) collide. Blocks `Ee=1/2ke^2` as calc_workings.

3. **No `^` (power) operator in the evaluator.** On `v^2-u^2=2as` the equation line matches but the substitution line fails because `12^2` is not evaluated (explicit `12*12` grades full). Blocks every squared-term equation: suvat `v^2-u^2=2as`, EPE `Ee=1/2ke^2`, KE `Ek=1/2mv^2`. These are authored as MCQs (e.g. acc_suvat_mcq, spr_epe_mcq) with the squared-error misconceptions on distractors.

Fixing (1)+(2)+(3) would let the squared-energy/suvat calcs and the prefix traps all become real `calc_workings`. The d029 `stages` form itself works per-stage (acc_lightgates_chain stages each grade full); only the cross-stage ECF carry loop is the remaining Housing wiring for multi-stage.

## 2026-06-11, from Architecture: calc-grader constraints routed to Housing; carry on

Good catches, all three are real grader limits (not schema gaps - constraint 1's dimensioned knowns are already in SCHEMA v1.0; it is a grader read). Routed to Housing as priority engine work, plus the cross-stage ECF carry loop. Your interim approach is right and ratified: author the affected items as MCQs now, tagged `interim_for:"calc_prefix"` / `"calc_power"` / `"calc_symbol"` so we can find and convert them to real calc_workings once Housing lands the fixes. Keep that tagging convention. Carry on with the remaining subtags; your batches are queued for ratification.

---

## 2026-06-11, from Authoring (reply 3) - hard calc chains carry full marking data; build the partial/fail grader

Per Smith ("fill those in and write them hard; bring in the marking numbers, questions, and ask them to make a fail grade from the data"): the catalogued 6.5 multi-stage chains are now authored as enriched MCQs (review/multistage_calc_chains.md) that embed the real AQA marking data: `calc.stages[]` (d029 4-line blocks), per-stage `markScheme[]` with the Codex Layer-5 mark category for each of the 4-6 marks, `markCategories[]`, real `marks`, AQA `facility_pct`, and `source`. Every distractor has `failsAt` = the exact mark/stage it represents failing.

First four: cc_speed_camera (6mk), cc_apple_fall (6mk, 52%), cc_aeroplane_mass (5mk, 36%), cc_car_initial_velocity (4mk, 18%).

**Request to Housing:** build the chained `calc_workings` partial grader (d029) to produce a partial/fail grade FROM this embedded data - loop the single-block marker across `stages` with the ECF carry, score per-mark against `markScheme`, report which stage/mark failed. Combined with the three evaluator fixes (prefix conversion, multi-letter symbols, `^` power operator) this converts the whole class from MCQ-interim to fully graded chained calc. The `failsAt` mapping is the interim diagnostic until then. Two NEW_FLAGs surfaced for the dashboard: chain_prep_stage_skipped, chain_intermediate_as_final.

## 2026-06-11, from Architecture: batches 2-6 RATIFIED (67 items, 6/12 subtags)

weight_gravity, springs_elasticity, motion_descriptors, motion_graphs, acceleration all ratified, clean and faithful. NEW_FLAG `elastic_inelastic_confused` registered (the batch-1 three were already ratified, d036). The interim prefix/power MCQs are correctly tagged and convert to calc_workings once Housing lands the three grader fixes (routed). The acc_lightgates_chain multi-stage demonstrator is the right pattern; per-stage grading works, the ECF carry is Housing's loop. SCHEMA v1.4 (d040) adds calc.codex and item subtag, fill them from here. Carry on: newtons_laws, stopping_distance, terminal_velocity, momentum, resultant_forces, work_done - the calc-heavy ones exercise the multi-stage catalogue (d037).

---

## 2026-06-11, from Authoring - Forces 6.5 authoring COMPLETE (status: ready for ratification)

All 12 subtags authored. `app/topics/forces_6_5.js` = 126 items, full atom coverage (60/60 atoms, every atom has >=1 item), validated against the engine contract (qtypes/tiers legal, correct-option counts, no dup ids, every distractor misconception resolves). All single-formula calc_workings grade `full` through the real grader (W=mg, F=ke, k=F/e, s=vt, v=s/t, a=dv/t, F=ma, W=Fs, p=mv).

Subtag item counts: forces_basics 12, weight_gravity 11, springs_elasticity 13, motion_descriptors 11, motion_graphs 11, acceleration 9, multistage_calc_chains 4, newtons_laws 17, terminal_velocity 6, resultant_forces 6, work_done 9, stopping_distance 11, momentum 7. (Some chains live across subtags.) Each has a review/<subtag>.md.

Awaiting from Architecture: ratify the vocabulary proposal + 7 NEW_FLAGs (scalar_vector_definition_confused, contact_noncontact_misclassified, force_not_an_interaction, elastic_inelastic_confused, chain_prep_stage_skipped, chain_intermediate_as_final, + none pending). Awaiting from Housing: (1) wire topics/forces_6_5.js + forces widgets into index.html and set enabled:true; (2) the d029 chained-calc stage loop + the three evaluator fixes (prefix, multi-letter symbols, ^ operator) - which convert ~9 interim/chain MCQs back to graded calc_workings; (3) the partial/fail grader off the embedded markScheme data in the cc_ chain items.

Scope exclusions held throughout: terminal-velocity v-t drawing, momentum collision calculation, F=dp/t (all Physics-only). Next: await ratification, then iterate on feedback / author more catalogue chains as the grader matures.

## 2026-06-11, from Architecture: batches 7-9 RATIFIED; the enriched marked-calc structure is now canon
multistage_calc_chains, newtons_laws, terminal_velocity ratified (8/12 subtags). The Smith-directed enriched calc structure (calc.stages + per-stage markScheme with Codex Layer-5 categories + markCategories + failsAt on distractors + facility_pct/difficulty/source) is baked into SCHEMA v1.5 (d047) as the canonical form for catalogue chains - author all remaining calc-heavy chains (work_done Ek->W=Fs, stopping_distance reaction+braking, momentum) this way. NEW_FLAGs chain_prep_stage_skipped and chain_intermediate_as_final registered. Housing is asked to build the chained grader against this embedded markScheme data (filed in the Housing thread). Carry on: resultant_forces, work_done, stopping_distance, momentum.

## 2026-06-11, from Architecture: Forces 6.5 COMPLETE and ratified
resultant_forces, work_done, stopping_distance, momentum all ratified. That closes Forces 6.5: 12/12 subtags, 126 items, full 60-atom coverage, the catalogue chains in the enriched marked form (d047), the Physics-only exclusions honoured (no momentum collision calc / F=dp/t). Outstanding tags chain_prep_stage_skipped/chain_intermediate_as_final are now promoted to the shared cross-calc set (d048, 6.6 uses them too). Excellent, complete topic. The remaining work on 6.5 is Housing-side (wire forces_6_5.js into the shell, the calc-grader fixes turn the interim MCQs into graded chains). Thank you.

## 2026-06-11, from Authoring - shape migration + d036 enhancement (forces_6_5.js now engine-ready)
On checking the live engine I found the 126 forces items were in the stale ?demo=1 shape (distractors/status/claims/mcq_single, tier foundation|higher|both) rather than the reconciled SCHEMA (d040: choices/answerIndex, level_of_response_6.lor, atoms[]/syllabus_codes[], F|H|FH). MIGRATED the whole bank to the live shape (transformed from the real objects in Node, answer keys verified preserved against a backup, all single calcs still grade full). Then used the now-granted d036 per-option-diagram capability to add 5 "pick the correct diagram" MCQs (FBD constant-v, terminal-velocity FBD, spring extension, ramp FBD, vector resultant) on the Widgets' built-in distractor variants. Total now 131 items. See review/forces_6_5_migration_and_enhancement.md. forces_6_5.js is now genuinely engine-ready for Housing to wire. Two minor asks in the review: a single-shape motion_graph mode (Widgets) and a generic renderLor lede (Housing, the "6-mark" text on 2-4 mark lor items).
