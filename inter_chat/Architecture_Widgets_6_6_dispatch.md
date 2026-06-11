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

---

## 2026-06-11, from Widgets 6.6: delivery (all 13 kinds, static + interactive)

Built on the shared `widgets_core` (d026), `app/widgets/waves-diagrams.js` (~1540 lines). All 13 catalogue kinds delivered, nothing dropped (Smith: build everything). Static render first, interactive layer second (d031). Registers 13 static kinds on `window.TOPIC_DIAGRAMS`, 9 interactive factories on `window.TOPIC_WIDGETS`, and the pure physics + scorers on `window.WAVES_MODELS`. Grading contract opened with Housing: `inter_chat/Widgets_Housing_interactive_66.md`.

**Files:** `waves-diagrams.js` (kinds + models + scorers), `verify_waves_models.js` (53 headless assertions, 0 fail), `render_waves_svgs.js` + `previews_6_6/` (30 static renders + contact sheet), `index_6_6.html` (interactive harness with a Mark button printing the getAnswer/score payloads). Every static render verified visually after rasterisation; three refraction geometries were corrected on review (see below).

**Static kinds (13):** wave_train, wavefronts, longitudinal_wave, wave_scenario, ripple_tank, standing_wave, em_spectrum, em_origins, em_uses, refraction_wavefronts, refraction_ray, material_wave_behaviour, radiation_demo.
**Interactive (9):** wave_train / wavefronts / longitudinal_wave (drag-to-mark a feature), wave_scenario / ripple_tank / standing_wave (numeric read), em_spectrum (region select), refraction_wavefronts / refraction_ray (drag the refracted ray). em_origins, em_uses, material_wave_behaviour and radiation_demo are illustrative-only (no markable response), so no interactive layer, by design.

### Physics assumed and cited (the boundary's "cite assumed behaviour")
- **Transverse anatomy:** y(x) = A sin(2 pi x/lambda + phi). amplitude A = rest line -> crest (NOT crest->trough = 2A, the named distractor); wavelength = crest->crest = trough->trough = one full cycle; half-wavelength = crest->adjacent trough horizontally. Distractors rendered as named warning annotations: amplitude_double, amplitude_diagonal, wavelength_half, wavelength_peak_to_trough.
- **Longitudinal:** particle density modelled rho(x) = 1 - cos(...), compressions where particles crowd; particle-line shift s(x)=shift*sin(kx) with shift*k<1 (no line crossing). wavelength = C->C; C->R = half (the named distractor).
- **Wavefronts:** join points of equal phase; perpendicular spacing = one wavelength; plane source -> parallel fronts, point source -> concentric arcs stepping by lambda.
- **Refraction:** Snell n1 sin i = n2 sin r from the normal. Slower (denser, n2>n1) medium -> bend TOWARD the normal and fronts CLOSER (lambda2 = lambda1 * n1/n2, frequency unchanged across the boundary; the boundary trace spacing lambda1/sin i = lambda2/sin r is continuous, which is the wavefront-construction identity used). Critical angle asin(n2/n1) only dense->less-dense; TIR returns null. Ray tracing through faces uses the 2D vector Snell form (`WAVES_MODELS.refractDir`), verified against the scalar law. Prism deviates toward the base; semicircular block: ray to the centre exits the curved face along its radius undeviated, refraction shown at the flat face; rectangular block: emergent ray parallel to incident with lateral shift.
- **EM spectrum:** seven regions radio..gamma, increasing frequency / decreasing wavelength, all c in vacuum. Origins: gamma from the nucleus, radio from charge oscillations in an aerial/circuit, the rest between. Uses are the spec examples. (Order-of-magnitude wavelength anchors are labels only, not exam-required values.)
- **Speed of sound / echo:** direct v = d/t; echo/sonar/clap-off-a-wall v = 2d/t, depth = v t/2; clap-in-rhythm period = 2d/v.
- **Ripple-tank RP:** measure across SEVERAL wavelengths and divide (error reduction); f set by the vibrator; v = f lambda. **Standing-wave RP:** each loop = half a wavelength, lambda = 2L/n, nodes = loops + 1, antinodes at loop centres; masses set the tension/speed.
- **Infrared RP:** matt black is the best emitter AND absorber, shiny silver the worst (`SURFACE_RANK`); Leslie cube, wax-on-rod (matt-black wax melts first), two-bottle cooling curves (black cools faster: steeper Newtonian-cooling curve), IR detection by hand / IR sensor / thermal camera.

### Review corrections (physical-correctness-first)
On rasterised review, three refraction renders were wrong and fixed: (1) refraction_wavefronts drew the medium-2 fronts with the wrong perpendicular (fishbone); now continuous kinked fronts, closer and more boundary-parallel below. (2) refraction_ray triangle drew an unphysical internal V; now a single straight internal segment with a real two-face Snell trace deviating toward the base. (3) refraction_ray semicircle had the entry point degenerate above the centre (no visible bend); now the ray meets the flat face at the centre, refracts toward the horizontal normal, and exits the curved face radially undeviated.

### Open / flagged
- Same v1.1 flag pattern as 6.5: richer refraction interactions (drag the wavefronts THROUGH the boundary; rectangular-block lateral-shift read) are deferred; the getAnswer/score contract is unchanged when they land.
- Awaiting Housing confirmation on the two points in the interactive thread (widget item field + errorCodes onto the attempt event). Static registry seam already confirmed live (registry thread).

### Addendum 2026-06-11: full visual sweep + drag-the-wavefronts v1.1 built
Rasterised and eyeballed ALL 13 kinds (every scenario, ripple tank, longitudinal, both EM detail kinds, all four radiation variants, material behaviour) - all physically sound; fixed one label collision in ripple_tank. Then built the dispatch's named "drag the parallel wavefronts THROUGH the boundary" interaction (was flagged v1.1): the pupil rotates the refracted fronts and types the spacing change, graded on direction + angle + spacing (3 marks, independent) via scoreRefraction's new gradeSpacing path; new codes spacing_inverted / spacing_unchanged / spacing_wrong. verify_waves_models.js now 57/57. Contract addendum in the interactive thread. Remaining flagged-only: rectangular-block lateral-shift read.

## 2026-06-11, from Architecture: delivery ratified

Strong, physically-careful delivery (all 13 kinds, 57 assertions green, the refraction geometries caught and fixed on rasterised review, the wavefront frequency-invariant lambda2=lambda1*n1/n2 construction correct). Ratified. Interactive set is under d035 (see the interactive thread; hand me the errorCode slugs to register). This is the widget-central topic (d031), so its widget items will be a big share of 6.6 authoring.

### Addendum 2026-06-11: refraction made Trilogy-qualitative (Smith feedback)
Smith: Trilogy refraction is qualitative (no refractive index / Snell on the spec), so no readable n may appear on a diagram, though communicating in lambda and n in the code/models/contract is fine. Done: every refraction diagram now labels media by name + wave-speed cue ("wave faster/slower", the spec cause) and ray-boxes by material ("glass block/prism"); n1/n2 stay as author params driving correct-looking geometry only. The refraction_wavefronts interactive grades the spacing change qualitatively (closer/same/further) by default, numeric ratio kept for Triple; pupil-facing feedback no longer names Snell's law. verify 61/61; re-rasterised refraction statics confirm no index is readable. Detail in the interactive thread addendum 2.
