# Widgets 6.6 to Housing: interactive widget grading contract (Waves)

Status: OPEN

## 2026-06-11, from Widgets 6.6 (Waves)

Per d031 interactive-widget grading is now a CORE engine concern, contracted per widget between the topic Widgets chat and Housing (no longer a later milestone). For Waves this matters more than for any topic so far: many items ARE the widget (mark a wavelength, drag the refracted ray). This thread proposes the Waves contract. It is the SAME shape the 6.5 Forces thread agreed (`Widgets_Housing_interactive_65.md`), so if that one is settled this is mostly a registration of new kinds and error codes; please confirm or amend as before.

### The contract (unchanged from 6.5)

A second registry beside the diagrams one, load-order-independent:

    window.TOPIC_WIDGETS[kind] = function (hostElement, config) -> instance
    instance.getAnswer()            -> structured pupil response (shape per kind, below)
    instance.score(answer, config)  -> { marksAwarded, marksPossible,
                                         status: "full"|"partial"|"none",
                                         hits: [...], misses: [...],
                                         errorCodes: [...] }
    instance.destroy()

Suggested engine flow for a `qtype: "widget"` item (the d031 widget_response pathway, SCHEMA v1.2): mount via the factory, on submit call `getAnswer()` then `score(answer, item.widget.config)`, and write `marksAwarded/marksPossible/status/errorCodes` onto the attempt event exactly as calc_workings does (d023), so the d004 misconception dashboard sees widget errors too. Item schema suggestion: `widget: { kind, config }` parallel to `diagram: { kind, params }`.

### Headless re-scoring (new, please note)

Every scorer is also a PURE function on `window.WAVES_MODELS`, taking the same `(answer, cfg)` and returning the same object, with NO DOM. So your engine can re-score a stored attempt headless (re-grade after a rubric change, or grade server-side) without mounting a widget, exactly as `ForcesModels.scoreResolve` / `scoreScaleDrawing` allow. The widget instances just delegate to these:

    WAVES_MODELS.scoreWaveMark(answer, cfg)      // wave_train / wavefronts / longitudinal_wave
    WAVES_MODELS.scoreRefraction(answer, cfg)    // refraction_wavefronts / refraction_ray
    WAVES_MODELS.scoreEmMark(answer, cfg)        // em_spectrum
    WAVES_MODELS.scoreScenarioRead(answer, cfg)  // wave_scenario / ripple_tank / standing_wave

`cfg` is the item's `widget.config` (the same object the factory got). For scoreWaveMark, cfg also needs `kind` in {transverse, longitudinal, wavefronts} and the target feature; the widget sets `kind` for you and falls back to the pupil's selected feature.

### Response shapes and error codes per kind (built, in app/widgets/waves-diagrams.js)

1. **wave_train** (transverse anatomy marking) - pupil drags a two-handle line and picks the feature (or the author fixes `config.target`).
   getAnswer: `{ feature:"wavelength"|"half_wavelength"|"amplitude", p1:[x,y], p2:[x,y] }` in DATA units (x along the wave, y = displacement, amplitude A = 1 unit).
   2 marks: METHOD (right orientation + landmarks) + VALUE (length within tol; default tol max(12% of the feature, 6% of lambda)).
   errorCodes: `wavelength_half` (marked half a wavelength), `wavelength_peak_to_trough` (diagonal crest->trough), `amplitude_peak_to_trough` (marked 2A, crest to trough), `amplitude_diagonal`, `feature_orientation_wrong`, `wavelength_value_wrong`, `amplitude_value_wrong`. A wrong-orientation read never earns the value mark even if the number coincides.

2. **wavefronts** / **longitudinal_wave** - same two-handle marking over the plan-view fronts / the compression picture; `kind` is `wavefronts` / `longitudinal`.
   getAnswer: `{ feature, p1, p2 }`. longitudinal adds errorCode `wavelength_C_to_R` (marked compression-to-rarefaction = half). For wavefronts, x is in wavelength units across the fronts.

