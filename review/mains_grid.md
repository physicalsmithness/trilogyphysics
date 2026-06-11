# Batch review: mains_ac_dc + mains_safety + national_grid (calibration sample, batch 6 — closes 6.2)

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.
Status: CALIBRATION SAMPLE for review, not yet wired into `app/topics/electricity_6_2.js`.

Fifteen items closing the topic: `mains_ac_dc` (230 V / 50 Hz, a.c. vs d.c.), `mains_safety` (live/neutral/earth, plug, fuse-and-earth safety), `national_grid` (transformer roles, high-voltage transmission). Atoms: `mains_values_recall`, `ac_vs_dc`, `wire_identification`, `earthing_fuse_safety`, `cable_insulation`, `transformer_function`, `grid_high_voltage_reason`.

This batch exercises the proposal's last NEW_FLAG cluster (`mains_values_confused`, `live_neutral_earth_confused`, `transformer_role_confused`, `grid_loss_reason_missed`); no brand-new flags were needed, which is a good sign the proposal anticipated the mains/grid territory. Diagrams use the Widgets mains/grid kinds (`ac_dc_trace{quantity,signal}`, `transformer{type}`, `transmission_line`, `mains_three_wire`).

**Cross-topic boundary (d030):** the HT transformer-ratio calculation (Vp/Vs = Np/Ns, Vp Ip = Vs Is) appears in the bank tagged 6.2.6.3.c, but it is the 6.7 Magnetism `transformer` atom. I have NOT authored it here; it should be a single cross-referenced item owned by 6.7, not duplicated. National Grid in 6.2 stays qualitative. Flagging for coordination with the 6.7 Authoring seat.

Two-pass provenance: items 01, 02, 05, 08, 11, 13, 15 mirror real AQA shapes ("a battery supplies direct current, mains supplies...", "pd and frequency of UK mains", "what is the potential of the earth wire? tick one box", "explain why the earth wire makes the case safe", the step-up/step-down tick-box, "explain why step-up transformers are used", "what is this network called").

---

## A. The items (engine schema, ready to paste)

