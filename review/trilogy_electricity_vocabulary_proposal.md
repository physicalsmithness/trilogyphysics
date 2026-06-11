# Trilogy Electricity 6.2 — vocabulary proposal (Stage 1)

Status: **RATIFIED by Smith, 2026-06-08.** Architecture to bake the vocabulary into the locked schema. Rulings recorded below.

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.

## Ratification (Smith, 2026-06-08)

The six open questions in section 6 were put to Smith. His rulings:

1. **Subtag granularity** — the fold-vs-split choice is cosmetic (dashboard grouping only); the question *variety* is what matters and the mixes must be available. Decision: one `series_parallel` subtag for the dashboard, author across all four `circuit_shape` values including both mixed topologies (`parallel_in_series`, `series_in_parallel`).
2. **`wrong_power_form_for_topology`** — retire it. There is no P=V²/R in Trilogy. Removed from the slug set (see section 3).
3. **WS slug home** — left open by Smith ("good question"). Authoring default until Overview rules: a single shared working-scientifically taxonomy owned at the GCSE Physics Overview level, not duplicated per topic. `repeatability_reproducibility_confused` and `freehand_line_not_ruled` live there, referenced by 6.2 items.
4. **Cross-tier atoms** — not separately addressed; authoring default stands: one atom shared across tiers, tier carried on the item (d005).
5. **NEW_QTYPEs** — greenlit all three (`level_of_response_6`, `circuit_draw`, `graph_sketch`) via "that's got all the question types done now, I like it". Architecture/Housing to confirm grader staging.
6. **Mains scope** — not separately addressed; authoring default stands: mains is **in-scope**, not optional (real bank weight at 6.2.3.1 / 6.2.3.2).

## State absorbed before drafting (standing principle 3)

Read: `inter_chat/Architecture_Authoring_kickoff.md`, `AUTHORING_BRIEF.md`, `QUESTION_TYPES.md`, `DECISIONS.md` (d004 to d021), `PROJECT.md`, the standing principles, `review/SYLLABUS_6_2.md` (the 92-code v3 spine), the Codex `Trilogy Categorisation/README.md`, `formula_catalogue.md` and `vocabularies.md`, and Electric Circuits Mastery `data/misconceptions.yaml` plus the data-file structure. Mined the live bank (`aqa_extraction_plus_calc.db`: 467 parts tagged under 6.2) for examination shapes, the syllabus-code distribution, and examiner-report pain points.

Three things from that reading shaped this proposal up front, and I want them visible because they cut content the seed sub-topic list implies is in scope:

1. **Parallel-resistance reciprocal calculation is out of Trilogy.** Spec 6.2.2: "Students are not required to calculate the total resistance of two resistors joined in parallel." The Codex catalogue deliberately omits `RELATION.PARALLEL_RESISTANCE_RECIPROCAL`. So the kickoff's "parallel; mixed" sub-topics are *qualitative and current-/voltage-sum* topics for Trilogy, not reciprocal-arithmetic ones. A large slice of ECM's `resistor_combinations` content (the reciprocal drilling that ECM is built around) does **not** port. This is the single biggest "do not assume IB validity carries over" filter.
2. **Resistivity (R = ρL/A), potential dividers, and capacitance are not in Trilogy** (Triple/A-level). Every ECM `resistivity` and `potential_divider` slug is out of scope here.
3. **P = V²/R is not a Trilogy equation.** Trilogy power equations are P = VI and P = I²R only (catalogue confirms; no `POWER_V2R`). Any ported slug that contrasts V²/R reasoning is trimmed to the I²R half.

Pushback welcomed on any of these if the spine intends triple-content coverage I have mis-scoped.

---

## 1. Sub-topic (subtag) groups for 6.2

Mapped to the v3 spine in `SYLLABUS_6_2.md` and confirmed against what the bank actually examines under each code. Proposed `subtag` slugs (snake_case, the value an item carries alongside its finest v3 code per d021):

