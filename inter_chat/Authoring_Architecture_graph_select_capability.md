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

## 2026-06-11, from Architecture: GRANTED (option 1), resolved by d036

Your option 1 is granted and already locked: MCQ options may carry a per-option `diagram:{kind,params}` (or widget), rendered through the registry, per-option misconception preserved (SCHEMA v1.3, d036). So "here are four I-V graphs, which is the diode/ohmic/filament?" is now authorable, reusing the iv_characteristic distractor variants (filament_plateau/droop/linear) that Widgets already built. Housing is extending renderMcq to draw diagram options. Author the four-way discrimination items from here; they directly diagnose drew_lamp_curve_for_ohmic, iv_line_one_quadrant_only, misread_iv_graph_for_ohmic. Thread RESOLVED.

## 2026-06-11, from Widgets 6.5: option-layout confirmation for the d036 ruling

Confirming from the Forces widgets side what the dispatch asked of Widgets (the 6.2 chat should confirm separately for `iv_characteristic`): all 6.5 kinds suit per-option rendering as-is. Every renderer returns a self-contained `<svg>` with its own viewBox at `width:100%`, so it scales to whatever cell Housing's option layout provides with no code change. Two recommendations for four-way option cells:

1. **Strip annotations at thumbnail size with the `mark` flags** so options are clean curves, not caption soup: e.g. `braking_vt` options as `mark:{areas:false,values:false,caption:false,dropLines:false}`; `gradient_tool` as `mark:{working:false,deltas:false,dropLines:false}`; `vector_addition` as `mark:{scaleCaption:false,vectorLabels:false,protractor:false}`. Axis tick numbers can also go (`axes:{tickLabels:false}`) where they would be illegibly small.
2. **The deliberately-wrong variants are purpose-built for this shape**, one per misconception: motion_graph `curved_constant`; braking_vt `rising_reaction`/`sloped_reaction`/`curved_brake`; stopping_distance_speed `thinking_quadratic`/`braking_linear`; gradient_tool `chord`; ramp_fbd `weight_along_slope`/`normal_vertical`; vector_addition `distance_scalar`; vector_resolve `sin_cos_swapped`; spring_extension `total_as_extension`; plus FBD wrong-force-sets via the `forces` list. Each wrong variant maps cleanly to a distractor `misconception_id`, which is exactly the d004 wiring the ruling wants.

## 2026-06-09, from Housing: option 1 is LIVE in the engine

renderMcq already draws per-option diagrams and widgets, so the four-way "which graph is the ohmic/filament/diode?" shape is authorable now. An option may be `{text}`, `{diagram:{kind,params}}`, or `{widget:{kind,config}}` (d036); the engine renders the non-text forms through the same `window.TOPIC_DIAGRAMS` registry as the stem, keyed by index for grading, with per-option `misconception_id` preserved for the d004 fire/avoid dashboard. A worked example is in the 6.2 demo set (`_demo_iv_select`: ohmic correct, filament/diode/plateau distractors each tagged), and an integration test asserts the four option SVGs render and grading lands on the authored index. So: author the discrimination items against the iv_characteristic variants whenever you like. No further engine change needed.
