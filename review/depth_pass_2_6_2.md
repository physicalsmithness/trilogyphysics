# Depth pass 2: grader-gap conversions + diagram-option MCQs (6.2)

From: 6.2 Authoring chat. To: Architecture / Housing. Date: 2026-06-08.
Status: DONE. 5 items added on the back of today's d056 grader fixes. `electricity_6_2.js` now 83 items.

## Trigger: d056 (Housing, 2026-06-17) closed 2 of 3 calc-grader gaps
`^` power operator and multi-letter/case-distinct symbols now parse. I verified both against the live `calc_workings.js` before authoring (Rt, R1+R2, and I^2*R all grade `full`). This unblocked content I had explicitly held:

| id | what | was blocked by | now |
|---|---|---|---|
| `ch_potdiv_series_04` | potential-divider series chain: Rt=R1+R2 -> I=V/Rt -> V2=I*R2 (6mk, 3 stages) | multi-symbol gap (Rt/R1/R2) | real chained calc_workings, every stage `full` |
| `sp_series_R_sum_calc` | series resistance sum Rt=R1+R2 (2mk) | multi-symbol gap | real calc_workings (was MCQ `sp_series_R_sum_15`; both kept, MCQ = quick recall) |
| `pw_i2r_calc` | P=I²R, 3.0 A / 5.0 Ω -> 45 W (3mk) | `^` operator gap | real calc_workings (the non-prefix P=I²R; the prefix one `pw_i2r_prefix_mcq_09` stays MCQ-interim pending fix 3) |

## Diagram-option MCQs (d036, now that renderMcq draws option diagrams)
The capability I requested in `inter_chat/Authoring_Architecture_graph_select_capability.md` (granted d036) is live, so the proxy "describe the graph" framings become true "pick the correct graph" discrimination items, using the Widgets `iv_characteristic` variants as the wrong curves:

| id | item | options (all rendered I-V curves) |
|---|---|---|
| `iv_pick_filament_graph` | which graph is a filament lamp? | filament (correct) / ohmic / filament-plateau (filament_resistance_falls) / diode |
| `iv_pick_ohmic_graph` | which graph is an ohmic resistor? | ohmic (correct) / filament (drew_lamp_curve_for_ohmic) / diode / negative-line |

These are the most direct diagnostics for `drew_lamp_curve_for_ohmic`, `filament_resistance_falls`, and `misread_iv_graph_for_ohmic` (the discrimination the text items could only approximate).

## Still outstanding
- **Grader fix 3 (prefix/unit conversion)** still open: the prefix items (`ohm_vir_prefix_02`, `pw_i2r_prefix_mcq_09`) stay as authored / MCQ-interim until it lands.
- **`component_symbol` render kind** not built yet, so pick-the-symbol stays text MCQ (the I-V pick-the-graph items work because `iv_characteristic` exists).
- **d055 regression (Architecture, 2026-06-17):** the latest engine.js broke `level_of_response_6` and `mcq_multi` in the integration suite. My bank has 5 LOR + 1 mcq_multi, so those 6 items are affected in the live engine until Housing restores green. The ITEMS are correct (conformance clean, answer keys intact); the breakage is engine-side. Flagging that the live Electricity slice is partly affected by it; no authoring action needed from me.

## State
`electricity_6_2.js`: 83 items (55 mcq incl 2 diagram-option, 1 mcq_multi, 18 calc_workings [14 single + 4 chained], 5 level_of_response_6, 2 circuit_draw, 2 graph_sketch). Conformance clean; every calc item/stage grades `full`. Backups unchanged at `outputs/*.premigration.bak.js`.

## Addendum: calc.codex enrichment (2026-06-17)
With the `calc.codex` slot (d040) and its event passthrough wired (d056), all 18 calc_workings items now carry their Codex six-layer tags: `{ formula, sources:[{sym,category}], unit_actions, mark_categories, ecf }`. This closes the "calc tags have no home" finding from batch 1 and gives the d004 per-atom coverage analytics the static tagging it needs (alongside the grader's live ERROR_TYPES). Examples: `ohm_vir_prefix_02` carries `unit_actions:["prefix_strip"]` + `ecf:"ecf_allowed"`; the chains carry their per-leg formula array + `ecf:"from_previous_part"`. Verified: all 24 calc stages still grade `full`; conformance clean.