```js
// mains_ac_dc + mains_safety + national_grid — calibration batch v1 (15 items)
[
  // ---- mains_ac_dc ----
  {
    id: "mn_ac_dc_supply_01", qtype: "mcq_single", tier: "both",
    atom: "ac_vs_dc", syllabus: "6.2.3.1.a",
    prompt: "A battery supplies direct current (d.c.). What does the UK mains electricity supply provide?",
    diagram: { kind: "ac_dc_trace", params: { quantity: "pd", signal: "ac" } },
    explanation: "Mains electricity is an alternating supply: the potential difference repeatedly reverses direction, giving alternating current (a.c.).",
    distractors: [
      { id: "a", text: "Alternating current (a.c.)", status: "correct" },
      { id: "b", text: "Direct current, like the battery", status: "wrong", misconception: "ac_dc_confused" },
      { id: "c", text: "A current that only flows when a switch is pressed", status: "wrong" },
      { id: "d", text: "No current until a transformer is added", status: "wrong" }
    ]
  },
  {
    id: "mn_mains_values_02", qtype: "mcq_single", tier: "both",
    atom: "mains_values_recall", syllabus: "6.2.3.1.a",
    prompt: "What are the potential difference and frequency of the UK mains electricity supply?",
    explanation: "UK mains is 230 V and 50 Hz.",
    distractors: [
      { id: "a", text: "230 V and 50 Hz", status: "correct" },
      { id: "b", text: "230 V and 60 Hz", status: "wrong", misconception: "mains_values_confused" },
      { id: "c", text: "12 V and 50 Hz", status: "wrong", misconception: "mains_values_confused" },
      { id: "d", text: "50 V and 230 Hz", status: "wrong", misconception: "mains_values_confused" }
    ]
  },
  {
    id: "mn_alternating_meaning_03", qtype: "short", tier: "both",
    atom: "ac_vs_dc", syllabus: "6.2.3.1.a",
    prompt: "What is meant by an 'alternating potential difference'?",
    explanation: "An alternating pd repeatedly changes direction, so the current it drives keeps reversing direction.",
    claims: [
      { id: "a", text: "The potential difference repeatedly reverses direction", correct: true },
      { id: "b", text: "The direction of the current it drives keeps changing", correct: true },
      { id: "c", text: "It stays constant in one direction, like a battery", correct: false, misconception: "ac_dc_confused" },
      { id: "d", text: "It increases steadily and never decreases", correct: false, misconception: "ac_dc_confused" }
    ]
  },
  {
    id: "mn_identify_trace_04", qtype: "mcq_single", tier: "both",
    atom: "ac_vs_dc", syllabus: "6.2.3.1.a",
    prompt: "The graph shows how the potential difference from a supply varies with time. What type of supply is it?",
    diagram: { kind: "ac_dc_trace", params: { quantity: "pd", signal: "ac" } },
    explanation: "The trace repeatedly crosses from positive to negative, so the pd reverses: it is an alternating (a.c.) supply.",
    distractors: [
      { id: "a", text: "Alternating (a.c.), because the pd reverses direction", status: "correct" },
      { id: "b", text: "Direct (d.c.), because the pd is always changing", status: "wrong", misconception: "ac_dc_confused" },
      { id: "c", text: "Direct (d.c.), because it is a smooth curve", status: "wrong", misconception: "ac_dc_confused" },
      { id: "d", text: "Neither: the supply is switched off", status: "wrong" }
    ]
  },

  // ---- mains_safety ----
  {
    id: "mn_earth_potential_05", qtype: "mcq_single", tier: "both",
    atom: "wire_identification", syllabus: "6.2.3.2.a",
    prompt: "What is the potential of the earth wire?",
    explanation: "The earth wire is at 0 V; it carries no current in normal use.",
    distractors: [
      { id: "a", text: "0 V", status: "correct" },
      { id: "b", text: "230 V", status: "wrong", misconception: "live_neutral_earth_confused" },
      { id: "c", text: "12 V", status: "wrong", misconception: "live_neutral_earth_confused" },
      { id: "d", text: "1.5 V", status: "wrong", misconception: "live_neutral_earth_confused" }
    ]
  },
  {
    id: "mn_live_wire_06", qtype: "mcq_single", tier: "both",
    atom: "wire_identification", syllabus: "6.2.3.2.a",
    prompt: "In a UK three-pin plug, which wire carries the alternating potential difference from the supply, and what colour is it?",
    diagram: { kind: "mains_three_wire", params: {} },
    explanation: "The live wire (brown) carries the alternating pd from the supply, at about 230 V.",
    distractors: [
      { id: "a", text: "The live wire, coloured brown", status: "correct" },
      { id: "b", text: "The neutral wire, coloured blue", status: "wrong", misconception: "live_neutral_earth_confused" },
      { id: "c", text: "The earth wire, coloured green and yellow", status: "wrong", misconception: "live_neutral_earth_confused" },
      { id: "d", text: "The earth wire, coloured brown", status: "wrong", misconception: "live_neutral_earth_confused" }
    ]
  },
  {
    id: "mn_neutral_wire_07", qtype: "mcq_single", tier: "both",
    atom: "wire_identification", syllabus: "6.2.3.2.a",
    prompt: "What is the role of the neutral wire (blue) in a mains circuit?",
    explanation: "The neutral wire completes the circuit and is at (or near) 0 V.",
    distractors: [
      { id: "a", text: "It completes the circuit and is at about 0 V", status: "correct" },
      { id: "b", text: "It carries the 230 V supply to the appliance", status: "wrong", misconception: "live_neutral_earth_confused" },
      { id: "c", text: "It only carries current if there is a fault", status: "wrong", misconception: "live_neutral_earth_confused" },
      { id: "d", text: "It connects the metal case to the ground for safety", status: "wrong", misconception: "live_neutral_earth_confused" }
    ]
  },
  {
    id: "mn_earthing_safety_08", qtype: "short", tier: "higher",
    atom: "earthing_fuse_safety", syllabus: "6.2.3.2.a",
    prompt: "An appliance has a metal case connected to the earth wire. Explain why this makes the appliance safe if the live wire touches the case.",
    explanation: "If the live touches the case, a large current flows to earth through the low-resistance earth wire; this large current melts the fuse, disconnecting the live and leaving the case safe to touch.",
    claims: [
      { id: "a", text: "A large current flows from the live wire to earth through the earth wire", correct: true },
      { id: "b", text: "This large current melts the fuse (or trips the breaker), cutting off the live wire", correct: true },
      { id: "c", text: "The case cannot stay at a dangerous voltage, so it is safe to touch", correct: true },
      { id: "d", text: "The earth wire carries the normal working current of the appliance", correct: false, misconception: "live_neutral_earth_confused" }
    ]
  },
  {
    id: "mn_fuse_function_09", qtype: "mcq_single", tier: "both",
    atom: "earthing_fuse_safety", syllabus: "6.2.3.2.a",
    prompt: "What is the purpose of a fuse in a plug?",
    explanation: "A fuse contains a thin wire that melts and breaks the circuit if the current rises above a safe value.",
    distractors: [
      { id: "a", text: "It melts and breaks the circuit if the current gets too high", status: "correct" },
      { id: "b", text: "It reduces the potential difference supplied to the appliance", status: "wrong", misconception: "fuse_resistor_swap" },
      { id: "c", text: "It stores charge to smooth out the supply", status: "wrong" },
      { id: "d", text: "It increases the current so the appliance works faster", status: "wrong" }
    ]
  },
  {
    id: "mn_insulation_10", qtype: "mcq_single", tier: "foundation",
    atom: "cable_insulation", syllabus: "6.2.3.2.a",
    prompt: "Why is the material covering the wires in a mains cable made of plastic?",
    explanation: "Plastic is an electrical insulator, so it stops the user touching the live conductors and stops the wires short-circuiting.",
    distractors: [
      { id: "a", text: "Plastic is an electrical insulator", status: "correct" },
      { id: "b", text: "Plastic is a good electrical conductor", status: "wrong", misconception: "confused_v_and_i" },
      { id: "c", text: "Plastic increases the current in the wires", status: "wrong" },
      { id: "d", text: "Plastic stores the charge safely", status: "wrong" }
    ]
  },

  // ---- national_grid ----
  {
    id: "ng_stepup_function_11", qtype: "mcq_single", tier: "both",
    atom: "transformer_function", syllabus: "6.2.6.3.b",
    prompt: "What is the function of the step-up transformer in the National Grid?",
    diagram: { kind: "transformer", params: { type: "step_up" } },
    explanation: "A step-up transformer increases the potential difference (and lowers the current) for efficient transmission.",
    distractors: [
      { id: "a", text: "To increase the potential difference for transmission", status: "correct" },
      { id: "b", text: "To decrease the potential difference", status: "wrong", misconception: "transformer_role_confused" },
      { id: "c", text: "To increase the current in the cables", status: "wrong", misconception: "transformer_role_confused" },
      { id: "d", text: "To increase the power supplied to the cables", status: "wrong", misconception: "transformer_role_confused" }
    ]
  },
  {
    id: "ng_stepdown_function_12", qtype: "mcq_single", tier: "both",
    atom: "transformer_function", syllabus: "6.2.6.3.b",
    prompt: "What is the function of the step-down transformer in the National Grid?",
    diagram: { kind: "transformer", params: { type: "step_down" } },
    explanation: "A step-down transformer decreases the potential difference to a safer, usable level before electricity reaches homes.",
    distractors: [
      { id: "a", text: "To decrease the potential difference for safe use in homes", status: "correct" },
      { id: "b", text: "To increase the potential difference", status: "wrong", misconception: "transformer_role_confused" },
      { id: "c", text: "To decrease the power delivered to homes", status: "wrong", misconception: "transformer_role_confused" },
      { id: "d", text: "To change alternating current into direct current", status: "wrong", misconception: "ac_dc_confused" }
    ]
  },
  {
    id: "ng_high_voltage_explain_13", qtype: "short", tier: "higher",
    atom: "grid_high_voltage_reason", syllabus: "6.2.6.3.a",
    prompt: "Explain why electrical power is transmitted across the National Grid at very high potential difference.",
    diagram: { kind: "transmission_line", params: {} },
    explanation: "For a fixed power, P = VI means a higher pd gives a lower current; a lower current wastes less energy heating the cables (losses scale with I²R), so transmission is more efficient.",
    claims: [
      { id: "a", text: "For the same power, a higher pd means a lower current (P = VI)", correct: true },
      { id: "b", text: "A lower current wastes less energy heating the cables (I²R losses)", correct: true },
      { id: "c", text: "This makes transmission over long distances more efficient", correct: true },
      { id: "d", text: "The high voltage makes the electrons travel faster so they arrive sooner", correct: false, misconception: "grid_loss_reason_missed" }
    ]
  },
  {
    id: "ng_loss_reason_mcq_14", qtype: "mcq_single", tier: "higher",
    atom: "grid_high_voltage_reason", syllabus: "6.2.6.3.a",
    prompt: "Transmitting electrical power at high voltage reduces energy losses in the cables. Why?",
    explanation: "Higher voltage means a lower current for the same power, and lower current means less energy wasted as heat in the cable resistance.",
    distractors: [
      { id: "a", text: "The current is lower, so less energy is wasted heating the cables", status: "correct" },
      { id: "b", text: "The higher voltage pushes the energy along faster", status: "wrong", misconception: "grid_loss_reason_missed" },
      { id: "c", text: "The resistance of the cables falls to zero at high voltage", status: "wrong", misconception: "grid_loss_reason_missed" },
      { id: "d", text: "High voltage stops any current flowing, so nothing is wasted", status: "wrong", misconception: "grid_loss_reason_missed" }
    ]
  },
  {
    id: "ng_network_name_15", qtype: "mcq_single", tier: "foundation",
    atom: "transformer_function", syllabus: "6.2.6.3.a",
    prompt: "What is the name of the nationwide system of cables and transformers that distributes electricity from power stations to consumers?",
    explanation: "It is the National Grid.",
    distractors: [
      { id: "a", text: "The National Grid", status: "correct" },
      { id: "b", text: "The mains circuit", status: "wrong" },
      { id: "c", text: "The ring main", status: "wrong" },
      { id: "d", text: "The power factor", status: "wrong" }
    ]
  }
]
```

