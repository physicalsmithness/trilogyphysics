# Architecture to Widgets/Diagrams: Magnetism & Electromagnetism 6.7 widget catalogue

Status: OPEN

## 2026-06-11, from Architecture (Magnetism 6.7 Widgets chat; commissioned per d033). Topic-scoped, on the shared `widgets_core` (d026). Widgets are central and largely interactive (d031): static render first, interactive layer + Housing grading contract second.

**Salvage, do not start cold.** The existing `7_Magnetism/engine.js` (in this repo) already has bespoke field SVGs: bar-magnet field (correct, plus wrong-arrows / crossing / gaps variants), uniform field, straight-wire end-on (dot/cross, concentric circles), two-magnets attract/repel. Smith's verdict: the illustrations are rough but the ideas are good. Harvest and improve them onto `widgets_core`; do not reinvent from zero. Read the AQA 6.7 spec and `review/SYLLABUS_6_7.md`.

**3D is required throughout.** Field and force widgets must render into/out-of-page (dot = out, cross = in) and the standard orientations, because Fleming's left-hand rule and the motor need three dimensions.

---

## Magnets and fields
1. **`bar_magnet_field`** (params: show_field, poles): bar magnet, field lines N->S outside, denser near poles. **Distractor variants (rich, for MCQ "which is correct?"):** lines touching/crossing, lines passing through the magnet, lopsided field, lines not reaching the magnet, arrows reversed (S->N).
2. **`two_magnets_field`** (params: orientation): two bar magnets attracting (lines link across the gap) or repelling (lines bow outward, neutral point). Wrong-arrow and wrong-pole distractors.
3. **`electromagnet`** / **`solenoid_field`**: solenoid field (uniform inside, bar-magnet-like outside), connected to a battery (circuit symbol) with current direction shown; markable poles. Distractors.
4. **`induced_magnetism`** (variants): a magnet inducing magnetism in a nail / chain of paperclips; show the induced poles (and wrong-pole distractors); permanent vs induced (temporary).
5. **`magnetic_materials`**: iron / steel / cobalt vs non-magnetic objects near a magnet; which are attracted.

## Field detection and the Earth
6. **`compass`** (params: position, field): a compass needle free to rotate, aligning with the field / pointing north; the Earth as a bar magnet with a compass. Distractor: needle reversed / not aligned.
7. **`field_mapping`**: iron-filings pattern, and an array of plotting compasses revealing a field.

## Field around a wire (end-on, 3D)
8. **`wire_field`** (params: current direction in/out of page): concentric circles around a straight wire, right-hand grip rule. **Correct:** circles spaced further apart with distance, correct circulation sense. **Distractors:** equally-spaced circles, reversed circulation, wrong rule.

## Motor effect and Fleming's left-hand rule (HT, 3D, interactive)
9. **`flemings_lhr`**: an actual left hand, thuMb = Force / First finger = Field / seCond finger = Current, with blanks ("which way does the wire move?"). Interactive: pupil indicates the force direction; emits the chosen direction.
10. **`motor_effect_setup`** (variants): a current-carrying wire between magnet poles, pushed up or down; on a pivot, on a balance/scale; magnet at varying distance; the force at right angles to the field (present) vs parallel (zero); ways to increase the force (stronger field, larger current). Into/out-of-page. (Longer wire / larger current as a "what increases the force" item is probably an MCQ, not a widget.)
11. **`dc_motor`** (params: rotation_angle): a motor coil in a field with the split-ring commutator; forces on the two sides (up/down); the coil drawn at several rotation angles (horizontal, 45 degrees, vertical); correct vs incorrect force-arrow variants.

---

## Boundaries
Physical correctness first; cite assumptions. These widgets exist partly to REPLACE weak self-marking: they enable MCQ "which is correct?" and interactive grading instead of keyword-marked short answers. Build on `widgets_core`, salvage the 7_Magnetism SVGs, register into the shared registry, and agree interactive-grading contracts with Housing (d031). Do not author questions.

---

## 2026-06-11, from Widgets 6.7 (Magnetism): static catalogue DELIVERED

The full static catalogue is built, on the shared core, with the d031 build order honoured (static first; the interactive layer follows the Housing contract exchange, thread opened today: `Widgets_Housing_interactive_67.md`).

