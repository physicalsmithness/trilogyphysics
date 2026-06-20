# Batch review: electromagnetism (Magnetism 6.7, batch 5)

From: 6.7 Magnetism Authoring chat. Date: 2026-06-11. Status: delivered for review.

Appended to `app/topics/magnetism_6_7.js` in the engine JSON shape. Covers the whole 6.7.2.1 motor-effect-prerequisite block (field around a wire, the solenoid, the electromagnet and its uses), two-pass against the Codex bank.

## What it covers

- **Spec codes:** 6.7.2.1.a (current produces a field around a wire), 6.7.2.1.b (solenoid strengthens the field; iron core; electromagnet; uses), 6.7.2.1.c (solenoid field is bar-magnet-like), 6.7.2.1.d.i (demonstrate the magnetic effect), 6.7.2.1.d.ii.i (draw the wire and solenoid fields).
- **Atoms (all 8 in the subtag):** `wire_field_pattern`, `wire_field_direction`, `wire_field_distance`, `solenoid_field_pattern`, `solenoid_strengthening`, `electromagnet_definition`, `electromagnet_applications`, `magnetic_effect_demo`.
- **Items: 13.** 11 `mcq`, 1 `mcq_multi`, 1 `level_of_response_6` (the crane 6-marker). Tier: all `FH`.
- **Misconceptions exercised:** `wire_field_shape_wrong`, `wire_field_circulation_reversed` (NEW_FLAG, see below), `field_arrows_radial`, `field_arrows_reversed`, `field_strength_evidence_missed`, `force_increases_with_distance`, `stronger_magnet_for_electromagnet`, `coil_turns_stated_ambiguously`, `magnetic_materials_misidentified`, `magnetic_material_treated_as_magnet`, `electromagnet_mechanism_missing`.
- **Diagram-option MCQs (d036):** two. `em_wire_field_draw` (wire_field correct vs reversed vs equal_spacing, off the 2025 P2H "draw the field on the card" item) and `em_solenoid_draw` (solenoid_field correct vs reversed_arrows vs nonuniform, off the specimen "draw the solenoid field" item). Both render headless.
- **Salvage:** `solenoid_strength_1` (one of 15 near-duplicates), `ppq_reverse_current_compass` reworked. Zero keyword `short`.
- **Sources:** 9 `aqa_ppq` (2023 P2F 3.5, 2025 P2H 4.1, specimen set2 1.2/1.7/1.8, 2022 P2F 4.3/4.5, 2021 P2F 2.5/2.6, 2018 P2H 2.3 crane), 2 salvaged, 2 authored.

The crane `level_of_response_6` (`em_crane_lor`) encodes the 2018 P2H 2.3 indicative content as six creditworthy chain-points (complete circuit -> current -> field -> iron core magnetised -> block induced/attracted -> move -> switch off to release), with the two documented level-1 traps as wrong claims: the block treated as a permanent magnet (`magnetic_material_treated_as_magnet`) and the bare on/off answer with no mechanism (`electromagnet_mechanism_missing`). Only ~8% reached level 3 on the real paper.

## NEW_FLAG proposal (1)

Per principle 1 / the brief, one new slug was needed and is added to the registry in `magnetism_6_7.js`; please ratify it alongside the batch:

| slug | subtag | trap | why not an existing slug |
|---|---|---|---|
| `wire_field_circulation_reversed` | electromagnetism | the field circles round the wire are drawn/picked circulating the wrong way (grip rule applied backwards), or the compasses do not reverse when the current reverses | distinct from `wire_field_shape_wrong` (that is the wrong *shape*: straight/spokes/bar-magnet) and from `field_arrows_reversed` (a bar magnet's S-to-N arrows, not a wire's circulation sense). Evidenced: 2025 P2H 4.1 marks the anticlockwise circulation for current out of the page as a separate point; the reversed-current compass item turns on it |

## A correction to the magnetic_fields batch

While placing the wire-distance item I noticed `mf_distance_decreases` (batch 3) cited specimen set2 1.2, which is actually a wire-field part (tagged 6.7.2.1), not a bar-magnet part. I re-sourced that item to `authored` and made its prompt explicitly about a bar magnet (the concept is valid magnetic_fields content, and 2025 P2F 4.5 already anchors magnet-distance with a real PPQ), and authored the specimen wire-distance part properly here as `em_wire_distance`. No other batch-3 item affected.

## Anything awkward

- **`electromagnet` widget kind** renders a full stimulus (solenoid + battery), not a clean set of pick-the-correct variants, so the diagram-option items use `wire_field` and `solenoid_field` (which have correct/distractor variants). The `electromagnet` kind is available as a stem stimulus for later items if wanted.
- **`em_strengthen_multi`** is a tick-THREE item; the engine's `mcq_multi` grades by set match on `answerIndices`, so three correct indices grade cleanly. AQA's real item is tick-two with a deduction rule for over-ticking; I kept the three genuine changes (current, iron core, turns) since all three are creditworthy, and noted the "more turns not more coils" wording in the explanation.

## Validation run

Whole-file conformance ALL PASS (64 items: 50 mcq / 4 mcq_multi / 10 level_of_response_6; 39 atoms; 31 misconceptions): unique ids; legal qtype/tier; `atoms[]`/`syllabus_codes[]`/`subtag` on every item; one-correct mcq, multi-correct mcq_multi; lor `marks` = creditworthy-point count; every distractor/option/claim `misconception_id` resolves; every diagram stem and option (18 renders) renders against the real `magnetism-diagrams.js`. Both new subtags fully atom-covered (compass_and_earth 2/2, electromagnetism 8/8). Repo smoke suite green (75/75). Pre-append backup at `outputs/magnetism_6_7.pre_compass_em.bak.js`.

## Next

The HT pair: `motor_effect` (Fleming's LHR diagram-option family over the `flemings_lhr`/`motor_effect_setup` variants, the F=BIl `calc_workings` singles + prefix prep-steps + the d037 chains all `ecf_allowed` per d044, the right-angle/reversal/balance items) and `dc_motor` (the rotation `level_of_response_6` with the `current_attracted_to_pole` trap, the commutator, speed changes). Plus the cross-topic transformer item Architecture assigned (one shared item under 6.7, referenced by 6.2 National Grid). The motor_effect calc items are the first 6.7 `calc_workings`; I will mirror the Forces `calc.stages` shape.