---

## B. Atom and flag coverage

| atom | items | flags exercised |
|---|---|---|
| ac_vs_dc | 01, 03, 04 | ac_dc_confused (NEW, minor) |
| mains_values_recall | 02 | mains_values_confused |
| wire_identification | 05, 06, 07 | live_neutral_earth_confused |
| earthing_fuse_safety | 08, 09 | live_neutral_earth_confused, fuse_resistor_swap |
| cable_insulation | 10 | confused_v_and_i |
| transformer_function | 11, 12, 15 | transformer_role_confused, ac_dc_confused |
| grid_high_voltage_reason | 13, 14 | grid_loss_reason_missed |

## C. NEW_FLAG proposal (one minor)

**`ac_dc_confused`** (mains_ac_dc) — conflated alternating and direct supplies: read an a.c. trace as d.c. (or vice versa), or thought mains is d.c. like a battery. The proposal listed `mains_values_confused` (the 230 V / 50 Hz numbers) but not the a.c./d.c. concept itself; this fills that gap. Used in items 01, 03, 04, and as a distractor in item 12 (a transformer does not rectify a.c. to d.c.).

## D. Findings

1. **Cross-topic transformer calc (d030).** The Vp/Vs = Np/Ns and Vp Ip = Vs Is calculations are tagged 6.2.6.3.c in the bank but belong to the 6.7 Magnetism `transformer` atom. I deliberately did not author them here. Proposing one shared item owned by 6.7, cross-referenced from 6.2 national_grid, rather than a duplicate. Needs a word with the 6.7 Authoring seat (there is one active per the memory index). Flagging for you to broker.
2. **`short` carrying the explanation load again.** Items 03, 08, 13 are claim-point `short` items standing in for what would be 2-to-6-mark written explanations (`level_of_response_6`). The National Grid "explain why step-up transformers are used" is a classic 4-to-6 marker; the claim-point form captures the marking points but not the extended-prose skill. Same `level_of_response_6` dependency flagged in earlier batches.
3. **Diagram kinds used** (`ac_dc_trace`, `transformer`, `mains_three_wire`, `transmission_line`) are all in the topic config `diagram_kinds` and exist in `topic-diagrams.js`; params match what I read (`ac_dc_trace{quantity,signal}`, `transformer{type}`). `live_earth_danger` is available but unused here; a fault-scenario item could use it later.

