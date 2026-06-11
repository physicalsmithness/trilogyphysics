# Batch review: weight_gravity (Forces 6.5, batch 2)

From: 6.5 Forces Authoring chat. Date: 2026-06-11. Status: delivered for review.

Second authored batch. Output appended to `app/topics/forces_6_5.js`. Two-pass: spec-first coverage of 6.5.1.3, matched to the real AQA bank (the W=mg calc shapes, the g-to-kg paperclip trap, the mass rearrangement, the gfs-change explanation, the centre-of-mass naming, the newtonmeter read). This is the **first batch with `calc_workings`**.

## What it covers

- **Spec codes:** 6.5.1.3.a (W=mg, gfs dependence, weight arrow), .c (gfs/weight-mass distinction), .d (rearrange to mass), .e (centre of mass), .f (weight proportional to mass), .g (newtonmeter).
- **Atoms (all 6 in the subtag):** `weight_calc` (x4), `weight_mass_distinction`, `gfs_dependence` (x2), `weight_mass_proportional`, `centre_of_mass` (x2), `newtonmeter_read`.
- **Items: 11.** 8 `mcq_single`, 1 `short`, **2 `calc_workings`**. Tiers: 8 `both`, 1 `higher` (gfs explanation), 2 `foundation` (prefix MCQ, newtonmeter).
- **Misconceptions exercised (7):** `wrong_formula_rearrangement`, `prefix_not_converted`, `weight_mass_conflated`, `weight_gfs_confused`, `proportionality_stated_as_increases`, `centre_of_mass_arrow_missing`, `graph_scale_misread`. No NEW_FLAGs this batch (all slugs already in the proposal/registry).
- **Equation-sheet flags carried (principle 6):** `wg_equation_recall` and `wg_mass_rearrange` = `must_recall`; the two W=mg substitution items = `from_insert`. W=mg is fundamentally a recall equation (on the 2023 insert, not the pre-Covid one).

The two calc items were run through the real `calc_workings` grader (the verbatim Pre-IB lift): a full correct-method attempt scores `full`; a correct value with no unit scores `partial` (the unit mark is lost, `requireUnit:true`); the mass rearrangement scores `full`. So the method-marking works end to end.

## Findings to flag (engine / grading)

1. **`calc_workings` cannot natively grade a prefix conversion.** The grader's `knowns` are plain numbers (`{m:15, g:9.8}`), with no `asGiven`/unit, so it cannot tell that a student should have converted 150 g to 0.150 kg. This is exactly the signature Forces error (examiner reports: g-to-kg "answer too large by a factor of a thousand"; "only 1% converted"). I therefore authored the g-to-kg trap as a **diagnostic MCQ** (`wg_weight_prefix_mcq`, with the 1470 N distractor tagged `prefix_not_converted`) rather than as a calc. This will recur sharply in `springs_elasticity` (cm-to-m) and `work_done` (kN-to-N). **Proposal for Architecture/Housing:** extend the calc contract so `knowns` can carry an `asGiven` value + unit and the grader awards/【withholds a `prefix_conv` line-mark — the Codex Layer-4 `prefix_strip` action and the `prefix_conv` mark category already exist in the bank vocabulary. Until then, prefix traps ride on MCQ distractors.

2. **No hard anti-ECF gate within a single calc part.** AQA's real mass-rearrange item (engineer 710 N -> 72 kg) gates the final mark on "the correct equation must have been used" and requires 2 s.f. The `calc_workings` grader marks each line independently (method credit), which is the right default for most Forces calcs (ECF is mostly *allowed* here, per the proposal's gate-record finding), but it does not model the occasional hard within-part gate or enforce a sig-figs requirement. Not a blocker for this batch; flagging for the calc-heavy subtags (a Higher paper has roughly one hard gate near the end).

3. **Engine wiring still pending (Housing).** Same handoff as batch 1: `topics/forces_6_5.js` needs adding to `index.html`, the forces-widgets script loading, and the topic flipped to `enabled:true`. Two items reference `free_body_diagram`; the rest are text-only.

## Coverage so far (Forces 6.5)

2 of 12 subtags authored: `forces_basics` (12 items), `weight_gravity` (11 items) = 23 items live in `forces_6_5.js`. All 60 atoms and 53 misconceptions registered; 3 NEW_FLAGs still awaiting ratification from batch 1.

## Next

Suggested next: `springs_elasticity` (Hooke F=ke single-stage calc + spring-constant rearrange + the cm-to-m prefix trap + force-extension graph + RP18 claim-points + Ee=half-ke^2) — it stress-tests finding 1 above and brings in the first `level_of_response_6` claim-points and `graph_sketch`/`spring_extension` references. Or jump to a calc-chain subtag (`acceleration` / `stopping_distance`) to exercise the greenlit multi-stage chained `calc_workings`.
