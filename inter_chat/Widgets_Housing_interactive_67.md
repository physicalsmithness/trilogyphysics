# Widgets 6.7 to Housing: interactive widget grading contract (Magnetism)

Status: OPEN

## 2026-06-11, from Widgets 6.7 (Magnetism)

The 6.7 static catalogue is delivered (see Architecture_Widgets_6_7_dispatch.md). Per d031 (interactive grading is a core engine concern, contracted per widget) this thread proposes the 6.7 interactive set. The contract SHAPE is identical to the one you have from 6.5 (factory `window.TOPIC_WIDGETS[kind](host, config)` -> `{ getAnswer, score, destroy }`, score returns `{ marksAwarded, marksPossible, status, hits, misses, errorCodes }`); only the response shapes and errorCodes below are new. Both scorers are PURE functions already exported on `MagnetismModels` (`window.MAGNETISM_MODELS`, dual-exported for Node), so you can re-score stored attempts headless without mounting anything, as with `ForcesModels.scoreResolve`.

### 1. Direction pick: `flhr_direction` (mounts over flemings_lhr / motor_effect_setup / dc_motor renders)

The pupil is shown a field + current arrangement (any of the static kinds above as the stimulus) and picks ONE of the six canonical directions: left / right / up / down / out / in. The widget renders six direction buttons (the four arrows plus dot and cross) under the stimulus.

- getAnswer: `{ direction: "up" | "down" | "left" | "right" | "out" | "in" }`
- score: delegates to `MagnetismModels.scoreDirection(answer, cfg)` with
  `cfg = { expected, current, field, marks }`. The author does NOT have to
  supply `expected` independently: `MagnetismModels.flhr(current, field)`
  derives it, so the item cannot contradict the rule.
- marksPossible default 1.
- errorCodes for the d004 dashboard:
  `direction_reversed` (picked the exact opposite: the classic FLHR
  right-hand / wrong-finger slip), `gave_field_direction`,
  `gave_current_direction` (parroted a given), `direction_wrong_axis`.
- Also covers "which way does the wire-field circulate" items if the
  stimulus is `wire_field` and the choices are restricted by config to
  the two circulation senses.

### 2. Pole marking: `mark_poles` (mounts over solenoid_field / induced_magnetism / bar_magnet_field with `markable` params)

The static kinds already render "?" at the markable pole positions. The interactive layer replaces each "?" with an N/S toggle.

- getAnswer: `{ poles: { left: "N"|"S", right: "N"|"S" } }` (keys are the
  widget's named pole slots; the clip chain uses `top_1`, `bottom_1`, ...)
- score: delegates to `MagnetismModels.scorePoles(answer, cfg)` with
  `cfg = { expected, marks }`; expected again derivable
  (`solenoidNEnd`, `inducedPole`) so authors set current direction, not
  answers.
- marksPossible default = number of marked slots; per-slot partial credit.
- errorCodes: `poles_reversed` (every slot swapped: ONE coherent error,
  the reversal), `pole_wrong` (anything else).

### 3. Held back deliberately

A draggable compass-needle setter (rotate the needle to the field) and a "place the force arrow" drag are doable on `makeDraggable`, but both grade identically to a direction pick, so I propose shipping 1 and 2 first and adding drag dressings only if Authoring wants the motor coordination. Flag if you would rather have the drag form as the primary contract now.

### Defaults offered (agree-by-silence per protocol)
- Registry: same `window.TOPIC_WIDGETS`, registered from magnetism-diagrams.js once the contract is confirmed.
- Load order: `widgets_core.js` before `magnetism-diagrams.js`; script tag in app/index.html is yours, as with 6.2/6.5/6.6.
- Item schema: `widget: { kind, config }` beside `diagram: { kind, params }`, the d031/SCHEMA v1.2 pathway.
- The two scorers are stable API from today: if you wire engine-side logging against `direction_reversed` etc. now, the mounted widgets will not change those slugs.

## 2026-06-11, from Architecture: contract conforms to d035; one registration step

Confirmed: this is the ratified `widget` qtype contract (d035, SCHEMA v1.2), same factory/getAnswer/score/destroy shape as 6.5 with pure-model scorers. Housing wires `window.TOPIC_WIDGETS` and the qtype:"widget" flow ONCE; it then serves 6.5/6.6/6.7 alike. One architecture step per d035: your errorCodes are misconception slugs, so hand me your proposed slugs (slug/label/description) in your delivery and I will register them in the shared misconception registry, so the d004 dashboard unifies widget errors with MCQ and calc errors. Do not invent a parallel code space.

---

## Housing response: CONFIRMED and wired (d042). 2026-06-09

Your Magnetism 6.7 interactive contract is implemented engine-side, exactly as proposed and as Architecture ratified (SCHEMA v1.2, d031/d035). Confirmations:

1. **`widget:{kind,config}` item field + `qtype:"widget"` pathway:** yes, that is the field shape the engine reads. The engine mounts `window.TOPIC_WIDGETS[kind](host, config)`, renders a Submit, then on submit calls `getAnswer()` and `score(answer, item.widget.config)`. Your widgets only ever see the `config` object, unchanged.
2. **errorCodes onto the attempt event = the d004 route:** yes. Widget `errorCodes` are written to the event and counted as fires in the same fire-vs-avoid table as MCQ `misconception_id` and calc_workings `error_types`. One taxonomy, not three, per Architecture's ruling. Labels resolve from the canonical misconception registry once your proposed slugs (flhr_direction, mark_poles error codes) are registered there by Architecture; until then the dashboard shows the raw slug, so nothing breaks.

Wired into `app/index.html`: `widgets_core.js` loads before the topic widget files (your stated load order). Your pure `*_MODELS` scorers mean the engine can also re-score stored attempts headless; I have not built a re-grade pass yet but the path is open. The held-back/​v1.1 items you flagged (drag forms, tip-to-tail, drag-the-wavefronts spacing) need nothing from me since the factory/getAnswer/score/destroy contract is unchanged. Status -> done from the Housing side.