## E. Calibration notes and 6.2 close-out

- All four mains/grid NEW_FLAGs from the proposal fired naturally on real AQA shapes, with only one small addition (`ac_dc_confused`). That is a good validation of the proposal's coverage of this sub-topic.
- The National Grid "why high voltage" explanation leans on the `appliance_energy_confused_power_energy` cousin reasoning (power vs current vs voltage); the `grid_loss_reason_missed` flag is its sharpest diagnostic.

**6.2 first-pass authoring is now complete across all ten sub-topics:**

| subtag | file | items |
|---|---|---|
| resistance_ohm + charge_current | resistance_ohm.md | 10 |
| iv_characteristics | iv_characteristics.md | 12 |
| series_parallel | series_parallel.md | 16 |
| power_electrical + energy_appliances | power_energy.md | 12 |
| circuit_basics | circuit_basics.md | 8 |
| mains_ac_dc + mains_safety + national_grid | mains_grid.md | 15 |

**Total: 73 graded items, plus 4 authored-ahead deferred-qtype items** (2 graph_sketch, 2 circuit_draw). Atom coverage spans all 35-plus atoms in the ratified proposal plus the one added in authoring (`identify_topology`). Misconception slugs span the ratified set, the two corrected ports, and the batch-surfaced NEW_FLAGs.