| subtag | v3 codes (primary) | What it covers | Bank weight |
|---|---|---|---|
| `circuit_basics` | 6.2.1.1 | Standard circuit symbols; drawing/reading circuit diagrams; what a circuit is; ammeter/voltmeter placement | heavy (6.2.1.1.a ×46) |
| `charge_current` | 6.2.1.2 | Charge flow Q = It; current as rate of flow of charge | medium (6.2.1.2.b ×27) |
| `resistance_ohm` | 6.2.1.3 | Resistance; V = IR; R = V/I as definition | heavy (6.2.1.3.c ×56) |
| `iv_characteristics` | 6.2.1.4 | Ohmic conductor, filament lamp, diode, thermistor, LDR I-V behaviour; RP "resistance" (RP15) and wire-length R∝L (RP16) | heavy (6.2.1.4.e ×42, .b ×21) |
| `series_parallel` | 6.2.2 | Series vs parallel rules; cells/batteries; current-same-in-series, pd-same-across-parallel, voltage-sum, current-sum; qualitative "parallel R is less" | heavy (6.2.2.b ×38) |
| `mains_ac_dc` | 6.2.3.1 | UK mains 230 V / 50 Hz; direct vs alternating pd | medium (6.2.3.1.a ×31) |
| `mains_safety` | 6.2.3.2 | Three-core cable; live/neutral/earth; plug wiring; insulation; fuse/earthing safety | medium (6.2.3.2.a ×29) |
| `power_electrical` | 6.2.4.1, 6.2.6.1 | P = VI, P = I²R; power rating of appliances | heavy (6.2.6.1.a ×54) |
| `energy_appliances` | 6.2.4.2, 6.2.6.2 | E = Pt, E = QV; energy transferred by appliances; cost-of-use arithmetic | heavy (6.2.6.2.e ×53) |
| `national_grid` | 6.2.6.3 | Transformers (step-up/step-down); transmit at high V to cut current and I²R loss (HT) | medium (6.2.6.3.b ×23) |

Notes:
- The seed list named "series; parallel; mixed" separately. For Trilogy I propose folding them into one `series_parallel` subtag, because the *atoms* (current-same, voltage-same, the two sums) are shared and "mixed" only adds the `circuit_shape = parallel_in_series` / `series_in_parallel` Codex tag, which already carries the distinction. Splitting them as subtags would fragment the dashboard without adding a tracked skill. Flagging as a decision for you.
- **`static_electricity` is deliberately absent.** AQA static electricity is Triple-only (not Trilogy). The 6.2.6.x codes in the spine are power / energy / National Grid (verified against bank question text), **not** static. If the spine intends static for a later Triple build, it should sit under its own out-of-scope marker.
- `national_grid` confirmed as a sub-topic of 6.2, not its own chat (d020).

---

## 2. Atom groups (the units the dashboard tracks)

Atoms are the "can the learner do this specific thing" units that the per-atom coverage display (d004) reports on. Grouped by subtag. Each is a candidate `atom_id`. I have kept them at the grain where a single wrong answer is diagnostic — finer than a sub-topic, coarser than an individual item.

**circuit_basics**
- `recall_symbol` — identify/draw a standard symbol (cell, battery, switch, lamp, resistor, variable resistor, fuse, ammeter, voltmeter, diode, LED, thermistor, LDR)
- `draw_measuring_circuit` — construct a circuit to measure current and/or pd in a named component (ammeter in series, voltmeter in parallel)
- `meter_placement` — choose where an ammeter vs voltmeter goes

**charge_current**
- `charge_flow_calc` — Q = It (single formula)
- `current_as_rate` — current is rate of flow of charge; qualitative