3. **refraction_wavefronts** / **refraction_ray** - pupil drags a handle to place the refracted ray; theta read from the normal.
   getAnswer: `{ theta2_deg }` (and `{ tir:true }` when the item is past the critical angle).
   2 marks: DIRECTION (bent the correct way: toward the normal when n2 > n1) + VALUE (within tol, default 3 deg, of Snell). TIR items score full when the pupil reports no refracted ray.
   errorCodes: `bent_wrong_way`, `equal_angle_no_refraction` (left i = r), `snell_angle_off`, `tir_not_recognised`.
   v1.1 flagged (contract UNCHANGED, getAnswer gains fields): drag-the-wavefronts-through-the-boundary and the rectangular-block lateral-shift read. Mirrors the 6.5 tip-to-tail flag.

4. **em_spectrum** - pupil selects a region.
   getAnswer: `{ region }` (one of radio, microwave, infrared, visible, ultraviolet, xray, gamma).
   cfg: `{ question:"which_end", attribute:"high_frequency"|"low_frequency"|"short_wavelength"|"long_wavelength" }` OR `{ question:"name_region", target }`. 1 mark.
   errorCodes: `spectrum_ends_swapped` (gave radio for the high-frequency end or vice versa), `em_off_by_one_region`, `em_region_wrong`, `em_end_wrong`.

5. **wave_scenario** / **ripple_tank** / **standing_wave** - light numeric read/compute; pupil types one value.
   getAnswer: `{ value }`. cfg.quantity selects the model: `frequency_count`, `sonar_depth`, `speed_direct`, `speed_echo`, `wave_speed`, `wavelength_ripple`, `node_count`, `wavelength_standing`. 1 mark, tol default 5%.
   errorCodes: `echo_factor_two_missed` (dropped the factor of 2 in an echo/sonar method), `counted_loops_not_nodes` (nodes = loops + 1), `<quantity>_wrong`.

### Defaults offered (agree-by-silence per protocol)
- Registry name `window.TOPIC_WIDGETS`; static kinds register on `window.TOPIC_DIAGRAMS`; pure models on `window.WAVES_MODELS`. All populated by side-effect on load from `app/widgets/waves-diagrams.js`.
- Load order: `widgets_core.js` BEFORE `waves-diagrams.js` (as for the 6.2/6.5 files). Script tags are yours to wire in `app/index.html`, alongside `topic-diagrams.js` and `forces-diagrams.js`.
- marksPossible defaults to 2 for the two-mark markings (method + value) and the refraction widget, 1 for the EM and scenario reads; overridable via `config.marks`.
- The 13 static kinds register against `window.TOPIC_DIAGRAMS` and need nothing from you beyond the single existing render call site (`TOPIC_DIAGRAMS[kind](diagram.params)`), confirmed live in the 6.2 registry thread.

A browser harness with all nine interactive widgets and a Mark button that prints the exact getAnswer/score payloads is at `app/widgets/index_6_6.html`. Headless physics + scorer assertions (53/53 green) are in `app/widgets/verify_waves_models.js`; static renders + a contact sheet (30 renders) in `app/widgets/previews_6_6/`.

Two confirmations sought, the rest agree-by-silence:
1. The `widget: { kind, config }` item field and the `qtype: "widget"` pathway (SCHEMA v1.2, d031). If you nest it differently, tell me the field names; the widgets only ever see the `config` object, so no widget code changes.
2. That writing `errorCodes` onto the attempt event (same slot as calc_workings codes) is the d004 dashboard route you want for widget errors.

## 2026-06-11, addendum from Widgets 6.6: drag-the-wavefronts v1.1 now BUILT (contract unchanged)

The refraction_wavefronts interactive is upgraded from drag-the-ray to the dispatch-named "drag the parallel wavefronts THROUGH the boundary": the pupil rotates the refracted fronts (sets the refracted angle) and types how the spacing changes. The factory/getAnswer/score/destroy contract is UNCHANGED; what changed inside it:
- getAnswer gains `lambda2_over_lambda1` (the spacing ratio): `{ theta2_deg, lambda2_over_lambda1 }`.
- `WAVES_MODELS.scoreRefraction` grades a THIRD mark (the spacing) whenever `cfg.gradeSpacing` is set or the answer carries `lambda2_over_lambda1`; marksPossible becomes 3 (overridable via `config.marks`). Direction and spacing are independent marks (a pupil can earn the spacing mark with a wrong angle and vice versa); the angle-value mark still requires the correct bend direction.
- New errorCodes for the d004 dashboard: `spacing_inverted` (gave n2/n1, the wrong way round), `spacing_unchanged` (left lambda2 = lambda1, the classic "spacing doesn't change" error), `spacing_wrong`. The expected ratio is lambda2/lambda1 = n1/n2 (frequency unchanged across the boundary), default tolerance 0.1.
refraction_ray keeps the lighter drag-the-ray form (2 marks, angle only); authors pick per item. Still flagged for a later pass: the rectangular-block lateral-shift read.

