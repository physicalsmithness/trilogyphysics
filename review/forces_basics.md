# Batch review: forces_basics (Forces 6.5, batch 1)

From: 6.5 Forces Authoring chat. Date: 2026-06-11. Status: delivered for review.

First authored batch for Forces 6.5, per the brief's "report each batch" pattern. Output is `app/topics/forces_6_5.js` (the topic config: ratified atom + misconception registries plus this batch's items). Two-pass method: spec-first coverage of 6.5.1.1 / 6.5.1.2, then matched to the real AQA bank shapes mined from the Codex DB.

## What it covers

- **Spec codes:** 6.5.1.1.a (scalar/vector), 6.5.1.1.c (representing a vector by an arrow), 6.5.1.2.a/b/c (contact vs non-contact, force as an interaction).
- **Atoms (all 5 in the subtag):** `scalar_vector_distinction`, `identify_vector_quantity`, `vector_arrow_representation`, `contact_noncontact_classify`, `force_as_interaction`.
- **Items: 12.** 7 `mcq_single`, 3 `mcq_multi`, 2 `short`. Tiers: 10 `both`, 1 `higher` (the tick-two-scalars item, which the bank sets at Higher), 1 `foundation` (normal-force-on-scales).
- **Misconceptions exercised (8):** `scalar_vector_definition_confused`*, `distance_displacement_conflated`, `vector_defaulted_to_velocity`, `fbd_labelled_not_arrows`, `contact_noncontact_misclassified`*, `air_resistance_called_noncontact`, `normal_force_unrecognised`, `force_not_an_interaction`*. (* = NEW_FLAG, see below.)
- **Qtypes:** all gradeable-now (`mcq_single`, `mcq_multi`, `short`). No staged types and no calc in this subtag, so nothing is blocked.
- **Diagrams referenced:** `free_body_diagram` on two items (the "two ways arrows show vectors" stem, and the person-on-scales stem). Both use real kinds/params from the Forces Widgets registry (`object`, `preset`, `forces`).

Faithfulness: every stem mirrors a real AQA Trilogy shape from the bank (e.g. "Why is distance a scalar quantity?", "Which two of these are non-contact forces? Tick two", "What is the name of the upward force on the person?"), and the `short` claim-points are lifted from the actual mark-scheme `answers` wording ("has magnitude and a direction" / "has magnitude only").

## NEW_FLAG proposals (3) — surfaced while authoring this batch

Per principle 1 / the brief ("do not silently fold a new misconception into an existing bucket"). These were needed for diagnostic distractors the §3 proposal list did not yet name. Added to the registry in `forces_6_5.js`; please ratify into the schema alongside the proposal:

| slug | subtag | trap | why not an existing slug |
|---|---|---|---|
| `scalar_vector_definition_confused` | forces_basics | inverts the definition itself — "a vector has direction only", "a scalar has magnitude and direction", "weight is a scalar" | distinct from `vector_defaulted_to_velocity` (that is about *identifying* a quantity, not stating the definition). Evidenced: the "what is a vector quantity" items where 15–40% pick "direction only" |
| `contact_noncontact_misclassified` | forces_basics | misclassifies a contact force as non-contact, or vice versa (friction/tension/normal called non-contact) | the general bucket; `air_resistance_called_noncontact` is its highest-frequency *specific* sub-case and stays separate. Evidenced: "the majority thought air resistance was a non-contact force"; ~40% miss on the friction/electrostatic items |
| `force_not_an_interaction` | forces_basics | treats a force as a property held by one object rather than an interaction between two (6.5.1.2.a/e) | no existing slug covered the interaction-pair idea; it underpins later N3 work (`n3_confused_with_n1`) but is more basic |

No NEW_QTYPE needed for this subtag.

## Anything awkward

- **Engine wiring is a Housing handoff (not done here).** `app/topics/forces_6_5.js` is delivered, but to make the batch run in the shell, Housing needs to: (1) add `<script src="topics/forces_6_5.js"></script>` to `app/index.html` (alongside the electricity one at line ~139), (2) load the Forces Widgets script so the `free_body_diagram` renders rather than falling back to the placeholder, and (3) flip the Forces topic `enabled:false → true` (index.html line ~155). I have not edited `index.html` — that is the shell's seat. Flagging so the batch is testable.
- **Diagram-as-option not supported by the current runtime.** `engine.js renderMcq` renders option `text`, not diagram renders, so "which free-body diagram is correct?" pick-the-diagram items (the d023 interim form for `fbd_vector_draw`) cannot be authored until the shell can render a widget per option. For this subtag I sidestepped it (text options, diagram on the stem only). It will bite `resultant_forces` and the graph/FBD MCQ interim forms — relates to OQ-E. Flagging for Housing/Architecture.
- **Some wrong options are deliberately untagged** (e.g. "Time", "Work done" as non-vectors). They are not diagnostic of a named misconception, so they carry no `misconception` — by design, not omission.

## Validation run

Programmatic check against the engine field contract passed: 60 atoms / 53 misconceptions registered, 12 items, no duplicate atom/misconception/option ids; every `qtype` and `tier` legal; `mcq_single` has exactly one correct option and `mcq_multi` at least two; every `short` has a correct claim; every diagram kind is in `diagram_kinds`; **every distractor `misconception` resolves to a registered slug.**

## Next

On your nod I take the next subtag. Suggested order from here: `weight_gravity` (W=mg single-stage calc + the g→kg error + centre-of-mass), then `springs_elasticity`, then the calc-heavy `acceleration` / `stopping_distance` / `newtons_laws` where the greenlit multi-stage chained `calc_workings` first gets exercised.
