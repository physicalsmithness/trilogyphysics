# Batch review: iv_characteristics (calibration sample, batch 2)

From: 6.2 Authoring chat. To: Architecture. Date: 2026-06-08.
Status: CALIBRATION SAMPLE for review, not yet wired into `app/topics/electricity_6_2.js`.

Twelve items covering the I-V / component-behaviour atoms: `ohmic_recognise`, `ohmic_sketch`, `filament_behaviour`, `diode_behaviour`, `thermistor_behaviour`, `ldr_behaviour`, `rp_wire_length`, `rp_resistance_method`. This is the richest misconception territory in 6.2, and it is where the proposal's NEW_FLAGs (diode-reverse, one-quadrant, lamp-curve-for-ohmic, proportionality-as-increases) get exercised against real items.

**Qtype constraint honoured.** `graph_sketch` is a deferred NEW_QTYPE, so I cover the sketch atoms with gradable framings: *identify* a shown curve, *describe* the required shape, and *reason* about it. Several items carry a `diagram` spec for the Widgets renderers (`iv_characteristic`, `resistance_temperature`); the curve shapes and `device`/`variant` params match `app/widgets/topic-diagrams.js`.

Two-pass provenance: items 3, 5, 6, 9, 12 mirror real AQA stimulus/mark-scheme shapes (the ohmic constant-temperature tick-box; the reversed-diode "current = 0.00 A"; the "explain the current when pd is negative" 2-marker; the thermistor direction tick-box; the repeatable-vs-reproducible trap). Distractors are seeded from examiner-report pain points.

---

## A. The items (engine schema, ready to paste)

