# graph_sketch sample (NEW_QTYPE, authored ahead of the grader)

From: 6.2 Authoring chat. To: Architecture / Housing. Date: 2026-06-08.
Status: SAMPLE. `graph_sketch` is a proposed NEW_QTYPE; the grader does not exist yet. These items are written to **fail gracefully** until it does (see section B), so they can ship as self-checks now and become auto-graded later with no re-authoring.

The point Smith made: the good 6.2.1.4 graph questions cannot be set as MCQ without losing the actual skill, so author them as `graph_sketch` now and ask for the capability rather than letting the gap block the content. Done.

## A. The items

```js
// graph_sketch — sample (2 items), authored ahead of the grader
[
  {
    id: "iv_sketch_ohmic_01", qtype: "graph_sketch", tier: "both",
    atom: "ohmic_sketch", syllabus: "6.2.1.4.b",
    prompt: "Sketch the I–V characteristic of a fixed resistor at constant temperature. Draw it for both positive and negative potential difference.",
    // axes the student draws on
    axes: { x: { label: "potential difference", unit: "V", min: -1, max: 1 },
            y: { label: "current",              unit: "A", min: -1, max: 1 } },
    // the model curve, reused as both the reveal and (later) the grader's answer key
    target: { kind: "iv_characteristic", params: { device: "ohmic" } },
    // shape predicates the future grader checks (see section C)
    accept: {
      through_origin: true,
      monotonic: "increasing",
      linearity: "straight",
      quadrants: ["I", "III"],
      gradient_trend: "constant"
    },
    // misconception slugs the grader fires when a predicate fails
    on_fail: {
      quadrants_missing_III: "iv_line_one_quadrant_only",
      linearity_curved: "drew_lamp_curve_for_ohmic"
    },
    explanation: "Ohmic at constant temperature means I ∝ V: a straight line through the origin, continuing symmetrically into the third quadrant for negative pd.",
    // graceful degradation while no grader exists (see section B)
    fallback: {
      mode: "self_check",
      reveal: { kind: "iv_characteristic", params: { device: "ohmic" } },
      self_mark_prompt: "Compare your sketch with the model. Did your line go straight through the origin AND into the bottom-left (third quadrant)?",
      log_as: "ungraded_self_assessed"
    }
  },
  {
    id: "iv_sketch_filament_02", qtype: "graph_sketch", tier: "both",
    atom: "ohmic_sketch", syllabus: "6.2.1.4.e",
    prompt: "Sketch the I–V characteristic of a filament lamp. Draw it for both positive and negative potential difference.",
    axes: { x: { label: "potential difference", unit: "V", min: -1, max: 1 },
            y: { label: "current",              unit: "A", min: -1, max: 1 } },
    target: { kind: "iv_characteristic", params: { device: "filament" } },
    accept: {
      through_origin: true,
      monotonic: "increasing",
      linearity: "curved",
      quadrants: ["I", "III"],
      gradient_trend: "decreasing",   // current keeps rising, gradient falls (R rises as it heats)
      symmetry: "odd"
    },
    on_fail: {
      linearity_straight: "drew_lamp_curve_for_ohmic",   // drew it ohmic (straight)
      gradient_trend_increasing: "filament_resistance_falls",
      gradient_trend_plateau: "filament_resistance_falls", // flattened to horizontal => treated R as falling to 0
      quadrants_missing_III: "iv_line_one_quadrant_only"
    },
    explanation: "The filament heats as current rises, so its resistance increases: the line curves, with the gradient falling as pd increases, but current keeps rising. It is an S-shape through the origin (odd symmetry), never flattening to horizontal.",
    fallback: {
      mode: "self_check",
      reveal: { kind: "iv_characteristic", params: { device: "filament" } },
      self_mark_prompt: "Compare your sketch with the model. Does your curve keep rising (never going flat) while bending towards the pd-axis, and pass through the origin into the third quadrant?",
      log_as: "ungraded_self_assessed"
    }
  }
]
```

## B. How it fails gracefully (the contract I am asking Housing to honour now)

An engine that does not implement `graph_sketch` should, on encountering one of these items, **use the `fallback` block** rather than erroring or skipping silently:

1. Render the `prompt` and the labelled `axes` (a blank grid the student can sketch on, or just read while sketching on paper).
2. Offer a "reveal model answer" control that draws `fallback.reveal` through the existing `TOPIC_DIAGRAMS` renderer (the curve already exists in `topic-diagrams.js`, so nothing new is needed).
3. Show `fallback.self_mark_prompt` and let the student self-mark correct / not-yet.
4. Log the attempt as `ungraded_self_assessed` so it does not pollute the atom accuracy stats but still records exposure (the d004 "applicable-but-avoided" counter can still tick if the student self-marks correct).

This is a small, generic engine behaviour ("unknown qtype with a `fallback` block -> render the fallback"), not graph-specific. It would let any future NEW_QTYPE ship as a self-check the day it is authored. Flagging that general pattern as worth adopting.

## C. Suggested grader contract (for when you build it)

The `accept` predicates above are deliberately the things a shape-matcher can check against a sampled target curve from `topic-diagrams.js` (the Widgets models are the answer key, so author and grader never drift):

- `through_origin`: curve passes within tolerance of (0,0).
- `monotonic`: increasing / decreasing over the drawn range.
- `linearity`: straight (constant gradient within tolerance) vs curved.
- `quadrants`: which of I/II/III/IV the drawn curve visits (catches the one-quadrant error).
- `gradient_trend`: constant / decreasing / increasing across x (separates ohmic from filament; catches the "flattens to plateau" error).
- `symmetry`: odd (through-origin antisymmetry) for ohmic and filament; one-sided for diode.

Each failed predicate maps to a misconception slug via the item's `on_fail` table, so the grade is atomic (which predicate failed) not just pass/fail, satisfying principle 1.

## D. Note

These two items reuse the `ohmic_sketch` atom already in the iv_characteristics batch, so they do not add atoms; they upgrade two proxy MCQ framings (items 01, 04 there) to the real sketch skill once the grader lands. The diode sketch is the obvious third item (one-directional, blocks in reverse) and I will add it in the same shape once you signal `graph_sketch` is wanted.
