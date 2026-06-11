# Trilogy Physics: QUESTION_TYPES (Electricity 6.2, M1 locked 2026-06-08)

The map of question types AQA Trilogy physics actually uses, built from the Codex bank (467 parts tagged under 6.2), the examiner reports, and the ratified 6.2 vocabulary proposal. Authoring writes against this; Housing builds graders against it; Widgets supplies the visual kinds. Other topics extend this file as they are authored.

Two axes: **family** (what the item tests) and **grader qtype** (what the engine needs to mark it).

## Grader qtypes
| qtype | gradeable now? | marks | how it is marked |
|---|---|---|---|
| `mcq` (single) | yes | 1 | exact answerIndex; per diagnostic distractor a `misconception_id` (d004) |
| `mcq_multi` / tick-box | yes | 1-2 | set match; per-distractor misconception_id |
| `short` | yes (weak) | 1-2 | keyword presence (`markPoints.any`); engine shows the auto-mark warning. Prefer calc_workings / claim-points where structured |
| `calc_workings` | yes | 4 | the 4-line marks-the-method type (equation / substitute / rearrange / answer+unit), per-line Codex Layer-5 categories (d016) |
| `level_of_response_6` | STAGED (d023) | 6 | interim: selectable claim-points scored against level descriptors; free-text only when an LLM grader lands |
| `circuit_draw` | STAGED (d023) | 1-3 | interim: reframe as `mcq` with Circuit-Builder-rendered options ("which circuit is correct?"); true draw needs the Circuit Builder as an input surface (Housing) |
| `graph_sketch` | STAGED (d023) | 1-3 | interim: reframe as `mcq` with widget options (correct vs the plateau/droop distractor variants Widgets already built); true sketch needs a shape-template scorer |

The two staged draw/sketch types have immediate MCQ interim forms, so authoring is not blocked: circuit questions use Circuit Builder renders as options, graph questions use the I-V widget variants as options.

## Families seen in the 6.2 bank (with grader qtype, mark shape, misconceptions)
- **Single-formula calculation** (charge_current, resistance_ohm, power_electrical, energy_appliances): `calc_workings`. Q=It, V=IR, P=VI, P=I²R, E=Pt, E=QV. Mark shape: equation, substitution, evaluation, unit; the prefix-conversion mark (mA→A) is where Foundation loses ground; the "give the unit" mark sits last. Misconceptions: `confused_v_and_i`, `wrong_formula_rearrangement`, `forgot_to_square_in_power`, `prefix_not_converted`, `power_of_ten_evaluation_error`.
- **Circuit rules, qualitative** (series_parallel): `mcq` / `short`. Current-same-in-series, pd-same-across-parallel, voltage-sum, current-sum, "parallel R is less" (qualitative; NO reciprocal calc). Misconceptions: `current_consumed_at_components`, `voltage_same_in_series` (~75% miss), `equal_share_assumption`, `swapped_series_parallel` (qualitative trim).
- **Series numeric** (series_parallel): `calc_workings` for R=R₁+R₂, voltage/current sums, choose-the-right-V/I.
- **I-V characteristics** (iv_characteristics): `mcq` now (which graph / read-off), `graph_sketch` staged. Ohmic line both quadrants; filament curve flattens but keeps rising; diode threshold. Misconceptions: `diode_reverse_current_nonzero`, `iv_line_one_quadrant_only`, `drew_lamp_curve_for_ohmic`, `misread_iv_graph_for_ohmic`, `ohmic_confused_with_metal`.
- **Component symbols & circuit construction** (circuit_basics): `mcq` (identify symbol / which circuit measures X) now; `circuit_draw` staged. 6.2.1.1.a is the highest-frequency code (×46). Misconceptions: `ammeter_in_parallel`, `voltmeter_in_series`, symbol-swap slugs.
- **Required practical** (iv_characteristics): RP "resistance" (RP15) and wire-length R∝L (RP16). Method/analysis via `level_of_response_6` (staged claim-points) and `mcq`; the apparatus is the Circuit Builder, not a widget. Misconception: `proportionality_stated_as_increases`, plus WS `repeatability_reproducibility_confused`, `freehand_line_not_ruled`.
- **Mains** (mains_ac_dc, mains_safety): `mcq` / `short`. 230 V / 50 Hz / a.c. recall; AC-vs-DC trace (widget); three-wire colour code; earthing/fuse safety. Misconceptions: `mains_values_confused`, `live_neutral_earth_confused`.
- **National Grid** (national_grid): `mcq` (transformer role tick-box) and `level_of_response_6` (HT: high V → low I → low I²R loss). Misconceptions: `transformer_role_confused`, `grid_loss_reason_missed`.
- **Level-of-response 6-markers**: heavy in Trilogy; RP method descriptions and the National Grid transmission explanation. `level_of_response_6` (staged claim-points).

## Cross-references
- Atom ids and misconception slugs: `review/trilogy_electricity_vocabulary_proposal.md` (ratified) and SCHEMA.md.
- Calculation tagging vocabulary: the Codex six-layer (formula/substitution/rearrangement/evaluation/prefix/sig-fig/standard-form/unit), per SCHEMA.md calc_workings.
