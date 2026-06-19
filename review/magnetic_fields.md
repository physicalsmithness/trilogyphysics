# Batch review: magnetic_fields (Magnetism 6.7, batch 3)

From: 6.7 Magnetism Authoring chat. Date: 2026-06-11. Status: delivered for review.

Third batch, appended to `app/topics/magnetism_6_7.js`. Authored directly in the engine JSON shape (d053 standing rule), so no migration step is owed on it. Two-pass: spec-first coverage of 6.7.1.2, then matched to the AQA Trilogy bank shapes mined from the Codex DB.

## What it covers

- **Spec codes:** 6.7.1.2.a (field definition; pattern; strength vs distance), 6.7.1.2.c (strength from line spacing and from distance), 6.7.1.2.d (field direction = direction of force on a free N pole; the compass arrow), 6.7.1.2.f.i (plot a field line with a compass), 6.7.1.2.f.ii (draw the bar-magnet pattern with arrows; plotting-compass arrows).
- **Atoms (all 6 in the subtag):** `field_definition`, `field_line_drawing`, `field_direction_convention`, `field_strength_spacing`, `field_strength_distance`, `plot_field_with_compass`.
- **Items: 17.** 12 `mcq`, 0 `mcq_multi`, 5 `level_of_response_6` (claim-points). Tier: all `FH` (6.7.1.2 is Foundation-and-Higher).
- **Misconceptions exercised:** `field_arrows_reversed` (the headline error, 5 items), `field_arrows_radial` (4 items, the "spokes" error), `field_strength_evidence_missed` (6 items), `force_increases_with_distance`, plus `magnetic_materials_misidentified` / `contact_noncontact_misclassified` / `pole_names_confused` cross-firing.
- **Diagram-option MCQs (d036):** two. `mf_which_bar_field` (correct vs reversed_arrows vs crossing vs not_reaching, off the 2018/2021 "which diagram" items) and `mf_compass_field_direction` (compass needle correct vs reversed, off the 2024 "draw the arrow" item). Both render headless against the real registry. They are the interim form of the draw-the-field items (d023/d031); they upgrade to the interactive widgets when Housing wires the 6.7 `qtype:"widget"` contracts.
- **Salvage (d034):** `fieldlines_cross`, `fieldlines_NS`, `fields_rule_direction_def`, `fieldlines_spacing`, and the 5-mark keyword `plot_compass_line` reworked (the last converted to claim-points, per the self-marking steer). Zero keyword `short` in the batch.
- **Sources:** 8 `aqa_ppq` (2021 P2F 2.1, 2023 P2F 3.1/3.2, specimen set2 1.1/1.2/1.3, 2024 P2F 4.2, 2021 P2H 4.1, 2025 P2F 4.5/4.7), 4 salvaged, 3 authored (field definition, filings-vs-compass discrimination, gap-pass arrows).

Faithfulness: the two `level_of_response_6` field-rule items quote the actual mark schemes (2023 P2F 3.2 "correct pattern" + "arrows away from N towards S"; specimen 1.3 "distance between lines smaller where field stronger"); the plotting-compass-arrows item encodes the 2025 P2F 4.7 scheme (arrow by the S pole points towards it; middle arrows along the magnet), with the examiner-documented "all arrows point away from the pen" as the headline wrong claim (`field_arrows_radial`).

## NEW_FLAG proposals

None; the batch exercised the proposal's section 3 slugs as predicted.

## A fidelity fix I made to the earlier batches

While conformance-checking, I found Housing's d053 shape-migration had dropped the `subtag` field from the 29 batch-1/2 items (it kept `atoms[]`/`syllabus_codes[]` but not `subtag`). The engine's `buildEvent` falls back to `atoms[0]` when `subtag` is absent, so the atom dashboard would have grouped those items by atom instead of by subtag. I restored `subtag` on all 29 from the atom registry (and set it on the 17 new ones), so the whole file now groups correctly: magnets_and_poles 14, induced_magnetism 15, magnetic_fields 17. Flagging for Housing in case the migrator needs the same fix for waves_6_6.js. Pre-append backup at `outputs/magnetism_6_7.pre_magnetic_fields.bak.js`.

## Anything awkward

- **Iron-filings-vs-compass discrimination (`mf_filings_vs_compass`)** is authored, not from a single bank part; it tests the one thing filings cannot show (direction), which the spec wants under 6.7.1.2.f. Flagging as a spec-first item with no exact PPQ twin.
- The `field_mapping` widget renders a whole filings/compass pattern, so it suits a stem stimulus rather than a "pick the correct one" option; I used `bar_magnet_field` and `compass` variants for the discrimination items instead.

## Validation run

Engine-shape conformance ALL PASS across the whole file (46 items: 35 mcq / 3 mcq_multi / 8 level_of_response_6): unique ids; legal qtype/tier; `atoms[]`/`syllabus_codes[]`/`subtag` present on every item; one-correct on every mcq, two-correct on every mcq_multi; lor `marks` equals the creditworthy-point count; every distractor/option/claim `misconception_id` resolves to a registered slug; every diagram stem and diagram option renders against the real `magnetism-diagrams.js`. All 6 magnetic_fields atoms covered. Repo smoke suite green (63/63).

## Next

`compass_and_earth` (small: compass-is-a-bar-magnet, the Earth-core evidence claim-points), then `electromagnetism` (wire/solenoid fields with the wrong-field diagram options, the strengthening items, and the crane `level_of_response_6`), then the HT pair `motor_effect` (FLHR diagram-option family + the F=BIl `calc_workings` singles/prep-steps/chains, all `ecf_allowed` per d044) and `dc_motor`, plus the cross-topic transformer item Architecture assigned (one shared item under 6.7, referenced by 6.2 National Grid).