```js
// iv_characteristics — calibration batch v1 (12 items)
[
  {
    id: "iv_ohmic_drawshape_01", qtype: "mcq_single", tier: "both",
    atom: "ohmic_sketch", syllabus: "6.2.1.4.b",
    prompt: "A student must draw the I–V characteristic of a fixed resistor at constant temperature. Which graph should they draw?",
    explanation: "A fixed resistor at constant temperature is ohmic: a straight line through the origin. A curve that flattens is the filament-lamp characteristic.",
    distractors: [
      { id: "a", text: "A straight line through the origin", status: "correct" },
      { id: "b", text: "A curve that flattens out as the pd increases", status: "wrong", misconception: "drew_lamp_curve_for_ohmic" },
      { id: "c", text: "A line in one direction only", status: "wrong", misconception: "misread_iv_graph_for_ohmic" },
      { id: "d", text: "A horizontal straight line", status: "wrong", misconception: "misread_iv_graph_for_ohmic" }
    ]
  },
  {
    id: "iv_identify_filament_02", qtype: "mcq_single", tier: "both",
    atom: "ohmic_recognise", syllabus: "6.2.1.4.e",
    prompt: "The graph shows an I–V characteristic. Which component does it represent?",
    diagram: { kind: "iv_characteristic", params: { device: "filament" } },
    explanation: "The current keeps rising but the gradient falls as the pd increases: resistance is increasing as the filament heats. That is a filament lamp, not an ohmic resistor.",
    distractors: [
      { id: "a", text: "A filament lamp", status: "correct" },
      { id: "b", text: "A fixed resistor at constant temperature", status: "wrong", misconception: "misread_iv_graph_for_ohmic" },
      { id: "c", text: "A diode", status: "wrong", misconception: "misread_iv_graph_for_ohmic" },
      { id: "d", text: "A thermistor", status: "wrong", misconception: "ohmic_confused_with_variable_resistor" }
    ]
  },
  {
    id: "iv_ohmic_constantT_03", qtype: "mcq_single", tier: "both",
    atom: "ohmic_recognise", syllabus: "6.2.1.4.b",
    prompt: "Which quantity must stay the same so that a metal wire behaves as an ohmic conductor?",
    explanation: "An ohmic conductor gives I ∝ V only at constant temperature. If the wire heats, its resistance changes and the line is no longer straight.",
    distractors: [
      { id: "a", text: "Temperature of the wire", status: "correct" },
      { id: "b", text: "Air pressure", status: "wrong", misconception: "ohms_law_misread_temperature_role" },
      { id: "c", text: "Density of the metal", status: "wrong", misconception: "ohms_law_misread_temperature_role" },
      { id: "d", text: "Length of the wire", status: "wrong", misconception: "ohms_law_misread_temperature_role" }
    ]
  },
  {
    id: "iv_ohmic_thirdquadrant_04", qtype: "mcq_single", tier: "higher",
    atom: "ohmic_sketch", syllabus: "6.2.1.4.b",
    prompt: "The I–V characteristic of an ohmic resistor is a straight line through the origin. When the potential difference is made negative, the line should:",
    explanation: "The relationship is symmetric: reversing the pd reverses the current by the same amount, so the straight line continues into the third quadrant. Drawing it only in the first quadrant loses the mark.",
    distractors: [
      { id: "a", text: "Continue as a straight line into the third quadrant (negative V, negative I)", status: "correct" },
      { id: "b", text: "Stop at the origin", status: "wrong", misconception: "iv_line_one_quadrant_only" },
      { id: "c", text: "Become a horizontal line along the V-axis", status: "wrong", misconception: "iv_line_one_quadrant_only" },
      { id: "d", text: "Curve back towards the V-axis", status: "wrong", misconception: "misread_iv_graph_for_ohmic" }
    ]
  },
  {
    id: "iv_diode_reverse_05", qtype: "mcq_single", tier: "both",
    atom: "diode_behaviour", syllabus: "6.2.1.4.e",
    prompt: "There is a current of 1.00 A in a diode. The student then reverses the connections to the diode. What is the new current in the diode?",
    explanation: "A diode conducts in one direction only. Reversed, it blocks the current, so the new current is 0.00 A. It does not reverse or merely reduce.",
    distractors: [
      { id: "a", text: "0.00 A", status: "correct" },
      { id: "b", text: "1.00 A in the opposite direction", status: "wrong", misconception: "diode_reverse_current_nonzero" },
      { id: "c", text: "1.00 A in the same direction", status: "wrong", misconception: "diode_reverse_current_nonzero" },
      { id: "d", text: "A smaller current, but not zero", status: "wrong", misconception: "diode_reverse_current_nonzero" }
    ]
  },
  {
    id: "iv_diode_explain_06", qtype: "short", tier: "both",
    atom: "diode_behaviour", syllabus: "6.2.1.4.e",
    prompt: "Explain what happens to the current in an LED when the potential difference across it is made negative.",
    explanation: "A diode/LED conducts in one direction only. With the pd reversed it is reverse-biased, so the current is (almost) zero and the LED does not light.",
    claims: [
      { id: "a", text: "The current becomes (almost) zero", correct: true },
      { id: "b", text: "The LED is reverse-biased / only conducts one way", correct: true },
      { id: "c", text: "The current reverses direction but keeps the same size", correct: false, misconception: "diode_reverse_current_nonzero" },
      { id: "d", text: "The current stays the same as before", correct: false, misconception: "diode_reverse_current_nonzero" }
    ]
  },
  {
    id: "iv_diode_symbol_07", qtype: "mcq_single", tier: "both",
    atom: "diode_behaviour", syllabus: "6.2.1.1.a",
    prompt: "Which component allows current to flow in one direction only?",
    explanation: "A diode allows current in one direction only. A resistor, thermistor and LDR all conduct in either direction.",
    distractors: [
      { id: "a", text: "Diode", status: "correct" },
      { id: "b", text: "Fixed resistor", status: "wrong", misconception: "diode_vs_led" },
      { id: "c", text: "Thermistor", status: "wrong", misconception: "ohmic_confused_with_variable_resistor" },
      { id: "d", text: "LDR", status: "wrong", misconception: "ldr_vs_led" }
    ]
  },
  {
    id: "iv_filament_resistance_08", qtype: "mcq_single", tier: "both",
    atom: "filament_behaviour", syllabus: "6.2.1.4.e",
    prompt: "As the current in a filament lamp increases, the filament gets hotter. What happens to the resistance of the filament?",
    explanation: "A hotter filament has a higher resistance, which is why its I–V line curves (gradient falls).",
    distractors: [
      { id: "a", text: "It increases", status: "correct" },
      { id: "b", text: "It decreases", status: "wrong", misconception: "filament_resistance_falls" },
      { id: "c", text: "It stays the same", status: "wrong", misconception: "ohmic_confused_with_metal" },
      { id: "d", text: "It drops to zero", status: "wrong", misconception: "filament_resistance_falls" }
    ]
  },
  {
    id: "iv_thermistor_direction_09", qtype: "mcq_single", tier: "both",
    atom: "thermistor_behaviour", syllabus: "6.2.1.4.f",
    prompt: "The temperature of a thermistor increases. What happens to its resistance?",
    diagram: { kind: "resistance_temperature", params: { device: "thermistor" } },
    explanation: "For an NTC thermistor, resistance decreases as temperature increases (the curve falls).",
    distractors: [
      { id: "a", text: "It decreases", status: "correct" },
      { id: "b", text: "It increases", status: "wrong", misconception: "sensor_direction_reversed" },
      { id: "c", text: "It stays the same", status: "wrong", misconception: "ohmic_confused_with_variable_resistor" },
      { id: "d", text: "It first rises then falls", status: "wrong", misconception: "sensor_direction_reversed" }
    ]
  },
  {
    id: "iv_ldr_direction_10", qtype: "mcq_single", tier: "both",
    atom: "ldr_behaviour", syllabus: "6.2.1.4.f",
    prompt: "The light shining on an LDR gets brighter. What happens to the resistance of the LDR?",
    diagram: { kind: "resistance_light", params: {} },
    explanation: "For an LDR, brighter light means lower resistance (the curve falls as light intensity rises).",
    distractors: [
      { id: "a", text: "It decreases", status: "correct" },
      { id: "b", text: "It increases", status: "wrong", misconception: "sensor_direction_reversed" },
      { id: "c", text: "It stays the same", status: "wrong", misconception: "ohmic_confused_with_variable_resistor" },
      { id: "d", text: "It drops to zero", status: "wrong", misconception: "sensor_direction_reversed" }
    ]
  },
  {
    id: "iv_rp_wirelength_11", qtype: "short", tier: "both",
    atom: "rp_wire_length", syllabus: "6.2.1.3.d.iiA",
    prompt: "A student's results suggest the resistance of a wire is directly proportional to its length. How can the graph of resistance against length confirm this?",
    explanation: "Direct proportion needs both a straight line AND a line that passes through the origin. 'Resistance increases as length increases' only shows a positive correlation, not proportionality.",
    claims: [
      { id: "a", text: "The points lie on a straight line", correct: true },
      { id: "b", text: "The straight line passes through the origin", correct: true },
      { id: "c", text: "Showing that resistance increases as length increases is enough on its own", correct: false, misconception: "proportionality_stated_as_increases" },
      { id: "d", text: "The line is the best fit drawn with a ruler, not freehand", correct: true }
    ]
  },
  {
    id: "iv_rp_repeatable_12", qtype: "mcq_single", tier: "both",
    atom: "rp_resistance_method", syllabus: "6.2.1.4.d",
    prompt: "A student measures the current three times under the same conditions and gets the same value each time. This shows the results are:",
    explanation: "Repeating the same method and getting the same values shows repeatability. Reproducibility is when a different person or method gets the same result.",
    distractors: [
      { id: "a", text: "Repeatable", status: "correct" },
      { id: "b", text: "Reproducible", status: "wrong", misconception: "repeatability_reproducibility_confused" },
      { id: "c", text: "Accurate", status: "wrong", misconception: "repeatability_reproducibility_confused" },
      { id: "d", text: "Valid", status: "wrong", misconception: "repeatability_reproducibility_confused" }
    ]
  }
]
```