Outstanding for ratification / Housing (collected):
- NEW_FLAGs surfaced in authoring: `sensor_direction_reversed`, `filament_resistance_falls`, `appliance_energy_confused_power_energy`, `sensor_stimulus_confused`, `ac_dc_confused`.
- NEW atom: `identify_topology`.
- Proposal corrections: `treated_bypass_as_active` and `disguised_parallel_missed` are PORT not OUT; `equal_current_in_parallel_assumed` is an alias of `equal_share_assumption`.
- Capability asks (inter_chat thread): per-distractor diagram (pick-the-graph / pick-the-symbol), `component_symbol` render kind, `graph_sketch` grader, `circuit_draw` Builder-as-input grader; plus the three calc-grader gaps (prefix, multi-letter symbols, `^`) shared with the Forces seat.
- Retro-fix: batch-1 `ohm_vir_prefix_02` prefix mark not gradable.
- Cross-topic: transformer-ratio calc owned by 6.7.
- Whole bank still needs wiring into `electricity_6_2.js` (replace provisional atoms/misconceptions with the ratified registries; append items) on your nod.

Suggested next: a second pass for depth where the engine now allows (convert interim MCQs to calc_workings / graph_sketch / circuit_draw as capabilities land), and the `level_of_response_6` explanation items once that qtype exists.
