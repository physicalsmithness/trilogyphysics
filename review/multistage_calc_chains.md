# Batch review: multistage_calc_chains (Forces 6.5, batch 7)

From: 6.5 Forces Authoring chat. Date: 2026-06-11. Status: delivered for review. Output appended to `app/topics/forces_6_5.js`.

Smith (2026-06-11): "make them MCQs, but do fill in those ones and write them hard... we definitely need those things in the calculation data big time, so you bring in the marking numbers, questions, and ask them to make a fail grade from the data." This batch does exactly that for the catalogued hard chains.

## What it is

Four of the catalogue's (d037) high-likelihood 6.5 multi-stage chains, taken from real AQA papers, authored as `mcq_single` **but carrying the full calculation marking data** so they are a complete dataset for the future chained grader, not just a multiple-choice shell.

| id | chain | marks | AQA facility | source |
|---|---|---|---|---|
| `cc_speed_camera` | v=d/t -> v^2-u^2=2as (braking distance) | 6 | (no QLM row) | trilogy_2020_p2h_06.3 |
| `cc_apple_fall` | a=dv/t -> v^2-u^2=2as (distance fallen) | 6 | 52% | trilogy_2022_p2h_07.2 |
| `cc_aeroplane_mass` | a=dv/t -> F=ma (find mass) | 5 | 36% | trilogy_2019_p2h_06.2 |
| `cc_car_initial_velocity` | a=dv/t rearranged (find u) | 4 | 18% | trilogy_2024_p2h_05.1 |

Each item carries, in `calc`:
- **`stages[]`** - the d029 per-stage 4-line blocks (equation, knowns, unknown, expectedFinalValue, expectedUnit, gate), the canonical correct chain.
- **`markScheme[]` per stage** - the real AQA per-mark steps with the **Codex Layer-5 mark category** (substitution / non_final_evaluation / rearrangement / evaluation) for each of the 4-6 marks, lifted from the bank mark schemes.
- **`markCategories[]`** - the full ordered per-mark category list for the part.
- item-level **`marks`** (real AQA count), **`difficulty`** (d2/d3, set from the AQA national facility per d006), **`facility_pct`**, **`source`** (aqa_ppq ref), **`equation_sheet`**.

And every distractor carries **`failsAt`** - the exact mark/stage it corresponds to failing - alongside its `misconception`. So the four options are not arbitrary: each is the number a student gets when they fail at one identified point in the mark scheme (e.g. `cc_speed_camera` 16 m = skipped the v=d/t prep stage; 2.0 m = put the deceleration in the displacement slot; 400 m = left v^2 undivided).

## Ask to Housing (the "fail grade from the data" part)

The marking data is now embedded in these items: per-stage equations, per-mark categories, and the real mark-scheme steps. **Please build the chained `calc_workings` grader (d029) to produce a partial / fail grade from this data** - loop the single-block marker across `stages` with the ECF carry, award per-mark against `markScheme`, and report which stage/mark failed (principle 1, atom dashboard sees per-stage fires). The `failsAt` distractor mapping is the MCQ-interim equivalent in the meantime: selecting a wrong option already identifies the failed mark. Filed in the inter_chat dispatch.

This also depends on the three grader fixes already raised (prefix conversion, multi-letter symbols, the `^` power operator) - those three plus the stage loop turn this whole class from MCQ-interim into fully graded chained `calc_workings`.

## NEW_FLAGs (2) - multi-stage failure modes

| slug | trap | evidence |
|---|---|---|
| `chain_prep_stage_skipped` | skipped a preparatory stage and used a raw stem value where a computed quantity was needed (e.g. used the 14 m between camera images as the speed) | examiner reports: "32% calculated the speed but only 2% then substituted that value..."; the dominant multi-stage failure |
| `chain_intermediate_as_final` | gave an intermediate stage's value as the final answer (e.g. gave dv = 4.9 m/s as the distance) | "15% correctly worked out the change in velocity but then failed to use it to determine the distance" |

Both are exactly the multi-stage breakdowns the per-stage dashboard (d029) is meant to catch, and they recur across the bank's 4-6 markers.

## Coverage so far

71 items. The 4 chains seed the calc-heavy coverage that the remaining subtags complete (more chains land with newtons_laws, work_done, stopping_distance). 60 atoms, 56 misconceptions (7 NEW_FLAGs now awaiting ratification: scalar_vector_definition_confused, contact_noncontact_misclassified, force_not_an_interaction, elastic_inelastic_confused, chain_prep_stage_skipped, chain_intermediate_as_final).

## Next

Resume the subtag sweep: `newtons_laws` (which absorbs the F=ma chains and adds N1/N3 qualitative + inertia + RP19), then terminal_velocity, resultant_forces, work_done (Ek->W=Fs chain), stopping_distance (the full reaction+braking chain, ruler-drop), momentum. Each remaining calc-heavy subtag adds its catalogue chains in this enriched form.
