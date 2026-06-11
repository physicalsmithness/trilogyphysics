# Batch review: acceleration (Forces 6.5, batch 6)

From: 6.5 Forces Authoring chat. Date: 2026-06-11. Status: delivered for review. Output appended to `app/topics/forces_6_5.js`. First batch to use the multi-stage `stages` form (d029).

## What it covers

- **Spec codes:** 6.5.4.1.5.a (a = dv/t, unit), .b (deceleration), .c (estimate), .g (v^2-u^2=2as).
- **Atoms (all 4):** `accel_calc` (x4 incl. the chain), `deceleration` (x2), `suvat_calc` (x2), `estimate_accel`.
- **Items: 9.** 6 `mcq_single`, **3 `calc_workings`** (one single-stage `a=(v-u)/t` -> 3.0 m/s^2, grades full; one light-gates **multi-stage** chain; suvat is MCQ, see below).
- **Misconceptions exercised:** `wrong_formula_rearrangement`, `accel_unit_unknown`, `deceleration_sign_confused`, `suvat_squared_mishandled`, `accel_value_used_as_displacement`. No NEW_FLAGs. (`estimate_accel` wrong-magnitude distractors are left untagged - an unrealistic estimate is not a named misconception.)

## Multi-stage demonstrator (d029)

`acc_lightgates_chain` is the first chained `calc_workings` authored as `calc.stages: [ stage1, stage2 ]` per d029: stage 1 finds the velocity from the card (v = d/t = 2.0 m/s), stage 2 finds the acceleration (a = (v-u)/t = 1.25 m/s^2) with `gate:{kind:"from_previous_part"}`. **Each stage grades `full` on its own through the current single-block marker** (tested); the ECF carry between stages is the piece Housing wires by looping the marker (d029, "no new grader logic"). Until then the item is structurally valid and per-stage-correct but the cross-stage carry is inert. This establishes the pattern for the catalogued chains (review/MULTISTAGE_CALC_CATALOGUE.md); the F=ma->suvat and work->Ek chains land with `newtons_laws`, `stopping_distance` and `work_done`.

## Finding to flag (grader) - third calc constraint

**The calc grader's expression evaluator does not support the `^` (power) operator.** On `v^2 - u^2 = 2as`, the equation line (line 1) matches the canonical form, but the **substitution line fails** ("the two sides don't agree") because `12^2` is not evaluated. Confirmed: the same substitution written with explicit multiplication (`12*12`) grades `full`. So a student writing the natural `v^2` loses the substitution mark.

This is the root cause unifying the earlier squared-term problem: **any equation with a power term cannot be a `calc_workings` item** until the evaluator supports `^`. For Forces that is `v^2-u^2=2as` and `Ee=1/2ke^2`; for Energy it is `Ek=1/2mv^2`. All authored as MCQs for now (suvat: `acc_suvat_mcq` with the `suvat_squared_mishandled` 144 m and `accel_value_used_as_displacement` 2.0 m distractors). **Combined with the two earlier constraints, the calc-grader asks for Housing are: (a) prefix/unit conversion gradable; (b) multi-letter symbols; (c) the `^` power operator.** All three would let the squared-energy/suvat calcs and the prefix traps become real `calc_workings`. Added to the inter_chat dispatch.

## Coverage so far

6 of 12 subtags: forces_basics (12), weight_gravity (11), springs_elasticity (13), motion_descriptors (11), motion_graphs (11), acceleration (9) = **67 items**. 60 atoms, 54 misconceptions. 3 interim prefix MCQs + the squared-term MCQs all convert to `calc_workings` once (a)/(b)/(c) land. 5 NEW_FLAGs awaiting ratification.

## Next

`newtons_laws` (N1/N2/N3, F=ma calc + the F=ma->suvat multi-stage chain, inertia HT, the N1/N3 confusion goldmine, RP19), then `terminal_velocity`, `resultant_forces`, `work_done`, `stopping_distance`, `momentum`.
