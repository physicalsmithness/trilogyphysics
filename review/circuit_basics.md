# Batch review: circuit_basics (calibration sample, batch 5)

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.
Status: CALIBRATION SAMPLE for review, not yet wired into `app/topics/electricity_6_2.js`.

Eight items for `circuit_basics` (6.2.1.1, the highest-frequency 6.2 code, 46 bank parts): `recall_symbol`, `meter_placement`, `draw_measuring_circuit`.

**The defining feature of this sub-topic: it is drawing-heavy.** The real AQA 6.2.1.1 items are overwhelmingly "draw the circuit symbol for X" and "draw a circuit diagram to measure Y", with a minority of tick-box "what is component P?" identify items. Neither drawing nor pick-the-symbol is gradable with the current text-only MCQ engine. So I split the sub-topic:

- The *conceptual* symbol knowledge (which component does X, where a meter goes) is authored as **text MCQ**, gradable now (items 01 to 06).
- The *drawing* items are authored as **`circuit_draw`**, a NEW_QTYPE, ahead of the grader, using the same graceful-fallback pattern as the graph_sketch samples (items 07, 08). They degrade to a self-check that reveals the model via the Circuit Builder, and become auto-graded when Housing builds the Builder-as-input grader.

Two-pass provenance: items 01, 02, 06, 07, 08 mirror real AQA shapes ("which symbol represents a component whose resistance decreases as its temperature increases?", "what is component P? tick one box", "draw the circuit symbol for a fuse", "draw a circuit diagram to measure the current in a filament lamp"). Symbol-confusion distractors are the ported ECM symbol slugs.

---

## A. The items (engine schema, ready to paste)

