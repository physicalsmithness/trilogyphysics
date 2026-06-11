# Batch review: motion_graphs (Forces 6.5, batch 5)

From: 6.5 Forces Authoring chat. Date: 2026-06-11. Status: delivered for review. Output appended to `app/topics/forces_6_5.js`.

## What it covers

- **Spec codes:** 6.5.4.1.4.a/b/c (distance-time: constant speed, gradient = speed, tangent HT), 6.5.4.1.5.d/f (velocity-time: gradient = acceleration, area = distance HT, counting squares HT).
- **Atoms (all 5):** `dt_gradient_speed` (x2), `dt_describe_motion` (x3), `vt_gradient_accel` (x3), `vt_area_distance` (x2), `dt_tangent_speed` (HT).
- **Items: 11.** 10 `mcq_single`, 1 `short`. No `calc_workings` (the suvat numeric work is the `acceleration` batch); this subtag is graph *interpretation*.
- **Misconceptions exercised:** `gradient_described_not_named`, `graph_scale_misread`, `gradient_ratio_inverted`, `deceleration_sign_confused`, `area_under_vt_not_recognised`. No NEW_FLAGs. These are the highest-value misconceptions in the topic (examiner data: only 10-40% can name gradient = speed; "65% did not attempt the area").
- **Diagram refs:** `motion_graph` (distance_time) on the constant-speed item; `area_under_vt` on the area item. Stem illustrations only.

## Notes

- `mg_dt_gradient_calc` exercises `gradient_ratio_inverted` (250/50 = 5.0 vs the inverted 50/250 = 0.2) as an MCQ rather than `calc_workings`, since "gradient" is not a single named equation the calc grader matches; the MCQ captures the diagnostic cleanly.
- Pick-the-graph items (e.g. "which graph shows constant acceleration?") remain blocked by the text-only MCQ renderer (diagram-per-option), so graph questions are authored as text MCQs about a described/illustrated graph. Same standing constraint as earlier batches; relates to OQ-E.

## Coverage so far

5 of 12 subtags: forces_basics (12), weight_gravity (11), springs_elasticity (13), motion_descriptors (11), motion_graphs (11) = **58 items**. 60 atoms, 54 misconceptions. 3 interim prefix MCQs; 5 NEW_FLAGs awaiting ratification.

## Next

`acceleration` (a=dv/t and v^2-u^2=2as), the first batch to use the greenlit multi-stage chained `calc_workings`. Reading `review/MULTISTAGE_CALC_CATALOGUE.md` (Architecture/Housing guidance) before authoring it.
