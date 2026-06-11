# Architecture to Widgets/Diagrams: Forces 6.5 widget catalogue

Status: OPEN

## 2026-06-08, from Architecture (Widgets chat, 6.5 batch; commissioned per d025)

The 6.2 set landed well, so here is 6.5 Forces, which is graph-heavy and diagram-heavy. Reuse the 6.2 contract (renderer keyed by `kind`, given `params`, returns inline SVG; editorial tokens; test harness; vanilla SVG). **You are a dedicated Forces widgets chat (d026), built on the SHARED widget core.** Do not fork the 6.2 graph/axis/arrow code: factor the reusable primitives (axis and gridline plotting, arrows, square-counting, protractor) into a shared `widgets_core` module and build on it, registering your kinds into the same `window.TOPIC_DIAGRAMS`. Coordinate the core split with the 6.2/general widgets chat so there is one set of graph primitives, not two.

**One important new thing: some of these are INTERACTIVE, not static.** Static renderers just draw. Interactive ones take a reading FROM the pupil (read a gradient off a tangent, count squares for an area, pick a scale and read a protractor). Those blur into grading, so each interactive widget must emit the pupil's response in a defined shape and the **grader contract is agreed with Housing** (the widget supplies the input surface and the expected answer/template; Housing's engine scores it). I flag interactivity per widget below.

**Resources to mine** (do not start from scratch): the `graphingskills` repo (`G:\My Drive\github local files\graphingskills`, the graph-reading HTML Smith mentioned); the **Fields driller** (`G:\My Drive\github local files\fieldsdriller`) for the interactive "give the gradient / give the area, find the other" pattern Smith referenced; and your own 6.2 widget harness.

**Convention for all graph widgets:** readings should land ON gridlines. Use 5 small boxes per big box (sometimes 4), and pick reasonably hard axis scales (not all 1,2,3). Provide deliberately-wrong distractor variants wherever noted, for MCQ options.

---

## Priority 1 - kinematics graph core (highest bank frequency; build first)

1. **`motion_graph`** (params: `kind` = distance_time | displacement_time | speed_time | velocity_time | acceleration_time; `segments`=[{shape, from, to}]; `scenario`). Customisable multi-segment graphs. Acceleration-time is low priority but keep the kind. Scenarios include a "walk to the shops" journey (slow progress, stops, return leg) and conventional d-t and v-t shapes. Distractor shapes available (e.g. constant-speed drawn as a curve).
2. **`area_under_vt`** (interactive-capable): a velocity-time graph with the area shaded as little square blocks, so distance = count the squares. Static mode renders the shaded squares; interactive mode lets the pupil enter the square count / area and is graded. This is one of the first two Smith wants.
3. **`gradient_tool`** (interactive-capable): shows/finds the gradient of a line. Straight line -> read directly. **Curve -> the pupil must place a tangent and read off two points to get the gradient**; do not let a straight-line read pass on a curve. Distractor behaviour: applying the chord/straight-line gradient to a curve without a tangent. Interactive mode emits the pupil's read-off points and slope. (This and `area_under_vt` are the Fields-driller-style "give one, find the other" interactions.)

## Priority 2 - braking and stopping distance

4. **`braking_vt`** (params: `thinking`, `braking`, `speed`, `condition`): a velocity-time graph showing the thinking-distance segment (constant v during reaction), the braking segment (deceleration), and the stopping distance marked as the area. Condition variants: faster/slower initial speed; wet road or worn brakes (longer braking distance, same thinking distance); tired/distracted/drunk driver (longer thinking distance, same braking). **Distractor (wrong) variants:** thinking distance drawn as increasing during reaction; thinking time wrongly scaling so the reaction segment slopes; braking shape misapplied. These wrong ones are MCQ fodder.
5. **`stopping_distance_speed`** (params: `reaction_time`, points): the distance-versus-speed graph (thinking distance linear in speed, braking distance quadratic, total = stopping distance), from which reaction time and stopping distance are read. Distractor variants (e.g. thinking distance drawn quadratic).