---

## B. Atom and flag coverage

| atom | items | misconception flags exercised |
|---|---|---|
| ohmic_sketch | 01, 04 | drew_lamp_curve_for_ohmic, misread_iv_graph_for_ohmic, iv_line_one_quadrant_only |
| ohmic_recognise | 02, 03 | misread_iv_graph_for_ohmic, ohms_law_misread_temperature_role, ohmic_confused_with_variable_resistor |
| diode_behaviour | 05, 06, 07 | diode_reverse_current_nonzero, diode_vs_led, ldr_vs_led |
| filament_behaviour | 08 | filament_resistance_falls (NEW), ohmic_confused_with_metal |
| thermistor_behaviour | 09 | sensor_direction_reversed (NEW), ohmic_confused_with_variable_resistor |
| ldr_behaviour | 10 | sensor_direction_reversed (NEW), ohmic_confused_with_variable_resistor |
| rp_wire_length | 11 | proportionality_stated_as_increases |
| rp_resistance_method | 12 | repeatability_reproducibility_confused |

---

## C. NEW_FLAG proposals (surfaced by this batch)

Per principle 1 / the brief, surfaced explicitly rather than folded into a neighbour:

1. **`sensor_direction_reversed`** (iv_characteristics) — reversed the direction of a thermistor or LDR response: said resistance *rises* as temperature/light intensity *rises*, when for an NTC thermistor and an LDR it falls. One slug covers both sensors (the error and the fix are identical). Used in items 09, 10.
2. **`filament_resistance_falls`** (iv_characteristics) — thought a filament lamp's resistance *falls* (or drops to zero) as it heats, rather than rising. Distinct from `ohmic_confused_with_metal` (which is "stays constant / it's a metal so it's ohmic"); this one has the direction actively backwards. Used in item 08.

