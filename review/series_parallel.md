# Batch review: series_parallel (calibration sample, batch 3)

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.
Status: CALIBRATION SAMPLE for review, not yet wired into `app/topics/electricity_6_2.js`.

Sixteen items covering the series/parallel qualitative-rule heartland: `series_current_same`, `series_voltage_sum`, `parallel_voltage_same`, `parallel_current_sum`, `series_resistance_sum`, `parallel_resistance_qualitative`, `cells_in_series_voltage`, `choose_right_V`, plus one NEW atom `identify_topology` (see section C).

**This batch is the ECM port in action** (the `ECM_port_assessment.md` plan). Twelve items are retagged from ECM `circuit_rules` pre_ib items (provenance noted per item), not rewritten: I converted ECM's `stimulus.circuit` to the Trilogy `diagram.params.dsl` (same Circuit Builder DSL, d016), kept the distractor text and misconception slugs, mapped ECM's `equal_current_in_parallel_assumed` onto our ratified `equal_share_assumption`, and applied the two corrected slugs (`treated_bypass_as_active`, `disguised_parallel_missed` are PORT, per the ECM assessment). Four items are spec-first additions (`cells_in_series_voltage` from the real AQA 4-cell item, `series_resistance_sum` numeric, `parallel_resistance_qualitative`, and the voltmeter-placement meter item).

DSL note: the `dsl` strings are carried verbatim from ECM's Builder (tokens like `2cb` two-cell battery, `sc` switch-closed, `s` switch-open, `r`/`r10` resistor, `bb` bulb, `vr` variable resistor, `a` ammeter, `(x;y)` parallel branches, `left` orientation). Housing should render-check them against the Trilogy `diagrams.js` Circuit Builder embed; they come from the same module so I expect them to render, but I have not run the renderer.

---

## A. The items (engine schema, ready to paste)

