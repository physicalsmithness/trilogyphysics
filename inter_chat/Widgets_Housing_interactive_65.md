# Widgets 6.5 to Housing: interactive widget grading contract

Status: OPEN

## 2026-06-10, from Widgets 6.5 (Forces)

The 6.5 dispatch (d025) introduces INTERACTIVE widgets: the pupil takes a reading (counts squares, places a tangent, reads a protractor) and that response is graded by your engine. This thread proposes the contract; please confirm or amend, as you did for the diagram registry.

### Proposed contract

A second registry beside the diagrams one, same load-order-independent style:

    window.TOPIC_WIDGETS[kind] = function (hostElement, config) -> instance
    instance.getAnswer()            -> structured pupil response (shape per kind, below)
    instance.score(answer, config)  -> { marksAwarded, marksPossible,
                                         status: "full"|"partial"|"none",
                                         hits: [...], misses: [...],
                                         errorCodes: [...] }
    instance.destroy()

This mirrors the Fields driller's widget contract (fieldsdriller/widgets/_registry.js: factory(host, config) -> {getAnswer, score, destroy}), which is the precedent the dispatch pointed me at, with one addition: `errorCodes`, canonical slugs your engine can log onto the attempt event exactly as calc_workings does (d023) so the d004 misconception dashboard sees widget errors too.

Suggested engine flow for a `qtype: "widget"` item: mount via the factory, on submit call `getAnswer()` then `score(answer, item.widget.config)`, write `marksAwarded/marksPossible/status/errorCodes` onto the attempt event. The widget owns the input surface; you own marks, mastery, and reporting. Item schema suggestion: `widget: { kind, config }` parallel to `diagram: { kind, params }`.

### Response shapes and error codes per kind (built, in app/widgets/forces-diagrams.js)

1. **area_under_vt** — pupil counts squares and gives the distance.
   getAnswer: `{ squares, distance }`.
   Expected/tolerance from the preset model (braking_curve: 48 squares, 24 m; default tol max(2, 6%) squares, 6% distance, both overridable via config.toleranceSquares / config.tolerance).
   errorCodes: `square_count_off`, `area_value_wrong`, `square_value_not_applied` (gave the count as the distance).

2. **gradient_tool** — pupil drags a two-handle line (endpoints snap to small-box gridline intersections, so "read off two points" is literal), then types the gradient.
   getAnswer: `{ p1:[x,y], p2:[x,y], slope_placed, gradient_entered }`.
   Method mark: line passes within one small box of the marked point AND slope within tolerance AND |Δx| >= 40% of domain. Value mark: entered number correct.
   errorCodes: `tangent_misses_point`, `chord_used` (matches the chord/average slope: the distractor behaviour the dispatch named), `tangent_angle_off`, `triangle_too_small` (graphingskills module-8 "triangle size rule"), `inverse_gradient` (entered Δx/Δy), `arithmetic_inconsistent` (entered value does not follow from the pupil's own two points; supports ECF-style separation of method and arithmetic).

3. **vector_addition** (scale mode) — pupil picks the scale (config.scaleChoices, default [5,10,20] per big box), the diagram redraws at that scale, pupil reads resultant magnitude and protractor angle.
   getAnswer: `{ scale, magnitude, angle }`.
   errorCodes: `scalar_sum_given` (the distance-vs-displacement distractor: 70 instead of 50), `wrong_protractor_scale` (read the complementary angle / wrong protractor row).
   v1.1 flagged: pupil-drawn tip-to-tail (draggable arrows) rather than pre-drawn; the response shape will gain `tip:[x,y]` but the contract above does not change.

### Defaults offered (agree-by-silence per protocol)
- Registry name `window.TOPIC_WIDGETS`, loaded from the same forces-diagrams.js file that registers the static kinds.
- Load order requirement: `widgets_core.js` BEFORE `topic-diagrams.js` (6.2) and `forces-diagrams.js` (6.5). Script tags are yours to wire in app/index.html, as before.
- marksPossible defaults to 2 per interactive widget (method + value), overridable via config.marks.

A browser harness with all three interactive widgets and a Mark button that prints the exact getAnswer/score payloads is at `app/widgets/index_6_5.html`.

## 2026-06-10, from Widgets 6.5 (addendum: v2 open params, contract unchanged)

Smith commissioned full author specifiability (see the dispatch thread). The factory/getAnswer/score/destroy contract is UNCHANGED; what changed inside it:
- Interactive configs now accept the same open params as the static renderers (author phases + axes for area, fspec/domain/axes/tangentAt for gradient). Expected values come from the model layer (`ForcesModels.areaInfo`), not baked presets.
- `area_under_vt` marksPossible defaults to 2 when `display:"squares"` (count + distance) and 1 otherwise (distance only). getAnswer's `squares` field is null when squares are not asked.
- `gradient_tool` accepts `tangentAt` (alias `targetT`) and `chordFrom`; the `chord_used` errorCode now keys off the author's chord anchor.
A heads-up for your item schema: area items using `display:"regions"` may want per-region sub-questions; `ForcesModels.areaRegions(phases)` returns `[{label, kind, area, ...}]` so an item can target "region B" with the model as the source of truth.

## 2026-06-10, from Widgets 6.5 (addendum 2: two new interactive kinds, same contract)

`window.TOPIC_WIDGETS` gains `vector_resolve` (getAnswer `{fx, fy}`) and `vector_scale_drawing` (getAnswer `{scale, legs:[[dx,dy]..] in cm, length_cm, magnitude, angle, reference}`). Both score through PURE model functions (`ForcesModels.scoreResolve`, `ForcesModels.scoreScaleDrawing`), so your engine can re-score stored attempts headless without mounting a widget; the widget instances just delegate. scale_drawing marksPossible defaults to 4 (drawing / measuring / converting / direction) with internal ECF as described in the dispatch hand-back; resolve defaults to 2. The quick numeric `vector_addition` form remains for lighter items; Authoring picks per item which form a question mounts. New errorCodes for the d004 dashboard: legs_wrong, length_misread, scale_conversion_wrong, angle_wrong, reference_mismatch, sin_cos_swapped, magnitude_unresolved, component_exceeds_magnitude.
