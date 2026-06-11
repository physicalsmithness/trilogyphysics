# Batch review: magnets_and_poles (Magnetism 6.7, batch 1)

From: 6.7 Magnetism Authoring chat. Date: 2026-06-11. Status: delivered for review.

First authored batch for 6.7, per the brief's "report each batch" pattern. Output is `app/topics/magnetism_6_7.js` (the topic config: full proposal atom + misconception registries plus batches 1-2). The file FORKS AND SUPERSEDES `app/topics/magnetism_6_7.generated.js` per that file's own header; Housing should wire this one, not the generated one. Vocabulary is the PROPOSED set (`review/trilogy_magnetism_vocabulary_proposal.md`, awaiting ratification); authoring proceeded on Smith's "keep going", matching the 6.5 precedent.

## What it covers

- **Spec codes:** 6.7.1.1.a (poles strongest), 6.7.1.1.b (force on each other), 6.7.1.1.c (like repel / unlike attract), 6.7.1.1.d (non-contact), 6.7.1.1.f.i (describe attraction and repulsion), 6.7.1.1.f.ii (the repulsion test).
- **Atoms (all 5 in the subtag):** `poles_strongest_points`, `like_unlike_poles`, `attract_repel_demo`, `magnetic_force_noncontact`, `test_permanent_magnet`.
- **Items: 14.** 11 `mcq_single`, 1 `mcq_multi`, 2 `short` (claim-points). Tier: all `both` (6.7.1 is Foundation-and-Higher).
- **Misconceptions exercised:** `pole_names_confused`, `attraction_taken_as_magnet_proof`, `field_strength_evidence_missed`, `force_increases_with_distance`, `magnetic_material_treated_as_magnet`, `contact_noncontact_misclassified` (port).
- **Salvage (d034):** `poles_pair_1..24` deduped to 2 retagged items plus the conclusion/inference forms; `non_contact`, `ppq_ring_float`, `ppq_ring_flip` reworked; `ppq_test_perm_magnet` converted from keyword `short` to claim-points. Zero keyword-marked items in the batch.
- **Sources:** 6 `aqa_ppq` (2019 P2F 1.2/1.3, 2021 P2H 4.1, 2023 P2F 3.3, 2023 P2H 4.4 both forms), 5 salvaged, 3 authored (spec-first/gap: pole names, repel-conclusion multi, force-as-interaction).
- **Diagrams:** `bar_magnet_field` (correct variant) as a stem. The which-field-is-correct diagram-option MCQs are deliberately left for the `magnetic_fields` batch, where the wrong-field variants belong.

Faithfulness: stems mirror real bank shapes; both `short` items quote the actual mark-scheme structure (2019 1.3 attraction-and-repulsion demo; 2023 4.4 repulsion test, including the examiner-evidenced "any attraction proves it" trap as a wrong claim).

## NEW_FLAG proposals

None beyond the proposal's section 3 set; this batch exercised 5 of its slugs as predicted.

## Anything awkward

- **The 2019 P2F 1.2 strongest-position item** really wants a markable position overlay (A-D letters on the field diagram). The static `bar_magnet_field` has a `markable` param for poles, not arbitrary positions; I authored the text-option form instead. If the Widgets chat adds position markers, the item upgrades cleanly.
- Engine wiring is the usual Housing handoff: `index.html` script tag (swap `magnetism_6_7.generated.js` for `magnetism_6_7.js`), load `magnetism-diagrams.js` + `widgets_core.js`, flip the 6.7 topic on.

## Validation run

Headless checks pass: 38 atoms / 30 misconceptions registered; no duplicate item/option ids; every qtype and tier legal; every `mcq_single` has exactly one correct option, the `mcq_multi` at least two; every `short` has correct claims; every distractor/claim `misconception` resolves to a registered slug; every diagram kind registered and every referenced diagram (stem and option) renders headless against the real `magnetism-diagrams.js`. Repo smoke suite still green (60/60).