## Priority 3 - free body / force diagrams

6. **`free_body_diagram`** (params: `object`, `forces`=[{name, direction, magnitude}]): force arrows on an object (weight, normal/reaction, friction, air resistance, driving force, tension, upthrust), arrows sized by magnitude (balanced vs unbalanced), placed at the correct points. Distractors: missing a force, wrong direction, equal arrows when they should differ.
7. **`ramp_fbd`** (params: `angle`, `object`, `forces`, `resolve`): object on an incline (rolling ball, ball with air resistance, sliding/stationary block) with the force set, optionally resolved into components along/perpendicular to the slope. Distractors: weight drawn along the slope, normal drawn vertical, etc.

## Priority 4 - vectors

8. **`vector_addition`** (params: `vectors`=[{mag, angle}], `quantity` = force | displacement, `method` = maths | scale): add forces or displacements as vectors. **Scale-diagram interactive mode:** the pupil chooses the scale (units per box/cm), draws tip-to-tail, then reads the resultant magnitude and reads the angle off a **protractor**; the widget emits scale + magnitude + bearing for grading. Maths mode: components / Pythagoras + trig. **Distractor: distance vs displacement** (offer the scalar path-length as a wrong option against the vector resultant). Grader contract with Housing for the interactive read-off.

## Priority 5 - springs (Hooke's law)

9. **`spring_extension`** (params: `natural_length`, `extension`, `masses`, `arrangement` = single | series | parallel): spring(s) with masses hanging, single and multiple, with the original (natural) length and the extension clearly marked and distinct. Distractors: marking total length as extension.

## Priority 6 - momentum collisions (qualitative)

10. **`collision_illustration`** (params: `type` = sticky | bouncy | explosion; masses; before/after velocity arrows): qualitative before/after pictures - inelastic (stick together), elastic (bounce apart), explosion (push apart from rest). Illustrative only, not to scale. Cross-check the past-paper standard scenarios if useful.

---

## Boundaries
Physical correctness first; cite assumed behaviour in your hand-back. For interactive widgets, agree the input/response shape and grading template with Housing before finalising (open a `Widgets_Housing_*` thread as you did for the registry). Do not author questions. Surface any new kind Authoring asks for through me.

---

## 2026-06-10, from Widgets 6.5 (delivery: all 10 kinds, shared core factored, 3 interactive)

Shipped to `app/widgets/`:
- `widgets_core.js` - the d026 shared core (`window.WIDGETS_CORE`): the 6.2 primitives lifted unchanged (el/txt/makeSVG/arrowHead/graph + tokens) plus `grid()` (minor/major gridlines, numbered ticks, 5-or-4 small boxes per big box, square-count shading, drop-lines), `forceArrow()`, `protractor()` (two scales), `makeDraggable()` (pointer events, vanilla), and a `Maths` module (piecewise curves, exact trapezia, numeric gradient). Coordination with the 6.2 chat in `Widgets65_Widgets62_core_split.md`; their file is untouched.
- `forces-diagrams.js` - all ten dispatched kinds registered on `window.TOPIC_DIAGRAMS`, the three interactive factories on `window.TOPIC_WIDGETS`, and pure-maths `ForcesModels` (dual-exported). LOAD ORDER: widgets_core.js first.
- `index_6_5.html` - harness: 41 static renders (distractors flagged) + the three interactive widgets with a Mark button printing the getAnswer/score payloads.
- `verify_forces_models.js` - 58 Node assertions, all green.
- `render_forces_svgs.js` + `previews_6_5/` - 40 headless SVG renders rasterised to PNG plus `contact_sheet.png` for eyeballing.

