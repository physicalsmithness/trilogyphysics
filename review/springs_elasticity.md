# Batch review: springs_elasticity (Forces 6.5, batch 3)

From: 6.5 Forces Authoring chat. Date: 2026-06-11. Status: delivered for review.

Third authored batch. Output appended to `app/topics/forces_6_5.js`. Two-pass: spec-first coverage of 6.5.3, matched to the AQA bank (F=ke and k=F/e calcs, the cm-to-m trap, elastic/inelastic, limit of proportionality, force-extension graph, Ee=half-ke^2, RP18 method). First batch to bring in a `level_of_response` item and a `spring_extension` diagram.

## What it covers

- **Spec codes:** 6.5.3.a (elastic/inelastic, limit of proportionality), .b (extension, RP18 method), .c (F=ke, k=F/e, proportionality), .e.i (force-extension graph), .g (Ee=half-ke^2).
- **Atoms (all 7 in the subtag):** `hooke_calc` (x3), `spring_constant_calc`, `elastic_inelastic` (x2), `linear_nonlinear` (x2), `epe_calc`, `fe_graph_interpret` (x2), `rp18_force_extension` (x2).
- **Items: 13.** 8 `mcq_single`, 1 `mcq_multi`, 2 `short`, **2 `calc_workings`**. Tiers: 9 `both`, 3 `higher`, 1 `foundation`.
- **Misconceptions exercised (8):** `wrong_formula_rearrangement`, `used_epe_for_hooke`, `prefix_not_converted`, `extension_total_length_used`, `elastic_inelastic_confused`*, `proportionality_stated_as_increases`, `wrong_spring_graph_sketched`, `freehand_line_not_ruled`. (* = NEW_FLAG.)
- The two calc items (F=ke -> 0.80 N; k=F/e -> 750 N/m) were run through the grader and both score `full` (4/4).
- `spr_rp18_method` is the **interim form of `level_of_response_6`** (d023): authored as `short` claim-points (four method points plus two distractor claims), because the engine cannot render the `level_of_response_6` qtype yet.

## NEW_FLAG (1)

| slug | subtag | trap | evidence |
|---|---|---|---|
| `elastic_inelastic_confused` | springs_elasticity | swaps the meaning of elastic and inelastic deformation (e.g. an inelastically deformed spring "returns to its original length", or an elastically deformed one "stays stretched") | the elastic/inelastic definition items are the diagnostic pair; this is the cross-distractor used on `spr_elastic_meaning`, `spr_inelastic_meaning`, `spr_limit_proportionality`. Distinct from `wrong_spring_graph_sketched` (a graph-shape error) |

## Findings to flag (engine / grading)

1. **Second calc-grader constraint: single-character, case-folded symbols.** The grader (v1.5.24) builds a lowercased symbol set, so a multi-letter unknown like `Ee` is read as `E * e`, and `E` (energy) and `e` (extension) collide once lowercased. **`Ee = half-k-e^2` therefore cannot be a `calc_workings` item.** I authored it as an MCQ (`spr_epe_mcq`) with the not-squared (420 J) and not-halved (58.8 J) distractors. The same blocks any squared-term equation with colliding letters (KE = half-m-v^2 is fine, distinct letters; GPE, momentum p=mv fine). **Combined with the prefix gap, the two calc-grader limits to raise with Housing are: (a) prefix conversion not gradable; (b) multi-letter / squared-term equations not gradable.** A future grader (or the Pre-IB convergence, q-shared-engine) should handle both; until then EPE/KE-style energy calcs ride on MCQs.
2. **cm-to-m prefix trap** is the second `interim_for:"calc_prefix"` item (`spr_hooke_prefix_mcq`, 12000 N distractor). When the calc grader gains prefix grading, convert it and `wg_weight_prefix_mcq` back to `calc_workings`.
3. **`spr_fe_graph_shape` references the `spring_extension` widget** (`{kind:"spring_extension", params:{variant:"linear"}}`) as a stem illustration. As with batch 1, pick-the-graph (diagram-per-option) is still blocked by the text-only MCQ renderer; the item is authored as a text MCQ with the diagram on the stem.

## Coverage so far (Forces 6.5)

3 of 12 subtags authored: `forces_basics` (12), `weight_gravity` (11), `springs_elasticity` (13) = **36 items**. Registries: 60 atoms, 54 misconceptions. NEW_FLAGs now awaiting ratification (5 total): `scalar_vector_definition_confused`, `contact_noncontact_misclassified`, `force_not_an_interaction`, `elastic_inelastic_confused`, and (registry-only, not yet a fresh one this batch). Engine-wiring handoff to Housing still pending (index.html script tag, widgets, enabled:true).

## Next

Per Smith ("carry on"), the next batches work through the motion spine. Natural order: `motion_descriptors` (distance/displacement, speed/velocity, s=vt, typical speeds) -> `motion_graphs` -> `acceleration` (first multi-stage chained `calc_workings`, the greenlit OQ-A form) -> `newtons_laws` -> `terminal_velocity` -> `resultant_forces` -> `work_done` -> `stopping_distance` -> `momentum`.