```js
// series_parallel — calibration batch v1 (16 items). Provenance: ECM cr_* noted in _src.
[
  // ---- series rules ----
  {
    id: "sp_series_current_same_01", qtype: "mcq_single", tier: "both",
    atom: "series_current_same", syllabus: "6.2.2.c", _src: "ECM cr_002",
    prompt: "Two resistors of unequal resistance are connected in series with a battery and a closed switch. How does the current through the smaller resistor compare with the current through the larger resistor?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,r,r" } },
    explanation: "There is one path, so the current is the same through every component in a series loop, whatever the resistor values.",
    distractors: [
      { id: "a", text: "They are equal: the same current flows through every component in a series loop", status: "correct" },
      { id: "b", text: "The smaller resistor carries the larger current, because current prefers the easier path", status: "wrong", misconception: "current_splits_when_not_branching" },
      { id: "c", text: "The larger resistor carries the larger current, because more resistance attracts more current", status: "wrong", misconception: "current_consumed_at_components" },
      { id: "d", text: "The first resistor reduces the current, so the second carries less", status: "wrong", misconception: "current_consumed_at_components" }
    ]
  },
  {
    id: "sp_series_pd_larger_R_02", qtype: "mcq_single", tier: "higher",
    atom: "series_voltage_sum", syllabus: "6.2.2.c", _src: "ECM cr_011",
    prompt: "Two unequal resistors are connected in series with a battery and a closed switch. Without doing any calculation, which resistor has the larger potential difference across it?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,r,r" } },
    explanation: "In series the current is the same, so by V = IR the larger resistance has the larger pd across it.",
    distractors: [
      { id: "a", text: "The larger resistor", status: "correct" },
      { id: "b", text: "The smaller resistor", status: "wrong", misconception: "confused_v_and_i" },
      { id: "c", text: "Both have the same pd, because they are in series", status: "wrong", misconception: "voltage_same_in_series" },
      { id: "d", text: "It cannot be told without the supply pd or the resistor values", status: "wrong", misconception: "qualitative_inference_doubted" }
    ]
  },
  {
    id: "sp_series_pd_sum_two_03", qtype: "mcq_single", tier: "both",
    atom: "series_voltage_sum", syllabus: "6.2.2.c", _src: "ECM cr_046",
    prompt: "Two resistors are in series with a battery. The supply pd is V_S. The pd across one resistor is 2V_S/3. What is the pd across the other resistor?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,r,r" } },
    explanation: "The component pds in series add up to the supply pd, so the other pd is V_S - 2V_S/3 = V_S/3.",
    distractors: [
      { id: "a", text: "V_S/3", status: "correct" },
      { id: "b", text: "2V_S/3, the same as the first", status: "wrong", misconception: "voltage_same_in_series" },
      { id: "c", text: "V_S, the full supply", status: "wrong", misconception: "voltage_same_in_series" },
      { id: "d", text: "It cannot be told without the resistor values", status: "wrong", misconception: "qualitative_inference_doubted" }
    ]
  },
  {
    id: "sp_series_pd_sum_three_04", qtype: "mcq_single", tier: "higher",
    atom: "series_voltage_sum", syllabus: "6.2.2.c", _src: "ECM cr_045",
    prompt: "Three resistors R1, R2 and R3 are in series with a battery. The pd across R1 is one third of the supply pd, and the pd across R2 is one half of the supply pd. What is the pd across R3?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,r.1,r.2,r.3" } },
    explanation: "The three pds add to the supply: 1 - 1/3 - 1/2 = 1/6 of the supply pd.",
    distractors: [
      { id: "a", text: "One sixth of the supply pd", status: "correct" },
      { id: "b", text: "Five sixths of the supply pd", status: "wrong" },
      { id: "c", text: "Two thirds of the supply pd", status: "wrong" },
      { id: "d", text: "The full supply pd, because the three components share it equally", status: "wrong", misconception: "voltage_same_in_series" }
    ]
  },
  {
    id: "sp_series_unscrew_bulb_05", qtype: "mcq_single", tier: "both",
    atom: "series_current_same", syllabus: "6.2.2.c", _src: "ECM cr_024",
    prompt: "Two identical bulbs are connected in series with a battery and a closed switch. One bulb is unscrewed, leaving an open break where it was. What happens to the other bulb?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,bb,bb" } },
    explanation: "A series loop has one path. Breaking it anywhere stops the current everywhere, so the other bulb also goes out.",
    distractors: [
      { id: "a", text: "It also goes out", status: "correct" },
      { id: "b", text: "It stays at the same brightness", status: "wrong", misconception: "current_consumed_at_components" },
      { id: "c", text: "It becomes brighter, because the loop's total resistance is now lower", status: "wrong", misconception: "bulb_brightness_from_resistance_only" },
      { id: "d", text: "It becomes dimmer but stays lit", status: "wrong", misconception: "current_consumed_at_components" }
    ]
  },
  {
    id: "sp_open_switch_series_06", qtype: "mcq_single", tier: "both",
    atom: "series_current_same", syllabus: "6.2.2.c", _src: "ECM cr_025",
    prompt: "In the circuit shown the switch S is open. The loop also contains a battery and a single bulb L1. What is the state of L1?",
    diagram: { kind: "circuit", params: { dsl: "2cb,s,bb.1" } },
    explanation: "An open switch breaks the single loop, so no current flows and the bulb is off.",
    distractors: [
      { id: "a", text: "L1 is off: no current flows because the loop is broken at the switch", status: "correct" },
      { id: "b", text: "L1 is dimly lit, because some current still flows across the open switch", status: "wrong", misconception: "switch_state_inverted" },
      { id: "c", text: "L1 is at full brightness, because the open switch does not affect the bulb directly", status: "wrong", misconception: "switch_state_inverted" },
      { id: "d", text: "The bulb is damaged because the open switch creates a voltage spike", status: "wrong" }
    ]
  },

  // ---- parallel rules ----
  {
    id: "sp_parallel_pd_same_07", qtype: "mcq_single", tier: "both",
    atom: "parallel_voltage_same", syllabus: "6.2.2.d", _src: "ECM cr_014",
    prompt: "Three components R1, R2 and L1 are connected as parallel branches across a battery, with a closed switch in the main line. What is true about the potential difference across them?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,(r10.1;r10.2;bb.1)" } },
    explanation: "Branches in parallel share the same two nodes, so each has the same pd across it, equal to the supply pd.",
    distractors: [
      { id: "a", text: "All three have the same pd, equal to the supply pd", status: "correct" },
      { id: "b", text: "Each has a different pd, because they have different resistances", status: "wrong", misconception: "equal_share_assumption" },
      { id: "c", text: "The component with the smallest resistance has the largest pd", status: "wrong", misconception: "confused_v_and_i" },
      { id: "d", text: "The bulb has a different pd because it is not a resistor", status: "wrong", misconception: "equal_share_assumption" }
    ]
  },
  {
    id: "sp_parallel_current_sum_08", qtype: "mcq_single", tier: "both",
    atom: "parallel_current_sum", syllabus: "6.2.2.d", _src: "ECM cr_015",
    prompt: "A battery drives two parallel branches. Ammeter A1 is in the main line; A2 and A3 are in the two branches. Which equation is correct?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,a.1,(r10,a.2;r10,a.3)" } },
    explanation: "The current from the battery splits between the branches and recombines, so A1 = A2 + A3.",
    distractors: [
      { id: "a", text: "A1 = A2 + A3", status: "correct" },
      { id: "b", text: "A1 = A2 = A3, because the current is the same through every ammeter", status: "wrong", misconception: "current_consumed_at_components" },
      { id: "c", text: "A2 + A3 is larger than A1, because each branch generates its own current", status: "wrong", misconception: "current_consumed_at_components" },
      { id: "d", text: "A1 = A2 × A3", status: "wrong" }
    ]
  },
  {
    id: "sp_parallel_share_equal_09", qtype: "mcq_single", tier: "both",
    atom: "parallel_current_sum", syllabus: "6.2.2.d", _src: "ECM cr_017",
    prompt: "Three identical resistors are connected as three parallel branches across a battery. How does the cell's total current divide between the branches?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,(r;r;r)" } },
    explanation: "Identical branches carry equal current, so each carries one third of the cell current.",
    distractors: [
      { id: "a", text: "It divides equally; each branch carries one third of the cell current", status: "correct" },
      { id: "b", text: "All the current flows through the first branch; the others carry none", status: "wrong" },
      { id: "c", text: "The current is the same in each branch and equal to the cell current", status: "wrong", misconception: "current_consumed_at_components" },
      { id: "d", text: "It divides equally only when the cell pd is above a threshold", status: "wrong", misconception: "qualitative_inference_doubted" }
    ]
  },
  {
    id: "sp_parallel_add_bulb_10", qtype: "mcq_single", tier: "higher",
    atom: "parallel_voltage_same", syllabus: "6.2.2.d", _src: "ECM cr_018",
    prompt: "A bulb L1 is connected to a battery via a closed switch. An identical bulb L2 is then added in parallel with L1 (same two nodes). What happens to the brightness of L1?",
    diagram: { kind: "circuit", params: { dsl: "left,2cb,sc,(bb.1;bb.2)" } },
    explanation: "Each parallel branch still has the full supply pd across it, so L1 keeps the same current and stays the same brightness.",
    distractors: [
      { id: "a", text: "It stays the same", status: "correct" },
      { id: "b", text: "L1 dims, because the current it used to get now shares with L2", status: "wrong", misconception: "equal_share_assumption" },
      { id: "c", text: "L1 gets brighter, because the total resistance is lower so more current flows", status: "wrong", misconception: "bulb_brightness_from_resistance_only" },
      { id: "d", text: "L1 goes out, because L2 short-circuits it", status: "wrong", misconception: "treated_bypass_as_active" }
    ]
  },

  // ---- topology identification (NEW atom identify_topology) ----
  {
    id: "sp_identify_series_11", qtype: "mcq_single", tier: "both",
    atom: "identify_topology", syllabus: "6.2.2.a", _src: "ECM cr_030",
    prompt: "Three components R1, L1 and VR1 are connected in a single loop with a battery and a closed switch. How are they arranged with respect to one another?",
    diagram: { kind: "circuit", params: { dsl: "left,2cb,sc,r10.1,bb.1,vr.1" } },
    explanation: "A single loop with no branches is a series arrangement: the same current flows through each component.",
    distractors: [
      { id: "a", text: "All three are in series: the same current flows through each", status: "correct" },
      { id: "b", text: "All three are in parallel with one another", status: "wrong", misconception: "disguised_parallel_missed" },
      { id: "c", text: "R1 is in series with L1, but VR1 is in parallel with R1", status: "wrong", misconception: "disguised_parallel_missed" },
      { id: "d", text: "Only L1 and VR1 are in series; R1 sits on its own", status: "wrong" }
    ]
  },
  {
    id: "sp_identify_parallel_12", qtype: "mcq_single", tier: "both",
    atom: "identify_topology", syllabus: "6.2.2.a", _src: "ECM cr_031",
    prompt: "Three components R1, L1 and VR1 are connected as branches between the same pair of nodes, with a battery and a closed switch in the main line. How are they arranged?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,(r10.1;bb.1;vr.1)" } },
    explanation: "Components between the same two nodes are in parallel: each has the same pd across it.",
    distractors: [
      { id: "a", text: "All three are in parallel: each has the same pd across it", status: "correct" },
      { id: "b", text: "All three are in series: the same current flows through each", status: "wrong", misconception: "disguised_parallel_missed" },
      { id: "c", text: "R1 and L1 are in parallel; VR1 is in series with them", status: "wrong", misconception: "disguised_parallel_missed" },
      { id: "d", text: "It is a mixed network whose details depend on the values", status: "wrong", misconception: "topology_indifferent_assumption" }
    ]
  },

  // ---- meter placement (choose_right_V) ----
  {
    id: "sp_voltmeter_placement_13", qtype: "mcq_single", tier: "both",
    atom: "choose_right_V", syllabus: "6.2.1.1.a", _src: "ECM cr_001",
    prompt: "Two identical bulbs L1 and L2 are in series with a battery, switch and ammeter. Where should a voltmeter be connected to measure the potential difference across L1 only?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,bb.1,bb.2,a.1" } },
    explanation: "A voltmeter measures pd across a component, so it goes in parallel with L1, its two leads on the two terminals of L1.",
    distractors: [
      { id: "a", text: "In parallel with bulb L1 only, leads on the two terminals of L1", status: "correct" },
      { id: "b", text: "In series with L1, placed between L1 and L2 in the loop", status: "wrong", misconception: "voltmeter_in_series" },
      { id: "c", text: "In parallel across both bulbs at once", status: "wrong", misconception: "voltage_same_in_series" },
      { id: "d", text: "In place of the ammeter A1, after removing A1", status: "wrong", misconception: "meter_kinds_interchangeable" }
    ]
  },

  // ---- spec-first additions ----
  {
    id: "sp_cells_in_series_14", qtype: "mcq_single", tier: "foundation",
    atom: "cells_in_series_voltage", syllabus: "6.2.2.b",
    prompt: "A student connects identical 1.5 V cells in series to make a 6.0 V battery. How many cells are used?",
    explanation: "Cell pds in series add: 6.0 / 1.5 = 4 cells.",
    distractors: [
      { id: "a", text: "4 cells", status: "correct" },
      { id: "b", text: "3 cells", status: "wrong" },
      { id: "c", text: "2 cells", status: "wrong" },
      { id: "d", text: "6 cells", status: "wrong", misconception: "picked_given_value" }
    ]
  },
  {
    id: "sp_series_R_sum_15", qtype: "mcq_single", tier: "both",
    atom: "series_resistance_sum", syllabus: "6.2.2.c",
    prompt: "A 4 Ω resistor and a 6 Ω resistor are connected in series. What is their combined resistance?",
    diagram: { kind: "circuit", params: { dsl: "2cb,sc,r.1,r.2" } },
    explanation: "Resistances in series add: 4 + 6 = 10 Ω.",
    distractors: [
      { id: "a", text: "10 Ω", status: "correct" },
      { id: "b", text: "2.4 Ω", status: "wrong", misconception: "swapped_series_parallel" },
      { id: "c", text: "24 Ω", status: "wrong", misconception: "wrong_formula_rearrangement" },
      { id: "d", text: "5 Ω", status: "wrong" }
    ]
  },
  {
    id: "sp_parallel_R_qualitative_16", qtype: "mcq_single", tier: "higher",
    atom: "parallel_resistance_qualitative", syllabus: "6.2.2.d",
    prompt: "A 4 Ω resistor and a 6 Ω resistor are connected in parallel. Without calculating, what can you say about their combined resistance?",
    explanation: "Adding a parallel path gives the current more routes, so the combined resistance is less than either resistor on its own, i.e. less than 4 Ω.",
    distractors: [
      { id: "a", text: "It is less than 4 Ω (less than the smaller resistor)", status: "correct" },
      { id: "b", text: "It is between 4 Ω and 6 Ω", status: "wrong", misconception: "equal_share_assumption" },
      { id: "c", text: "It is 10 Ω (the two added together)", status: "wrong", misconception: "swapped_series_parallel" },
      { id: "d", text: "It is exactly 5 Ω (their average)", status: "wrong", misconception: "swapped_series_parallel" }
    ]
  }
]
```

