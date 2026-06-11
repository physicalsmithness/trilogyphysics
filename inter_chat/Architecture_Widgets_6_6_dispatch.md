# Architecture to Widgets/Diagrams: Waves 6.6 widget catalogue

Status: OPEN

## 2026-06-11, from Architecture (Waves 6.6 Widgets chat; commissioned per d032). A dedicated topic-scoped chat on the shared `widgets_core` (d026).

**Read this framing first (d031, widgets are now central).** For Waves, many items ARE the widget: marking a wavelength on a wave, dragging wavefronts across a boundary, sliding a prism into a beam. So these are interactive question surfaces, not illustrations. Build each widget in two layers: (1) a static render (author params -> SVG), then (2) an interactive/markable layer that emits the pupil's response (the mark they placed, the angle they read, the position they dragged to) in a defined shape. The grading of that response is a CORE contract with Housing now, not a later milestone; open a `Widgets_Housing_*` thread and agree the response schema per interactive widget, as the 6.5 chat did for gradient/area.

**Read the AQA 6.6 spec and Smith's notes** for the measurement-method variations (ripple tank, standing waves) and the required practical, `review/SYLLABUS_6_6.md` for the code spine. Editorial tokens, vanilla SVG, test harness, build on `widgets_core`.

---

## Wave anatomy (transverse, side-on)
1. **`wave_train`** (params: wavelength, amplitude, cycles, orientation). Markable: wavelength (peak-peak or trough-trough), HALF wavelength (for the half-lambda questions), amplitude (rest line to peak). Arrows at peaks and troughs. **Distractors:** amplitude marked peak-to-trough (double), a diagonal "amplitude", wavelength marked as a half or peak-to-trough horizontal. Interactive: pupil drags markers to indicate wavelength / amplitude; emits which feature and endpoints.
2. **`wavefronts`** (plan view): parallel/curved wavefronts seen from above, spacing = wavelength. Mark wavelength (half-wavelength less needed here). Used for water ripples and for refraction below.
3. **`longitudinal_wave`**: compressions and rarefactions (coil/particle density), arrows, blanks to label C/R, wavelength marked compression-to-compression. Distractor: wavelength marked C-to-R (half).

## Wave scenarios (qualitative, lengths markable)
4. **`wave_scenario`** (variants): shore ripples; person on a pier counting waves (frequency); boat echolocation/sonar (depth from echo time); speed-of-sound methods, clap or drum a measured distance apart with a stopwatch, and clap-in-rhythm with the echo off a wall. Distances/times markable.
5. **`ripple_tank`**: the apparatus plus the several ways to measure ripple wavelength and speed (read the spec/notes, there are a few). Markable distances.
6. **`standing_wave`** (RP): standing wave on a rope/string, vibration generator, pulley and hanging masses; nodes and antinodes; count nodes; weights vary it. Read the syllabus for the variations and what is measured. Markable nodes/antinodes.

## Electromagnetic spectrum
7. **`em_spectrum`**: the seven regions; author-specifiable marking, name a region, indicate high/low wavelength and high/low frequency ends, label given positions. 
8. **`em_origins`** (lower priority): where regions originate, gamma from the nucleus, radio from oscillations in a circuit, the rest in between. Author-specifiable; keep light. (Radio inducing an a.c. of the same frequency in a circuit is optional, a good FET animation already exists; skippable.)
9. **`em_uses`** (optional, can be dropped): author-specifiable illustrations of EM uses.

## Light: refraction (priority) and reflection (minor)
10. **`refraction_wavefronts`**: parallel wavefronts crossing a boundary, slowing (bend toward the normal, fronts closer) or speeding up (bend away, fronts further), the wavefront-spacing change visible. Interactive: drag the parallel wavefronts across the boundary; "refract out of the way" variant.
11. **`refraction_ray`**: a ray refracting through a prism, variants triangular prism, rectangular block, semicircular block. Interactive: drag the ray / mark the refracted angle. Reflection is a low-priority variant.
12. **`material_wave_behaviour`**: transparent vs absorbing/transmitting/refracting/reflecting differently by wavelength; author-specifiable scenarios.

## Infrared / radiation required practical
13. **`radiation_demo`** (variants): Leslie cube with a detector (emission from matt-black vs shiny faces); the bulb-between-plates / wax-on-rod demo (matt black absorbs more, wax falls first); two bottles (matt black vs shiny) with water and a thermometer, heating then cooling, with cooling curves; infrared detection by hand, IR sensor, and thermal camera.

---

## Boundaries
Physical correctness first; cite assumed behaviour. Static render first, interactive layer second with a Housing grading contract per interactive widget (d031). Do not author questions. Build on `widgets_core`; register kinds into the shared `window.TOPIC_DIAGRAMS`.
