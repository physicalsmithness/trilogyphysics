# Batch review: motor_effect (Magnetism 6.7, batch 6, HT)

From: 6.7 Magnetism Authoring chat. Date: 2026-06-11. Status: delivered for review.

The biggest 6.7 subtag and the first to carry `calc_workings`. Higher-tier throughout. Appended to `app/topics/magnetism_6_7.js`.

## What it covers

- **Spec codes:** 6.7.2.2.a (force on a current-carrying conductor; right-angle/parallel condition; equal-and-opposite), 6.7.2.2.b (Fleming's left-hand rule; reversing the force), 6.7.2.2.c (factors affecting the force), 6.7.2.2.d (F = BIl).
- **Atoms (all 9):** `motor_effect_concept`, `flhr_labels`, `flhr_apply`, `bil_calc`, `flux_density_unit`, `motor_force_factors`, `force_direction_reversal`, `right_angle_condition`, `balance_experiment_reasoning`.
- **Items: 18.** 10 `mcq`, 2 `mcq_multi`, 2 `level_of_response_6`, 4 `calc_workings`. Tier: all `H`.
- **calc_workings (the first in 6.7):** find F (single), find B (single, 2024 P2H 4.2 values), find I (single, 2019 P2H 4.3 values), the W=mg -> F=BIl chain (specimen 6.3, `stages` with ECF), and the V=IR -> F=BIl chain (`stages`, `ecf_allowed`, the Synergy hard gate deliberately NOT modelled per d044). All grade `full` headless through `markCalcWorkings`, including the rearrangements for B and I. Plus one interim prefix-trap MCQ (`me_bil_prefix_trap`, `interim_for: calc_prefix`) for the mm->m conversion the bank marks separately, mirroring the Forces `wg_weight_prefix_mcq` pattern.
- **Cross-topic atomMap (d030 / d044 OQ-4):** the W=mg chain references the 6.5 `weight_calc` atom; the V=IR chain references the 6.2 `ohm_law_calc` atom. Both verified to be the real registry slugs, not 6.7 duplicates.
- **FLHR family (OQ-2):** finger-label MCQs over the `flemings_lhr` stem, an apply item over the `motor_effect_setup` stem (force into the page, 2024 P2H 4.1), and the full describe-the-rule `level_of_response_6` from specimen set1 6.1. Authored as the interim MCQ/stem form now; they upgrade to the interactive `flhr_direction` widget (d042) when Housing wires `qtype:"widget"`.
- **Misconceptions:** `flhr_finger_assignment_confused`, `flhr_force_along_current` (NEW_FLAG), `magnitude_change_given_for_reversal`, `flux_density_unit_unknown`, `balance_increase_called_weight_gain`, `current_attracted_to_pole`, `prefix_not_converted`, `proportionality_stated_as_increases`, `confused_v_and_i`.
- **Sources:** 8 `aqa_ppq` (2022 P2H 4.1/4.2, 2024 P2H 4.1/4.2, 2019 P2H 4.2/4.3, 2020 P2H 7.1, specimen set1 6.1, specimen set2 6.3), 1 `in_style_of` (the Synergy V=IR->F=BIl chain, adapted to Trilogy), 3 salvaged, the rest authored.

## NEW_FLAG proposal (1)

| slug | subtag | trap | why not an existing slug |
|---|---|---|---|
| `flhr_force_along_current` | motor_effect | takes the force as acting along the current or along the field, not perpendicular to both (also the "parallel wire gives max force" error) | distinct from `flhr_finger_assignment_confused` (mislabelling the fingers); this is the geometric error that the force is mutually perpendicular. Underpins the right-angle condition (6.7.2.2.a) |

## Anything awkward

- **F=BIl ECF.** The bank's "allow a correct calculation using an unconverted value of l" is ordinary ECF, modelled by tolerance + the prefix-trap MCQ, not a hard gate. The one genuine hard gate (Synergy V=IR->F=BIl) is excluded from Trilogy per d044; I authored the Trilogy V=IR chain as `ecf_allowed` and said so in the item explanation.
- The `motor_effect_setup` and `flemings_lhr` widgets render the rig/hand as a stem; the force direction is a text pick (into/out/up/down). True direction-picking is the interactive `flhr_direction` widget, staged.

## Validation

Part of the whole-file run (see review/dc_motor_and_transformer.md): all 9 atoms covered, every slug resolves, all 4 calc_workings grade full, smoke 75/75.