---

## B. Atom and flag coverage

| atom | items | flags exercised |
|---|---|---|
| series_current_same | 01, 05, 06 | current_splits_when_not_branching, current_consumed_at_components, bulb_brightness_from_resistance_only, switch_state_inverted |
| series_voltage_sum | 02, 03, 04 | voltage_same_in_series, confused_v_and_i, qualitative_inference_doubted |
| parallel_voltage_same | 07, 10 | equal_share_assumption, confused_v_and_i, bulb_brightness_from_resistance_only, treated_bypass_as_active |
| parallel_current_sum | 08, 09 | current_consumed_at_components, qualitative_inference_doubted |
| identify_topology (NEW) | 11, 12 | disguised_parallel_missed, topology_indifferent_assumption |
| choose_right_V | 13 | voltmeter_in_series, voltage_same_in_series, meter_kinds_interchangeable |
| cells_in_series_voltage | 14 | picked_given_value |
| series_resistance_sum | 15 | swapped_series_parallel, wrong_formula_rearrangement |
| parallel_resistance_qualitative | 16 | swapped_series_parallel, equal_share_assumption |

All slugs are in the ratified set or are the two corrected ports (`treated_bypass_as_active`, `disguised_parallel_missed`). `equal_current_in_parallel_assumed` from ECM is rendered as `equal_share_assumption` throughout.

