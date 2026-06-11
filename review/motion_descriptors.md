# Batch review: motion_descriptors (Forces 6.5, batch 4)

From: 6.5 Forces Authoring chat. Date: 2026-06-11. Status: delivered for review. Output appended to `app/topics/forces_6_5.js`.

## What it covers

- **Spec codes:** 6.5.4.1.1.a/b (distance vs displacement), .1.2.g/i/j (typical speeds, s=vt, average speed), .1.3.a/c (speed vs velocity, circular motion HT).
- **Atoms (all 6):** `distance_displacement` (x2), `speed_velocity` (x2), `typical_speeds` (x2), `speed_calc` (x2), `average_speed` (x2), `circular_motion_velocity` (HT).
- **Items: 11.** 6 `mcq_single`, 2 `short`, **2 `calc_workings`** (s=vt -> 90 m; v=s/t -> 7.5 m/s, both grade `full`).
- **Misconceptions exercised:** `distance_displacement_conflated`, `speed_velocity_direction_dropped`, `scalar_vector_definition_confused`, `wrong_formula_rearrangement`, `prefix_not_converted`. No NEW_FLAGs.
- `md_mean_speed_prefix` is a **min->s conversion trap** (2 min -> 120 s; the 1020 m/s distractor tags `prefix_not_converted`). It is the third `interim_for:"calc_prefix"` item. Note: this is a time-unit conversion (min->s), not strictly an SI prefix, but it has the same un-gradeable-by-calc_workings character; folding it under `prefix_not_converted` keeps one slug for "did not convert a unit before substituting".

## Notes

- `md_circular_motion` and `md_velocity_falling` are HT `short` items that lean on the speed/velocity vector distinction; the "velocity is constant because speed is constant" distractor (`speed_velocity_direction_dropped`) is the examiner-flagged trap ("very common to state the velocity was constant").
- No diagram items this batch; the graph-based motion items (gradient = speed, tangent for instantaneous speed) belong to `motion_graphs`, authored next.

## Coverage so far

4 of 12 subtags: forces_basics (12), weight_gravity (11), springs_elasticity (13), motion_descriptors (11) = **47 items**. 60 atoms, 54 misconceptions. 3 interim prefix MCQs flagged for conversion. 5 NEW_FLAGs awaiting ratification.