Both are genuine I-V-behaviour traps not covered by the ported ECM set (ECM's resistivity/parallel focus did not include thermistor/LDR/filament direction errors at GCSE grain). If you would rather generalise, `sensor_direction_reversed` could absorb a filament variant, but I think the filament (a passive heating effect) and the sensors (designed responses) are pedagogically different and worth two slugs.

---

## D. Findings for Architecture (new this batch)

1. **NEW (important): MCQ distractors are text-only — no "pick the correct graph from four" item is possible.** 6.2.1.4 is graph-dense and AQA routinely shows four candidate I-V graphs and asks which is (say) the diode. The current schema can show *one* diagram as the item stimulus (items 02, 09, 10 do this) and ask a text MCQ about it, but it cannot offer four graph *options*. Three ways forward: (a) add per-distractor `diagram` support to the MCQ schema; (b) lean on identify-this-graph and describe-the-shape framings (what I did here); (c) wait for `graph_sketch`. I recommend (a) eventually, since "choose the correct characteristic" is a high-frequency AQA shape; (b) covers it acceptably for now.
2. **`diagram` spec shape confirmed** against the demo fixture and `topic-diagrams.js`: `diagram: { kind, params:{...} }`. Items here use `iv_characteristic{device}`, `resistance_temperature{device}`, `resistance_light{}`. Please confirm the Widgets renderers accept exactly these param names (I read them from `topic-diagrams.js`; Housing wires `diagrams.js`).
3. **`short` (claims) is carrying the explanation load** that `level_of_response_6` will eventually own. Items 06 and 11 work as claim-point selections, but a true 6-marker (e.g. "describe the RP method to obtain the I-V characteristic of a filament lamp") still needs the NEW_QTYPE. Flagging that the explanation-heavy core of Trilogy is only half-served until then.
4. Carries forward unresolved from batch 1: no `calc.codex{}` slot (n/a here, no calc items), no item-level `subtag` field (these items would all sit under `iv_characteristics`).

## E. Calibration notes

- The `iv_characteristic{device:"filament"}` renderer already models the "current keeps rising while the gradient falls" shape correctly (I read the model fn), so item 02 will render a physically faithful curve rather than a plateau. Good — the Widgets chat got the filament physics right, which is the exact thing the brief flagged as easy to draw wrong.
- The reversed-diode item (05) is the single highest-value item in 6.2 by examiner pain (fewer than 1 in 10 score it). Worth seeding several variants later (red vs blue LED, ammeter-reads-0-mA framing).
- Awkward: items 09/10 show a falling curve in the diagram, which arguably gives away the "decreases" answer. For a diagnostic I may want a *no-diagram* variant so the student recalls the direction rather than reading it off. Easy to add; flagging the design tension between "show the graph" (tests reading) and "no graph" (tests recall).

On your nod, both batches (resistance_ohm + iv_characteristics, 22 items) wire into `electricity_6_2.js` together, the provisional atom registry is replaced with the ratified slugs, and `sensor_direction_reversed` + `filament_resistance_falls` are added to the misconception table. Next batch: `series_parallel` (the qualitative-rule heartland, where `voltage_same_in_series` and the choose-V/choose-I rules live).
