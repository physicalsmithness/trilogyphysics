# Batch review: dc_motor (HT) + the cross-topic transformer item (Magnetism 6.7, batch 7, final)

From: 6.7 Magnetism Authoring chat. Date: 2026-06-11. Status: delivered for review. **This completes 6.7 authoring.**

## dc_motor (6.7.2.3, HT)

- **Atoms (all 3):** `motor_rotation_explain`, `commutator_function`, `motor_speed_changes`.
- **Items: 4.** 3 `mcq`, 1 `level_of_response_6`. Tier: all `H`.
- The rotation `level_of_response_6` (`dm_rotation_lor`) encodes the 2019 P2H 4.4 / 2025 P2H 4.3 mark scheme as five chain-points (field present; opposite currents on the two sides; so opposite forces; coil turns; commutator reverses current each half turn), with the two documented traps as wrong claims: `current_attracted_to_pole` ("the current is attracted to the N pole") and `motor_opposite_currents_missed` ("only one side has a force"). 75% scored zero on the real paper. Uses the `dc_motor` widget as the stem.
- `dm_forces_vertical` carries the new `motor_force_rotates_with_coil` slug (the "forces spin round with the coil" misconception the `dc_motor` widget's `forces_rotate` distractor variant is built for).
- **Sources:** 2 `aqa_ppq` (2019 P2H 4.4, 2022 P2H 4.3), 1 salvaged (`motor_commutator`), 1 authored.

## Transformer item (cross-topic, Architecture assignment)

Per your instruction to own one shared transformer item under 6.7, cross-referenced from 6.2 National Grid. I authored **two** small `calc_workings` (a turns-ratio p.d. and a power/current), because the National Grid story needs both the step-down and the step-up-lowers-current idea, and one item could not carry both cleanly.

- New subtag `transformer` (HT) with two atoms (`transformer_turns_pd`, `transformer_power`). This is outside my ratified proposal (which excluded transformers as Triple-only); it exists solely because you assigned the shared item. Flagging the scope note explicitly: **if 6.2 would rather own these, move them; they are deliberately isolated in their own subtag so that is a one-line change.**
- `tr_turns_ratio_calc`: Vp/Vs = Np/Ns, 230 V / 200:50 turns -> 57.5 V (step-down). `transformer_ratio_inverted` (NEW_FLAG) is the invert-the-ratio error (gives 920 V).
- `tr_power_calc`: Vp Ip = Vs Is, step-up 230 V / 0.50 A -> 1150 V gives 0.10 A. Both equations are on both inserts (`equation_sheet: from_insert`). Both grade `full` headless.

## NEW_FLAG proposals (this batch: 2)

| slug | subtag | trap |
|---|---|---|
| `motor_force_rotates_with_coil` | dc_motor | thinks the motor-effect forces rotate around with the coil so they always drive it forward, rather than staying vertical with a changing moment arm |
| `transformer_ratio_inverted` | transformer | inverts Vp/Vs = Np/Ns, turning a step-down into a step-up (or vice versa) |

(`flhr_force_along_current` was proposed in review/motor_effect.md.)

## Final 6.7 coverage (whole topic)

- **88 items** total: 62 `mcq`, 6 `mcq_multi`, 13 `level_of_response_6`, 7 `calc_workings`.
- **8 subtags, full atom coverage:** magnets_and_poles 5/5, induced_magnetism 5/5, magnetic_fields 6/6, compass_and_earth 2/2, electromagnetism 8/8, motor_effect 9/9, dc_motor 3/3, transformer 2/2. Every one of the 40 registry atoms is exercised by at least one item; the 2 cross-topic atoms (`weight_calc`, `ohm_law_calc`) are referenced via `atomMap`, not duplicated.
- **34 misconceptions** registered, including 4 NEW_FLAGs surfaced during authoring (`wire_field_circulation_reversed`, `flhr_force_along_current`, `motor_force_rotates_with_coil`, `transformer_ratio_inverted`) on top of the 20 in the ratified proposal.
- **Self-marking (d034):** zero keyword `short` in the entire topic. Every structured answer is `mcq`, `mcq_multi`, `calc_workings`, claim-point `level_of_response_6`, or a d036 diagram-option MCQ.
- **Salvage (d034):** the legacy 162-item bank's good ideas are retagged and re-graded across the eight batches; the four padded series (poles x24, wire_dir x17, solenoid_strength x15, flhr_case x20) are deduped to their distinct cases.

## Validation

Whole-file conformance ALL PASS: 88 items; unique ids; legal qtype/tier; `atoms[]`/`syllabus_codes[]`/`subtag` on every item; one-correct mcq / multi-correct mcq_multi; every `level_of_response_6` `marks` equals its creditworthy-point count; every distractor/option/claim `misconception_id` resolves to a registered slug (34 slugs); all 7 `calc_workings` (singles, both chains, both transformer items) grade `full` through the real `markCalcWorkings`, with the chain stages graded per-stage with ECF; every diagram stem and option (22 renders) renders against the real `magnetism-diagrams.js`. Repo smoke suite green (75/75). Backups at `outputs/magnetism_6_7.pre_motor.bak.js` (and earlier `pre_*`).

## Owed back / open

- **Ratify the 4 NEW_FLAGs** and (your call) the `transformer` subtag + its 2 atoms, or reassign them to 6.2.
- **Housing wiring:** swap the script tag to `magnetism_6_7.js` (not `.generated`), load `magnetism-diagrams.js` on `widgets_core.js`, and flip 6.7 `enabled:true` (it is engine-conformant now, the d053 blocker is cleared). The interactive `flhr_direction` / `mark_poles` widget qtype wiring upgrades the FLHR and induced-pole and compass-arrow items from their interim MCQ forms.
- **Registry sync:** `data/misconceptions.js` should gain the 6.7 NEW_FLAGs and still lacks `contact_noncontact_misclassified` and `sig_figs_not_applied` (flagged earlier).
