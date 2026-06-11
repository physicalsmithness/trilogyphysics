# Batch review: induced_magnetism (Magnetism 6.7, batch 2)

From: 6.7 Magnetism Authoring chat. Date: 2026-06-11. Status: delivered for review.

Second batch, same delivery file (`app/topics/magnetism_6_7.js`). This is the subtag the vocabulary proposal flagged as the heaviest misconception cluster in the topic (1-25% success rates in the examiner reports), which is why it comes second rather than later.

## What it covers

- **Spec codes:** 6.7.1.1.e (permanent vs induced), 6.7.1.1.f.ii (distinguish them; identify blocks), 6.7.1.2.b (force between magnet and magnetic material is always attraction), 6.7.1.2.e (compass needle material, shared with compass_and_earth).
- **Atoms (all 5 in the subtag):** `permanent_vs_induced`, `induced_polarity`, `induced_always_attracts`, `magnetic_materials_recall`, `identify_magnet_iron_other`.
- **Items: 15.** 10 `mcq_single`, 3 `mcq_multi`, 2 `short` (claim-points).  Tier: all `both`.
- **Misconceptions exercised:** `induced_magnet_expected_to_repel` (the headline trap: 5 items), `magnetic_materials_misidentified` (4 items), `magnetic_material_treated_as_magnet` (4 items), plus `pole_names_confused`, `attraction_taken_as_magnet_proof`, `contact_noncontact_misclassified` cross-firing.
- **Salvage (d034):** `perm_definition`, `induced_temporary`, `ppq_which_metals_magnetic` reworked (tin swapped for brass to match the widget's material model); `induced_polarity`, `induced_vs_perm_short`, `ppq_paperclip_south_pole` ideas absorbed into the diagram and claim-point forms. Zero keyword-marked items.
- **Sources:** 8 `aqa_ppq` (2019 P2F 1.4/1.5, 2020 P2F 6.2 + P2H 1.2, 2021 P2F 2.2, 2022 P2F 4.2, 2024 P2F 4.4, 2018 P2H 2.2, 2021 P2F 2.4), 3 salvaged, 4 authored.
- **Diagrams:** `induced_magnetism` (nail stem; clip-chain correct vs `wrong_poles` as DIAGRAM OPTIONS, the first d036 diagram-option MCQ in 6.7) and `magnetic_materials` (five-sample stem). All render headless.

The diagram-option item (`im_polarity_diagram_pick`) is the interim form of the 2019 "label the poles" draw item; it upgrades to the `mark_poles` interactive widget (d042 contract) when Housing wires `qtype:"widget"` for 6.7.

## NEW_FLAG proposals

None beyond the proposal set; the batch confirmed the proposal's predictions (every wrong claim/distractor the examiner reports describe mapped onto an already-proposed slug).

## Anything awkward

- **`im_polarity_diagram_pick` has 3 options (2 diagram + 1 text).** The `induced_magnetism` widget has exactly two pole variants (correct / wrong_poles), so a third diagram distractor does not exist. If Widgets adds a "non-alternating chain" variant, a third diagram option becomes possible.
- **The 2018 identify-three-blocks 3-marker** is authored as claim-points (5 claims, 3 correct). The true free-description form waits on the LLM short grader (q-explanation-grader); the claim-point form grades the reasoning structure now, which is the d034 intent.
- The crane/electromagnet 6-marker itself (level_of_response_6) belongs to the `electromagnetism` batch; this batch carries its conceptual prerequisite (`im_electromagnet_iron_pickup`).

## Validation run

Same headless harness as batch 1: ALL CHECKS PASS (29 items across both batches; every slug resolves; every mcq_single exactly one correct; every diagram including both diagram OPTIONS renders against the real registry). Repo smoke suite green (60/60).

## Next

Suggested order from here: `magnetic_fields` (the wrong-field widget variants are built and waiting; field_line_drawing + plotting items), then `compass_and_earth` (small), then `electromagnetism` (incl. the crane level_of_response_6 claim-points), then the HT pair `motor_effect` (FLHR family + the F=BIl calc_workings singles, prep-steps and d037 chains) and `dc_motor`. The motor_effect calcs exercise `stages` + the one modelled anti-ECF gate (proposal OQ-5) and want an Architecture ruling there first.