## C. New proposal from this batch

**NEW atom `identify_topology`** (series_parallel) — read off whether components are in series or in parallel from the diagram, before any rule is applied. It is the home for `disguised_parallel_missed` and is a distinct, drillable skill (AQA sets "how are X and Y arranged?" and disguised-topology diagrams). Items 11, 12 exercise it; a disguised-parallel item (ECM cr_003, four resistors as two series pairs in parallel) is the obvious Higher extension. Adding it makes the series_parallel atom set 9, not 8.

## D. Findings

1. **Per-distractor feedback is missed here.** The ECM source items carry excellent per-distractor `feedback` strings (plain, names the error, corrects it). Our schema has only one `explanation` per item, so I have dropped that richness on the floor. This is the strongest argument yet for the optional per-distractor `feedback` field I floated in the ECM assessment. The content already exists in ECM; we are choosing whether to keep it.
2. **DSL render-check needed** (section header): the `dsl` strings are ECM-verbatim and unrendered by me.
3. **`series_resistance_sum` as MCQ not calc_workings:** I made it MCQ rather than `calc_workings` because R = R1 + R2 (two symbolic addends) may not be in the calc grader's parse/formula set, and the brief says do not author a type the grader will mishandle. If Housing confirms the grader handles a simple two-term sum, this becomes a clean `calc_workings` item. Flagging the choice.

## E. Calibration notes

- The ECM port was fast and high-quality: twelve solid items in the time it would have taken to write four from scratch, and the distractors are battle-tested (they carry ECM's own misconception tagging). This vindicates Smith's "go and look at ECM" steer; `circuit_rules` alone could supply most of a Foundation series/parallel drill once retagged.
- `identify_topology` genuinely was missing from the proposal; the ECM topology items had nowhere to attach until I added it. Good example of authoring surfacing an atom from the material (principle 5).
- Running total across batches 1 to 3: 38 items (resistance_ohm 10, iv_characteristics 12, series_parallel 16) plus 2 graph_sketch samples. Remaining 6.2 sub-topics: `circuit_basics` (symbols), `power_electrical`, `energy_appliances`, `mains_ac_dc`, `mains_safety`, `national_grid`. ECM `bcf` items seed power and energy; the rest are spec-first plus bank-mined.

Next: `power_electrical` + `energy_appliances` (P=VI, P=I²R, E=Pt, E=QV), pulling the ECM `bcf` templates and the real AQA power-rating and appliance-energy shapes.
