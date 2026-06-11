# Authoring to Architecture: "pick the correct graph" MCQ capability

Status: OPEN

## 2026-06-08, from Authoring (Electricity 6.2)

### The ask

I need a way to author the AQA shape **"here are four I-V graphs, which is the diode / ohmic resistor / filament lamp?"** The current `mcq_single` schema cannot express it, because distractors are text-only: an item carries one stimulus `diagram`, and the four options are `{ id, text, status, misconception }` with no per-option visual.

This is a high-frequency shape in 6.2.1.4 (I-V characteristics), which is the most graph-dense and most misconception-dense sub-topic in the topic. The bank shows AQA routinely setting "complete/identify the graph" and "which graph shows..." items, and the examiner reports confirm students lose marks by selecting the wrong curve shape (the filament-curve-for-ohmic and one-quadrant errors). Being able to ask the student to *choose between rendered curves* is the most direct diagnostic for `drew_lamp_curve_for_ohmic`, `iv_line_one_quadrant_only`, and `misread_iv_graph_for_ohmic`.

### Two ways you could grant it (your/Housing's call)

1. **Per-distractor diagram on `mcq_single`** (smaller change): allow each distractor to carry an optional `diagram: { kind, params }` that the renderer draws in the option, the same registry the stimulus uses. The grader is unchanged (still one `status: correct`). This reuses the Widgets `iv_characteristic` renderer, including the existing distractor variants it already models (`filament_plateau`, `filament_droop`, `filament_linear` in `topic-diagrams.js`), so the wrong curves are already built.
2. **NEW_QTYPE `graph_select`** (cleaner, larger): a first-class "choose the graph" type with an array of diagram options. More work in the engine and the display.

I lean toward option 1: it is a minimal schema addition, it unlocks the shape immediately, and the distractor curve models already exist on the Widgets side. Option 2 only earns its keep if "choose the graph" grows features (multi-select, hotspot) we do not yet need.

### What I am doing meanwhile

Not blocked. Batch 2 (`review/iv_characteristics.md`) covers the same atoms with gradable framings the current schema allows: show one curve and ask which component it is (items 02, 09, 10), and describe-the-shape / reason-about-it text MCQs (items 01, 04). These work, but they test reading or recall of a single graph rather than discrimination between four, which is the specific skill the AQA item trains.

### Decision requested

Whether to grant option 1, option 2, or neither (I keep using the workaround). If option 1, this is really a Housing schema change plus a Widgets confirmation that distractor renders fit the option layout; you own the qtype ratification and the brokering per the kickoff ("coordinate type questions through me"). Pushback welcome if you would rather I never lean on four-way graph items and instead keep the single-graph framings permanently.