```js
// circuit_basics — calibration batch v1 (8 items)
[
  // ---- text MCQ: component identity (gradable now) ----
  {
    id: "cb_thermistor_id_01", qtype: "mcq_single", tier: "both",
    atom: "recall_symbol", syllabus: "6.2.1.4.f",
    prompt: "Which component has a resistance that decreases as its temperature increases?",
    explanation: "A thermistor's resistance falls as it gets hotter. An LDR responds to light, not temperature.",
    distractors: [
      { id: "a", text: "Thermistor", status: "correct" },
      { id: "b", text: "LDR (light-dependent resistor)", status: "wrong", misconception: "sensor_stimulus_confused" },
      { id: "c", text: "Fixed resistor", status: "wrong" },
      { id: "d", text: "Fuse", status: "wrong" }
    ]
  },
  {
    id: "cb_ldr_id_02", qtype: "mcq_single", tier: "both",
    atom: "recall_symbol", syllabus: "6.2.1.4.f",
    prompt: "Which component has a resistance that decreases as the light shining on it gets brighter?",
    explanation: "An LDR's resistance falls as light intensity rises. A thermistor responds to temperature, not light.",
    distractors: [
      { id: "a", text: "LDR (light-dependent resistor)", status: "correct" },
      { id: "b", text: "Thermistor", status: "wrong", misconception: "sensor_stimulus_confused" },
      { id: "c", text: "Diode", status: "wrong" },
      { id: "d", text: "Variable resistor", status: "wrong" }
    ]
  },
  {
    id: "cb_variable_resistor_03", qtype: "mcq_single", tier: "both",
    atom: "recall_symbol", syllabus: "6.2.1.1.a",
    prompt: "Which component is used to change the current in a circuit by changing its own resistance?",
    explanation: "A variable resistor (rheostat) has an adjustable resistance, used to vary the current.",
    distractors: [
      { id: "a", text: "Variable resistor", status: "correct" },
      { id: "b", text: "Fixed resistor", status: "wrong" },
      { id: "c", text: "Fuse", status: "wrong" },
      { id: "d", text: "Diode", status: "wrong" }
    ]
  },
  {
    id: "cb_cell_vs_battery_04", qtype: "mcq_single", tier: "foundation",
    atom: "recall_symbol", syllabus: "6.2.1.1.a",
    prompt: "What is the difference between a cell and a battery?",
    explanation: "A battery is two or more cells connected together. A single cell is one unit.",
    distractors: [
      { id: "a", text: "A battery is two or more cells connected together", status: "correct" },
      { id: "b", text: "A cell is two or more batteries connected together", status: "wrong", misconception: "cell_battery_confusion" },
      { id: "c", text: "They are two names for exactly the same thing", status: "wrong", misconception: "cell_battery_confusion" },
      { id: "d", text: "A battery is a single unit; a cell is several joined", status: "wrong", misconception: "cell_battery_confusion" }
    ]
  },
  {
    id: "cb_ammeter_placement_05", qtype: "mcq_single", tier: "both",
    atom: "meter_placement", syllabus: "6.2.1.1.a",
    prompt: "How should an ammeter be connected to measure the current through a lamp?",
    explanation: "An ammeter measures the current through a component, so it goes in series with the lamp, in the same loop.",
    distractors: [
      { id: "a", text: "In series with the lamp", status: "correct" },
      { id: "b", text: "In parallel with the lamp", status: "wrong", misconception: "ammeter_in_parallel" },
      { id: "c", text: "Directly across the battery terminals", status: "wrong", misconception: "ammeter_in_parallel" },
      { id: "d", text: "In place of the lamp, after removing it", status: "wrong", misconception: "meter_kinds_interchangeable" }
    ]
  },
  {
    id: "cb_voltmeter_symbol_06", qtype: "mcq_single", tier: "both",
    atom: "recall_symbol", syllabus: "6.2.1.1.a",
    prompt: "A circuit symbol is a circle with the letter V inside it. What is it?",
    explanation: "A circle with V is a voltmeter (measures potential difference). A circle with A is an ammeter.",
    distractors: [
      { id: "a", text: "A voltmeter", status: "correct" },
      { id: "b", text: "An ammeter", status: "wrong", misconception: "swapped_meter_letter" },
      { id: "c", text: "An ohmmeter", status: "wrong", misconception: "swapped_meter_letter" },
      { id: "d", text: "A cell", status: "wrong", misconception: "power_supply_vs_cell" }
    ]
  },

  // ---- circuit_draw: NEW_QTYPE, authored ahead, fails gracefully ----
  {
    id: "cb_draw_fuse_symbol_07", qtype: "circuit_draw", tier: "both",
    atom: "recall_symbol", syllabus: "6.2.1.1.a",
    _interim_for: "circuit_draw grader (Builder-as-input); needs a component_symbol render kind for the isolated-symbol reveal",
    prompt: "Draw the circuit symbol for a fuse.",
    // model for reveal + (later) the grader's target
    target: { kind: "circuit", params: { dsl: "cell,sw,f,bb" } },  // fuse shown in a minimal loop; a component_symbol kind would show it isolated
    accept: { component_present: "fuse", symbol_form: "rectangle_with_line" },
    on_fail: { drew_resistor: "fuse_resistor_swap" },
    explanation: "The fuse symbol is a rectangle with a thin line through it (the wire that melts).",
    fallback: {
      mode: "self_check",
      reveal: { kind: "circuit", params: { dsl: "cell,sw,f,bb" } },
      reveal_note: "The fuse is the rectangle with the line through it. A component_symbol render kind would show it on its own; for now it is shown in a simple loop.",
      self_mark_prompt: "Compare your symbol with the fuse in the revealed circuit. Did you draw a rectangle with a line through it (not a plain resistor rectangle)?",
      log_as: "ungraded_self_assessed"
    }
  },
  {
    id: "cb_draw_measure_current_08", qtype: "circuit_draw", tier: "both",
    atom: "draw_measuring_circuit", syllabus: "6.2.1.1.a",
    _interim_for: "circuit_draw grader (Builder-as-input)",
    prompt: "Draw a circuit diagram for a circuit that could be used to measure the current in a filament lamp. Use a cell, a filament lamp and an ammeter.",
    target: { kind: "circuit", params: { dsl: "cell,sw,bb,am" } },
    accept: {
      components_present: ["cell", "bulb", "ammeter"],
      ammeter_in_series_with: "bulb",
      complete_loop: true
    },
    on_fail: {
      ammeter_in_parallel: "ammeter_in_parallel",
      voltmeter_used_instead: "meter_kinds_interchangeable"
    },
    explanation: "A single series loop: cell, switch, filament lamp and ammeter all in series, so the ammeter reads the current through the lamp.",
    fallback: {
      mode: "self_check",
      reveal: { kind: "circuit", params: { dsl: "cell,sw,bb,am" } },
      self_mark_prompt: "Compare your circuit with the model. Is the ammeter (circle with A) in series with the lamp, in one complete loop with the cell?",
      log_as: "ungraded_self_assessed"
    }
  }
]
```

