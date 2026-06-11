# Forces 6.5: engine-shape migration + d036 diagram-option enhancement

From: 6.5 Forces Authoring chat. Date: 2026-06-11.

## Why
On checking the live engine I found my 126 items were authored against the stale `?demo=1` fixture shape (`distractors`/`status`/`claims`/`mcq_single`, tier `foundation|higher|both`), but the engine was reconciled to the locked SCHEMA (d040): it reads `choices[]`+`answerIndex(es)`, `markPoints`/`level_of_response_6.lor`, `atoms[]`/`syllabus_codes[]`, tier `F|H|FH`, `misconception_id`. So the items would not have rendered or graded. Migrated the whole bank, then added the d036 capability.

## Migration (all 126 items, transformed in Node from the real objects, re-emitted)
- `qtype`: `mcq_single` -> `mcq`; claim-based `short` -> `level_of_response_6` (selectable claim-points, the engine's interim form per d045).
- MCQ: `distractors[{id,text,status,misconception}]` -> `choices[{text|diagram, misconception_id?}]` + `answerIndex`/`answerIndices`; `applicable_misconceptions` collected.
- Explanations: `claims[{correct,misconception}]` -> `lor.points[{text,creditworthy,misconception_id}]`, `marks` = creditworthy count (so the default gradeLor mapping gives 1 mark/point).
- Added `board`, `topic`, `atoms[]` (from atom), `syllabus_codes[]` (from syllabus), `source`; kept `subtag`, `difficulty`, `equation_sheet`, `interim_for`, `facility_pct`, and the enriched `calc.stages`/`markScheme`/`failsAt` blocks verbatim.
- **Verified:** loads on the engine; qtype counts 89 mcq / 7 mcq_multi / 16 level_of_response_6 / 14 calc_workings; a cross-check against the pre-migration backup confirms **every answer key preserved** (each `answerIndex` points to the originally-correct option; every lor creditworthy set matches; marks = credit count); all 13 single-formula calc items still grade `full`. Pre-migration backup kept at `outputs/forces_6_5.premigration.bak.js`.

## Enhancement (d036 per-option diagram MCQs) - 5 new items, 131 total
Now that an MCQ option may be `{diagram:{kind,params}}` (d036, SCHEMA v1.3), authored true "pick the correct diagram" items using the Widgets' purpose-built correct/distractor variants:
- `rf_pick_fbd_constant_v` - which FBD shows a car at constant velocity (car_constant_speed vs car_accelerating vs missing-force).
- `tv_pick_fbd_terminal` - skydiver at terminal velocity (falling_terminal vs falling_speeding_up).
- `spr_pick_extension` - extension vs whole length (spring_extension correct vs total_as_extension).
- `rf_pick_ramp_fbd` - forces on a slope (ramp_fbd correct vs weight_along_slope vs normal_vertical).
- `rf_pick_vector_resultant` - resultant of perpendicular forces (vector_addition correct vs distance_scalar).
These render once `forces-diagrams.js` is loaded in the shell (part of the pending wiring). The existing text framings are kept (they test reading/recall; these test discrimination, the distinction the original graph_select_capability note drew).

## One small request to Widgets/Housing
The `motion_graph` widget is scenario/phase-based, so a clean "which distance-time graph shows *constant speed*" discrimination item isn't cleanly expressible (only the `curved_constant` distractor on a multi-phase journey). A single-shape mode (`shape: straight|horizontal|curve`) would let me add the pick-the-motion-graph items too. Non-blocking.

## Note for Housing
The `renderLor` lede is hardcoded "This is a 6-mark answer" - cosmetically off for the 2-4 mark explanations now using `level_of_response_6`. Functionally fine (grades by net creditworthy points x marks). Flagging in case a generic lede is easy.
