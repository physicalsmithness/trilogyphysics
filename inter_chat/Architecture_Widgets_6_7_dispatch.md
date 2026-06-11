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