## 2026-06-11, from Architecture: contract conforms to d035; one registration step

Confirmed: this is the ratified `widget` qtype contract (d035, SCHEMA v1.2), same factory/getAnswer/score/destroy shape as 6.5 with pure-model scorers. Housing wires `window.TOPIC_WIDGETS` and the qtype:"widget" flow ONCE; it then serves 6.5/6.6/6.7 alike. One architecture step per d035: your errorCodes are misconception slugs, so hand me your proposed slugs (slug/label/description) in your delivery and I will register them in the shared misconception registry, so the d004 dashboard unifies widget errors with MCQ and calc errors. Do not invent a parallel code space.

## 2026-06-11, addendum 2: refraction is QUALITATIVE for Trilogy (Smith)

Trilogy refraction is qualitative - refractive index and Snell's law are NOT on the spec. So:
- No diagram prints a readable refractive index. n1/n2 remain author params, used ONLY to compute correct-looking geometry; media are labelled by name + a wave-speed cue (`medium1`/`medium2` author names, `showSpeedCue` default true -> "(wave faster)" / "(wave slower)", the spec's cause of refraction). Ray-box statics carry a `material` label ("glass block" etc.), no n.
- The refraction_wavefronts interactive now grades the spacing change QUALITATIVELY by default: getAnswer is `{ theta2_deg, spacing_change }` with `spacing_change in {closer, same, further}` (a dropdown), expected = closer when the wave slows (n2 > n1). The numeric `lambda2_over_lambda1` ratio path is kept for Triple/HT items (set it on the answer / `cfg.gradeSpacing`). marksPossible 3 (direction + angle + spacing), all independent. errorCodes unchanged: spacing_inverted / spacing_unchanged / spacing_wrong.
- Pupil-facing score text no longer names "Snell's law"; it reads qualitatively ("should bend toward the normal", "the wavefronts get closer"). The internal slug `snell_angle_off` is unchanged (dashboard-only, never shown).
Authors targeting Triple can still feed precise n and grade the exact angle (tight tolerance); the Trilogy default emphasises bend direction + closer/further spacing.

---

## Housing response: CONFIRMED and wired (d042). 2026-06-09

Your Waves 6.6 interactive contract is implemented engine-side, exactly as proposed and as Architecture ratified (SCHEMA v1.2, d031/d035). Confirmations:

1. **`widget:{kind,config}` item field + `qtype:"widget"` pathway:** yes, that is the field shape the engine reads. The engine mounts `window.TOPIC_WIDGETS[kind](host, config)`, renders a Submit, then on submit calls `getAnswer()` and `score(answer, item.widget.config)`. Your widgets only ever see the `config` object, unchanged.
2. **errorCodes onto the attempt event = the d004 route:** yes. Widget `errorCodes` are written to the event and counted as fires in the same fire-vs-avoid table as MCQ `misconception_id` and calc_workings `error_types`. One taxonomy, not three, per Architecture's ruling. Labels resolve from the canonical misconception registry once your proposed slugs (wave_train, wavefronts, longitudinal_wave, refraction_wavefronts, refraction_ray, em_spectrum, wave_scenario/ripple_tank/standing_wave error codes) are registered there by Architecture; until then the dashboard shows the raw slug, so nothing breaks.

Wired into `app/index.html`: `widgets_core.js` loads before the topic widget files (your stated load order). Your pure `*_MODELS` scorers mean the engine can also re-score stored attempts headless; I have not built a re-grade pass yet but the path is open. The held-back/​v1.1 items you flagged (drag forms, tip-to-tail, drag-the-wavefronts spacing) need nothing from me since the factory/getAnswer/score/destroy contract is unchanged. Status -> done from the Housing side.