---

## B. Atom and flag coverage

| atom | items | flags exercised |
|---|---|---|
| recall_symbol | 01, 02, 03, 04, 06, 07 | sensor_stimulus_confused (NEW), cell_battery_confusion, swapped_meter_letter, power_supply_vs_cell, fuse_resistor_swap |
| meter_placement | 05 | ammeter_in_parallel, meter_kinds_interchangeable |
| draw_measuring_circuit | 08 | ammeter_in_parallel, meter_kinds_interchangeable |

## C. NEW_FLAG proposal

**`sensor_stimulus_confused`** (circuit_basics / iv_characteristics) — confused which physical quantity a sensor responds to: treated a thermistor as light-dependent or an LDR as temperature-dependent. Distinct from `sensor_direction_reversed` (which has the direction of the response backwards). This is the "picked the wrong sensor" error, surfaced by items 01 and 02. AQA sets both "which responds to temperature" and "which responds to light" routinely.

## D. Findings

1. **`circuit_draw` NEW_QTYPE, authored ahead and failing gracefully** (items 07, 08), exactly as with `graph_sketch`. The `fallback` self-check pattern is reused unchanged (reveal the model via the existing Circuit Builder, student self-marks, logged ungraded). The grader, when built, is "Builder-as-input": the student assembles a circuit in the embedded Circuit Builder, and the grader checks the `accept` predicates (components present, series/parallel relationship, complete loop) against the `target` DSL. This is a bigger build than graph_sketch (it needs the Builder as an input surface, not just a renderer), so it is the one most worth your scheduling attention. Filed alongside the graph asks; I will fold a line into the inter_chat capability thread.
2. **A `component_symbol` render kind is the missing piece for symbol items.** The AQA "what is component P? tick one box" identify shape, and the cleanest reveal for "draw the symbol for X", both want a single isolated symbol rendered. The Circuit Builder draws whole circuits, not lone symbols. Item 07's reveal works around it by showing the fuse in a minimal loop. A small `component_symbol` kind (one symbol, by name) on the Widgets side would unlock the identify items and tidy the draw reveals. Flagging for Widgets/Housing.
3. **Pick-the-symbol** (four symbol images, choose the LDR) is the symbol-world twin of pick-the-graph, blocked by the same text-only-distractor limit. Covered by the per-distractor-diagram request already in the capability thread; a `component_symbol` kind would also satisfy it.
4. Meter placement overlaps a little with `series_parallel` item 13 (voltmeter placement). I kept ammeter placement here and the voltmeter-across-a-bulb there; together they cover both meters without duplication.

## E. Calibration notes

- This sub-topic is the clearest case so far of the engine's current shape gating coverage: most of what AQA actually sets at 6.2.1.1 is drawing, which is exactly what the engine cannot yet grade. The text-MCQ items are real and useful, but they test the concept (which component, where the meter goes) rather than the assessed skill (drawing it). Authoring the `circuit_draw` items now keeps the content honest and ready.
- `sensor_stimulus_confused` plus the earlier `sensor_direction_reversed` now give the two-axis sensor error model: which stimulus, and which direction. That pair will recur in any topic with thermistors/LDRs.
- Running total: 58 graded items across five batches, plus 2 graph_sketch and 2 circuit_draw samples (4 deferred-qtype items authored ahead). Remaining sub-topics: `mains_ac_dc`, `mains_safety`, `national_grid` (the mains/grid cluster, carrying the proposal's last NEW_FLAGs).

Next: `mains_ac_dc` + `mains_safety` (UK 230 V / 50 Hz, a.c. vs d.c., live/neutral/earth, plug wiring, fuse-and-earth safety), then `national_grid` to close 6.2.