**resistance_ohm**
- `ohm_law_calc` — V = IR with rearrangement to any subject
- `resistance_definition` — R = V/I as a definition (distinct from Ohm's law as a claim of constancy)

**iv_characteristics**
- `ohmic_recognise` — linear-through-origin at constant T = ohmic
- `ohmic_sketch` — draw the ohmic I-V line (both quadrants)
- `filament_behaviour` — resistance rises as filament heats; curve flattens
- `diode_behaviour` — conducts one way; reverse current is zero
- `thermistor_behaviour` — R falls as temperature rises (HT-leaning)
- `ldr_behaviour` — R falls as light intensity rises
- `rp_resistance_method` — RP15: method/analysis for measuring resistance
- `rp_wire_length` — RP16: R ∝ L for a wire; line of best fit; describe proportionality

**series_parallel**
- `series_current_same` — current identical through a series chain
- `series_voltage_sum` — supply pd = sum of component pds in series
- `parallel_voltage_same` — pd identical across parallel branches
- `parallel_current_sum` — supply current = sum of branch currents
- `series_resistance_sum` — R_total = R₁ + R₂ in series (numeric)
- `parallel_resistance_qualitative` — combined parallel R is less than the smallest branch (qualitative only; **no reciprocal calc**)
- `cells_in_series_voltage` — N cells of 1.5 V give 1.5N V
- `choose_right_V` / `choose_right_I` — pick the component-vs-branch-vs-supply value (the Codex `CIRCUIT_CHOOSE_V/I` rules)

**mains_ac_dc**
- `mains_values_recall` — 230 V, 50 Hz, a.c.
- `ac_vs_dc` — distinguish alternating from direct pd; read/identify a trace

**mains_safety**
- `wire_identification` — live/neutral/earth colours and roles
- `earthing_fuse_safety` — how earth wire + fuse make an appliance safe
- `cable_insulation` — why insulation/double-insulation; three-core cable

**power_electrical**
- `power_vi_calc` — P = VI
- `power_i2r_calc` — P = I²R
- `power_rating_interpret` — power rating as max energy per second

**energy_appliances**
- `energy_pt_calc` — E = Pt
- `energy_qv_calc` — E = QV
- `appliance_energy_reasoning` — link power, time, energy transferred; cost-of-use

**national_grid**
- `transformer_function` — step-up vs step-down role
- `grid_high_voltage_reason` — high V means lower I means lower I²R heating loss (HT)

I propose atoms be **shared across tiers** with the tier carried on the item (d005), not duplicated per tier. The same atom (`ohm_law_calc`) fires for Foundation Q06 and Higher Q01 of a cross-tier-shared question.

---

## 3. Misconception slugs

Format follows the ECM `misconceptions.yaml` schema (slug / topic / label / description) so the blended engine can read them directly (d016). `topic:` uses the subtags above. Marked **[port]** (carried from ECM, valid for Trilogy), **[port-trim]** (ported but narrowed for Trilogy scope), or **NEW_FLAG** (surfaced from the AQA bank, not in ECM — proposed explicitly per principle 1 and the brief's boundaries).

### Ported from ECM, valid as-is

| slug | subtag | trap |
|---|---|---|
| `confused_v_and_i` | resistance_ohm | substituted voltage for current or vice versa [port] |
| `treated_V_as_I` / `treated_I_as_V` | power_electrical | wrong quantity into the formula slot [port] |
| `wrong_formula_rearrangement` | resistance_ohm | rearranged V=IR (or P=VI) the wrong way [port] |
| `swapped_factor_in_squared` | power_electrical | in P=I²R squared R instead of I [port] |
| `forgot_to_square_in_power` | power_electrical | omitted the squaring in P=I²R [port] |
| `picked_given_value` | resistance_ohm | answered with a value lifted straight from the stem [port] |
| `ammeter_in_parallel` | circuit_basics | ammeter placed in parallel (short-circuit) [port] |
| `voltmeter_in_series` | circuit_basics | voltmeter placed in series (blocks current) [port] |
| `meter_kinds_interchangeable` | circuit_basics | ammeter/voltmeter treated as the same [port] |
| `swapped_meter_letter` | circuit_basics | read A vs V inside the meter circle wrongly [port] |
| `current_consumed_at_components` | series_parallel | thinks current is used up in a resistor/bulb [port] |
| `current_splits_when_not_branching` | series_parallel | current divided where there is no junction [port] |
| `voltage_same_in_series` | series_parallel | assumed equal pd across series components [port] — **strongly evidenced**: examiner reports show ~75% miss that supply pd = total component pd in series |
| `equal_share_assumption` | series_parallel | assumed current/voltage splits equally between unequal branches [port] |
| `bulb_brightness_from_resistance_only` | series_parallel | predicted brightness from R alone, ignoring current [port] |
| `switch_state_inverted` | series_parallel | read a closed switch as open, or vice versa [port] |
| `qualitative_inference_doubted` | series_parallel | picked "cannot tell without values" when topology + formula decide it [port] |
| `confused_definition_with_law` | iv_characteristics | treated R=V/I as "Ohm's law" rather than the definition of R [port] |
| `misread_iv_graph_for_ohmic` | iv_characteristics | read a non-linear curve as ohmic, or linear as non-ohmic [port] — **evidenced** |
| `ohmic_confused_with_metal` | iv_characteristics | "it's a metal so it's ohmic", ignoring filament heating [port] — **evidenced** |
| `ohmic_confused_with_variable_resistor` | iv_characteristics | read LDR/thermistor as ohmic [port] |
| `ohms_law_misread_temperature_role` | iv_characteristics | denied the constant-temperature precondition [port] — **evidenced** |
| `cell_battery_confusion` | circuit_basics | single cell vs multi-cell battery symbol [port] |
| `power_supply_vs_cell` | circuit_basics | DC power-supply box read as a cell [port] |
| `heater_resistor_swap` | circuit_basics | heater vs fixed resistor symbol [port] |
| `fuse_resistor_swap` | circuit_basics | fuse vs fixed resistor symbol [port] |
| `ldr_vs_led` | circuit_basics | LDR vs LED symbol (arrow direction) [port] |
| `diode_vs_led` | circuit_basics | diode vs LED symbol (light-emission arrows) [port] |
| `units_off_by_factor` | (cross) | right number, wrong prefix (mA vs A) [port] — **evidenced** |
| `rounding_mistake` | (cross) | engine-derived near-miss under a rounding regime [port, d032] |

### Ported but trimmed for Trilogy scope

| slug | subtag | change |
|---|---|---|
| `swapped_series_parallel` | series_parallel | **[port-trim]** keep as a *qualitative-rule* confusion (applied series reasoning where parallel holds, or vice versa). Drop the reciprocal-formula reading — that calc is out of Trilogy. |
| `topology_indifferent_assumption` | series_parallel | **[port-trim]** keep as "assumed topology doesn't change current/voltage distribution"; not about reciprocal combination. |
| `wrong_power_form_for_topology` | power_electrical | **RETIRED for Trilogy (Smith, 2026-06-08).** No P=V²/R in Trilogy. Topology-power reasoning is covered by `swapped_factor_in_squared` plus the series/parallel rules. |

### Out of scope for Trilogy (ECM slugs NOT ported, with reason)

`forgot_final_reciprocal`, `halved_for_three`, `divided_by_two_instead_of_n`, `incomplete_reduction`, `treated_bypass_as_active`, `disguised_parallel_missed` — all parallel-resistance **reciprocal-calculation** traps; that calculation is not in Trilogy (spec 6.2.2). All `resistivity` slugs (`unit_prefix_not_converted` aside, see below), `confused_resistance_resistivity`, `area_linear_not_squared`, `forgot_area_proportionality`, `length_area_swapped`, `volume_preservation_missed`, `wrong_resistivity_units` — resistivity is Triple-only. `cell_capacitor_confusion` — capacitance not in Trilogy. `wrong_constant_for_period` — period-vs-time is marginal for Q=It; hold unless the bank shows it.

(`unit_prefix_not_converted` from ECM resistivity is generalised into the cross-topic `prefix_not_converted` below rather than ported under resistivity.)

### NEW_FLAG — surfaced from the AQA Trilogy bank

Proposed explicitly (principle 1; brief boundary "do not silently fold a new misconception into an existing bucket"). Each is backed by examiner-report evidence in the bank.

| slug | subtag | trap | evidence |
|---|---|---|---|
| `diode_reverse_current_nonzero` | iv_characteristics | on a reversed diode, said current "reverses" or "decreases" rather than being zero | "<1 in 10 scored both marks… common to suggest the current would reverse, or just decrease. Very few said zero"; another year ~40% said current stays the same |
| `iv_line_one_quadrant_only` | iv_characteristics | drew the ohmic I-V line only in the 1st quadrant, omitting the 3rd | "A number of students only drew the line in the 1st quadrant, so did not gain the mark" |
| `drew_lamp_curve_for_ohmic` | iv_characteristics | drew a filament-lamp curve when asked for the ohmic (straight-line) characteristic | "Some students drew the IV curve for a lamp" |
| `proportionality_stated_as_increases` | iv_characteristics | described R∝L (or I∝V) as "resistance increases as length increases" instead of naming direct proportionality / straight line through origin | "most common answer 'resistance increases as length increases' — gained no marks" |
| `power_of_ten_evaluation_error` | (cross) | correct method, place-value slip in the division/multiplication (e.g. 3.0/2000 → 1.5) | "a fifth scored one mark due to incorrect evaluation… typically a power of ten error, 3.0/2000 = 1.5 V common" |
| `mains_values_confused` | mains_ac_dc | gave the wrong UK mains pd or frequency, or swapped the two (e.g. 50 V / 230 Hz) | recall items at 6.2.3.1.a; common low-scoring recall |
| `live_neutral_earth_confused` | mains_safety | mismatched wire to colour/role (live/neutral/earth) | 6.2.3.2 plug-wiring items |
| `transformer_role_confused` | national_grid | step-up vs step-down function inverted (or "decreases power" tick-box) | 6.2.6.3.b tick-box: distractors "to decrease the current / pd / power" |
| `grid_loss_reason_missed` | national_grid | could not link high transmission voltage → lower current → lower I²R heating loss | 6.2.6.3 HT explanation items |

### Cross-topic / working-scientifically slugs (propose, owner = Architecture to place)

| slug | note |
|---|---|
| `prefix_not_converted` | generalised SI-prefix failure (mA→A, kΩ→Ω). Cross-topic; subsumes ECM `units_off_by_factor` and `unit_prefix_not_converted`. Maps to Codex `unit_handling_type = prefix_strip`. |
| `repeatability_reproducibility_confused` | WS slug; appears on electricity RP items ("nearly 50% chose repeatability"). Belongs to a shared WS taxonomy, not 6.2 specifically — flagging for Architecture to decide where WS slugs live across topics. |
| `freehand_line_not_ruled` | graph-technique/WS; best-fit line drawn freehand. Same shared-WS question. |

---

## 4. Calculation vocabulary mapping (Codex six-layer alignment)

Per d003/d016, calculation items carry the Codex tagging so the grader classifies an attempt (principle 1). The 6.2 formula codes (from `formula_catalogue.md`), with the recall-vs-insert flag the brief demands (principle 6):

| Codex code | Equation | v3 code | On 2023 insert? | Pre-Covid insert? | Recall status |
|---|---|---|---|---|---|
| `FORMULA.CHARGE_IT` | Q = It | 6.2.1.2 | yes | no | recall once insert reverts |
| `FORMULA.OHM` | V = IR | 6.2.1.3 | yes | no | recall once insert reverts |
| `FORMULA.POWER_VI` | P = VI | 6.2.4.1 | yes | no | recall once insert reverts |
| `FORMULA.POWER_I2R` | P = I²R | 6.2.4.1 | yes | no | recall once insert reverts |
| `FORMULA.ENERGY_PT` | E = Pt | 6.2.4.2 | yes | no | recall once insert reverts |
| `FORMULA.ENERGY_QV` | E = QV | 6.2.4.2 | yes | no | recall once insert reverts |
| `RELATION.SERIES_RESISTANCE_SUM` | R = R₁+R₂ | 6.2.2 | n/a (not given) | n/a | always recall |
| `RELATION.SERIES_VOLTAGE_SUM` | V = V₁+V₂ | 6.2.2 | n/a | n/a | always recall |
| `RELATION.PARALLEL_CURRENT_SUM` | I = I₁+I₂ | 6.2.2 | n/a | n/a | always recall |
| `RULE.SERIES_CURRENT_CONSTANT` | qualitative | 6.2.2 | — | — | — |
| `RULE.PARALLEL_VOLTAGE_CONSTANT` | qualitative | 6.2.2 | — | — | — |
| `RULE.PARALLEL_RESISTANCE_LESS_THAN_INDIVIDUAL` | qualitative | 6.2.2 | — | — | — |
| `RULE.CIRCUIT_CHOOSE_V` / `CIRCUIT_CHOOSE_I` | selection | 6.2.2 | — | — | — |
| `INTERPRET.GRADIENT_QT_IS_CURRENT` | graph | 6.2.1.2 | — | — | rare, end-of-paper HT |

Note: **none of the six electricity formulae are on the pre-Covid insert** (catalogue line 41: all six are `on_2023_insert = yes`, `on_pre_covid_insert = no`). So every 6.2 calculation becomes recall-dependent once exams revert to the minimal insert. V = IR is *not* among the pre-Covid seven, despite being the most-examined 6.2 calculation. This is a real difficulty cliff to flag for sequencing.

**Deliberately excluded** (do not author calc items for these in Trilogy): parallel-resistance reciprocal (`RELATION.PARALLEL_RESISTANCE_RECIPROCAL` — omitted by Codex, spec-excluded), resistivity `R = ρL/A`, `P = V²/R`.

`calc_workings` items (the 4-line marks-the-method type, d016) should expose, per mark, the Codex Layer-5 categories that 6.2 actually uses: `equation_quoted`, `substitution`, `rearrangement`, `evaluation`, `prefix_conv`, `sig_figs`, `standard_form`, `unit`. The bank shows the "give the unit" mark sits last and the prefix-conversion mark is where Foundation loses ground (mA→A on V=IR). Anti-ECF gating is rare in 6.2 specifically (it clusters in end-of-Higher kinematics/forces), so I do not expect to author much `gate_kind` content here beyond the occasional `from_previous_part` ECF chain.

---

## 5. Question-type constraints and NEW_QTYPE proposals

Honouring the kickoff boundary: author only what the blended engine grades now — **MCQ (single), MCQ-multi/tick-box, short-answer, and `calc_workings`**. Coverage that 6.2 needs but those four cannot yet carry, proposed as NEW_QTYPE for you to coordinate (brief: "Coordinate type questions through me"):

- **NEW_QTYPE `level_of_response_6`** — the 6-mark level-of-response explanation (e.g. describe RP15/RP16 method; explain National Grid transmission). Heavy in Trilogy (brief §"Written explanation"). Until a grader exists, the brief suggests constraining to selectable claim-points rather than free text. I can author the claim-point bank now if you want it staged behind the qtype.
- **NEW_QTYPE `circuit_draw`** — "draw a circuit to measure current in a lamp" / "draw the symbol for a fuse" (6.2.1.1.a, ×46 in the bank — high frequency). Needs the Circuit Builder as an *input* surface, not just a renderer. Flagging that this depends on Housing's Circuit Builder integration and the Widgets chat's symbol set.
- **NEW_QTYPE `graph_sketch`** — "sketch the I-V characteristic of an ohmic conductor / filament lamp". The `iv_line_one_quadrant_only` and `drew_lamp_curve_for_ohmic` misconceptions are only gradable if the engine can score a sketched curve against a shape template. De