### Files
- `app/widgets/magnetism-diagrams.js` (~1,210 lines): `MagnetismModels` (pure physics, no DOM, dual-exported) + 13 static kinds registered into `window.TOPIC_DIAGRAMS`. Loads after `widgets_core.js`, same as 6.5/6.6.
- `app/widgets/verify_magnetism_models.js`: 72 headless assertions, all green (FLHR cross-product table, grip rule, solenoid pole ends, dipole field directions on axis and equator, motor forces incl. the 90-degree dead point, the two pure scorers, registry completeness).
- `app/widgets/render_magnetism_svgs.js` -> `previews_6_7/` (56 kind+variant previews).
- `app/widgets/index_6_7.html`: browser harness, every kind and variant with its `{kind, params}` JSON; distractors flagged. jsdom-checked: 56 cards, 56 SVGs.

### The catalogue (params in the file header of each renderer)
1. `bar_magnet_field`: correct + the five commissioned distractors (reversed arrows, crossing, through-magnet, lopsided, not reaching), poles flippable, markable poles.
2. `uniform_field` (ADDED, flag for ratification): the facing-poles uniform field, with curved / not-parallel / reversed distractors. Salvaged from the old engine and needed as the bed for the motor-effect items; cheap, in my lane, shout if it should not exist.
3. `two_magnets_field`: attract (lines link the gap + long return loops) and repel (lines bow away, NEUTRAL POINT marked) with wrong-pole and reversed-arrow distractors.
4. `solenoid_field` / `electromagnet` (core param): SECTION view, the 3D cut: dots along one row of turns, crosses along the other, uniform inside field, bar-magnet-like outside, poles markable, battery + conventional-current arrows. Distractors: wrong poles, non-uniform inside.
5. `induced_magnetism`: nail (induced poles labelled, opposite near face) and clip chain (alternating poles); `state:"removed"` shows temporariness (iron falls, steel keeps it); wrong-poles distractor.
6. `magnetic_materials`: iron/steel/cobalt/nickel vs copper/aluminium/plastic/wood etc., ask or show_result modes.
7. `compass`: plotting compasses around a magnet (needles computed from the dipole model, not hand-placed), single needle, and the Earth (internal tilted magnet, magnetic S near geographic North, surface compass). Reversed-needle distractor.
8. `field_mapping`: iron filings (seeded, deterministic; aligned along the computed dipole field, opacity tracks field strength, NO arrows: pattern-not-direction is the teaching point) and the plotting-compass grid.
9. `wire_field`: end-on dot/cross wire, concentric circles whose SPACING GROWS with distance (B ~ 1/r), grip-rule circulation; equal-spacing and reversed-circulation distractors.
10. `flemings_lhr` (HT): stylised left hand, canonical pose (First finger right = Field, seCond finger out of page = Current, thuMb up = Force), each digit blankable to "?". Orientation variations are deliberately NOT rotated-hand art: they are the interactive widget's job (pupil answers a direction; see the Housing thread).
11. `motor_effect_setup` (HT): wire between poles with force from the model, plus parallel (F = 0), pivot, balance (Newton's-third-law reading change), far-from-poles (smaller force); reversed-force and force-along-field distractors.
12. `dc_motor` (HT): end-on coil at any rotation angle, dot/cross sides, forces ALWAYS vertical (the model enforces it), dead point at 90 degrees captioned with the commutator's job, split-ring + brushes inset whose gaps line up with the brushes exactly at the dead point. Distractors: both-same, reversed, and forces-rotating-with-the-coil.

### Physics positions taken (cite-or-challenge)
- All 3D uses dot = out of page, cross = into page; screen frame x right, y up, z toward the viewer. FLHR is computed as F = IL x B in `MagnetismModels.flhr`, never hand-set per diagram, so a renderer cannot disagree with the rule.
- Solenoid: dots on the TOP row of cut turns -> N at the RIGHT end (right-hand grip on the visible circulation). Battery polarity is drawn consistent with an ASSUMED winding handedness (stated in the code comment); the polarity-to-pole mapping is convention-dependent and authors should treat the drawn pairing as definitive within a question.
- Compass needles and filings come from the in-plane dipole formula B ~ (3(m.r^)r^ - m)/r^3. Near the very ends of a long bar magnet the point-dipole approximation underweights the pole faces; at the distances drawn it is qualitatively right (and the alternative is hand-waving).
- Earth: drawn with the magnetic S pole near geographic North (that is why N ends point north), 11-degree tilt sketched.
- d.c. motor torque factor |cos theta| with vertical forces at every angle; "longer wire / bigger current" comparisons stay MCQ items, per the dispatch.

### Salvage report (d034)
Harvested from `7_Magnetism/engine.js` `customSVG`: the bar-field loop geometry (now 3 nested loop pairs + axial lines, arrows on every line, denser at poles), uniform field, end-on wire (now with correct circulation arrows and 1/r spacing, which the old flat-spaced circles lacked), two-magnet panels. NOTE: the old `twoMagnets_attract` / `twoMagnets_repel` blocks were UNREACHABLE (nested after the `wire_cross` return inside `symbolSVG`; `customSVG` itself was also scoped inside `symbolSVG`), so those MCQ choices can never have rendered in the old app. They render here for the first time. Worth keeping in mind when the 6.7 Authoring chat mines `questions.js`: any old item that referenced those svgKinds was silently broken.

### Open to Architecture
- Ratify `uniform_field` as a catalogue addition (or fold its variants into `two_magnets_field`).
- The interactive set and grading contract are with Housing (d031); schema hook is the agreed `widget: { kind, config }` + `widget_response` pathway (SCHEMA v1.2).

## 2026-06-11, from Architecture: delivery ratified; uniform_field approved

Excellent, physically-rigorous delivery (72 assertions green, the FLHR computed from I L x B so a render cannot contradict the rule, the 1/r wire spacing fixing the old flat circles). `uniform_field` RATIFIED as a catalogue kind (keep it separate from two_magnets_field; it is the bed for the motor-effect items, in your lane). Your salvage finding that the old twoMagnets_attract/repel SVGs were UNREACHABLE (scoped-dead in symbolSVG, never rendered) is important and I have flagged it to the 6.7 author: any old questions.js item referencing those svgKinds was silently broken, treat them as unillustrated when salvaging (d034). The interactive set is under d035 (see the interactive thread).

## 2026-06-11, from Widgets 6.7: bar_magnet_field CORRECTED (Smith review)

Smith reviewed the "correct" bar-magnet field and rejected it, rightly: the hand-drawn loops joined the magnet's TOP face to its top face (stacked racetracks), where the true pattern has every line leaving the N pole END face and re-entering the S END face. This was the one renderer whose physics was drawn by eye instead of computed, and it shows; mea culpa, and it strengthens the file's own rule that a renderer must not be allowed to disagree with the model.

Fix, correctness by construction: `MagnetismModels` gains `twoPoleFieldAt` (the Gilbert two-pole model, which reproduces a bar magnet's external field) and `traceFieldLine` (RK2 streamline tracer), both pure and exported. `bar_magnet_field` now draws ONLY traced streamlines: three closed loops per side (author-tunable launch angles), frame-clipped shallow fan lines with their matching re-entry pieces at the S pole (the lines that run off the edge of every textbook figure), and the two axial separatrix stubs. Lines therefore leave the N FACE, fan, arc, converge into the S FACE, bunch at the poles, and cannot cross. All six distractor variants now deform the computed polylines, so each breaks exactly one rule against an otherwise-correct field (crossing inflates one loop; lopsided skews the bulge; not_reaching trims the line ends; through/reversed unchanged in spirit). Canvas grew to 420x340 to hold honest loop proportions.

Per Smith's "make it as a widget": `app/widgets/bar_field_lab.html` is a live tuning widget: sliders for the three loop angles, fan angle, pole inset and seed radius, plus poles/variant selectors, emitting the exact `{kind, params}` block to copy into items or defaults. Verification now 97 headless assertions (new: loops close ON the S pole face, apex field runs N-to-S, loops nest so they cannot cross, up/down symmetry) + 13 jsdom. Previews regenerated.

Note for the record: Architecture's ratification above predates this correction; the catalogue list stands, only bar_magnet_field's rendering changed (same kind name, same params plus new optional tuning params, so no authoring impact). The same tracer is available to upgrade two_magnets_field (attract/repel as genuine two-magnet streamlines) on request; not done yet, Smith scoped this commission to the bar magnet.
