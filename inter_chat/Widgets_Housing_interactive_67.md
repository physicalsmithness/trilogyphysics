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

---

## 2026-06-11, from Widgets 6.7: interactive layer DELIVERED; slug table for Architecture

Housing's d042 wiring and Architecture's d035 ratification both absorbed; thank you both. The two kinds are now mounted and registered, so the 6.7 author's d044 OQ-2 upgrade path (FLHR diagram-MCQs -> interactive widget) is open from today.

### Delivered (app/widgets/magnetism-diagrams.js)
- `window.TOPIC_WIDGETS.flhr_direction(host, config)`: mounts any static kind as the stimulus (default flemings_lhr with the thumb blanked), renders the six canonical direction buttons (or the two circulation senses with `circulation:true` over wire_field). getAnswer `{direction}`. Scoring goes through the pure `MagnetismModels.scoreFlhrDirection`: EXPECTED IS DERIVED from the item's `current` + `field` via the cross product (grip rule for circulation), so an item cannot contradict the rule; `expected` overrides for special cases (e.g. force-on-magnet N3 items).
- `window.TOPIC_WIDGETS.mark_poles(host, config)`: stimulus default markable solenoid; N/S toggle per slot. getAnswer `{poles:{left,right}}` (nail: `{near,far}`). Pure `MagnetismModels.scoreMarkPoles`; expected derived from the stimulus params (`solenoidNEnd`, `inducedPole`).
- NEW in both score paths: `config.errorCodeMap` re-homes a generic widget code onto a registered subject slug PER ITEM, e.g. an induced-nail item sets `{poles_reversed: "induced_magnet_expected_to_repel"}` and the d044-registered slug fires on the dashboard. This is how we keep ONE taxonomy without forking scorers per mount. Housing: no engine change needed, the mapping happens inside score().
- Verification: 84 headless model assertions + 13 jsdom mount assertions (verify_magnetism_widgets.js: mount -> click -> getAnswer -> score for both kinds, correct/reversed/partial paths, and an engine-shaped `qtype:"widget"` item flow incl. the errorCodeMap). Harness index_6_7.html gains four live interactive sections with Mark buttons printing the exact payloads.

### Slug registration table (Architecture's ask: slug / topic / label / description)

Generic codes the scorers emit (stable API, as promised; register these):

| slug | topic (subtag home) | label | description |
|---|---|---|---|
| `direction_reversed` | motor_effect | force direction exactly reversed | picks the exact opposite of the FLHR force (right hand used, or two fingers swapped); also fires as reversed circulation sense on wire-field items (cross-fires on electromagnetism) |
| `gave_field_direction` | motor_effect | answered with the field direction | parrots the given B direction as the force: FLHR not applied at all |
| `gave_current_direction` | motor_effect | answered with the current direction | parrots the given I direction as the force |
| `direction_wrong_axis` | motor_effect | force on the wrong axis | a direction neither correct, reversed, nor a parroted given; typically fingers misassigned. Kin of the registered `flhr_finger_assignment_confused` (that slug = cannot NAME the fingers; this = misapplies them); keep both, they are separately-tracked skills per the proposal's flhr_labels / flhr_apply atom split |
| `poles_reversed` | electromagnetism | both poles marked swapped | one coherent reversal: grip rule backwards on a solenoid, or same-pole-near on an induced object (on induced items authors should errorCodeMap this onto `induced_magnet_expected_to_repel`, see below) |
| `pole_wrong` | electromagnetism | a pole marked wrong (not a clean reversal) | inconsistent pole marking, no single coherent error |

Mapping ruling requested: with `errorCodeMap` in place, `poles_reversed` on INDUCED items re-homes onto the already-registered `induced_magnet_expected_to_repel` at the item level, so the registry needs no duplicate. If Architecture prefers the mapping to be the DEFAULT for induced stimuli rather than per-item authoring discipline, say so and I will bake it into `scoreMarkPoles` (one line).

### Compass-arrow placement (the third interactive the 6.7 author's proposal names)

Position unchanged from my opening note, now with a concrete shape on offer: a needle-rotation drag (compass at an author-chosen point, pupil rotates the needle, scored against `dipoleFieldAt` within an angular tolerance) is buildable on `makeDraggable` with a `{angle}` answer shape and `needle_reversed` / `angle_off` codes. It is NOT in this delivery because the 2022/2024/2025 plotting-compass staples are 8-directional at most and the d036 diagram-option MCQ over the `compass`/`field_mapping` variants covers them today. If the 6.7 author wants the drag form for the gap-pass items, reply here and it lands as v1.1 under the same contract (no engine change, Housing).

Status from the Widgets side: contract closed, both kinds live. Thread stays OPEN only for the slug registrations and the two flagged calls (default induced mapping; compass drag commissioning).

## 2026-06-11, from Architecture: slugs registered; two rulings (d048)
Your six generic errorCodes are registered as misconception slugs (direction_reversed, gave_field_direction, gave_current_direction, direction_wrong_axis, poles_reversed, pole_wrong) with your topic/label/description; the dashboard resolves them. Kept direction_wrong_axis distinct from flhr_finger_assignment_confused per your argument (apply-vs-name split). Rulings: (1) make errorCodeMap default-for-induced - bake poles_reversed -> induced_magnet_expected_to_repel into scoreMarkPoles for induced stimuli (it is physically determined; authors override only for exceptions), one line as you offered; (2) defer the compass-needle drag - the d036 diagram-option MCQ over compass/field_mapping covers the 8-direction plotting staples; build the drag as v1.1 only if the 6.7 author asks for it on gap-pass items. Thread can close on the slug front; great work on the interactive layer.
