# Batch review: newtons_laws (Forces 6.5, batch 8)

From: 6.5 Forces Authoring chat. Date: 2026-06-11. Output appended to `app/topics/forces_6_5.js`.

## What it covers

- **Spec codes:** 6.5.4.2.1 (N1, inertia), .2.2 (N2 F=ma, proportionality, RP19, inertial mass), .2.3 (N3).
- **Atoms (all 8):** `n1_resultant_zero` (x2), `n1_apply`, `n2_calc` (x4 incl. chain), `n2_proportionality` (x2), `n3_equal_opposite` (x3), `inertia_concept` (HT), `inertial_mass` (HT), `rp19_force_mass_accel`.
- **Items: 17.** 12 `mcq_single`, 2 `short`, **2 `calc_workings`** (F=ma force -> 682 N, mass -> 72 kg; both grade `full`), 1 enriched multi-stage chain.
- **Misconceptions exercised:** `resultant_nonzero_at_constant_v`, `wrong_formula_rearrangement`, `n3_confused_with_n1`, `n2_acceleration_squared`, `n2_inverse_stated_as_decreases`, `inertia_term_unknown`, `chain_prep_stage_skipped`, `chain_intermediate_as_final`, `repeatability_reproducibility_confused`. No NEW_FLAGs.

## Highlights

- **`nl_n3_vs_n1`** (short, HT) targets the bank's biggest Newton's-laws error - "the cars exert equal and opposite forces, so the resultant is zero" (examiner: "a large number mixed Newton's First and Third Laws"). The `n3_confused_with_n1` slug is exercised across four items here.
- **`nl_n2_squared_trap`** captures the "60 m/s^2 means square it" error (`n2_acceleration_squared`, the 270000 N distractor) - a recurring real misread of the unit.
- **`cc_rocket_resultant`** is an enriched multi-stage chain (W=mg -> resultant -> F=ma), the catalogue's "forget the weight" hard variant: the 15 m/s^2 distractor (`chain_prep_stage_skipped`) is exactly that failure. Carries the full `calc.stages` + per-mark `markScheme` + `failsAt` marking data like batch 7. Source is `in_style_of` (composed to the catalogue pattern with clean numbers) rather than a single ppq.

## Coverage so far

7 of 12 subtags = **87 items**. 60 atoms, 56 misconceptions. Remaining: terminal_velocity, resultant_forces, work_done, stopping_distance, momentum.