### Physics assumed (cited per dispatch)
- ONE JOURNEY MODEL feeds every motion graph: phases of linear velocity; v/a exact, displacement exact piecewise-quadratic, distance the exact integral of |v| (split at zero crossings). So d-t, displacement-t, speed-t, v-t and a-t of the same scenario are mutually consistent by construction (verified: the walk's displacement returns to 0 while distance reaches 120 m).
- Scenarios: `walk_to_shops` (slow progress, stop, faster return; the return leg makes speed-vs-velocity and distance-vs-displacement contrasts visible) and `bus_journey` (accelerate-cruise-brake; d-t concave up while accelerating, concave down while braking, asserted).
- Readings land on gridlines: every preset's marked values sit on small-box intersections (asserted for the tangent read-off points). Scales use 5 small boxes per big box, sometimes 4, with non-trivial steps (0.4, 0.5, 2, 4, 25...).
- gradient_tool curve preset: d = 0.5t² with tangent at t=6 (slope 6) passing (3,0) and (9,36); the chord distractor is the genuine average-speed line (slope 3), and on a concave-up curve the chord UNDERESTIMATES the tangent (asserted).
- area_under_vt: braking curve v = 12(1-u)², exact area 24 m = 48 small squares at 0.5 m; full squares shaded strong, part squares light (count-as-half convention).
- Braking: thinking = u·tr (linear in u), braking = u²/2a (quadratic, asserted x2 speed -> x4 braking); wet road/worn brakes change only a, tired/distracted only tr. Wrong variants: rising reaction, sloped reaction, braking that flattens and never stops.
- stopping_distance_speed: thinking linear, braking quadratic in v; reaction time is the linear gradient. Distractors: thinking-quadratic, braking-linear.
- FBDs: weight from the centre of mass, normal/friction anchored at the contact surface, arrow length proportional to magnitude. Missing-force / wrong-direction / equal-when-unequal distractors are authored via the forces list; presets cover car constant/accelerating, terminal velocity, falling-speeding-up.
- ramp_fbd: normal perpendicular to the slope (W cosθ), weight vertical; named wrong variants weight_along_slope and normal_vertical; optional dashed W sinθ / W cosθ resolution (components recombine by Pythagoras, asserted).
- vector_addition: default 3-4-5 (30 N + 40 N -> 50 N at 53.1°) so tips land on gridlines; scalar-sum 70 kept as the distance-vs-displacement distractor; protractor drawn with both scales (the wrong-scale read is a named errorCode).
- springs: extension marked from natural length, never total length (that wrong labelling is the named distractor); series doubles extension at the same load, parallel halves it (same k assumed, stated).
- collisions: sticky/bouncy/explosion arrows computed by exact momentum conservation (and KE conservation for bouncy), so the "illustrative" pictures are quantitatively honest; momentum-before = momentum-after captioned.

### Interactivity and grading
Contract proposed to Housing in `Widgets_Housing_interactive_65.md`: `window.TOPIC_WIDGETS[kind](host, config) -> {getAnswer, score, destroy}` (the Fields-driller pattern) plus canonical `errorCodes` for the d004 dashboard, borrowing graphingskills module-8 slugs (triangle_too_small, inverse_gradient, chord_used...). The gradient widget will NOT pass a straight-line read on a curve: a placed line matching the chord slope is caught and coded `chord_used`, and arithmetic consistent with the pupil's own (wrong) tangent is separated from arithmetic errors, ECF-style.

### Access note for the estate
`graphingskills` and `fieldsdriller` G:-drive folders are byte-blind in session mounts (as d023 recorded); both repos were mined via raw.githubusercontent.com instead (graphingskills module list + module-8 error taxonomy; fieldsdriller widgets/_registry.js + curve_probe.js). Also: files EDITED in the session outputs folder serve stale truncated bytes to the Linux shell (fresh writes are fine); worked around by re-emitting and verifying via `node --check` before shipping.

### Known polish items (not blocking)
- Some caption/label collisions at small sizes (gradient Δ labels near the right edge; protractor numerals are cramped at r=62).
- The L₀ subscript glyph can drop in rasterised previews (fine in browsers).
- vector_addition interactive v1 pre-draws the vectors at the pupil's chosen scale; pupil-drawn tip-to-tail dragging is flagged as v1.1 in the Housing thread.
- acceleration_time is rendered (piecewise bars with dashed jumps) but kept low-priority per the dispatch.

Boundaries respected: no questions authored, no engine code touched; new kinds requested by Authoring come back through Architecture.

---

## 2026-06-10, from Smith via Widgets 6.5: v2 commission, full author specifiability

Smith reviewed the v1 set ("a great first set") and commissioned the params opened all the way. Captured as state:

1. **Curved phases**: authors give start point, end point, and a curve direction (curve up / curve down); the widget has liberty over the exact curve PROVIDED the gradient never goes vertical or horizontal mid-curve. Additional named shapes offered: curve OVER THE TOP (overshoot then settle), UNDER THE BOTTOM (dip then rise), and CURVE TO AN ASYMPTOTE (flattening but never flat).
2. **Everything about the graph surface specifiable**: axes quantities, units, scale steps (what the axis "goes up in"), how many little squares per big box, etc.
3. **area_under_vt display modes**: (a) NO area marking at all (pupil computes unaided); (b) counted squares (mostly for curved graphs); (c) the region split into rectangles and triangles AUTO-LABELLED A, B, C, D, E.
4. **Scale-diagram vector flow** (wave 2): pupil CHOOSES the scale first (nothing drawn until then; the chosen scale stays visible afterwards, and the effect of their scale on line length must be visible); pupil draws one line then the other; the widget auto-joins the hypotenuse; then a RULER is offered and the pupil is prompted to measure the line; then to convert via their scale; then a PROTRACTOR to measure the angle; then to state the reference ("x above horizontal", "right of vertical", etc.).
5. **braking_vt comparisons**: e.g. a dotted line for the wet-road driver against the solid dry-road line, with a key. Line style + key author-specified.
6. **Marked-vs-unmarked**: every kind takes a form (a `mark` object) saying what annotations show: captions, values, drop lines, region letters, the resultant itself, so the same render works as stimulus or as answer reveal.
7. **Momentum/FBD objects**: cart, trolley, car, car with trailer attached, boat, person; momentum scenarios fully specifiable in advance (wave 2 for the sprites; numbers already open).
8. **Vector RESOLVING as well as adding** (wave 2): pupil/author chooses the method per item: by calculation, "by hand" via Pythagorean triples, or by scale drawing. All options available.

Widgets 6.5 is delivering this in two waves: wave 1 (params opened: curved shapes, axes/units/grid, area modes incl. lettered regions, mark flags, braking compare + key, gradient curve families with author tangent points) and wave 2 (the staged ruler/protractor scale-drawing interaction, vector_resolve, object sprites).

## 2026-06-10, from Widgets 6.5 (wave 1 of the v2 commission delivered)

Params are now open. What an author can specify, per kind:

- **Curved phases everywhere a journey is drawn** (`motion_graph`, `area_under_vt` sources): each phase is `{dur, v0, v1, shape}` with shapes `linear`, `hold`, `curve_up`, `curve_down`, `asymptote`, `over_top`, `under_bottom`. The monotone shapes keep the gradient strictly positive (never vertical, never horizontal mid-curve, as commissioned: curve_up runs 0.15x to 1.85x the mean gradient); `asymptote` flattens but never goes flat (end gradient ~0.075x, asserted); `over_top` genuinely overshoots (peaks at ~1.08 of the rise) and `under_bottom` genuinely dips below the start, each with their one deliberate stationary point. Displacement/distance integrate these exactly-or-numerically as appropriate (asserted against independent integration).
- **The whole graph surface**: `axes: {xmax, xstep, ymax, ystep, minorDiv, xlabel, ylabel}` on every gridded kind; units live in the label strings; minorDiv is the little-squares count; steps are "what the axis goes up in".
- **area_under_vt `display`**: `"none"` (no area marking, pupil unaided), `"squares"` (counted squares, the curved-graph mode), `"regions"` (rectangles and triangles auto-labelled A, B, C... left to right, rect before triangle within a ramp; `mark.areaValues` adds a per-letter values caption). Region decomposition is a model function (`ForcesModels.areaRegions`) so Authoring can ask "the area of region B" in items and the grader knows it (bus journey: A=60 triangle, B=240 rectangle, C=60 triangle, sum=displacement, asserted).
- **gradient_tool author curves**: `fspec: {type:"power"|"linear"|"asymptote", ...}` with analytic slopes (no eval), plus `domain`, `axes`, `tangentAt`, `slopeUnits`, `chordFrom`. Read-off points are computed to land exactly on minor gridlines (widest such pair; falls back with a visible WARNING note if no exact pair exists, so the convention cannot break silently); authors can also force `readPoints` explicitly.
- **braking_vt comparisons**: `compare: [{condition or speed/reaction_time/decel overrides, label, dash}]` overlays dotted lines (default dot pattern) over the solid main line with an auto key (e.g. dry solid vs wet dotted), axes auto-fit to all lines or author-overridden.
- **Marked-vs-unmarked (`mark` object) on every kind**: braking (areas/values/caption/dropLines/key), gradient (triangle/deltas/working/label/dropLines), area (squareCaption/regionLabels/areaValues), stopping (labels), vector_addition (resultant/scaleCaption/protractor/vectorLabels/working: `mark:{resultant:false}` gives the draw-the-resultant stimulus). Same render serves as stimulus or reveal.
- **Interactive widgets take the same open params**; area's marksPossible adapts to the display mode (squares asks for count + distance; none/regions asks distance only); gradient's chord detection now computes the chord from the author's `chordFrom` rather than a baked value.

Verification: 78 Node assertions green (was 58; the new 20 pin the shape-liberty rules, region decomposition, areaInfo, curve families, and the gridline read-point finder). 49 headless renders incl. nine v2 demonstrations; harness extended with the same nine.

Wave 2 (next session): the staged scale-drawing interaction (choose scale first, nothing drawn until then; draw both legs, auto-join hypotenuse, ruler to measure, convert via scale, protractor to read the angle, then state the reference such as "x above horizontal"); `vector_resolve` (calculation / Pythagorean triples / scale drawing, pupil-chooses-method); object sprites (cart, trolley, car, car+trailer, boat, person) for FBDs and momentum.

## 2026-06-10, from Widgets 6.5 (wave 2 of the v2 commission delivered)

1. **The staged scale-drawing interaction** (`window.TOPIC_WIDGETS.vector_scale_drawing`), Smith's sequence exactly: the pupil chooses the scale FIRST and nothing is drawn until then (the chosen scale stays on display afterwards, so the consequence of their choice for line length is visible); they drag and place each line tip-to-tail on a cm grid (snapped to small boxes, with Undo); the hypotenuse auto-joins when the last leg lands; a movable-and-rotatable RULER appears (graduated in cm = big boxes, round handle moves, square handle rotates about the zero mark) and they are prompted to measure the resultant line; then to convert it with their scale; then a movable-and-rotatable PROTRACTOR appears and they measure the angle; finally they state the reference (above/below the horizontal, right/left of the vertical). Ruler and manipulation gizmo are new CORE primitives (`ruler`, `makeManipulable`), available to every topic chat.
   Scoring is the pure `ForcesModels.scoreScaleDrawing` (4 marks: drawing, measuring, converting, direction), with deliberate ECF: the measure mark is judged against THEIR drawing and the conversion mark against THEIR measurement, so one early slip does not zero the attempt. errorCodes: legs_wrong, length_misread, scale_conversion_wrong, scalar_sum_given, angle_wrong, wrong_protractor_scale (the 180-θ read), reference_mismatch (right angle, wrong stated reference). Equivalent statements both score: "53° above the horizontal" and "37° right of the vertical" are the same direction and both earn the mark (asserted).
2. **vector_resolve** (static kind + numeric interactive): resolve into components by `method: "calculation"` (F cos θ / F sin θ working), `"triples"` (detects scaled Pythagorean triples 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29 and annotates "5-12-13 × 2"), or `"scale"` (grid + scale caption + protractor). Distractor `variant:"sin_cos_swapped"`. Interactive entry of both components; errorCodes sin_cos_swapped, magnitude_unresolved, component_exceeds_magnitude. NOT YET: resolve BY DRAWING through the staged flow (drawing a vector at a given angle needs protractor-guided placement; flagged as the follow-up).
3. **Object sprites** for FBDs and momentum: trolley, cart, car, car_with_trailer (as `car_trailer`), boat (with waterline, used with upthrust force sets), person. `free_body_diagram` takes `object:` any of these (ground line drawn under grounded bodies); `collision_illustration` takes `object1`/`object2` per side, arrow heights adapt to sprite height. Momentum scenarios remain fully author-specified (masses, velocities, types, objects, showValues).

Verification: 95 Node assertions green (was 78; new ones pin triple detection, resolve scoring incl. the swap, the direction-reference algebra, and seven scale-drawing scoring scenarios incl. both ECF paths). 59 headless renders. Harness extended with the staged flow, the resolve widget, and nine new static cards.

Polish noted: tall sprites (person) in the explosion layout run tight against the top edge at default canvas height; FBD left-pointing labels now anchor away from the body (fixed this wave).

## 2026-06-10, from Widgets 6.5 (fix: axes overrides are now PARTIAL and universal)

Smith caught that several kinds looked hard-wired in the playground. Two causes, both fixed: (1) the vector_addition and vector_resolve grids genuinely were not author-overridable; they now take `axes` like everything else; (2) axes overrides everywhere were all-or-nothing; they are now PARTIAL via `ForcesModels.mergeAxes`: an author writes `axes:{ymax:20}` against a scenario or preset and only that field changes (asserted, plus a render-level check that the tweaked tick appears). The playground's example configs were also rewritten to show the full effective config (phases, axes, mark, tolerances) so everything visible in the JSON editor is editable; "preset + PARTIAL axes tweak" examples demonstrate the merge. 97 assertions green, 56 playground configs render clean.

## 2026-06-10, from Widgets 6.5 (Smith's playtest fixes: facing, vector interactivity, declutter)

From Smith's hands-on testing:
1. **Sprites are now directional and turnable.** The car was reading as pointing left under a rightward driving force. The car (and boat) are redrawn unambiguous (squared rear, long bonnet, headlight; squared stern, pointed bow) facing RIGHT by default, and every sprite user takes `facing:"left"|"right"` (FBD) / `facing1`,`facing2` (collisions). Collisions default to facing along each body's motion; a body at rest faces the other body, so head-on setups (u2 negative) come out facing each other automatically.
2. **The interactive `vector_addition` is now the staged drawing flow** (it was the numeric quick form, which reads as "not interactive"). The numeric form survives as `vector_addition_quick` and now renders a STIMULUS (resultant and protractor hidden) rather than giving the answer away. The staged widget's drag tip is bigger with a "drag this tip" hint until first touched. HOUSING NOTE: if any item already referenced the interactive `vector_addition`, its answer shape changed from `{scale, magnitude, angle}` to the staged shape; none exist yet to my knowledge, but flagging the rename.
3. **Vector grids are plain squared paper now**: tick numbers off by default on vector_addition / vector_resolve / the scale-drawing grid (`tickLabels:false` in the core grid; authors can re-enable via axes). Scale drawings should not display force-unit numbers along the axes.
97 assertions green; 63 renders; 60 playground configs clean.
